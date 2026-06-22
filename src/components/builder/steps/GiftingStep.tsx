"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2 } from "lucide-react";
import type { Couple, GiftMethod, GiftMethodType } from "@/lib/types";

interface Props {
  couple: Couple;
}

const METHOD_LABELS: Record<GiftMethodType, string> = {
  bank_transfer: "Bank Transfer",
  flutterwave: "Flutterwave",
  paystack: "Paystack",
  amazon: "Amazon Wishlist",
};

export function GiftingStep({ couple }: Props) {
  const { toast } = useToast();
  const [methods, setMethods] = useState<GiftMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("gift_methods")
        .select("*")
        .eq("couple_id", couple.id)
        .order("position");
      setMethods(data ?? []);
      setLoading(false);
    }
    load();
  }, [couple.id]);

  async function addMethod(type: GiftMethodType) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gift_methods")
      .insert({ couple_id: couple.id, type, position: methods.length })
      .select()
      .single();
    if (error) { toast("Failed to add", "error"); return; }
    setMethods([...methods, data]);
  }

  function updateMethod(id: string, patch: Partial<GiftMethod>) {
    setMethods((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  async function saveMethod(method: GiftMethod) {
    setSaving(method.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("gift_methods")
      .update({
        bank_name: method.bank_name,
        account_number: method.account_number,
        account_name: method.account_name,
        currency: method.currency,
        link_url: method.link_url,
      })
      .eq("id", method.id);
    setSaving(null);
    if (error) toast("Failed to save", "error");
    else toast("Gift method saved");
  }

  async function deleteMethod(id: string) {
    const supabase = createClient();
    await supabase.from("gift_methods").delete().eq("id", id);
    setMethods((prev) => prev.filter((m) => m.id !== id));
    toast("Gift method removed");
  }

  if (loading) return <p className="text-sm text-[var(--color-muted)]">Loading…</p>;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Step 04</p>
        <h2 className="font-display text-4xl font-light">Gifting</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Add one or more ways guests can send a gift.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {methods.map((method) => (
          <div key={method.id} className="border border-[var(--color-ink)]/10 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-widest uppercase text-[var(--color-muted)]">
                {METHOD_LABELS[method.type]}
              </span>
              <button
                onClick={() => deleteMethod(method.id)}
                className="text-[var(--color-muted)] hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {method.type === "bank_transfer" && (
              <>
                <Input
                  label="Bank name"
                  value={method.bank_name ?? ""}
                  onChange={(e) => updateMethod(method.id, { bank_name: e.target.value || null })}
                />
                <Input
                  label="Account number"
                  value={method.account_number ?? ""}
                  onChange={(e) => updateMethod(method.id, { account_number: e.target.value || null })}
                />
                <Input
                  label="Account name"
                  value={method.account_name ?? ""}
                  onChange={(e) => updateMethod(method.id, { account_name: e.target.value || null })}
                />
                <Input
                  label="Currency (e.g. NGN, USD)"
                  value={method.currency ?? ""}
                  onChange={(e) => updateMethod(method.id, { currency: e.target.value || null })}
                />
              </>
            )}

            {(method.type === "flutterwave" || method.type === "paystack" || method.type === "amazon") && (
              <Input
                label="Link URL"
                type="url"
                placeholder={
                  method.type === "amazon"
                    ? "https://www.amazon.com/gp/registry/..."
                    : "https://paystack.com/pay/..."
                }
                value={method.link_url ?? ""}
                onChange={(e) => updateMethod(method.id, { link_url: e.target.value || null })}
              />
            )}

            <Button
              size="sm"
              onClick={() => saveMethod(method)}
              disabled={saving === method.id}
              className="self-end"
            >
              {saving === method.id ? "Saving…" : "Save"}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {(Object.keys(METHOD_LABELS) as GiftMethodType[]).map((type) => (
          <button
            key={type}
            onClick={() => addMethod(type)}
            className="flex items-center gap-1.5 border border-dashed border-[var(--color-ink)]/20 px-4 py-2.5 text-xs text-[var(--color-muted)] hover:border-[var(--color-ink)]/40 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> {METHOD_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}