import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="px-8 md:px-16 py-6 flex items-center justify-between border-b border-[var(--color-ink)]/5">
        <span className="font-script text-4xl">Velvet</span>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-ink)]">
            Sign in
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-8">
        <p className="text-xs tracking-[0.4em] uppercase text-[var(--color-muted)]">
          Wedding website builder
        </p>
        <h1 className="font-display text-6xl md:text-8xl font-light leading-none max-w-3xl">
          Your love story.<br />
          <span className="italic">Beautifully told.</span>
        </h1>
        <p className="text-base text-[var(--color-muted)] max-w-lg leading-relaxed">
          Create a stunning, personalised wedding website in under 30 minutes — no design or coding skills required.
          Share your schedule, collect RSVPs, and receive gifts from guests around the world.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg">Create your free site</Button>
          </Link>
          <a href="/sharon-and-victor" target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline">View a demo</Button>
          </a>
        </div>
      </main>

      {/* Features */}
      <section className="px-8 md:px-16 py-24 border-t border-[var(--color-ink)]/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Live in 30 minutes",
              body: "A guided setup wizard walks you through each section one step at a time. Your site is live and shareable the moment you finish.",
            },
            {
              title: "Every detail covered",
              body: "Schedule, RSVP, gifting via bank or Flutterwave/Paystack, well wishes with moderation, Q&A — all in one place.",
            },
            {
              title: "Timeless design",
              body: "Inspired by high-end print stationery. Choose your accent colour, font, and which sections to show — the rest is handled.",
            },
          ].map((f) => (
            <div key={f.title} className="flex flex-col gap-4">
              <h3 className="font-display text-2xl font-light">{f.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-ink)] text-white px-8 md:px-16 py-24 text-center flex flex-col items-center gap-6">
        <h2 className="font-script text-6xl md:text-7xl">Your wedding, your way.</h2>
        <p className="text-sm text-white/60 max-w-md">
          Join couples who chose Velvet to share their most important day.
        </p>
        <Link href="/signup">
          <Button variant="outline-white" size="lg">Start for free</Button>
        </Link>
      </section>

      <footer className="px-8 py-6 border-t border-[var(--color-ink)]/5 flex items-center justify-between">
        <span className="font-script text-2xl">Velvet</span>
        <p className="text-xs text-[var(--color-muted)]">© {new Date().getFullYear()} Velvet</p>
      </footer>
    </div>
  );
}