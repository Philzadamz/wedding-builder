"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { RSVPTable } from "./RSVPTable";
import { WishesModeration } from "./WishesModeration";
import { Analytics } from "./Analytics";
import { ShareTools } from "./ShareTools";
import { InvitationsHub } from "@/components/invitations/InvitationsHub";
import { cn } from "@/lib/utils";
import type { Couple, RsvpSubmission, WellWish, WeddingEvent } from "@/lib/types";
import { LayoutDashboard, Heart, Users, Mail, Share2, LogOut } from "lucide-react";

interface Props {
  couple: Couple;
  rsvps: RsvpSubmission[];
  wishes: WellWish[];
  events: WeddingEvent[];
  analytics: {
    totalViews: number;
    totalRsvps: number;
    totalWishes: number;
    pendingWishes: number;
  };
}

type Tab = "overview" | "rsvps" | "wishes" | "share" | "invitations";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "rsvps", label: "RSVPs", icon: <Users className="h-4 w-4" /> },
  { id: "wishes", label: "Well Wishes", icon: <Heart className="h-4 w-4" /> },
  { id: "share", label: "Share", icon: <Share2 className="h-4 w-4" /> },
  { id: "invitations", label: "Invitations", icon: <Mail className="h-4 w-4" /> },
];

function DashboardInner({ couple, rsvps, wishes: initialWishes, events, analytics }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [wishes, setWishes] = useState(initialWishes);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function moderateWish(id: string, status: "approved" | "rejected") {
    const supabase = createClient();
    const { error } = await supabase
      .from("well_wishes")
      .update({ status })
      .eq("id", id);
    if (error) { toast("Failed to update wish", "error"); return; }
    setWishes((prev) => prev.map((w) => (w.id === id ? { ...w, status } : w)));
    toast(status === "approved" ? "Wish approved" : "Wish rejected");
  }

  async function deleteWish(id: string) {
    const supabase = createClient();
    await supabase.from("well_wishes").delete().eq("id", id);
    setWishes((prev) => prev.filter((w) => w.id !== id));
    toast("Wish deleted");
  }

  const siteUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${couple.slug}`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-[var(--color-ink)]/10 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-script text-3xl">Velvet</Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[var(--color-muted)] hidden sm:block">
            {couple.bride_name} & {couple.groom_name}
          </span>
          <a
            href={`/${couple.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs underline text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          >
            View site
          </a>
          <Link href="/setup">
            <Button variant="outline" size="sm">Edit site</Button>
          </Link>
          <button onClick={handleSignOut} className="text-[var(--color-muted)] hover:text-[var(--color-ink)]">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="hidden md:flex flex-col w-52 border-r border-[var(--color-ink)]/10 p-4 gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors",
                tab === t.id
                  ? "bg-[var(--color-ink)]/5 text-[var(--color-ink)] font-medium"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              {t.icon}
              {t.label}
              {t.id === "wishes" && analytics.pendingWishes > 0 && (
                <span className="ml-auto text-[10px] bg-[var(--color-accent)] text-white px-1.5 py-0.5 rounded-full">
                  {analytics.pendingWishes}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Mobile tab bar */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-[var(--color-ink)]/10 bg-[var(--color-paper)] flex z-40">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] tracking-widest uppercase transition-colors",
                tab === t.id ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-6 py-10 pb-24 md:pb-10">
          {tab === "overview" && (
            <Analytics
              analytics={analytics}
              couple={couple}
              onTabChange={setTab}
            />
          )}
          {tab === "rsvps" && <RSVPTable rsvps={rsvps} />}
          {tab === "wishes" && (
            <WishesModeration
              wishes={wishes}
              onModerate={moderateWish}
              onDelete={deleteWish}
            />
          )}
          {tab === "share" && <ShareTools couple={couple} siteUrl={siteUrl} />}
          {tab === "invitations" && <InvitationsHub couple={couple} events={events} />}
        </main>
      </div>
    </div>
  );
}

export function DashboardClient(props: Props) {
  return (
    <ToastProvider>
      <DashboardInner {...props} />
    </ToastProvider>
  );
}