"use client";
import { useState, useEffect, useCallback } from "react";

interface Props {
  images: string[];
}

export function GallerySection({ images }: Props) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 400);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % images.length);
  }, [current, images.length, goTo]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [images.length, next]);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--color-ink)] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--color-accent)] mb-3">Our Story</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white">
            Before the Big Day
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[var(--color-accent)] opacity-50" />
            <span className="text-[var(--color-accent)] text-sm">✦</span>
            <div className="h-px w-12 bg-[var(--color-accent)] opacity-50" />
          </div>
        </div>

        {/* Slideshow */}
        <div className="relative">
          {/* Main image */}
          <div className="relative overflow-hidden bg-black" style={{ height: "min(70vh, 640px)" }}>
            {/* Blurred background fill — makes any aspect ratio look intentional */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[current]}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: "cover",
                filter: "blur(24px)",
                transform: "scale(1.1)",
                opacity: fading ? 0 : 0.35,
                transition: "opacity 0.4s ease",
              }}
            />
            {/* Main sharp image, contained so nothing is cropped */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[current]}
              alt={`Pre-wedding photo ${current + 1}`}
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: "contain",
                opacity: fading ? 0 : 1,
                transform: fading ? "scale(1.02)" : "scale(1)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => goTo((current - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-colors"
                  aria-label="Previous"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => goTo((current + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-colors"
                  aria-label="Next"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] tracking-[0.2em] uppercase px-3 py-1">
              {current + 1} / {images.length}
            </div>
          </div>

          {/* Dot indicators + thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              {images.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className="relative overflow-hidden transition-all duration-300"
                  style={{
                    width: idx === current ? 64 : 40,
                    height: idx === current ? 64 : 40,
                    outline: idx === current ? "2px solid var(--color-accent)" : "2px solid transparent",
                    outlineOffset: 2,
                    opacity: idx === current ? 1 : 0.5,
                  }}
                  aria-label={`Go to photo ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
