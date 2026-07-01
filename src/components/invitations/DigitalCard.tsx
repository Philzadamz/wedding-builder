"use client";
import { useState, useEffect } from "react";
import type { CardData, DigitalTemplate } from "./types";

interface Props {
  template: DigitalTemplate;
  data: CardData;
}

function fmt(date: string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  } catch { return date; }
}

function Sparkle({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 4, height: 4, borderRadius: "50%", background: color, opacity: 0.6, ...style }} />
  );
}

export function DigitalCard({ template: t, data: d }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [interiorVisible, setInteriorVisible] = useState(false);
  const [sparkles, setSparkles] = useState<{ x: number; y: number; delay: number }[]>([]);
  const [qrCells, setQrCells] = useState<boolean[]>([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: 12 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 0.15,
      }))
    );
    setQrCells(Array.from({ length: 25 }, () => Math.random() > 0.5));
  }, []);

  function open() {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => setInteriorVisible(true), 900);
  }

  const panelStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "50%",
    transformStyle: "preserve-3d",
    transition: "transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
    willChange: "transform",
  };

  return (
    <div style={{ width: "100%", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      {/* Card wrapper */}
      <div
        style={{ position: "relative", width: "100%", paddingBottom: "66.67%", perspective: "1400px", cursor: isOpen ? "default" : "pointer" }}
        onClick={open}
        role={isOpen ? undefined : "button"}
        aria-label="Open invitation"
      >
        {/* ── Interior (always rendered, fades in when open) ─────────────── */}
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          opacity: interiorVisible ? 1 : 0,
          transform: interiorVisible ? "scale(1)" : "scale(0.97)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          background: t.interiorBg,
          overflow: "hidden",
        }}>
          {/* Left interior section */}
          <div style={{ flex: 1, borderRight: `1px solid ${t.dividerColor}33`, padding: "6% 5%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: "clamp(10px,1.2vw,13px)", letterSpacing: "0.3em", textTransform: "uppercase", color: t.interiorAccent, opacity: 0.8, marginBottom: "8%" }}>You are cordially invited</div>
            <div style={{ fontSize: "clamp(28px,4vw,42px)", fontStyle: "italic", color: t.interiorText, lineHeight: 1.1, marginBottom: "2%" }}>{d.brideName}</div>
            <div style={{ fontSize: "clamp(12px,1.5vw,18px)", color: t.interiorAccent, margin: "2% 0", fontStyle: "italic" }}>{"&"}</div>
            <div style={{ fontSize: "clamp(28px,4vw,42px)", fontStyle: "italic", color: t.interiorText, lineHeight: 1.1, marginBottom: "6%" }}>{d.groomName}</div>
            <div style={{ width: 40, height: 1, background: t.dividerColor, marginBottom: "6%" }} />
            {d.hashtag && <div style={{ fontSize: "clamp(11px,1.3vw,14px)", fontStyle: "italic", color: t.interiorAccent }}>{d.hashtag}</div>}
            {d.specialInstructions && <div style={{ marginTop: "6%", fontSize: "clamp(9px,1vw,11px)", color: t.interiorText, opacity: 0.7, lineHeight: 1.5 }}>{d.specialInstructions}</div>}
          </div>

          {/* Center section */}
          <div style={{ flex: 1.2, padding: "6% 5%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", borderRight: `1px solid ${t.dividerColor}33` }}>
            <div style={{ fontSize: "clamp(8px,0.9vw,10px)", letterSpacing: "0.4em", textTransform: "uppercase", color: t.interiorAccent, marginBottom: "8%" }}>Wedding Details</div>
            {d.weddingDate && (
              <div style={{ marginBottom: "6%" }}>
                <div style={{ fontSize: "clamp(8px,0.8vw,9px)", letterSpacing: "0.2em", textTransform: "uppercase", color: t.interiorAccent, opacity: 0.7, marginBottom: 4 }}>Date</div>
                <div style={{ fontSize: "clamp(10px,1.1vw,13px)", color: t.interiorText }}>{fmt(d.weddingDate)}</div>
                {d.weddingTime && <div style={{ fontSize: "clamp(10px,1.1vw,12px)", color: t.interiorText, opacity: 0.8, marginTop: 2 }}>{d.weddingTime}</div>}
              </div>
            )}
            {d.ceremonyVenue && (
              <div style={{ marginBottom: "6%" }}>
                <div style={{ fontSize: "clamp(8px,0.8vw,9px)", letterSpacing: "0.2em", textTransform: "uppercase", color: t.interiorAccent, opacity: 0.7, marginBottom: 4 }}>Ceremony</div>
                <div style={{ fontSize: "clamp(10px,1.1vw,13px)", color: t.interiorText }}>{d.ceremonyVenue}</div>
                {d.ceremonyAddress && <div style={{ fontSize: "clamp(9px,0.9vw,11px)", color: t.interiorText, opacity: 0.7, marginTop: 2 }}>{d.ceremonyAddress}</div>}
              </div>
            )}
            {d.receptionVenue && (
              <div style={{ marginBottom: "6%" }}>
                <div style={{ fontSize: "clamp(8px,0.8vw,9px)", letterSpacing: "0.2em", textTransform: "uppercase", color: t.interiorAccent, opacity: 0.7, marginBottom: 4 }}>Reception</div>
                <div style={{ fontSize: "clamp(10px,1.1vw,13px)", color: t.interiorText }}>{d.receptionVenue}</div>
                {d.receptionAddress && <div style={{ fontSize: "clamp(9px,0.9vw,11px)", color: t.interiorText, opacity: 0.7, marginTop: 2 }}>{d.receptionAddress}</div>}
              </div>
            )}
            {d.dressCode && (
              <div style={{ marginBottom: "4%" }}>
                <div style={{ fontSize: "clamp(8px,0.8vw,9px)", letterSpacing: "0.2em", textTransform: "uppercase", color: t.interiorAccent, opacity: 0.7, marginBottom: 4 }}>Dress Code</div>
                <div style={{ fontSize: "clamp(10px,1.1vw,12px)", color: t.interiorText }}>{d.dressCode}</div>
              </div>
            )}
            {d.rsvpEmail && (
              <div>
                <div style={{ fontSize: "clamp(8px,0.8vw,9px)", letterSpacing: "0.2em", textTransform: "uppercase", color: t.interiorAccent, opacity: 0.7, marginBottom: 4 }}>RSVP</div>
                <div style={{ fontSize: "clamp(9px,1vw,11px)", color: t.interiorText, opacity: 0.8 }}>{d.rsvpEmail}</div>
              </div>
            )}
          </div>

          {/* Right section */}
          <div style={{ flex: 1, padding: "6% 5%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: "clamp(8px,0.9vw,10px)", letterSpacing: "0.4em", textTransform: "uppercase", color: t.interiorAccent, marginBottom: "8%" }}>More Info</div>
            {d.websiteUrl && (
              <div style={{ marginBottom: "6%" }}>
                <div style={{ fontSize: "clamp(8px,0.8vw,9px)", letterSpacing: "0.2em", textTransform: "uppercase", color: t.interiorAccent, opacity: 0.7, marginBottom: 4 }}>Website</div>
                <div style={{ fontSize: "clamp(9px,1vw,11px)", color: t.interiorText, opacity: 0.8 }}>{d.websiteUrl}</div>
              </div>
            )}
            {d.rsvpDeadline && (
              <div style={{ marginBottom: "6%" }}>
                <div style={{ fontSize: "clamp(8px,0.8vw,9px)", letterSpacing: "0.2em", textTransform: "uppercase", color: t.interiorAccent, opacity: 0.7, marginBottom: 4 }}>RSVP By</div>
                <div style={{ fontSize: "clamp(10px,1.1vw,12px)", color: t.interiorText }}>{d.rsvpDeadline}</div>
              </div>
            )}
            {/* Decorative QR placeholder */}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 60, height: 60, border: `2px solid ${t.dividerColor}`, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2, padding: 4, opacity: 0.4 }}>
                {(qrCells.length ? qrCells : Array(25).fill(false)).map((filled, i) => (
                  <div key={i} style={{ background: filled ? t.interiorText : "transparent", borderRadius: 1 }} />
                ))}
              </div>
              <div style={{ fontSize: "clamp(7px,0.8vw,9px)", letterSpacing: "0.2em", textTransform: "uppercase", color: t.interiorAccent, opacity: 0.6 }}>Scan to visit</div>
            </div>
          </div>
        </div>

        {/* ── Left cover panel ───────────────────────────────────────────────── */}
        <div style={{
          ...panelStyle,
          left: 0,
          transformOrigin: "0% 50%",
          transform: isOpen ? "rotateY(-180deg)" : "rotateY(0deg)",
          zIndex: isOpen ? 0 : 2,
          overflow: "hidden",
          boxShadow: isOpen ? "none" : "2px 0 16px rgba(0,0,0,0.15)",
        }}>
          {/* Front face — left panel */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: t.coverBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8%", overflow: "hidden" }}>
            {d.couplePhotoUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.couplePhotoUrl} alt="Couple" style={{ position: "absolute", inset: 0, width: "200%", height: "100%", objectFit: "cover", objectPosition: "left center" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.65) 100%)" }} />
              </>
            )}
            {sparkles.map((s, i) => (
              <Sparkle key={i} color={d.couplePhotoUrl ? "rgba(255,255,255,0.7)" : t.coverAccent} style={{ top: `${s.y}%`, left: `${s.x}%`, animationDelay: `${s.delay}s`, zIndex: 2 }} />
            ))}
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "clamp(28px,5vw,52px)", fontStyle: "italic", color: "#fff", lineHeight: 1.1, textAlign: "center", textShadow: "0 2px 20px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.6)" }}>{d.brideName}</div>
              <div style={{ fontSize: "clamp(14px,2vw,20px)", color: "rgba(255,255,255,0.9)", margin: "4% 0", fontStyle: "italic", letterSpacing: "0.1em", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}>{"&"}</div>
              <div style={{ fontSize: "clamp(28px,5vw,52px)", fontStyle: "italic", color: "#fff", lineHeight: 1.1, textAlign: "center", textShadow: "0 2px 20px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.6)" }}>{d.groomName}</div>
              <div style={{ marginTop: "8%", width: 40, height: 1, background: "rgba(255,255,255,0.6)" }} />
            </div>
          </div>
          {/* Back face */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: t.coverBg, opacity: 0.3 }} />
        </div>

        {/* ── Right cover panel ──────────────────────────────────────────────── */}
        <div style={{
          ...panelStyle,
          right: 0,
          left: "50%",
          transformOrigin: "100% 50%",
          transform: isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
          zIndex: isOpen ? 0 : 2,
          overflow: "hidden",
          boxShadow: isOpen ? "none" : "-2px 0 16px rgba(0,0,0,0.15)",
        }}>
          {/* Front face — right panel */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: t.coverBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8%", overflow: "hidden" }}>
            {d.couplePhotoUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.couplePhotoUrl} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "200%", height: "100%", objectFit: "cover", objectPosition: "right center", right: 0, left: "auto" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 100%)" }} />
              </>
            )}
            <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
              {d.weddingDate && (
                <>
                  <div style={{ fontSize: "clamp(8px,0.9vw,10px)", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: "6%", textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>Save the Date</div>
                  <div style={{ fontSize: "clamp(12px,1.8vw,18px)", color: "#fff", fontStyle: "italic", textShadow: "0 2px 16px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.5)" }}>{fmt(d.weddingDate)}</div>
                  {d.weddingTime && <div style={{ fontSize: "clamp(10px,1.2vw,14px)", color: "rgba(255,255,255,0.85)", marginTop: "3%", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}>{d.weddingTime}</div>}
                  {d.ceremonyVenue && <div style={{ fontSize: "clamp(10px,1.2vw,14px)", color: "#fff", marginTop: "6%", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}>{d.ceremonyVenue}</div>}
                </>
              )}
            </div>
            <div style={{ position: "relative", zIndex: 2, marginTop: "auto", fontSize: "clamp(8px,1vw,11px)", color: "rgba(255,255,255,0.65)", letterSpacing: "0.25em", textTransform: "uppercase", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
              {isOpen ? "" : "Click to open"}
            </div>
          </div>
          {/* Back face */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(-180deg)", background: t.coverBg, opacity: 0.3 }} />
        </div>
      </div>

      {/* Open/close button */}
      {isOpen && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button
            onClick={() => { setIsOpen(false); setInteriorVisible(false); }}
            style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B6B6B", background: "none", border: "none", cursor: "pointer", padding: "4px 0", borderBottom: "1px solid #6B6B6B" }}
          >
            Close card
          </button>
        </div>
      )}
    </div>
  );
}
