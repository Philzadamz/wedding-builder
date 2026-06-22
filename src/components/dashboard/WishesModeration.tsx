"use client";
import { useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WellWish, WishStatus } from "@/lib/types";

interface Props {
  wishes: WellWish[];
  onModerate: (id: string, status: "approved" | "rejected") => void;
  onDelete: (id: string) => void;
}

const STATUS_FILTERS: { value: WishStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function WishesModeration({ wishes, onModerate, onDelete }: Props) {
  const [filter, setFilter] = useState<WishStatus | "all">("all");

  const filtered = filter === "all" ? wishes : wishes.filter((w) => w.status === filter);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Moderation</p>
        <h2 className="font-display text-3xl font-light">Well Wishes</h2>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-[var(--color-ink)]/10">
        {STATUS_FILTERS.map((f) => {
          const count = f.value === "all" ? wishes.length : wishes.filter((w) => w.status === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-2 text-xs tracking-widest uppercase border-b-2 -mb-px transition-colors",
                filter === f.value
                  ? "border-[var(--color-ink)] text-[var(--color-ink)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)] py-12 text-center">
          No wishes in this category.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((wish) => (
            <div
              key={wish.id}
              className={cn(
                "border p-5 flex flex-col gap-3",
                wish.status === "approved" && "border-green-200 bg-green-50/50",
                wish.status === "rejected" && "border-red-200 bg-red-50/50",
                wish.status === "pending" && "border-[var(--color-ink)]/10"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">{wish.wisher_name}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {new Date(wish.created_at).toLocaleDateString()} ·{" "}
                    <span className="capitalize">{wish.status}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {wish.status !== "approved" && (
                    <button
                      onClick={() => onModerate(wish.id, "approved")}
                      className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {wish.status !== "rejected" && (
                    <button
                      onClick={() => onModerate(wish.id, "rejected")}
                      className="p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors"
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(wish.id)}
                    className="p-1.5 text-[var(--color-muted)] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm leading-relaxed">{wish.message}</p>

              {wish.media_url && (
                <div className="mt-1">
                  {wish.media_type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={wish.media_url} alt="" className="h-24 w-auto object-cover" />
                  ) : (
                    <video src={wish.media_url} controls className="h-24 w-auto" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}