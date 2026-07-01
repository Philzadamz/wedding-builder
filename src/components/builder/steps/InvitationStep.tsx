"use client";
import { useState, useRef } from "react";
import { FileText, Zap, Check, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { PrintCardPreview, CARD_W, CARD_H } from "@/components/invitations/PrintCardPreview";
import { DigitalCard } from "@/components/invitations/DigitalCard";
import { PRINT_TEMPLATES } from "@/components/invitations/templates/printTemplates";
import { DIGITAL_TEMPLATES } from "@/components/invitations/templates/digitalTemplates";
import type { Couple, WeddingEvent, InvitationCard } from "@/lib/types";
import type { CardData } from "@/components/invitations/types";

interface Props {
  couple: Couple;
  events: WeddingEvent[];
  onUpdate: (couple: Couple) => void;
}

function buildDefaults(couple: Couple, events: WeddingEvent[]): CardData {
  const ceremony = events.find((e) =>
    e.name.toLowerCase().includes("ceremon") || e.position === 0
  ) ?? events[0];
  const reception = events.find((e) =>
    e.name.toLowerCase().includes("reception") || e.position === 1
  ) ?? events[1];

  const siteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${couple.slug}`
    : couple.slug;

  const saved = couple.invitation_card?.data;
  return {
    brideName: saved?.brideName ?? couple.bride_name,
    groomName: saved?.groomName ?? couple.groom_name,
    weddingDate: saved?.weddingDate ?? couple.wedding_date ?? "",
    weddingTime: saved?.weddingTime ?? ceremony?.time ?? "",
    ceremonyVenue: saved?.ceremonyVenue ?? ceremony?.venue_name ?? "",
    ceremonyAddress: saved?.ceremonyAddress ?? ceremony?.venue_address ?? "",
    receptionVenue: saved?.receptionVenue ?? reception?.venue_name ?? "",
    receptionAddress: saved?.receptionAddress ?? reception?.venue_address ?? "",
    dressCode: saved?.dressCode ?? "",
    rsvpDeadline: saved?.rsvpDeadline ?? couple.rsvp_deadline ?? "",
    rsvpEmail: saved?.rsvpEmail ?? "",
    websiteUrl: saved?.websiteUrl ?? siteUrl,
    hashtag: saved?.hashtag ?? "",
    specialInstructions: saved?.specialInstructions ?? "",
    couplePhotoUrl: saved?.couplePhotoUrl ?? couple.hero_image_url ?? "",
  };
}

export function InvitationStep({ couple, events, onUpdate }: Props) {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const existing = couple.invitation_card;
  const [cardType, setCardType] = useState<"print" | "digital">(existing?.type ?? "print");
  const [templateId, setTemplateId] = useState(
    existing?.templateId ?? PRINT_TEMPLATES[0].id
  );
  const [data, setData] = useState<CardData>(() => buildDefaults(couple, events));
  const [saving, setSaving] = useState(false);

  const printTemplate = PRINT_TEMPLATES.find((t) => t.id === templateId);
  const digitalTemplate = DIGITAL_TEMPLATES.find((t) => t.id === templateId);

  function switchType(type: "print" | "digital") {
    setCardType(type);
    setTemplateId(type === "print" ? PRINT_TEMPLATES[0].id : DIGITAL_TEMPLATES[0].id);
  }

  function set(key: keyof CardData, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const card: InvitationCard = { type: cardType, templateId, data };
    const supabase = createClient();
    const { data: updated, error } = await supabase
      .from("couples")
      .update({ invitation_card: card })
      .eq("id", couple.id)
      .select()
      .single();

    setSaving(false);
    if (error) {
      toast("Failed to save invitation card", "error");
    } else {
      onUpdate(updated as Couple);
      toast("Invitation card saved — it's now live on your site!");
    }
  }

  async function remove() {
    setSaving(true);
    const supabase = createClient();
    const { data: updated, error } = await supabase
      .from("couples")
      .update({ invitation_card: null })
      .eq("id", couple.id)
      .select()
      .single();

    setSaving(false);
    if (error) {
      toast("Failed to remove card", "error");
    } else {
      onUpdate(updated as Couple);
      toast("Invitation card removed from your site");
    }
  }

  const PREVIEW_W = 340;
  const scale = PREVIEW_W / CARD_W;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Step 08</p>
        <h2 className="font-display text-4xl font-light">Invitation Card</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Choose a card to display on your wedding site — guests can view and download it.
        </p>
        {existing && (
          <div className="flex items-center gap-2 mt-3 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2 w-fit">
            <Check className="h-3.5 w-3.5" />
            A {existing.type} card is currently live on your site
          </div>
        )}
      </div>

      {/* Card type toggle */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-3">Card type</p>
        <div className="flex gap-1 border border-[var(--color-ink)]/10 p-0.5 w-fit">
          <button
            onClick={() => switchType("print")}
            className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-colors ${cardType === "print" ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"}`}
          >
            <FileText className="h-3 w-3" /> Print
          </button>
          <button
            onClick={() => switchType("digital")}
            className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-colors ${cardType === "digital" ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"}`}
          >
            <Zap className="h-3 w-3" /> Digital
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: template picker + fields */}
        <div className="flex flex-col gap-6 lg:w-72 shrink-0">
          {/* Template grid */}
          <div>
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-3">Template</p>
            {cardType === "print" ? (
              <div className="grid grid-cols-4 gap-2">
                {PRINT_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`aspect-[3/4] rounded-sm border-2 transition-all ${templateId === t.id ? "border-[var(--color-ink)] ring-1 ring-[var(--color-ink)]" : "border-transparent hover:border-[var(--color-ink)]/30"}`}
                    style={{ background: t.primaryBg }}
                    title={t.name}
                  >
                    <div style={{ height: 2, background: t.accentColor, margin: "4px 4px 0" }} />
                    <div style={{ height: 1, background: t.accentColor, margin: "2px 6px", opacity: 0.4 }} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {DIGITAL_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`flex items-center gap-3 p-2.5 border transition-all text-left ${templateId === t.id ? "border-[var(--color-ink)]" : "border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30"}`}
                  >
                    <div className="w-8 h-8 rounded-sm shrink-0" style={{ background: t.coverBg }} />
                    <div>
                      <div className="text-xs font-medium">{t.name}</div>
                      <div className="text-[10px] text-[var(--color-muted)]">{t.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <hr className="border-[var(--color-ink)]/10" />

          {/* Couple photo picker */}
          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Couple photo</p>
            <p className="text-[10px] text-[var(--color-muted)]">
              Shown on the card — blurred bg for print, front cover for digital.
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {/* No photo option */}
              <button
                onClick={() => set("couplePhotoUrl", "")}
                className={`w-12 h-12 border-2 flex items-center justify-center transition-all ${!data.couplePhotoUrl ? "border-[var(--color-ink)]" : "border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30"}`}
                title="No photo"
              >
                <ImageOff className="h-4 w-4 opacity-40" />
              </button>
              {/* Hero image */}
              {couple.hero_image_url && (
                <button
                  onClick={() => set("couplePhotoUrl", couple.hero_image_url!)}
                  className={`w-12 h-12 border-2 overflow-hidden transition-all ${data.couplePhotoUrl === couple.hero_image_url ? "border-[var(--color-accent)]" : "border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30"}`}
                  title="Hero photo"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={couple.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                </button>
              )}
              {/* Gallery images */}
              {(couple.gallery_images ?? []).map((url, i) => (
                <button
                  key={i}
                  onClick={() => set("couplePhotoUrl", url)}
                  className={`w-12 h-12 border-2 overflow-hidden transition-all ${data.couplePhotoUrl === url ? "border-[var(--color-accent)]" : "border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30"}`}
                  title={`Gallery photo ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[var(--color-ink)]/10" />

          {/* Editable fields */}
          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Card details</p>
            <Input label="Bride's name" value={data.brideName} onChange={(e) => set("brideName", e.target.value)} />
            <Input label="Groom's name" value={data.groomName} onChange={(e) => set("groomName", e.target.value)} />
            <Input label="Date" type="datetime-local" value={data.weddingDate} onChange={(e) => set("weddingDate", e.target.value)} />
            <Input label="Time" placeholder="e.g. 2:00 PM" value={data.weddingTime} onChange={(e) => set("weddingTime", e.target.value)} />
            <Input label="Ceremony venue" value={data.ceremonyVenue} onChange={(e) => set("ceremonyVenue", e.target.value)} />
            <Input label="Ceremony address" value={data.ceremonyAddress} onChange={(e) => set("ceremonyAddress", e.target.value)} />
            <Input label="Reception venue" value={data.receptionVenue} onChange={(e) => set("receptionVenue", e.target.value)} />
            <Input label="Reception address" value={data.receptionAddress} onChange={(e) => set("receptionAddress", e.target.value)} />
            <Input label="Dress code" placeholder="e.g. Black tie" value={data.dressCode} onChange={(e) => set("dressCode", e.target.value)} />
            <Input label="RSVP email" value={data.rsvpEmail} onChange={(e) => set("rsvpEmail", e.target.value)} />
            <Input label="Hashtag" placeholder="#YourWeddingTag" value={data.hashtag} onChange={(e) => set("hashtag", e.target.value)} />
            <Input label="Special instructions" value={data.specialInstructions} onChange={(e) => set("specialInstructions", e.target.value)} />
          </div>
        </div>

        {/* Right: live preview */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] self-start">Preview</p>
          {cardType === "print" && printTemplate ? (
            <div style={{ width: PREVIEW_W, height: CARD_H * scale, position: "relative" }}>
              <PrintCardPreview ref={previewRef} template={printTemplate} data={data} scale={scale} />
            </div>
          ) : digitalTemplate ? (
            <div className="w-full max-w-lg">
              <DigitalCard key={templateId} template={digitalTemplate} data={data} />
              <p className="text-xs text-[var(--color-muted)] text-center mt-3">Click the card to preview opening</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save & publish to site"}
        </Button>
        {existing && (
          <button
            onClick={remove}
            disabled={saving}
            className="text-xs text-[var(--color-muted)] underline hover:text-red-500 transition-colors"
          >
            Remove from site
          </button>
        )}
      </div>
    </div>
  );
}
