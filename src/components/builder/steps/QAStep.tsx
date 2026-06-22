"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2 } from "lucide-react";
import type { Couple, FAQ } from "@/lib/types";

const DEFAULT_FAQS = [
  { question: "Is it mandatory to RSVP?", answer: "Yes, we'd love to know you're coming so we can plan accordingly." },
  { question: "Are plus ones or kids allowed?", answer: "Please reach out to us directly to discuss." },
];

interface Props {
  couple: Couple;
}

export function QAStep({ couple }: Props) {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("faqs")
        .select("*")
        .eq("couple_id", couple.id)
        .order("position");

      if (!data || data.length === 0) {
        const { data: seeded } = await supabase
          .from("faqs")
          .insert(
            DEFAULT_FAQS.map((f, i) => ({ ...f, couple_id: couple.id, position: i }))
          )
          .select();
        setFaqs(seeded ?? []);
      } else {
        setFaqs(data);
      }
      setLoading(false);
    }
    load();
  }, [couple.id]);

  async function addFaq() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("faqs")
      .insert({ couple_id: couple.id, question: "", answer: "", position: faqs.length })
      .select()
      .single();
    if (error) { toast("Failed to add", "error"); return; }
    setFaqs([...faqs, data]);
  }

  function updateFaq(id: string, patch: Partial<FAQ>) {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  async function saveFaq(faq: FAQ) {
    setSaving(faq.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("faqs")
      .update({ question: faq.question, answer: faq.answer })
      .eq("id", faq.id);
    setSaving(null);
    if (error) toast("Failed to save", "error");
    else toast("Question saved");
  }

  async function deleteFaq(id: string) {
    const supabase = createClient();
    await supabase.from("faqs").delete().eq("id", id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast("Question removed");
  }

  if (loading) return <p className="text-sm text-[var(--color-muted)]">Loading…</p>;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Step 06</p>
        <h2 className="font-display text-4xl font-light">Questions & Answers</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Pre-answer common guest questions. These appear as an accordion on your site.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {faqs.map((faq, idx) => (
          <div key={faq.id} className="border border-[var(--color-ink)]/10 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-widest uppercase text-[var(--color-muted)]">
                Question {idx + 1}
              </span>
              <button
                onClick={() => deleteFaq(faq.id)}
                className="text-[var(--color-muted)] hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <Input
              label="Question"
              value={faq.question}
              onChange={(e) => updateFaq(faq.id, { question: e.target.value })}
            />
            <Textarea
              label="Answer"
              value={faq.answer}
              rows={3}
              onChange={(e) => updateFaq(faq.id, { answer: e.target.value })}
            />
            <Button
              size="sm"
              onClick={() => saveFaq(faq)}
              disabled={saving === faq.id}
              className="self-end"
            >
              {saving === faq.id ? "Saving…" : "Save"}
            </Button>
          </div>
        ))}
      </div>

      <button
        onClick={addFaq}
        className="flex items-center gap-2 border-2 border-dashed border-[var(--color-ink)]/20 p-5 text-sm text-[var(--color-muted)] hover:border-[var(--color-ink)]/40 transition-colors"
      >
        <Plus className="h-4 w-4" /> Add question
      </button>
    </div>
  );
}