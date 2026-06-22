"use client";
import { CountdownTimer } from "./CountdownTimer";
import { Button } from "@/components/ui/button";
import type { Couple } from "@/lib/types";

interface Props {
  couple: Couple;
}

export function HeroSection({ couple }: Props) {
  const hasDate = !!couple.wedding_date;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16"
    >
      {/* Background image */}
      {couple.hero_image_url && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={couple.hero_image_url}
            alt="Wedding cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </>
      )}

      <div
        className={`relative z-10 flex flex-col items-center gap-6 ${
          couple.hero_image_url ? "text-white" : "text-[var(--color-ink)]"
        }`}
      >
        {couple.tagline && (
          <p className="text-xs tracking-[0.4em] uppercase opacity-70">{couple.tagline}</p>
        )}

        <h1
          className="text-6xl md:text-8xl font-light leading-none"
          style={{
            fontFamily:
              couple.font_style === "script"
                ? "Great Vibes, cursive"
                : couple.font_style === "sans"
                ? "Jost, sans-serif"
                : "Cormorant Garamond, serif",
          }}
        >
          {couple.bride_name}
          <br />
          <span className="text-3xl md:text-4xl opacity-60">&</span>
          <br />
          {couple.groom_name}
        </h1>

        {hasDate && (
          <CountdownTimer targetDate={couple.wedding_date!} />
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Button
            variant={couple.hero_image_url ? "outline-white" : "default"}
            size="lg"
            onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
          >
            RSVP
          </Button>
          <Button
            variant={couple.hero_image_url ? "outline-white" : "outline"}
            size="lg"
            onClick={() => document.getElementById("gifting")?.scrollIntoView({ behavior: "smooth" })}
          >
            Gift Us
          </Button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-8 bg-current animate-bounce" />
      </div>
    </section>
  );
}