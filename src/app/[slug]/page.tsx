import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GuestSite } from "@/components/guest/GuestSite";
import type { Couple, WeddingEvent, WellWish, GiftMethod, FAQ } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("couples")
    .select("bride_name, groom_name, hero_image_url, tagline")
    .eq("slug", slug)
    .single();

  const couple = data as Pick<Couple, "bride_name" | "groom_name" | "hero_image_url" | "tagline"> | null;

  if (!couple) return { title: "Wedding" };

  const names = `${couple.bride_name} & ${couple.groom_name}`;
  return {
    title: `${names}'s Wedding`,
    description: couple.tagline ?? `Join us to celebrate ${names}`,
    openGraph: {
      title: `${names}'s Wedding`,
      description: couple.tagline ?? `Join us to celebrate ${names}`,
      images: couple.hero_image_url ? [{ url: couple.hero_image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${names}'s Wedding`,
      images: couple.hero_image_url ? [couple.hero_image_url] : [],
    },
  };
}

export default async function WeddingPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: coupleData } = await supabase
    .from("couples")
    .select("*")
    .eq("slug", slug)
    .single();

  const couple = coupleData as Couple | null;
  if (!couple) notFound();

  const [
    { data: eventsData },
    { data: wishesData },
    { data: giftData },
    { data: faqData },
  ] = await Promise.all([
    supabase.from("wedding_events").select("*").eq("couple_id", couple.id).order("position"),
    supabase.from("well_wishes").select("*").eq("couple_id", couple.id).eq("status", "approved").order("created_at", { ascending: false }),
    supabase.from("gift_methods").select("*").eq("couple_id", couple.id).order("position"),
    supabase.from("faqs").select("*").eq("couple_id", couple.id).order("position"),
  ]);

  supabase.from("page_views").insert({ couple_id: couple.id }).then(() => {});

  return (
    <GuestSite
      couple={couple}
      events={(eventsData ?? []) as WeddingEvent[]}
      wishes={(wishesData ?? []) as WellWish[]}
      giftMethods={(giftData ?? []) as GiftMethod[]}
      faqs={(faqData ?? []) as FAQ[]}
    />
  );
}