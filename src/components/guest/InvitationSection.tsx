"use client";
import { useRef } from "react";
import { Download, FileText, Zap } from "lucide-react";
import { PrintCardPreview, CARD_W, CARD_H } from "@/components/invitations/PrintCardPreview";
import { DigitalCard } from "@/components/invitations/DigitalCard";
import { PRINT_TEMPLATES } from "@/components/invitations/templates/printTemplates";
import { DIGITAL_TEMPLATES } from "@/components/invitations/templates/digitalTemplates";
import type { InvitationCard } from "@/lib/types";

interface Props {
  card: InvitationCard;
}

function PrintInvitation({ card }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const template = PRINT_TEMPLATES.find((t) => t.id === card.templateId) ?? PRINT_TEMPLATES[0];

  async function downloadPDF() {
    if (!previewRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: CARD_W,
        height: CARD_H,
      });
      const img = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      pdf.addImage(img, "JPEG", 0, 0, 210, 297);
      pdf.save(`${card.data.brideName}-${card.data.groomName}-invitation.pdf`);
    } catch {
      alert("Download failed — please try again.");
    }
  }

  async function downloadPNG() {
    if (!previewRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: CARD_W,
        height: CARD_H,
      });
      const link = document.createElement("a");
      link.download = `${card.data.brideName}-${card.data.groomName}-invitation.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Download failed — please try again.");
    }
  }

  // Display scale: max 480px wide
  const DISPLAY_W = Math.min(480, typeof window !== "undefined" ? window.innerWidth - 48 : 480);
  const scale = DISPLAY_W / CARD_W;

  return (
    <div className="flex flex-col items-center gap-6">
      <div style={{ width: DISPLAY_W, height: CARD_H * scale, position: "relative" }}>
        <PrintCardPreview ref={previewRef} template={template} data={card.data} scale={scale} />
      </div>
      <div className="flex gap-3">
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-ink)] text-white text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
        >
          <Download className="h-3.5 w-3.5" /> Download PDF
        </button>
        <button
          onClick={downloadPNG}
          className="flex items-center gap-2 px-5 py-2.5 border border-[var(--color-ink)] text-xs tracking-widest uppercase hover:bg-[var(--color-ink)]/5 transition-colors"
        >
          <Download className="h-3.5 w-3.5" /> Download PNG
        </button>
      </div>
    </div>
  );
}

function DigitalInvitation({ card }: Props) {
  const template = DIGITAL_TEMPLATES.find((t) => t.id === card.templateId) ?? DIGITAL_TEMPLATES[0];

  function downloadHTML() {
    const d = card.data;
    const t = template;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${d.brideName} & ${d.groomName} — Wedding Invitation</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Cormorant Garamond', Georgia, serif; background: #111; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .card { position: relative; width: 100%; max-width: 800px; padding-bottom: 66.67%; cursor: pointer; }
    .cover { position: absolute; inset: 0; background: ${t.coverBg}; display: flex; align-items: center; justify-content: center; flex-direction: column; color: ${t.coverText}; font-style: italic; transition: opacity 0.8s; z-index: 2; padding: 10%; text-align: center; }
    .cover.open { opacity: 0; pointer-events: none; }
    .cover h1 { font-size: clamp(28px,5vw,52px); line-height: 1.1; }
    .cover .and { font-size: 20px; color: ${t.coverAccent}; margin: 4% 0; }
    .cover .hint { margin-top: auto; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: ${t.coverAccent}; opacity: .6; }
    .interior { position: absolute; inset: 0; display: flex; background: ${t.interiorBg}; color: ${t.interiorText}; opacity: 0; transition: opacity 0.6s 0.7s; }
    .interior.open { opacity: 1; }
    .col { flex: 1; padding: 6% 5%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-right: 1px solid ${t.dividerColor}33; }
    .col:last-child { border-right: none; }
    .lbl { font-size: 9px; letter-spacing: .3em; text-transform: uppercase; color: ${t.interiorAccent}; opacity: .7; margin-bottom: 4px; }
    .val { font-size: clamp(10px,1.2vw,13px); margin-bottom: 6%; }
  </style>
</head>
<body>
  <div class="card" onclick="open_()">
    <div class="interior" id="interior">
      <div class="col">
        <div class="lbl" style="margin-bottom:8%">You are cordially invited</div>
        <div style="font-size:clamp(28px,4vw,42px);font-style:italic;line-height:1.1">${d.brideName}</div>
        <div style="font-size:18px;color:${t.interiorAccent};font-style:italic;margin:3% 0">&amp;</div>
        <div style="font-size:clamp(28px,4vw,42px);font-style:italic;line-height:1.1;margin-bottom:6%">${d.groomName}</div>
        ${d.hashtag ? `<div style="font-style:italic;color:${t.interiorAccent}">${d.hashtag}</div>` : ""}
      </div>
      <div class="col" style="flex:1.2">
        <div class="lbl" style="margin-bottom:8%">Wedding Details</div>
        ${d.weddingDate ? `<div class="lbl">Date</div><div class="val">${new Date(d.weddingDate).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}${d.weddingTime ? "<br/>"+d.weddingTime : ""}</div>` : ""}
        ${d.ceremonyVenue ? `<div class="lbl">Ceremony</div><div class="val">${d.ceremonyVenue}${d.ceremonyAddress ? "<br/><small style='opacity:.7'>"+d.ceremonyAddress+"</small>" : ""}</div>` : ""}
        ${d.receptionVenue ? `<div class="lbl">Reception</div><div class="val">${d.receptionVenue}</div>` : ""}
        ${d.dressCode ? `<div class="lbl">Dress Code</div><div class="val">${d.dressCode}</div>` : ""}
        ${d.rsvpEmail ? `<div class="lbl">RSVP</div><div class="val" style="font-size:11px">${d.rsvpEmail}</div>` : ""}
      </div>
      <div class="col">
        <div class="lbl" style="margin-bottom:8%">More Info</div>
        ${d.websiteUrl ? `<div class="lbl">Website</div><div class="val" style="font-size:11px">${d.websiteUrl}</div>` : ""}
        ${d.rsvpDeadline ? `<div class="lbl">RSVP By</div><div class="val">${d.rsvpDeadline}</div>` : ""}
      </div>
    </div>
    <div class="cover" id="cover">
      <h1>${d.brideName}</h1>
      <div class="and">&amp;</div>
      <h1>${d.groomName}</h1>
      ${d.weddingDate ? `<div style="margin-top:8%;font-size:14px;opacity:.8">${new Date(d.weddingDate).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>` : ""}
      <div class="hint">Click to open</div>
    </div>
  </div>
  <script>var o=false;function open_(){if(o)return;o=true;document.getElementById('cover').classList.add('open');document.getElementById('interior').classList.add('open');}</script>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${d.brideName}-${d.groomName}-invitation.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      <DigitalCard template={template} data={card.data} />
      <button
        onClick={downloadHTML}
        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-ink)] text-white text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
      >
        <Download className="h-3.5 w-3.5" /> Download Digital Invitation
      </button>
    </div>
  );
}

export function InvitationSection({ card }: Props) {
  return (
    <section id="invitation" className="py-20 px-6 md:px-10 max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-10">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[var(--color-muted)] mb-3">
            {card.type === "print" ? (
              <><FileText className="inline h-3 w-3 mr-1.5" />Print Invitation</>
            ) : (
              <><Zap className="inline h-3 w-3 mr-1.5" />Digital Invitation</>
            )}
          </p>
          <h2 className="font-display text-4xl font-light">Our Invitation</h2>
          <p className="text-sm text-[var(--color-muted)] mt-2">
            {card.type === "print"
              ? "Download and print your personal copy."
              : "Click the card to open your digital invitation."}
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 h-px bg-[var(--color-ink)]/10" />
          <span className="text-[var(--color-accent)] text-sm">✦</span>
          <div className="flex-1 h-px bg-[var(--color-ink)]/10" />
        </div>

        {card.type === "print" ? (
          <PrintInvitation card={card} />
        ) : (
          <DigitalInvitation card={card} />
        )}
      </div>
    </section>
  );
}
