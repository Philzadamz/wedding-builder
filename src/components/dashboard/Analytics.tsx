import { Eye, Users, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Couple } from "@/lib/types";

interface Props {
  analytics: {
    totalViews: number;
    totalRsvps: number;
    totalWishes: number;
    pendingWishes: number;
  };
  couple: Couple;
  onTabChange: (tab: "overview" | "rsvps" | "wishes" | "share") => void;
}

const STAT_CARDS = [
  { label: "Page Views", key: "totalViews" as const, icon: <Eye className="h-5 w-5" /> },
  { label: "RSVPs Received", key: "totalRsvps" as const, icon: <Users className="h-5 w-5" /> },
  { label: "Well Wishes", key: "totalWishes" as const, icon: <Heart className="h-5 w-5" /> },
  { label: "Wishes Pending", key: "pendingWishes" as const, icon: <Clock className="h-5 w-5" /> },
];

export function Analytics({ analytics, couple, onTabChange }: Props) {
  const hasDate = !!couple.wedding_date;
  const daysUntil = hasDate
    ? Math.ceil((new Date(couple.wedding_date!).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Dashboard</p>
        <h1 className="font-display text-4xl font-light">
          {couple.bride_name} & {couple.groom_name}
        </h1>
        {daysUntil !== null && (
          <p className="text-sm text-[var(--color-muted)] mt-2">
            {daysUntil > 0
              ? `${daysUntil} days until your wedding`
              : daysUntil === 0
              ? "Today is your wedding day!"
              : "Congratulations on your wedding!"}
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="border border-[var(--color-ink)]/10 p-5 flex flex-col gap-3"
          >
            <div className="text-[var(--color-muted)]">{card.icon}</div>
            <div>
              <p className="text-3xl font-light">{analytics[card.key]}</p>
              <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mt-1">
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-4">
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Quick actions</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => onTabChange("rsvps")}>
            View RSVPs
          </Button>
          {analytics.pendingWishes > 0 && (
            <Button variant="outline" size="sm" onClick={() => onTabChange("wishes")}>
              Review {analytics.pendingWishes} pending wish{analytics.pendingWishes !== 1 ? "es" : ""}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onTabChange("share")}>
            Share your site
          </Button>
        </div>
      </div>
    </div>
  );
}