import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { WeddingEvent } from "@/lib/types";

interface Props {
  events: WeddingEvent[];
  label: string;
}

export function ScheduleSection({ events, label }: Props) {
  return (
    <section id="schedule" className="py-24 px-6 md:px-16 bg-[var(--color-paper)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-[var(--color-muted)] mb-4">
            Your day
          </p>
          <h2 className="heading-section">The {label.toUpperCase()}</h2>
        </div>

        <div className="flex flex-col gap-16">
          {events.map((event, i) => (
            <div key={event.id} className="border-t border-[var(--color-ink)]/10 pt-10">
              <p className="text-xs tracking-[0.4em] uppercase text-[var(--color-muted)] mb-4">
                Event #{String(i + 1).padStart(2, "0")}
              </p>
              <h3
                className="font-display text-5xl md:text-6xl font-light mb-10"
              >
                {event.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Date & Time */}
                <div>
                  <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-2">
                    Date & Time
                  </p>
                  <p className="text-lg">
                    {event.date ? formatDate(event.date) : "—"}
                    {event.time && (
                      <span className="text-[var(--color-muted)]"> · {event.time}</span>
                    )}
                  </p>
                </div>

                {/* Venue */}
                <div>
                  <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-2">
                    Venue
                  </p>
                  <p className="text-lg">{event.venue_name || "—"}</p>
                  {event.venue_address && (
                    <p className="text-sm text-[var(--color-muted)] mt-1">{event.venue_address}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Dress Groom */}
                {event.dress_groom && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-2">
                      Dress Theme · Groom&apos;s Side
                    </p>
                    <p className="text-base">{event.dress_groom}</p>
                  </div>
                )}
                {/* Dress Bride */}
                {event.dress_bride && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-2">
                      Dress Theme · Bride&apos;s Side
                    </p>
                    <p className="text-base">{event.dress_bride}</p>
                  </div>
                )}
              </div>

              {/* Colours */}
              {event.colors.length > 0 && (
                <div>
                  <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-3">
                    Colours of the Day
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {event.colors.map((c, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.label && (
                          <span className="text-xs text-[var(--color-muted)]">{c.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button
            onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
          >
            RSVP Now
          </Button>
        </div>
      </div>
    </section>
  );
}