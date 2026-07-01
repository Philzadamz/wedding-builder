"use client";
import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, MessageCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Couple } from "@/lib/types";

interface Props {
  couple: Couple;
  siteUrl: string;
}

export function ShareTools({ couple, siteUrl }: Props) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function copyLink() {
    await navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    toast("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(
      `You're invited to ${couple.bride_name} & ${couple.groom_name}'s wedding! 🎉\n\nView details and RSVP here: ${siteUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  async function downloadQRPdf() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { jsPDF } = await import("jspdf");
    const qrSize = 80;
    const pageW = 148;
    const pageH = 148;
    const pdf = new jsPDF({ unit: "mm", format: [pageW, pageH] });

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageW, pageH, "F");

    const imgData = canvas.toDataURL("image/png");
    const x = (pageW - qrSize) / 2;
    pdf.addImage(imgData, "PNG", x, 16, qrSize, qrSize);

    pdf.setFont("times", "italic");
    pdf.setFontSize(16);
    pdf.setTextColor(13, 13, 13);
    const names = `${couple.bride_name} & ${couple.groom_name}`;
    pdf.text(names, pageW / 2, 108, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 120);
    pdf.text("SCAN TO VISIT OUR WEDDING SITE", pageW / 2, 116, { align: "center" });

    pdf.save(`${couple.bride_name}-${couple.groom_name}-qr.pdf`);
  }

  return (
    <div className="flex flex-col gap-10 max-w-lg">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Share</p>
        <h2 className="font-display text-3xl font-light">Share your site</h2>
      </div>

      {/* Site URL */}
      <div className="flex flex-col gap-2">
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Your unique link</p>
        <div className="flex items-center gap-3 border border-[var(--color-ink)]/10 p-4">
          <span className="text-sm flex-1 truncate font-mono">{siteUrl}</span>
          <button
            onClick={copyLink}
            className="shrink-0 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex flex-col gap-3">
        <Button variant="outline" onClick={shareWhatsApp} className="justify-start gap-3">
          <MessageCircle className="h-4 w-4" />
          Share on WhatsApp
        </Button>
        <Button variant="outline" onClick={() => setShowQR(!showQR)} className="justify-start gap-3">
          <QrCode className="h-4 w-4" />
          {showQR ? "Hide QR code" : "Generate QR code"}
        </Button>
      </div>

      {/* QR code */}
      {showQR && (
        <div className="flex flex-col items-center gap-4 p-8 border border-[var(--color-ink)]/10">
          <QRCodeCanvas
            ref={canvasRef}
            value={siteUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#0D0D0D"
            marginSize={0}
          />
          <div className="text-center">
            <p className="font-script text-2xl">{couple.bride_name} & {couple.groom_name}</p>
            <p className="text-xs text-[var(--color-muted)] mt-1 tracking-widest uppercase">
              Scan to visit our wedding site
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={downloadQRPdf}>
            Download QR code (PDF)
          </Button>
        </div>
      )}
    </div>
  );
}
