"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Couple } from "@/lib/types";

interface Props {
  couple: Couple;
  onUpdate: (couple: Couple) => void;
}

export function WishesStep({ couple, onUpdate }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(couple.sections_enabled.wishes);

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const newSections = { ...couple.sections_enabled, wishes: enabled };
    const { data, error } = await supabase
      .from("couples")
      .update({ sections_enabled: newSections })
      .eq("id", couple.id)
      .select()
      .single();
    setSaving(false);
    if (error) toast("Failed to save", "error");
    else { onUpdate(data); toast("Saved"); }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Step 05</p>
        <h2 className="font-display text-4xl font-light">Well Wishes</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Let guests leave you a message, image, or video. All wishes go through a moderation queue before going live.
        </p>
      </div>

      <div className="border border-[var(--color-ink)]/10 p-6 flex flex-col gap-6">
        <Switch
          label="Enable Well Wishes section"
          description="Guests can post a name, message, and optional image or video (MP4 up to 50MB)."
          checked={enabled}
          onCheckedChange={setEnabled}
        />

        {enabled && (
          <div className="pt-4 border-t border-[var(--color-ink)]/5 flex flex-col gap-3">
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">
              How moderation works
            </p>
            <ul className="text-sm text-[var(--color-muted)] flex flex-col gap-2 list-disc pl-4">
              <li>Every wish starts in a <strong>Pending</strong> state.</li>
              <li>You review and approve or reject each one from your dashboard.</li>
              <li>Only approved wishes appear publicly on your site.</li>
            </ul>
          </div>
        )}
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </Button>
    </div>
  );
}