"use client";
import { useRef, useState } from "react";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { PrintCardPreview, CARD_W, CARD_H } from "./PrintCardPreview";
import { PRINT_TEMPLATES } from "./templates/printTemplates";
import type { CardData, PrintTemplate } from "./types";

interface Props {
  initialData: CardData;
  onBack: () => void;
  preselectedTemplate?: string;
}

export function PrintCardEditor({ initialData, onBack, preselectedTemplate }: Props) {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<CardData>(initialData);
  const [templateId, setTemplateId] = useState(preselectedTemplate ?? PRINT_TEMPLATES[0].id);
  const [downloading, setDownloading] = useState(false);

  const template = PRINT_TEMPLATES.find((t) => t.id === templateId) ?? PRINT_TEMPLATES[0];

  function set(key: keyof CardData, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function downloadPDF() {
    if (!previewRef.current) return;
    setDownloading(true);
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
      // A4 in mm: 210×297
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      pdf.addImage(img, "JPEG", 0, 0, 210, 297);
      pdf.save(`${data.brideName}-${data.groomName}-invitation.pdf`);
      toast("Downloaded as PDF");
    } catch {
      toast("Download failed — try the Print option", "error");
    } finally {
      setDownloading(false);
    }
  }

  async function downloadPNG() {
    if (!previewRef.current) return;
    setDownloading(true);
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
      link.download = `${data.brideName}-${data.groomName}-invitation.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast("Downloaded as PNG");
    } catch {
      toast("Download failed", "error");
    } finally {
      setDownloading(false);
    }
  }

  function printCard() {
    const printWin = window.open("", "_blank");
    if (!printWin || !previewRef.current) return;
    const html = previewRef.current.outerHTML;
    const styles = Array.from(document.styleSheets)
      .flatMap((s) => { try { return Array.from(s.cssRules).map((r) => r.cssText); } catch { return []; } })
      .join("\n");
    printWin.document.write(`<!DOCTYPE html><html><head><style>${styles} body{margin:0}</style></head><body>${html}</body></html>`);
    printWin.document.close();
    printWin.onload = () => { printWin.print(); };
  }

  // Preview scale to fit within ~420px wide panel
  const PREVIEW_W = 420;
  const scale = PREVIEW_W / CARD_W;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[var(--color-ink)]/10 px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="font-display text-xl font-light">Print Card Editor</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={printCard}>
            <Printer className="h-3.5 w-3.5 mr-1.5" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={downloadPNG} disabled={downloading}>PNG</Button>
          <Button size="sm" onClick={downloadPDF} disabled={downloading}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> {downloading ? "Saving…" : "PDF"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: form ─────────────────────────────────────────────── */}
        <div className="w-80 shrink-0 border-r border-[var(--color-ink)]/10 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Template picker */}
          <div>
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-3">Template</p>
            <div className="grid grid-cols-3 gap-2">
              {PRINT_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplateId(t.id)}
                  className={`aspect-[3/4] rounded-sm border-2 transition-all ${templateId === t.id ? "border-[var(--color-ink)]" : "border-transparent"}`}
                  style={{ background: t.primaryBg }}
                  title={t.name}
                >
                  <div style={{ height: 3, background: t.accentColor, margin: "6px 6px 0" }} />
                  <div style={{ height: 2, background: t.accentColor, margin: "3px 10px", opacity: 0.5 }} />
                  <div style={{ height: 2, background: t.accentColor, margin: "3px 10px", opacity: 0.3 }} />
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--color-muted)] mt-2">{template.name} · {template.category}</p>
          </div>

          <hr className="border-[var(--color-ink)]/10" />

          {/* Fields */}
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Wedding Details</p>
            <Input label="Bride's name" value={data.brideName} onChange={(e) => set("brideName", e.target.value)} />
            <Input label="Groom's name" value={data.groomName} onChange={(e) => set("groomName", e.target.value)} />
            <Input label="Wedding date" type="datetime-local" value={data.weddingDate} onChange={(e) => set("weddingDate", e.target.value)} />
            <Input label="Time" placeholder="e.g. 2:00 PM" value={data.weddingTime} onChange={(e) => set("weddingTime", e.target.value)} />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Ceremony</p>
            <Input label="Venue name" value={data.ceremonyVenue} onChange={(e) => set("ceremonyVenue", e.target.value)} />
            <Input label="Venue address" value={data.ceremonyAddress} onChange={(e) => set("ceremonyAddress", e.target.value)} />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Reception</p>
            <Input label="Venue name" value={data.receptionVenue} onChange={(e) => set("receptionVenue", e.target.value)} />
            <Input label="Venue address" value={data.receptionAddress} onChange={(e) => set("receptionAddress", e.target.value)} />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Other</p>
            <Input label="Dress code" placeholder="e.g. Black tie optional" value={data.dressCode} onChange={(e) => set("dressCode", e.target.value)} />
            <Input label="RSVP email" value={data.rsvpEmail} onChange={(e) => set("rsvpEmail", e.target.value)} />
            <Input label="RSVP deadline" type="date" value={data.rsvpDeadline} onChange={(e) => set("rsvpDeadline", e.target.value)} />
            <Input label="Website URL" value={data.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} />
            <Input label="Hashtag" placeholder="e.g. #AdesolaAndAdams2026" value={data.hashtag} onChange={(e) => set("hashtag", e.target.value)} />
            <Input label="Special instructions" value={data.specialInstructions} onChange={(e) => set("specialInstructions", e.target.value)} />
          </div>
        </div>

        {/* ── Right: live preview ────────────────────────────────────── */}
        <div className="flex-1 overflow-auto flex items-start justify-center bg-[var(--color-ink)]/5 p-10">
          <div style={{ width: PREVIEW_W, height: CARD_H * scale, position: "relative" }}>
            <PrintCardPreview ref={previewRef} template={template} data={data} scale={scale} />
          </div>
        </div>
      </div>
    </div>
  );
}
