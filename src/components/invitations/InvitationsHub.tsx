"use client";
import { useState } from "react";
import { Search, Sparkles, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrintCardEditor } from "./PrintCardEditor";
import { DigitalCardEditor } from "./DigitalCardEditor";
import { PRINT_TEMPLATES, PRINT_CATEGORIES } from "./templates/printTemplates";
import { DIGITAL_TEMPLATES } from "./templates/digitalTemplates";
import type { CardData } from "./types";
import type { Couple, WeddingEvent } from "@/lib/types";

interface Props {
  couple: Couple;
  events: WeddingEvent[];
}

type View = "hub" | "print-editor" | "digital-editor";

function buildCardData(couple: Couple, events: WeddingEvent[]): CardData {
  const ceremony = events.find((e) =>
    e.name.toLowerCase().includes("ceremon") || e.name.toLowerCase().includes("church") || e.position === 0
  ) ?? events[0];
  const reception = events.find((e) =>
    e.name.toLowerCase().includes("reception") || e.position === 1
  ) ?? events[1];

  const siteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${couple.slug}`
    : couple.slug;

  return {
    brideName: couple.bride_name,
    groomName: couple.groom_name,
    weddingDate: couple.wedding_date ?? "",
    weddingTime: ceremony?.time ?? "",
    ceremonyVenue: ceremony?.venue_name ?? "",
    ceremonyAddress: ceremony?.venue_address ?? "",
    receptionVenue: reception?.venue_name ?? "",
    receptionAddress: reception?.venue_address ?? "",
    dressCode: ceremony?.dress_bride ? `${ceremony.dress_bride} / ${ceremony.dress_groom}` : "",
    rsvpDeadline: couple.rsvp_deadline ?? "",
    rsvpEmail: "",
    websiteUrl: siteUrl,
    hashtag: "",
    specialInstructions: "",
  };
}

// ── Template thumbnail ────────────────────────────────────────────────────────
function PrintThumb({ template, onClick }: { template: typeof PRINT_TEMPLATES[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-2 text-left hover:opacity-90 transition-opacity"
    >
      <div
        className="aspect-[3/4] w-full overflow-hidden relative border border-[var(--color-ink)]/10 group-hover:border-[var(--color-ink)]/30 transition-colors"
        style={{ background: template.primaryBg }}
      >
        {/* Thumbnail simulation */}
        <div style={{ padding: 10 }}>
          <div style={{ height: 2, background: template.accentColor, margin: "4px 8px", opacity: 0.8 }} />
          <div style={{ height: 1, background: template.accentColor, margin: "3px 16px", opacity: 0.4 }} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <div style={{ height: 18, width: 60, background: template.accentColor, opacity: 0.6, borderRadius: 1 }} />
          </div>
          <div style={{ height: 6, width: 40, background: template.accentColor, margin: "4px auto", opacity: 0.3, borderRadius: 1 }} />
          <div style={{ height: 6, width: 50, background: template.accentColor, margin: "2px auto", opacity: 0.4, borderRadius: 1 }} />
          <div style={{ height: 1, background: template.borderColor, margin: "10px 12px", opacity: 0.3 }} />
          <div style={{ height: 5, width: 60, background: template.primaryText, margin: "4px auto", opacity: 0.2, borderRadius: 1 }} />
          <div style={{ height: 5, width: 48, background: template.primaryText, margin: "3px auto", opacity: 0.15, borderRadius: 1 }} />
          <div style={{ height: 5, width: 36, background: template.primaryText, margin: "3px auto", opacity: 0.1, borderRadius: 1 }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <span className="text-white text-xs tracking-widest uppercase bg-black/60 px-3 py-1.5">Select</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: "var(--color-ink)" }}>{template.name}</p>
        <p className="text-[10px] text-[var(--color-muted)]">{template.category}</p>
      </div>
    </button>
  );
}

function DigitalThumb({ template, onClick }: { template: typeof DIGITAL_TEMPLATES[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-2 text-left hover:opacity-90 transition-opacity"
    >
      <div
        className="aspect-video w-full overflow-hidden relative border border-[var(--color-ink)]/10 group-hover:border-[var(--color-ink)]/30 transition-colors flex items-center justify-center"
        style={{ background: template.coverBg }}
      >
        <div className="text-center">
          <div style={{ fontSize: 16, fontStyle: "italic", color: template.coverText, opacity: 0.9 }}>Bride</div>
          <div style={{ fontSize: 11, color: template.coverAccent, margin: "2px 0" }}>&amp;</div>
          <div style={{ fontSize: 16, fontStyle: "italic", color: template.coverText, opacity: 0.9 }}>Groom</div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <span className="text-white text-xs tracking-widest uppercase bg-black/60 px-3 py-1.5">Select</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium">{template.name}</p>
        <p className="text-[10px] text-[var(--color-muted)]">{template.category}</p>
      </div>
    </button>
  );
}

// ── Main hub ──────────────────────────────────────────────────────────────────
export function InvitationsHub({ couple, events }: Props) {
  const [view, setView] = useState<View>("hub");
  const [cardType, setCardType] = useState<"print" | "digital">("print");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const cardData = buildCardData(couple, events);

  function openPrint(templateId: string) {
    setSelectedTemplateId(templateId);
    setView("print-editor");
  }

  function openDigital(templateId: string) {
    setSelectedTemplateId(templateId);
    setView("digital-editor");
  }

  if (view === "print-editor") {
    return <PrintCardEditor initialData={cardData} onBack={() => setView("hub")} preselectedTemplate={selectedTemplateId} />;
  }
  if (view === "digital-editor") {
    return <DigitalCardEditor initialData={cardData} onBack={() => setView("hub")} preselectedTemplate={selectedTemplateId} />;
  }

  const filteredPrint = PRINT_TEMPLATES.filter((t) => {
    const matchCat = category === "All" || t.category === category;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredDigital = DIGITAL_TEMPLATES.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Hero banner */}
      <div className="relative overflow-hidden bg-[var(--color-ink)] text-white -mx-6 -mt-10 px-6 pt-16 pb-12 md:px-10">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #C9A96E 0%, transparent 60%), radial-gradient(circle at 70% 30%, #C9A96E 0%, transparent 50%)" }} />
        <div className="relative max-w-2xl">
          <div className="text-xs tracking-[0.4em] uppercase text-white/50 mb-3">New</div>
          <h2 className="font-display text-5xl font-light mb-4 leading-tight">Invitation Cards</h2>
          <p className="text-sm text-white/60 leading-relaxed max-w-md">
            Create stunning print-ready or interactive digital invitations using your wedding details — no re-entry needed.
          </p>
          <div className="flex gap-3 mt-8">
            <Button
              onClick={() => { setCardType("print"); document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" }); }}
              className="bg-white text-[var(--color-ink)] hover:bg-white/90 text-xs tracking-widest uppercase"
            >
              <FileText className="h-3.5 w-3.5 mr-2" /> Print Cards
            </Button>
            <Button
              variant="outline"
              onClick={() => { setCardType("digital"); document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" }); }}
              className="border-white/30 text-white hover:bg-white/10 text-xs tracking-widest uppercase"
            >
              <Zap className="h-3.5 w-3.5 mr-2" /> Digital Cards
            </Button>
          </div>
        </div>
      </div>

      {/* Card type toggle + search */}
      <div id="gallery" className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex gap-1 border border-[var(--color-ink)]/10 p-0.5 self-start">
            <button
              onClick={() => setCardType("print")}
              className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors ${cardType === "print" ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"}`}
            >
              <FileText className="h-3 w-3 inline mr-1.5" />Print
            </button>
            <button
              onClick={() => setCardType("digital")}
              className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors ${cardType === "digital" ? "bg-[var(--color-ink)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"}`}
            >
              <Sparkles className="h-3 w-3 inline mr-1.5" />Digital
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-muted)]" />
            <input
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-[var(--color-ink)]/20 bg-transparent outline-none focus:border-[var(--color-ink)] transition-colors"
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category filters (print only) */}
        {cardType === "print" && (
          <div className="flex gap-2 flex-wrap">
            {PRINT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs tracking-wider transition-colors border ${category === cat ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white" : "border-[var(--color-ink)]/20 text-[var(--color-muted)] hover:border-[var(--color-ink)]/40 hover:text-[var(--color-ink)]"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Template grids */}
        {cardType === "print" && (
          <>
            <p className="text-xs text-[var(--color-muted)]">{filteredPrint.length} template{filteredPrint.length !== 1 ? "s" : ""}</p>
            {filteredPrint.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredPrint.map((t) => (
                  <PrintThumb key={t.id} template={t} onClick={() => openPrint(t.id)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-muted)] py-8 text-center">No templates match your search.</p>
            )}
          </>
        )}

        {cardType === "digital" && (
          <>
            <p className="text-xs text-[var(--color-muted)]">{filteredDigital.length} template{filteredDigital.length !== 1 ? "s" : ""}</p>
            {filteredDigital.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl">
                {filteredDigital.map((t) => (
                  <DigitalThumb key={t.id} template={t} onClick={() => openDigital(t.id)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-muted)] py-8 text-center">No templates match your search.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
