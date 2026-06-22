"use client";
import { ToastProvider } from "@/components/ui/toast";
import { GuestNav } from "./GuestNav";
import { HeroSection } from "./HeroSection";
import { WishesSection } from "./WishesSection";
import { ScheduleSection } from "./ScheduleSection";
import { RsvpSection } from "./RsvpSection";
import { GiftingSection } from "./GiftingSection";
import { QASection } from "./QASection";
import { GuestFooter } from "./GuestFooter";
import type { Couple, WeddingEvent, WellWish, GiftMethod, FAQ } from "@/lib/types";

interface Props {
  couple: Couple;
  events: WeddingEvent[];
  wishes: WellWish[];
  giftMethods: GiftMethod[];
  faqs: FAQ[];
}

export function GuestSite({ couple, events, wishes, giftMethods, faqs }: Props) {
  const accent = couple.color_theme.accent;
  const { sections_enabled: s, nav_labels: n } = couple;

  return (
    <ToastProvider>
      <div
        style={{ "--color-accent": accent } as React.CSSProperties}
        className="font-body"
      >
        <GuestNav couple={couple} />

        <HeroSection couple={couple} />

        {s.wishes && (
          <WishesSection
            couple={couple}
            initialWishes={wishes}
            label={n.wishes}
          />
        )}

        {s.schedule && events.length > 0 && (
          <ScheduleSection events={events} label={n.schedule} />
        )}

        {s.rsvp && (
          <RsvpSection couple={couple} label={n.rsvp} />
        )}

        {s.gifting && giftMethods.length > 0 && (
          <GiftingSection couple={couple} giftMethods={giftMethods} label={n.gifting} />
        )}

        {s.qa && faqs.length > 0 && (
          <QASection faqs={faqs} label={n.qa} />
        )}

        <GuestFooter couple={couple} />
      </div>
    </ToastProvider>
  );
}