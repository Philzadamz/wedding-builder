"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/lib/types";

interface Props {
  faqs: FAQ[];
  label: string;
}

export function QASection({ faqs, label }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="qa" className="py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="editorial-grid">
          {/* Left */}
          <div>
            <h2 className="heading-section">{label.toUpperCase()}</h2>
          </div>

          {/* Right — accordion */}
          <div className="flex flex-col">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-[var(--color-ink)]/10">
                <button
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  className="flex w-full items-center justify-between py-5 text-left gap-4"
                >
                  <span className="text-sm leading-relaxed">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform",
                      open === faq.id && "rotate-180"
                    )}
                  />
                </button>
                {open === faq.id && (
                  <div className="pb-5 text-sm text-[var(--color-muted)] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}