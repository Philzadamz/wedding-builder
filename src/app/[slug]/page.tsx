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
    .select("bride_name, groom_name, hero_image_url, tagline, wedding_date")
    .eq("slug", slug)
    .single();

  const couple = data as Pick<Couple, "bride_name" | "groom_name" | "hero_image_url" | "tagline" | "wedding_date"> | null;

  if (!couple) return { title: "Wedding" };

  const names = `${couple.bride_name} & ${couple.groom_name}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedding-builder-sage.vercel.app";
  const pageUrl = `${siteUrl}/${slug}`;

  const dateStr = couple.wedding_date
    ? new Date(couple.wedding_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const description = couple.tagline
    ?? (dateStr ? `${names} are getting married on ${dateStr}. You're invited!` : `Join us to celebrate the wedding of ${names}.`);

  const images = couple.hero_image_url
    ? [{ url: couple.hero_image_url, width: 1200, height: 630, alt: `${names} — Wedding` }]
    : [];

  return {
    title: `${names} — Wedding`,
    description,
    openGraph: {
      type: "website",
      url: pageUrl,
      siteName: "Velvet Weddings",
      title: `${names} — Wedding`,
      description,
      images,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${names} — Wedding`,
      description,
      images: couple.hero_image_url ? [couple.hero_image_url] : [],
    },
    metadataBase: new URL(siteUrl),
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