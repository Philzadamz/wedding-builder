"use client";
import { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { DigitalCard } from "./DigitalCard";
import { DIGITAL_TEMPLATES } from "./templates/digitalTemplates";
import type { CardData } from "./types";

interface Props {
  initialData: CardData;
  onBack: () => void;
  preselectedTemplate?: string;
}

export function DigitalCardEditor({ initialData, onBack, preselectedTemplate }: Props) {
  const { toast } = useToast();
  const [data, setData] = useState<CardData>(initialData);
  const [templateId, setTemplateId] = useState(preselectedTemplate ?? DIGITAL_TEMPLATES[0].id);

  const template = DIGITAL_TEMPLATES.find((t) => t.id === templateId) ?? DIGITAL_TEMPLATES[0];

  function set(key: keyof CardData, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function downloadHTML() {
    // Fetch couple photo and embed as base64 so it works offline
    let photoDataUrl = "";
    if (data.couplePhotoUrl) {
      try {
        const res = await fetch(data.couplePhotoUrl);
        const blob = await res.blob();
        photoDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch { /* skip if fetch fails */ }
    }

    const hasPhoto = !!photoDataUrl;
    const coverBg = hasPhoto
      ? `background: linear-gradient(135deg,rgba(0,0,0,0.45),rgba(0,0,0,0.6)), url('${photoDataUrl}') center/cover no-repeat`
      : `background: ${template.coverBg}`;
    const coverColor = hasPhoto ? "#fff" : template.coverText;
    const coverAccent = hasPhoto ? "rgba(255,255,255,0.75)" : template.coverAccent;
    const textShadow = hasPhoto ? "text-shadow: 0 2px 16px rgba(0,0,0,0.7);" : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.brideName} &amp; ${data.groomName} — Wedding Invitation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Cormorant Garamond', Georgia, serif; background: #111; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .card-wrap { width: 100%; max-width: 860px; }
    .card { position: relative; width: 100%; padding-bottom: 66.67%; perspective: 1400px; cursor: pointer; }
    .cover { position: absolute; inset: 0; ${coverBg}; display: flex; align-items: center; justify-content: center; flex-direction: column; color: ${coverColor}; font-style: italic; transition: opacity 0.8s ease; z-index: 2; padding: 10%; text-align: center; }
    .cover.open { opacity: 0; pointer-events: none; }
    .cover h1 { font-size: clamp(28px, 5vw, 56px); line-height: 1.1; ${textShadow} }
    .cover .and { font-size: clamp(14px, 2vw, 22px); color: ${coverAccent}; margin: 4% 0; ${textShadow} }
    .cover .date { margin-top: 6%; font-size: clamp(13px, 1.8vw, 18px); color: ${coverAccent}; ${textShadow} }
    .cover .hint { margin-top: auto; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: ${coverAccent}; opacity: 0.7; }
    .interior { position: absolute; inset: 0; display: flex; background: ${template.interiorBg}; color: ${template.interiorText}; opacity: 0; transition: opacity 0.6s 0.7s; }
    .interior.open { opacity: 1; }
    .col { flex: 1; padding: 6% 5%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-right: 1px solid ${template.dividerColor}33; }
    .col:last-child { border-right: none; }
    .label { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: ${template.interiorAccent}; opacity: 0.7; margin-bottom: 4px; }
    .value { font-size: clamp(10px, 1.2vw, 13px); color: ${template.interiorText}; margin-bottom: 6%; }
    .names { font-size: clamp(28px, 4vw, 42px); font-style: italic; line-height: 1.1; color: ${template.interiorText}; }
    .and-int { font-size: 18px; color: ${template.interiorAccent}; font-style: italic; margin: 3% 0; }
  </style>
</head>
<body>
  <div class="card-wrap">
    <div class="card" id="card" onclick="openCard()">
      <div class="interior" id="interior">
        <div class="col">
          <div style="font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:${template.interiorAccent};opacity:.7;margin-bottom:8%">You are cordially invited</div>
          <div class="names">${data.brideName}</div>
          <div class="and-int">&amp;</div>
          <div class="names">${data.groomName}</div>
          ${data.hashtag ? `<div style="margin-top:8%;font-style:italic;color:${template.interiorAccent};font-size:14px">${data.hashtag}</div>` : ""}
        </div>
        <div class="col" style="flex:1.2">
          <div style="font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:${template.interiorAccent};margin-bottom:8%">Wedding Details</div>
          ${data.weddingDate ? `<div class="label">Date</div><div class="value">${new Date(data.weddingDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}${data.weddingTime ? "<br/>" + data.weddingTime : ""}</div>` : ""}
          ${data.ceremonyVenue ? `<div class="label">Ceremony</div><div class="value">${data.ceremonyVenue}${data.ceremonyAddress ? "<br/><small style='opacity:.7'>" + data.ceremonyAddress + "</small>" : ""}</div>` : ""}
          ${data.receptionVenue ? `<div class="label">Reception</div><div class="value">${data.receptionVenue}</div>` : ""}
          ${data.dressCode ? `<div class="label">Dress Code</div><div class="value">${data.dressCode}</div>` : ""}
          ${data.rsvpEmail ? `<div class="label">RSVP</div><div class="value" style="font-size:11px;opacity:.8">${data.rsvpEmail}</div>` : ""}
        </div>
        <div class="col">
          <div style="font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:${template.interiorAccent};margin-bottom:8%">More Info</div>
          ${data.websiteUrl ? `<div class="label">Website</div><div class="value" style="font-size:11px">${data.websiteUrl}</div>` : ""}
          ${data.rsvpDeadline ? `<div class="label">RSVP By</div><div class="value">${data.rsvpDeadline}</div>` : ""}
          ${data.specialInstructions ? `<div style="margin-top:auto;font-size:11px;opacity:.7;line-height:1.5">${data.specialInstructions}</div>` : ""}
        </div>
      </div>
      <div class="cover" id="cover">
        <h1>${data.brideName}</h1>
        <div class="and">&amp;</div>
        <h1>${data.groomName}</h1>
        ${data.weddingDate ? `<div class="date">${new Date(data.weddingDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>` : ""}
        ${data.ceremonyVenue ? `<div style="margin-top:3%;font-size:clamp(11px,1.4vw,15px);color:${coverAccent};opacity:.85;${textShadow}">${data.ceremonyVenue}</div>` : ""}
        <div class="hint">Click to open</div>
      </div>
    </div>
  </div>
  <script>
    var opened = false;
    function openCard() {
      if (opened) return;
      opened = true;
      document.getElementById('cover').classList.add('open');
      document.getElementById('interior').classList.add('open');
    }
  </script>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.brideName}-${data.groomName}-digital-invitation.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Downloaded as HTML — image embedded");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--color-ink)]/10 px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="font-display text-xl font-light">Digital Invitation Editor</h1>
        <Button size="sm" onClick={downloadHTML}>
          <Download className="h-3.5 w-3.5 mr-1.5" /> Download HTML
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: controls ─────────────────────────────────────────── */}
        <div className="w-72 shrink-0 border-r border-[var(--color-ink)]/10 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Theme picker */}
          <div>
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-3">Theme</p>
            <div className="flex flex-col gap-2">
              {DIGITAL_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={`flex items-center gap-3 p-3 border text-left transition-all ${templateId === t.id ? "border-[var(--color-ink)]" : "border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/30"}`}
                >
                  <div className="w-8 h-8 rounded-sm shrink-0" style={{ background: t.coverBg }} />
                  <div>
                    <div className="text-xs font-medium">{t.name}</div>
                    <div className="text-[10px] text-[var(--color-muted)]">{t.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[var(--color-ink)]/10" />

          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Details</p>
            <Input label="Bride's name" value={data.brideName} onChange={(e) => set("brideName", e.target.value)} />
            <Input label="Groom's name" value={data.groomName} onChange={(e) => set("groomName", e.target.value)} />
            <Input label="Wedding date" type="datetime-local" value={data.weddingDate} onChange={(e) => set("weddingDate", e.target.value)} />
            <Input label="Time" placeholder="e.g. 2:00 PM" value={data.weddingTime} onChange={(e) => set("weddingTime", e.target.value)} />
            <Input label="Ceremony venue" value={data.ceremonyVenue} onChange={(e) => set("ceremonyVenue", e.target.value)} />
            <Input label="Ceremony address" value={data.ceremonyAddress} onChange={(e) => set("ceremonyAddress", e.target.value)} />
            <Input label="Reception venue" value={data.receptionVenue} onChange={(e) => set("receptionVenue", e.target.value)} />
            <Input label="Dress code" value={data.dressCode} onChange={(e) => set("dressCode", e.target.value)} />
            <Input label="RSVP email" value={data.rsvpEmail} onChange={(e) => set("rsvpEmail", e.target.value)} />
            <Input label="RSVP deadline" type="date" value={data.rsvpDeadline} onChange={(e) => set("rsvpDeadline", e.target.value)} />
            <Input label="Website URL" value={data.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} />
            <Input label="Hashtag" value={data.hashtag} onChange={(e) => set("hashtag", e.target.value)} />
            <Input label="Special notes" value={data.specialInstructions} onChange={(e) => set("specialInstructions", e.target.value)} />
          </div>
        </div>

        {/* ── Right: live animated preview ────────────────────────────── */}
        <div className="flex-1 overflow-auto flex flex-col items-center justify-center bg-[var(--color-ink)]/5 p-10 gap-6">
          <div className="max-w-2xl w-full">
            <DigitalCard key={templateId} template={template} data={data} />
          </div>
          <p className="text-xs text-[var(--color-muted)] tracking-widest uppercase">Click the card to open it</p>
        </div>
      </div>
    </div>
  );
}
