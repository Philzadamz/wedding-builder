"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import type { Couple, RsvpRequiredFields, AttendingFor } from "@/lib/types";

interface Props {
  couple: Couple;
  label: string;
}

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  relationship: string;
  address: string;
  attending_for: AttendingFor | "";
};

export function RsvpSection({ couple, label }: Props) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    first_name: "", last_name: "", email: "",
    phone: "", relationship: "", address: "", attending_for: "",
  });

  const req = couple.rsvp_required_fields;

  function isValid() {
    const checks: (keyof RsvpRequiredFields)[] = [
      "first_name", "last_name", "email", "phone", "relationship", "address", "attending_for"
    ];
    return checks.every((k) => !req[k] || form[k as keyof FormData]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid()) return;
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("rsvp_submissions").insert({
      couple_id: couple.id,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email || null,
      phone: form.phone || null,
      relationship: form.relationship || null,
      address: form.address || null,
      attending_for: (form.attending_for as AttendingFor) || null,
    });
    setSubmitting(false);
    if (error) {
      toast("Submission failed. Please try again.", "error");
    } else {
      setSubmitted(true);
    }
  }

  return (
    <section id="rsvp" className="py-24 px-6 md:px-16 bg-[var(--color-ink)] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="editorial-grid">
          {/* Left */}
          <div>
            <h2 className="heading-section text-white">{label.toUpperCase()}</h2>
            {couple.rsvp_deadline && (
              <p className="text-sm text-white/50 mt-6 tracking-wide">
                Deadline: {formatDate(couple.rsvp_deadline)}
              </p>
            )}
          </div>

          {/* Right */}
          <div>
            {submitted ? (
              <div className="flex flex-col gap-4 py-12">
                <p className="font-display text-3xl font-light">Thank you!</p>
                <p className="text-sm text-white/60">
                  Your RSVP has been received. We can&apos;t wait to celebrate with you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs tracking-widest uppercase text-white/50">
                      First Name {req.first_name && <span className="text-[var(--color-accent)]">*</span>}
                    </label>
                    <input
                      className="border-b border-white/20 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white"
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      required={req.first_name}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs tracking-widest uppercase text-white/50">
                      Last Name {req.last_name && <span className="text-[var(--color-accent)]">*</span>}
                    </label>
                    <input
                      className="border-b border-white/20 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white"
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      required={req.last_name}
                    />
                  </div>
                </div>

                {req.email !== undefined && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs tracking-widest uppercase text-white/50">
                      Email {req.email && <span className="text-[var(--color-accent)]">*</span>}
                    </label>
                    <input
                      type="email"
                      className="border-b border-white/20 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required={req.email}
                    />
                  </div>
                )}

                {req.phone !== undefined && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs tracking-widest uppercase text-white/50">
                      Phone {req.phone && <span className="text-[var(--color-accent)]">*</span>}
                    </label>
                    <input
                      type="tel"
                      className="border-b border-white/20 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required={req.phone}
                    />
                  </div>
                )}

                {req.relationship !== undefined && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs tracking-widest uppercase text-white/50">
                      Relationship {req.relationship && <span className="text-[var(--color-accent)]">*</span>}
                    </label>
                    <input
                      className="border-b border-white/20 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white"
                      placeholder="e.g. Friend of the bride"
                      value={form.relationship}
                      onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                      required={req.relationship}
                    />
                  </div>
                )}

                {req.address !== undefined && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs tracking-widest uppercase text-white/50">
                      Address {req.address && <span className="text-[var(--color-accent)]">*</span>}
                    </label>
                    <input
                      className="border-b border-white/20 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      required={req.address}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs tracking-widest uppercase text-white/50">
                    Who are you coming for? {req.attending_for && <span className="text-[var(--color-accent)]">*</span>}
                  </label>
                  <select
                    className="border-b border-white/20 bg-transparent py-2.5 text-sm text-white outline-none focus:border-white"
                    value={form.attending_for}
                    onChange={(e) => setForm({ ...form, attending_for: e.target.value as AttendingFor })}
                    required={req.attending_for}
                  >
                    <option value="" className="text-black">Select…</option>
                    <option value="bride" className="text-black">Bride</option>
                    <option value="groom" className="text-black">Groom</option>
                    <option value="both" className="text-black">Both</option>
                  </select>
                </div>

                <p className="text-xs text-white/40">
                  Please note that once you submit, you will not be able to edit your RSVP details.
                </p>
                <p className="text-xs text-white/30">
                  Your data is collected solely for the couple&apos;s use in planning their wedding. See our privacy policy.
                </p>

                <Button
                  type="submit"
                  variant="outline-white"
                  disabled={!isValid() || submitting}
                  className="self-start"
                >
                  {submitting ? "Submitting…" : "Submit RSVP"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}