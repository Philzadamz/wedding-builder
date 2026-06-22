"use client";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
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
          <QRCodeSVG
            value={siteUrl}
            size={200}
            bgColor="transparent"
            fgColor="#0D0D0D"
            includeMargin={false}
          />
          <div className="text-center">
            <p className="font-script text-2xl">{couple.bride_name} & {couple.groom_name}</p>
            <p className="text-xs text-[var(--color-muted)] mt-1 tracking-widest uppercase">
              Scan to visit our wedding site
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const svg = document.querySelector("#qr-code-wrapper svg");
              if (!svg) return;
              const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "wedding-qr.svg";
              a.click();
            }}
          >
            Download QR code
          </Button>
        </div>
      )}
    </div>
  );
}