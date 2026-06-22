"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Couple, WellWish } from "@/lib/types";

interface Props {
  couple: Couple;
  initialWishes: WellWish[];
  label: string;
}

export function WishesSection({ couple, initialWishes, label }: Props) {
  const { toast } = useToast();
  const [wishes, setWishes] = useState(initialWishes);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ wisher_name: "", message: "" });

  const displayed = showAll ? wishes : wishes.slice(0, 6);

  async function submitWish(e: React.FormEvent) {
    e.preventDefault();
    if (!form.wisher_name.trim() || !form.message.trim()) return;
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("well_wishes").insert({
      couple_id: couple.id,
      wisher_name: form.wisher_name,
      message: form.message,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast("Failed to post wish", "error");
    } else {
      toast("Your wish has been submitted for review!");
      setForm({ wisher_name: "", message: "" });
      setOpen(false);
    }
  }

  return (
    <section id="wishes" className="py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="editorial-grid mb-16">
          <div>
            <h2 className="heading-section">{label.toUpperCase()}</h2>
          </div>
          <div className="flex flex-col gap-6 justify-end">
            <p className="text-sm text-[var(--color-muted)]">
              Leave a message, share your excitement, or send your love to the couple.
            </p>
            <div className="flex gap-4">
              {wishes.length > 6 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs tracking-widest uppercase underline"
                >
                  {showAll ? "Show less" : `View all (${wishes.length})`}
                </button>
              )}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button className="text-xs tracking-widest uppercase underline">
                    Post a Wish
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Leave a wish</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={submitWish} className="flex flex-col gap-6">
                    <Input
                      label="Your name"
                      value={form.wisher_name}
                      onChange={(e) => setForm({ ...form, wisher_name: e.target.value })}
                      required
                    />
                    <Textarea
                      label="Your message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      required
                    />
                    <p className="text-xs text-[var(--color-muted)]">
                      Your wish will appear after it&apos;s been reviewed by the couple.
                    </p>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Sending…" : "Send wish"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {wishes.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)] text-center py-12">
            Be the first to leave a wish.
          </p>
        ) : (
          <div className="masonry-grid">
            {displayed.map((wish) => (
              <WishCard key={wish.id} wish={wish} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function WishCard({ wish }: { wish: WellWish }) {
  return (
    <div className="relative overflow-hidden bg-[var(--color-ink)] text-white">
      {wish.media_url && wish.media_type === "image" && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={wish.media_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </>
      )}
      {wish.media_url && wish.media_type === "video" && (
        <>
          <video
            src={wish.media_url}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </>
      )}
      <div className="relative z-10 p-6 flex flex-col gap-3 min-h-[180px] justify-end">
        <p className="text-sm leading-relaxed opacity-90">&ldquo;{wish.message}&rdquo;</p>
        <p className="text-xs tracking-widest uppercase opacity-60">— {wish.wisher_name}</p>
      </div>
    </div>
  );
}