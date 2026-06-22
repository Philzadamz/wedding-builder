"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { RsvpSubmission } from "@/lib/types";

interface Props {
  rsvps: RsvpSubmission[];
}

export function RSVPTable({ rsvps }: Props) {
  const [search, setSearch] = useState("");

  const filtered = rsvps.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.first_name.toLowerCase().includes(q) ||
      r.last_name.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.relationship?.toLowerCase().includes(q)
    );
  });

  function exportCSV() {
    const header = ["First Name", "Last Name", "Email", "Phone", "Relationship", "Attending For", "Submitted At"];
    const rows = rsvps.map((r) => [
      r.first_name, r.last_name, r.email ?? "", r.phone ?? "",
      r.relationship ?? "", r.attending_for ?? "",
      new Date(r.created_at).toLocaleString(),
    ]);
    const csv = [header, ...rows].map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvps.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">RSVPs</p>
          <h2 className="font-display text-3xl font-light">{rsvps.length} Responses</h2>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <input
        type="text"
        placeholder="Search by name, email, relationship…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-b border-[var(--color-ink)]/20 bg-transparent py-2 text-sm outline-none placeholder:text-[var(--color-muted)]/50 w-full max-w-sm"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)] py-12 text-center">
          {rsvps.length === 0 ? "No RSVPs yet." : "No results match your search."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-ink)]/10">
                {["Name", "Email", "Phone", "Relationship", "Coming for", "Date"].map((h) => (
                  <th key={h} className="text-left text-xs tracking-widest uppercase text-[var(--color-muted)] py-3 pr-6 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-[var(--color-ink)]/5 hover:bg-[var(--color-ink)]/2">
                  <td className="py-3 pr-6 font-medium">{r.first_name} {r.last_name}</td>
                  <td className="py-3 pr-6 text-[var(--color-muted)]">{r.email ?? "—"}</td>
                  <td className="py-3 pr-6 text-[var(--color-muted)]">{r.phone ?? "—"}</td>
                  <td className="py-3 pr-6 text-[var(--color-muted)]">{r.relationship ?? "—"}</td>
                  <td className="py-3 pr-6 capitalize text-[var(--color-muted)]">{r.attending_for ?? "—"}</td>
                  <td className="py-3 pr-6 text-[var(--color-muted)] whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}