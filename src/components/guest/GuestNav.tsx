"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Couple } from "@/lib/types";

interface Props {
  couple: Couple;
}

export function GuestNav({ couple }: Props) {
  const [open, setOpen] = useState(false);
  const { sections_enabled: s, nav_labels: n } = couple;

  const links: { href: string; label: string; show: boolean }[] = [
    { href: "#wishes", label: n.wishes, show: s.wishes },
    { href: "#schedule", label: n.schedule, show: s.schedule },
    { href: "#qa", label: n.qa, show: s.qa },
    { href: "#rsvp", label: n.rsvp, show: s.rsvp },
    { href: "#gifting", label: n.gifting, show: s.gifting },
  ].filter((l) => l.show);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-[var(--color-paper)]/80 backdrop-blur-md border-b border-[var(--color-ink)]/5">
      <span className="font-script text-2xl">{couple.bride_name} & {couple.groom_name}</span>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-xs tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-[var(--color-ink)]"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-[var(--color-paper)] border-b border-[var(--color-ink)]/10 py-6 px-6 flex flex-col gap-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}