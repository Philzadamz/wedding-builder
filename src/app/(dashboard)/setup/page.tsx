"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { WizardLayout } from "@/components/builder/WizardLayout";
import { HeroStep } from "@/components/builder/steps/HeroStep";
import { ScheduleStep } from "@/components/builder/steps/ScheduleStep";
import { RsvpStep } from "@/components/builder/steps/RsvpStep";
import { GiftingStep } from "@/components/builder/steps/GiftingStep";
import { WishesStep } from "@/components/builder/steps/WishesStep";
import { QAStep } from "@/components/builder/steps/QAStep";
import { BrandingStep } from "@/components/builder/steps/BrandingStep";
import type { Couple } from "@/lib/types";

const STEPS = [
  { label: "Hero" },
  { label: "Schedule" },
  { label: "RSVP" },
  { label: "Gifting" },
  { label: "Well Wishes" },
  { label: "Q&A" },
  { label: "Branding" },
];

export default function SetupPage() {
  const [step, setStep] = useState(0);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("couples")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setCouple(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">Loading…</p>
      </div>
    );
  }

  if (!couple) return null;

  const stepComponents = [
    <HeroStep key="hero" couple={couple} onUpdate={setCouple} />,
    <ScheduleStep key="schedule" couple={couple} />,
    <RsvpStep key="rsvp" couple={couple} onUpdate={setCouple} />,
    <GiftingStep key="gifting" couple={couple} />,
    <WishesStep key="wishes" couple={couple} onUpdate={setCouple} />,
    <QAStep key="qa" couple={couple} />,
    <BrandingStep key="branding" couple={couple} onUpdate={setCouple} />,
  ];

  return (
    <WizardLayout
      steps={STEPS}
      currentStep={step}
      onStepChange={setStep}
      couple={couple}
    >
      {stepComponents[step]}
    </WizardLayout>
  );
}
