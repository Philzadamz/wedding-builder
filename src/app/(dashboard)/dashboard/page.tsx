import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { Couple, RsvpSubmission, WellWish } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: coupleData } = await supabase
    .from("couples")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const couple = coupleData as Couple | null;
  if (!couple) redirect("/setup");

  const [
    { data: rsvpData, count: rsvpCount },
    { data: wishData, count: wishCount },
    { count: viewCount },
    { count: pendingCount },
  ] = await Promise.all([
    supabase.from("rsvp_submissions").select("*", { count: "exact" }).eq("couple_id", couple.id).order("created_at", { ascending: false }),
    supabase.from("well_wishes").select("*", { count: "exact" }).eq("couple_id", couple.id).order("created_at", { ascending: false }),
    supabase.from("page_views").select("*", { count: "exact", head: true }).eq("couple_id", couple.id),
    supabase.from("well_wishes").select("*", { count: "exact", head: true }).eq("couple_id", couple.id).eq("status", "pending"),
  ]);

  return (
    <DashboardClient
      couple={couple}
      rsvps={(rsvpData ?? []) as RsvpSubmission[]}
      wishes={(wishData ?? []) as WellWish[]}
      analytics={{
        totalViews: viewCount ?? 0,
        totalRsvps: rsvpCount ?? 0,
        totalWishes: wishCount ?? 0,
        pendingWishes: pendingCount ?? 0,
      }}
    />
  );
}