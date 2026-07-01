"use client";
import React, { forwardRef } from "react";
import type { CardData, PrintTemplate } from "./types";

interface Props {
  template: PrintTemplate;
  data: CardData;
  scale?: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(date: string) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  } catch { return date; }
}

function Divider({ color, style = "solid" }: { color: string; style?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0" }}>
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.4 }} />
      {style === "ornate" && (
        <span style={{ color, fontSize: 14, opacity: 0.7 }}>✦</span>
      )}
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.4 }} />
    </div>
  );
}

function Field({ label, value, labelColor, valueColor }: { label: string; value: string; labelColor: string; valueColor: string }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 6, textAlign: "center" }}>
      <div style={{ fontSize: 7.5, letterSpacing: "0.2em", textTransform: "uppercase", color: labelColor, opacity: 0.7, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 11, color: valueColor, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

// ── Template renderers ────────────────────────────────────────────────────────

function LuxuryGold({ t, d }: { t: PrintTemplate; d: CardData }) {
  return (
    <div style={{ width: "100%", height: "100%", background: t.primaryBg, padding: 40, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      {/* Corner ornaments */}
      {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
        <div key={pos} style={{
          position: "absolute",
          ...(pos.includes("top") ? { top: 20 } : { bottom: 20 }),
          ...(pos.includes("left") ? { left: 20 } : { right: 20 }),
          width: 40, height: 40,
          borderTop: pos.includes("top") ? `2px solid ${t.accentColor}` : "none",
          borderBottom: pos.includes("bottom") ? `2px solid ${t.accentColor}` : "none",
          borderLeft: pos.includes("left") ? `2px solid ${t.accentColor}` : "none",
          borderRight: pos.includes("right") ? `2px solid ${t.accentColor}` : "none",
        }} />
      ))}
      {/* Double border */}
      <div style={{ position: "absolute", inset: 14, border: `1px solid ${t.accentColor}`, opacity: 0.4 }} />
      <div style={{ position: "absolute", inset: 18, border: `1px solid ${t.accentColor}`, opacity: 0.2 }} />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 8.5, letterSpacing: "0.35em", textTransform: "uppercase", color: t.mutedText, marginBottom: 10 }}>You are cordially invited to celebrate the wedding of</div>
        <div style={{ fontSize: 44, fontStyle: "italic", fontWeight: 300, color: t.accentColor, lineHeight: 1.1, marginBottom: 4 }}>{d.brideName}</div>
        <div style={{ fontSize: 10, letterSpacing: "0.4em", color: t.mutedText }}>&amp;</div>
        <div style={{ fontSize: 44, fontStyle: "italic", fontWeight: 300, color: t.accentColor, lineHeight: 1.1, marginBottom: 16 }}>{d.groomName}</div>
        <Divider color={t.accentColor} style="ornate" />
        {d.weddingDate && <div style={{ fontSize: 11, letterSpacing: "0.1em", color: t.primaryText, marginBottom: 4 }}>{fmt(d.weddingDate)}{d.weddingTime ? ` · ${d.weddingTime}` : ""}</div>}
        {d.ceremonyVenue && <div style={{ fontSize: 10, color: t.mutedText, marginBottom: 2 }}>{d.ceremonyVenue}</div>}
        {d.ceremonyAddress && <div style={{ fontSize: 9, color: t.mutedText, opacity: 0.8 }}>{d.ceremonyAddress}</div>}
        {(d.receptionVenue || d.receptionAddress) && (
          <>
            <Divider color={t.accentColor} />
            <div style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: t.mutedText, marginBottom: 4 }}>Reception</div>
            {d.receptionVenue && <div style={{ fontSize: 10, color: t.primaryText, marginBottom: 2 }}>{d.receptionVenue}</div>}
            {d.receptionAddress && <div style={{ fontSize: 9, color: t.mutedText }}>{d.receptionAddress}</div>}
          </>
        )}
        {d.dressCode && <div style={{ marginTop: 10, fontSize: 9, color: t.mutedText, letterSpacing: "0.1em" }}>Dress Code · {d.dressCode}</div>}
        {d.rsvpEmail && <div style={{ marginTop: 6, fontSize: 9, color: t.mutedText }}>RSVP · {d.rsvpEmail}</div>}
        {d.hashtag && <div style={{ marginTop: 10, fontSize: 10, color: t.accentColor, fontStyle: "italic" }}>{d.hashtag}</div>}
      </div>
    </div>
  );
}

function ClassicIvory({ t, d }: { t: PrintTemplate; d: CardData }) {
  return (
    <div style={{ width: "100%", height: "100%", background: t.primaryBg, padding: 48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", border: `2px solid ${t.borderColor}`, outline: `6px solid ${t.primaryBg}`, outlineOffset: -14 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 8, letterSpacing: "0.4em", textTransform: "uppercase", color: t.mutedText, marginBottom: 16 }}>Together with their families</div>
        <div style={{ fontSize: 48, fontStyle: "italic", color: t.primaryText, lineHeight: 1, marginBottom: 2 }}>{d.brideName}</div>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", color: t.mutedText, margin: "6px 0" }}>and</div>
        <div style={{ fontSize: 48, fontStyle: "italic", color: t.primaryText, lineHeight: 1, marginBottom: 20 }}>{d.groomName}</div>
        <div style={{ width: 60, height: 1, background: t.accentColor, margin: "0 auto 20px" }} />
        <div style={{ fontSize: 10, letterSpacing: "0.15em", color: t.mutedText, marginBottom: 6 }}>request the honour of your presence</div>
        {d.weddingDate && <div style={{ fontSize: 12, color: t.primaryText, fontWeight: 500, marginBottom: 4 }}>{fmt(d.weddingDate)}</div>}
        {d.weddingTime && <div style={{ fontSize: 10, color: t.mutedText, marginBottom: 12 }}>at {d.weddingTime}</div>}
        {d.ceremonyVenue && <div style={{ fontSize: 11, color: t.primaryText, marginBottom: 2 }}>{d.ceremonyVenue}</div>}
        {d.ceremonyAddress && <div style={{ fontSize: 9.5, color: t.mutedText, marginBottom: 14 }}>{d.ceremonyAddress}</div>}
        {d.receptionVenue && (
          <>
            <div style={{ width: 40, height: 1, background: t.borderColor, margin: "0 auto 10px", opacity: 0.4 }} />
            <div style={{ fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase", color: t.mutedText, marginBottom: 4 }}>Reception to follow at</div>
            <div style={{ fontSize: 10, color: t.primaryText }}>{d.receptionVenue}</div>
          </>
        )}
        {d.rsvpEmail && <div style={{ marginTop: 14, fontSize: 9, color: t.mutedText }}>RSVP · {d.rsvpEmail}</div>}
      </div>
    </div>
  );
}

function Minimalist({ t, d }: { t: PrintTemplate; d: CardData }) {
  return (
    <div style={{ width: "100%", height: "100%", background: t.primaryBg, padding: "50px 60px", display: "flex", flexDirection: "column", justifyContent: "center", fontFamily: "'Jost', system-ui, sans-serif" }}>
      <div style={{ fontSize: 8, letterSpacing: "0.4em", textTransform: "uppercase", color: t.mutedText, marginBottom: 20 }}>Wedding Invitation</div>
      <div style={{ fontSize: 52, fontWeight: 300, color: t.primaryText, lineHeight: 1, letterSpacing: "-0.01em", marginBottom: 4 }}>{d.brideName}</div>
      <div style={{ fontSize: 14, color: t.mutedText, letterSpacing: "0.15em", marginBottom: 4 }}>+ {d.groomName}</div>
      <div style={{ width: 32, height: 1, background: t.accentColor, margin: "20px 0" }} />
      {d.weddingDate && <div style={{ fontSize: 10, color: t.primaryText, letterSpacing: "0.05em", marginBottom: 4 }}>{fmt(d.weddingDate)}</div>}
      {d.weddingTime && <div style={{ fontSize: 10, color: t.mutedText, marginBottom: 10 }}>{d.weddingTime}</div>}
      {d.ceremonyVenue && <div style={{ fontSize: 11, color: t.primaryText, marginBottom: 2 }}>{d.ceremonyVenue}</div>}
      {d.ceremonyAddress && <div style={{ fontSize: 9.5, color: t.mutedText, marginBottom: 16 }}>{d.ceremonyAddress}</div>}
      {d.receptionVenue && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: t.mutedText, marginBottom: 4 }}>Reception</div>
          <div style={{ fontSize: 10, color: t.primaryText }}>{d.receptionVenue}</div>
        </div>
      )}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {d.dressCode && <Field label="Dress" value={d.dressCode} labelColor={t.mutedText} valueColor={t.primaryText} />}
        {d.rsvpEmail && <Field label="RSVP" value={d.rsvpEmail} labelColor={t.mutedText} valueColor={t.primaryText} />}
      </div>
      {d.hashtag && <div style={{ marginTop: 16, fontSize: 9, color: t.mutedText }}>{d.hashtag}</div>}
    </div>
  );
}

function FloralGarden({ t, d }: { t: PrintTemplate; d: CardData }) {
  return (
    <div style={{ width: "100%", height: "100%", background: t.primaryBg, padding: 42, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", position: "relative" }}>
      {/* Leaf/floral corner decorations */}
      <div style={{ position: "absolute", top: 16, left: 16, fontSize: 28, opacity: 0.3, color: t.accentColor }}>🌿</div>
      <div style={{ position: "absolute", top: 16, right: 16, fontSize: 28, opacity: 0.3, color: t.accentColor, transform: "scaleX(-1)" }}>🌿</div>
      <div style={{ position: "absolute", bottom: 16, left: 16, fontSize: 28, opacity: 0.3, color: t.accentColor, transform: "scaleY(-1)" }}>🌿</div>
      <div style={{ position: "absolute", bottom: 16, right: 16, fontSize: 28, opacity: 0.3, color: t.accentColor, transform: "scale(-1)" }}>🌿</div>
      <div style={{ position: "absolute", inset: 28, border: `1.5px solid ${t.borderColor}`, opacity: 0.3, borderRadius: 2 }} />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase", color: t.mutedText, marginBottom: 12 }}>You are warmly invited</div>
        <div style={{ fontSize: 16, fontStyle: "italic", color: t.mutedText, marginBottom: 4 }}>to the wedding of</div>
        <div style={{ fontSize: 42, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1 }}>{d.brideName}</div>
        <div style={{ fontSize: 18, color: t.accentColor, margin: "4px 0", fontStyle: "italic" }}>& </div>
        <div style={{ fontSize: 42, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1, marginBottom: 16 }}>{d.groomName}</div>
        <Divider color={t.accentColor} style="ornate" />
        {d.weddingDate && <div style={{ fontSize: 11, color: t.primaryText, marginBottom: 4 }}>{fmt(d.weddingDate)}</div>}
        {d.weddingTime && <div style={{ fontSize: 10, color: t.mutedText, marginBottom: 8 }}>{d.weddingTime}</div>}
        {d.ceremonyVenue && <div style={{ fontSize: 10, color: t.primaryText, marginBottom: 2 }}>{d.ceremonyVenue}</div>}
        {d.ceremonyAddress && <div style={{ fontSize: 9, color: t.mutedText, marginBottom: 10 }}>{d.ceremonyAddress}</div>}
        {d.receptionVenue && <div style={{ fontSize: 9, color: t.mutedText }}>Reception · {d.receptionVenue}</div>}
        {d.dressCode && <div style={{ marginTop: 8, fontSize: 9, color: t.mutedText }}>Dress · {d.dressCode}</div>}
        {d.rsvpEmail && <div style={{ marginTop: 6, fontSize: 9, color: t.mutedText }}>RSVP · {d.rsvpEmail}</div>}
        {d.hashtag && <div style={{ marginTop: 10, fontSize: 11, fontStyle: "italic", color: t.accentColor }}>{d.hashtag}</div>}
      </div>
    </div>
  );
}

function RoyalBurgundy({ t, d }: { t: PrintTemplate; d: CardData }) {
  return (
    <div style={{ width: "100%", height: "100%", background: t.primaryBg, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", position: "relative" }}>
      <div style={{ position: "absolute", inset: 14, border: `1px solid ${t.accentColor}`, opacity: 0.5 }} />
      <div style={{ position: "absolute", inset: 20, border: `1px solid ${t.accentColor}`, opacity: 0.2 }} />
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.5em", textTransform: "uppercase", color: t.accentColor, opacity: 0.8, marginBottom: 14 }}>Royal Invitation</div>
        <div style={{ color: t.accentColor, fontSize: 18, marginBottom: 8 }}>♛</div>
        <div style={{ fontSize: 42, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1 }}>{d.brideName}</div>
        <div style={{ fontSize: 12, color: t.accentColor, margin: "6px 0", letterSpacing: "0.3em" }}>& </div>
        <div style={{ fontSize: 42, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1, marginBottom: 16 }}>{d.groomName}</div>
        <div style={{ width: 80, height: 1, background: t.accentColor, margin: "0 auto 14px", opacity: 0.6 }} />
        {d.weddingDate && <div style={{ fontSize: 11, color: t.primaryText, marginBottom: 4, letterSpacing: "0.05em" }}>{fmt(d.weddingDate)}</div>}
        {d.weddingTime && <div style={{ fontSize: 10, color: t.mutedText, marginBottom: 10 }}>{d.weddingTime}</div>}
        {d.ceremonyVenue && <div style={{ fontSize: 10, color: t.primaryText, marginBottom: 2 }}>{d.ceremonyVenue}</div>}
        {d.ceremonyAddress && <div style={{ fontSize: 9, color: t.mutedText, marginBottom: 10 }}>{d.ceremonyAddress}</div>}
        {d.receptionVenue && <div style={{ fontSize: 9, color: t.mutedText }}>Reception at {d.receptionVenue}</div>}
        {d.dressCode && <div style={{ marginTop: 8, fontSize: 9, color: t.mutedText, letterSpacing: "0.1em" }}>Dress Code · {d.dressCode}</div>}
        {d.rsvpEmail && <div style={{ marginTop: 6, fontSize: 9, color: t.accentColor }}>{d.rsvpEmail}</div>}
      </div>
    </div>
  );
}

function AfricanGold({ t, d }: { t: PrintTemplate; d: CardData }) {
  return (
    <div style={{ width: "100%", height: "100%", background: t.primaryBg, padding: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", position: "relative", overflow: "hidden" }}>
      {/* Kente-inspired border strip top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, background: `repeating-linear-gradient(90deg, ${t.accentColor} 0px, ${t.accentColor} 14px, #B8860B 14px, #B8860B 28px, #8B0000 28px, #8B0000 42px, #006400 42px, #006400 56px)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 14, background: `repeating-linear-gradient(90deg, ${t.accentColor} 0px, ${t.accentColor} 14px, #B8860B 14px, #B8860B 28px, #8B0000 28px, #8B0000 42px, #006400 42px, #006400 56px)` }} />
      <div style={{ position: "absolute", top: 14, left: 0, bottom: 14, width: 10, background: `repeating-linear-gradient(180deg, ${t.accentColor} 0px, ${t.accentColor} 10px, #8B0000 10px, #8B0000 20px)` }} />
      <div style={{ position: "absolute", top: 14, right: 0, bottom: 14, width: 10, background: `repeating-linear-gradient(180deg, ${t.accentColor} 0px, ${t.accentColor} 10px, #8B0000 10px, #8B0000 20px)` }} />

      <div style={{ textAlign: "center", zIndex: 1, padding: "0 40px" }}>
        <div style={{ fontSize: 7.5, letterSpacing: "0.4em", textTransform: "uppercase", color: t.accentColor, marginBottom: 10 }}>A Joyful Celebration</div>
        <div style={{ fontSize: 40, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1 }}>{d.brideName}</div>
        <div style={{ fontSize: 12, color: t.accentColor, margin: "4px 0" }}>&&amp; </div>
        <div style={{ fontSize: 40, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1, marginBottom: 14 }}>{d.groomName}</div>
        <div style={{ width: 60, height: 2, background: t.accentColor, margin: "0 auto 14px" }} />
        {d.weddingDate && <div style={{ fontSize: 11, color: t.primaryText, marginBottom: 4 }}>{fmt(d.weddingDate)}</div>}
        {d.weddingTime && <div style={{ fontSize: 10, color: t.mutedText, marginBottom: 8 }}>{d.weddingTime}</div>}
        {d.ceremonyVenue && <div style={{ fontSize: 10, color: t.primaryText }}>{d.ceremonyVenue}</div>}
        {d.ceremonyAddress && <div style={{ fontSize: 9, color: t.mutedText, marginBottom: 8 }}>{d.ceremonyAddress}</div>}
        {d.receptionVenue && <div style={{ fontSize: 9, color: t.mutedText }}>Reception · {d.receptionVenue}</div>}
        {d.dressCode && <div style={{ marginTop: 8, fontSize: 9, color: t.mutedText }}>Attire · {d.dressCode}</div>}
        {d.rsvpEmail && <div style={{ marginTop: 6, fontSize: 9, color: t.accentColor }}>{d.rsvpEmail}</div>}
        {d.hashtag && <div style={{ marginTop: 8, fontSize: 11, fontStyle: "italic", color: t.accentColor }}>{d.hashtag}</div>}
      </div>
    </div>
  );
}

function BeachBliss({ t, d }: { t: PrintTemplate; d: CardData }) {
  return (
    <div style={{ width: "100%", height: "100%", background: t.primaryBg, padding: 44, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${t.accentColor}, #7EC8E3, ${t.accentColor})` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${t.accentColor}, #7EC8E3, ${t.accentColor})` }} />
      <div style={{ position: "absolute", inset: "24px 24px", border: `1px solid ${t.borderColor}`, opacity: 0.4 }} />
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 22, marginBottom: 8 }}>🌊</div>
        <div style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: t.mutedText, marginBottom: 12 }}>Destination Wedding</div>
        <div style={{ fontSize: 40, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1 }}>{d.brideName}</div>
        <div style={{ fontSize: 14, color: t.accentColor, margin: "4px 0", fontStyle: "italic" }}>& {d.groomName}</div>
        <div style={{ fontSize: 40, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1, marginBottom: 14 }}></div>
        <Divider color={t.borderColor} />
        {d.weddingDate && <div style={{ fontSize: 11, color: t.primaryText, marginBottom: 4 }}>{fmt(d.weddingDate)}</div>}
        {d.weddingTime && <div style={{ fontSize: 10, color: t.mutedText, marginBottom: 10 }}>{d.weddingTime}</div>}
        {d.ceremonyVenue && <div style={{ fontSize: 10, color: t.primaryText, marginBottom: 2 }}>{d.ceremonyVenue}</div>}
        {d.ceremonyAddress && <div style={{ fontSize: 9, color: t.mutedText, marginBottom: 10 }}>{d.ceremonyAddress}</div>}
        {d.receptionVenue && <div style={{ fontSize: 9, color: t.mutedText }}>Reception · {d.receptionVenue}</div>}
        {d.dressCode && <div style={{ marginTop: 8, fontSize: 9, color: t.mutedText }}>Dress · {d.dressCode}</div>}
        {d.rsvpEmail && <div style={{ marginTop: 6, fontSize: 9, color: t.accentColor }}>{d.rsvpEmail}</div>}
      </div>
    </div>
  );
}

function VintageRomance({ t, d }: { t: PrintTemplate; d: CardData }) {
  return (
    <div style={{ width: "100%", height: "100%", background: t.primaryBg, padding: 42, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", position: "relative" }}>
      <div style={{ position: "absolute", inset: 16, border: `2px solid ${t.borderColor}`, opacity: 0.5 }} />
      <div style={{ position: "absolute", inset: 22, border: `1px solid ${t.borderColor}`, opacity: 0.3 }} />
      <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", color: t.accentColor, fontSize: 18, background: t.primaryBg, padding: "0 8px" }}>❧</div>
      <div style={{ position: "absolute", bottom: 9, left: "50%", transform: "translateX(-50%)", color: t.accentColor, fontSize: 18, background: t.primaryBg, padding: "0 8px" }}>❧</div>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase", color: t.mutedText, marginBottom: 10, opacity: 0.8 }}>With great joy we invite you</div>
        <div style={{ fontSize: 42, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1 }}>{d.brideName}</div>
        <div style={{ fontSize: 12, color: t.accentColor, margin: "4px 0", fontStyle: "italic" }}>& </div>
        <div style={{ fontSize: 42, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1, marginBottom: 14 }}>{d.groomName}</div>
        <div style={{ color: t.accentColor, fontSize: 16, letterSpacing: "0.3em" }}>✦ ✦ ✦</div>
        <div style={{ height: 12 }} />
        {d.weddingDate && <div style={{ fontSize: 11, color: t.primaryText, fontStyle: "italic", marginBottom: 4 }}>{fmt(d.weddingDate)}</div>}
        {d.weddingTime && <div style={{ fontSize: 10, color: t.mutedText, marginBottom: 10 }}>{d.weddingTime}</div>}
        {d.ceremonyVenue && <div style={{ fontSize: 10, color: t.primaryText, marginBottom: 2 }}>{d.ceremonyVenue}</div>}
        {d.ceremonyAddress && <div style={{ fontSize: 9, color: t.mutedText, marginBottom: 10 }}>{d.ceremonyAddress}</div>}
        {d.receptionVenue && <div style={{ fontSize: 9, color: t.mutedText }}>Reception · {d.receptionVenue}</div>}
        {d.dressCode && <div style={{ marginTop: 8, fontSize: 9, color: t.mutedText }}>Dress · {d.dressCode}</div>}
        {d.rsvpEmail && <div style={{ marginTop: 6, fontSize: 9, color: t.mutedText }}>{d.rsvpEmail}</div>}
        {d.hashtag && <div style={{ marginTop: 10, fontSize: 11, fontStyle: "italic", color: t.accentColor }}>{d.hashtag}</div>}
      </div>
    </div>
  );
}

function MidnightGlamour({ t, d }: { t: PrintTemplate; d: CardData }) {
  return (
    <div style={{ width: "100%", height: "100%", background: t.primaryBg, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", position: "relative" }}>
      <div style={{ position: "absolute", inset: 14, border: `1px solid ${t.accentColor}`, opacity: 0.3 }} />
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.5em", textTransform: "uppercase", color: t.accentColor, opacity: 0.7, marginBottom: 14 }}>The Wedding of</div>
        <div style={{ fontSize: 44, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1 }}>{d.brideName}</div>
        <div style={{ fontSize: 10, color: t.accentColor, margin: "6px 0", letterSpacing: "0.5em" }}>&amp;</div>
        <div style={{ fontSize: 44, fontStyle: "italic", color: t.primaryText, lineHeight: 1.1, marginBottom: 18 }}>{d.groomName}</div>
        <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${t.accentColor}, transparent)`, margin: "0 auto 16px" }} />
        {d.weddingDate && <div style={{ fontSize: 11, color: t.primaryText, marginBottom: 4, letterSpacing: "0.1em" }}>{fmt(d.weddingDate)}</div>}
        {d.weddingTime && <div style={{ fontSize: 10, color: t.mutedText, marginBottom: 10 }}>{d.weddingTime}</div>}
        {d.ceremonyVenue && <div style={{ fontSize: 10, color: t.primaryText, marginBottom: 2 }}>{d.ceremonyVenue}</div>}
        {d.ceremonyAddress && <div style={{ fontSize: 9, color: t.mutedText, marginBottom: 10 }}>{d.ceremonyAddress}</div>}
        {d.receptionVenue && <div style={{ fontSize: 9, color: t.mutedText }}>Reception · {d.receptionVenue}</div>}
        {d.dressCode && <div style={{ marginTop: 8, fontSize: 9, color: t.mutedText, letterSpacing: "0.15em" }}>Dress · {d.dressCode}</div>}
        {d.rsvpEmail && <div style={{ marginTop: 6, fontSize: 9, color: t.accentColor }}>{d.rsvpEmail}</div>}
        {d.hashtag && <div style={{ marginTop: 12, fontSize: 12, fontStyle: "italic", color: t.accentColor }}>{d.hashtag}</div>}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

const RENDERERS: Record<string, (props: { t: PrintTemplate; d: CardData }) => React.ReactElement> = {
  "luxury-gold": LuxuryGold,
  "classic-ivory": ClassicIvory,
  "minimalist": Minimalist,
  "floral-garden": FloralGarden,
  "royal-burgundy": RoyalBurgundy,
  "african-gold": AfricanGold,
  "beach-bliss": BeachBliss,
  "vintage-romance": VintageRomance,
  "midnight-glamour": MidnightGlamour,
};

// Card is always 560×792 (A4 proportions) internally; scale controls display size.
const CARD_W = 560;
const CARD_H = 792;

export const PrintCardPreview = forwardRef<HTMLDivElement, Props>(
  ({ template, data, scale = 1 }, ref) => {
    const Renderer = RENDERERS[template.id] ?? LuxuryGold;
    return (
      <div
        ref={ref}
        style={{
          width: CARD_W,
          height: CARD_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          flexShrink: 0,
          overflow: "hidden",
          boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
          position: "relative",
        }}
      >
        {/* Blurred couple photo background */}
        {data.couplePhotoUrl && (
          <div style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.couplePhotoUrl}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(18px)",
                transform: "scale(1.15)",
                opacity: 0.22,
              }}
            />
          </div>
        )}
        <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
          <Renderer t={template} d={data} />
        </div>
      </div>
    );
  }
);
PrintCardPreview.displayName = "PrintCardPreview";

export { CARD_W, CARD_H };
