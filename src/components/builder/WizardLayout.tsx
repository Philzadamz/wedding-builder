"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Couple } from "@/lib/types";

interface Props {
  steps: { label: string }[];
  currentStep: number;
  onStepChange: (step: number) => void;
  couple: Couple;
  children: React.ReactNode;
}

export function WizardLayout({ steps, currentStep, onStepChange, couple, children }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-[var(--color-ink)]/10 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-script text-3xl">Velvet</Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-muted)] tracking-widest uppercase">
            {couple.bride_name} &amp; {couple.groom_name}
          </span>
          <span className="mx-2 text-[var(--color-ink)]/20">|</span>
          <a
            href={`/${couple.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs underline text-[var(--color-muted)]"
          >
            Preview site
          </a>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard")}
        >
          Go to dashboard
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar steps */}
        <nav className="hidden md:flex flex-col w-52 border-r border-[var(--color-ink)]/10 p-6 gap-1">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => onStepChange(i)}
              className={cn(
                "text-left px-3 py-2 text-sm tracking-widest uppercase transition-colors",
                i === currentStep
                  ? "text-[var(--color-ink)] font-medium bg-[var(--color-ink)]/5"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                i < currentStep && "text-[var(--color-ink)]/40"
              )}
            >
              <span className="text-[10px] mr-2 opacity-50">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </button>
          ))}
        </nav>

        {/* Step content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-12">
            {/* Mobile step indicator */}
            <div className="md:hidden mb-6 flex items-center gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 transition-colors",
                    i <= currentStep ? "bg-[var(--color-ink)]" : "bg-[var(--color-ink)]/10"
                  )}
                />
              ))}
            </div>

            {children}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-[var(--color-ink)]/10">
              <Button
                variant="ghost"
                onClick={() => onStepChange(currentStep - 1)}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={() => onStepChange(currentStep + 1)}>
                  Continue
                </Button>
              ) : (
                <Button onClick={() => router.push("/dashboard")}>
                  Finish setup
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
