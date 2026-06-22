"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Upload, X } from "lucide-react";
import type { Couple } from "@/lib/types";

interface Props {
  couple: Couple;
  onUpdate: (couple: Couple) => void;
}

export function HeroStep({ couple, onUpdate }: Props) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    bride_name: couple.bride_name,
    groom_name: couple.groom_name,
    tagline: couple.tagline ?? "",
    wedding_date: couple.wedding_date
      ? new Date(couple.wedding_date).toISOString().slice(0, 16)
      : "",
  });
  const [heroUrl, setHeroUrl] = useState(couple.hero_image_url ?? "");

  async function uploadHero(file: File) {
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/hero-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("wedding-assets")
      .upload(path, file);
    if (error) {
      toast("Image upload failed", "error");
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage
      .from("wedding-assets")
      .getPublicUrl(path);
    setHeroUrl(publicUrl);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("couples")
      .update({
        bride_name: form.bride_name,
        groom_name: form.groom_name,
        tagline: form.tagline || null,
        wedding_date: form.wedding_date || null,
        hero_image_url: heroUrl || null,
      })
      .eq("id", couple.id)
      .select()
      .single();
    setSaving(false);
    if (error) {
      toast("Failed to save changes", "error");
    } else {
      onUpdate(data);
      toast("Changes saved");
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Step 01</p>
        <h2 className="font-display text-4xl font-light">Hero Section</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          This is the first thing your guests see — make it count.
        </p>
      </div>

      {/* Hero image upload */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-3">
          Cover Image
        </p>
        {heroUrl ? (
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroUrl} alt="Hero" className="w-full h-full object-cover" />
            <button
              onClick={() => { setHeroUrl(""); if (fileRef.current) fileRef.current.value = ""; }}
              className="absolute top-3 right-3 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-video border-2 border-dashed border-[var(--color-ink)]/20 flex flex-col items-center justify-center gap-3 text-[var(--color-muted)] hover:border-[var(--color-ink)]/40 transition-colors"
          >
            <Upload className="h-8 w-8 opacity-40" />
            <p className="text-xs tracking-widest uppercase">
              {uploading ? "Uploading…" : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs opacity-50">JPG, PNG, WEBP · Max 10MB</p>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size <= 10 * 1024 * 1024) uploadHero(file);
            else if (file) toast("Image must be under 10MB", "error");
          }}
        />
      </div>

      <div className="flex flex-col gap-6">
        <Input
          label="Bride's name"
          value={form.bride_name}
          onChange={(e) => setForm({ ...form, bride_name: e.target.value })}
        />
        <Input
          label="Groom's name"
          value={form.groom_name}
          onChange={(e) => setForm({ ...form, groom_name: e.target.value })}
        />
        <Input
          label="Tagline (optional)"
          placeholder="e.g. We are getting married"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
        />
        <Input
          type="datetime-local"
          label="Wedding date & time"
          value={form.wedding_date}
          onChange={(e) => setForm({ ...form, wedding_date: e.target.value })}
        />
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
