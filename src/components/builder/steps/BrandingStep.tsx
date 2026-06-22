"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { Couple, FontStyle, SectionsEnabled, NavLabels } from "@/lib/types";

interface Props {
  couple: Couple;
  onUpdate: (couple: Couple) => void;
}

const FONTS: { value: FontStyle; label: string; preview: string }[] = [
  { value: "serif", label: "Serif Elegant", preview: "Cormorant Garamond" },
  { value: "sans", label: "Modern Sans", preview: "Jost" },
  { value: "script", label: "Script Romantic", preview: "Great Vibes" },
];

const SECTION_LABELS: Record<keyof SectionsEnabled, string> = {
  wishes: "Well Wishes",
  schedule: "Schedule",
  qa: "Q&A",
  rsvp: "RSVP",
  gifting: "Gifting",
};

export function BrandingStep({ couple, onUpdate }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [accent, setAccent] = useState(couple.color_theme.accent);
  const [font, setFont] = useState<FontStyle>(couple.font_style);
  const [sections, setSections] = useState<SectionsEnabled>(couple.sections_enabled);
  const [navLabels, setNavLabels] = useState<NavLabels>(couple.nav_labels);

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("couples")
      .update({
        color_theme: { ...couple.color_theme, accent },
        font_style: font,
        sections_enabled: sections,
        nav_labels: navLabels,
      })
      .eq("id", couple.id)
      .select()
      .single();
    setSaving(false);
    if (error) toast("Failed to save", "error");
    else { onUpdate(data); toast("Branding saved"); }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Step 07</p>
        <h2 className="font-display text-4xl font-light">Branding & Design</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Set the look and feel of your wedding site.
        </p>
      </div>

      {/* Accent colour */}
      <div className="flex flex-col gap-3">
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Accent colour</p>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="w-12 h-12 cursor-pointer border-none bg-transparent"
          />
          <span className="text-sm font-mono text-[var(--color-muted)]">{accent.toUpperCase()}</span>
        </div>
        <div className="flex gap-2 mt-1">
          {["#C9A96E", "#B5998A", "#8B9E87", "#A8B5C2", "#D4B8A0", "#1A1A1A"].map((c) => (
            <button
              key={c}
              onClick={() => setAccent(c)}
              className={cn(
                "w-8 h-8 border-2 transition-transform hover:scale-110",
                accent === c ? "border-[var(--color-ink)] scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Font style */}
      <div className="flex flex-col gap-3">
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Font style</p>
        <div className="flex flex-col gap-2">
          {FONTS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFont(f.value)}
              className={cn(
                "flex items-center justify-between border p-4 text-left transition-colors",
                font === f.value
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)]/5"
                  : "border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30"
              )}
            >
              <div>
                <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">{f.label}</p>
                <p
                  className="text-2xl mt-1"
                  style={{
                    fontFamily:
                      f.value === "serif"
                        ? "Cormorant Garamond, serif"
                        : f.value === "script"
                        ? "Great Vibes, cursive"
                        : "Jost, sans-serif",
                  }}
                >
                  Sharon & Victor
                </p>
              </div>
              {font === f.value && (
                <div className="w-2 h-2 rounded-full bg-[var(--color-ink)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Section toggles */}
      <div className="flex flex-col gap-3">
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Sections</p>
        <div className="flex flex-col gap-3">
          {(Object.keys(SECTION_LABELS) as (keyof SectionsEnabled)[]).map((key) => (
            <Switch
              key={key}
              label={SECTION_LABELS[key]}
              checked={sections[key]}
              onCheckedChange={(checked) => setSections({ ...sections, [key]: checked })}
            />
          ))}
        </div>
      </div>

      {/* Navigation labels */}
      <div className="flex flex-col gap-3">
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">
          Navigation labels
        </p>
        <div className="flex flex-col gap-4">
          {(Object.keys(navLabels) as (keyof NavLabels)[]).map((key) => (
            <Input
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={navLabels[key]}
              onChange={(e) => setNavLabels({ ...navLabels, [key]: e.target.value })}
            />
          ))}
        </div>
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save branding"}
      </Button>
    </div>
  );
}