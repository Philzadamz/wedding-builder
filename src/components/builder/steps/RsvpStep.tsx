"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Couple, RsvpRequiredFields } from "@/lib/types";

interface Props {
  couple: Couple;
  onUpdate: (couple: Couple) => void;
}

const FIELD_LABELS: Record<keyof RsvpRequiredFields, string> = {
  first_name: "First Name",
  last_name: "Last Name",
  email: "Email Address",
  phone: "Phone Number",
  relationship: "Relationship",
  address: "Address",
  attending_for: "Who are you coming for?",
};

const ALWAYS_REQUIRED: (keyof RsvpRequiredFields)[] = ["first_name", "last_name"];

export function RsvpStep({ couple, onUpdate }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [deadline, setDeadline] = useState(couple.rsvp_deadline ?? "");
  const [fields, setFields] = useState<RsvpRequiredFields>(couple.rsvp_required_fields);

  function toggleField(key: keyof RsvpRequiredFields, required: boolean) {
    setFields((prev) => ({ ...prev, [key]: required }));
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("couples")
      .update({
        rsvp_required_fields: fields,
        rsvp_deadline: deadline || null,
      })
      .eq("id", couple.id)
      .select()
      .single();
    setSaving(false);
    if (error) toast("Failed to save", "error");
    else { onUpdate(data); toast("RSVP settings saved"); }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Step 03</p>
        <h2 className="font-display text-4xl font-light">RSVP Form</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Choose which fields your guests must fill in. First and last name are always required.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {(Object.keys(FIELD_LABELS) as (keyof RsvpRequiredFields)[]).map((key) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-[var(--color-ink)]/5">
            <span className="text-sm">{FIELD_LABELS[key]}</span>
            <Switch
              checked={fields[key]}
              disabled={ALWAYS_REQUIRED.includes(key)}
              onCheckedChange={(checked) => toggleField(key, checked)}
            />
          </div>
        ))}
      </div>

      <Input
        type="date"
        label="RSVP deadline (optional)"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save RSVP settings"}
      </Button>
    </div>
  );
}