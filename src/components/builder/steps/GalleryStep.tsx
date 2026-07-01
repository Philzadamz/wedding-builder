"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Upload, X, ImageIcon } from "lucide-react";
import type { Couple } from "@/lib/types";

interface Props {
  couple: Couple;
  onUpdate: (couple: Couple) => void;
}

const MAX_IMAGES = 4;

export function GalleryStep({ couple, onUpdate }: Props) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(couple.gallery_images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function uploadImage(file: File) {
    if (images.length >= MAX_IMAGES) {
      toast(`Maximum ${MAX_IMAGES} photos allowed`, "error");
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/gallery-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("wedding-assets").upload(path, file);
    if (error) {
      toast("Upload failed", "error");
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("wedding-assets").getPublicUrl(path);
    setImages((prev) => [...prev, publicUrl]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("couples")
      .update({ gallery_images: images })
      .eq("id", couple.id)
      .select()
      .single();
    setSaving(false);
    if (error) {
      toast("Failed to save gallery", "error");
    } else {
      onUpdate(data);
      toast("Gallery saved");
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Step 09</p>
        <h2 className="font-display text-4xl font-light">Pre-Wedding Gallery</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Upload up to 4 pre-wedding photos. They will auto-slide on your wedding site for guests to enjoy.
        </p>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((url, idx) => (
          <div key={idx} className="relative aspect-square bg-gray-100 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(idx)}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] tracking-widest uppercase px-2 py-1 rounded">
              Photo {idx + 1}
            </div>
          </div>
        ))}

        {/* Upload slot */}
        {images.length < MAX_IMAGES && (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="aspect-square border-2 border-dashed border-[var(--color-ink)]/20 flex flex-col items-center justify-center gap-2 text-[var(--color-muted)] hover:border-[var(--color-ink)]/40 transition-colors"
          >
            {uploading ? (
              <p className="text-xs tracking-widest uppercase">Uploading…</p>
            ) : (
              <>
                <Upload className="h-7 w-7 opacity-40" />
                <p className="text-xs tracking-widest uppercase">Add photo</p>
                <p className="text-[10px] opacity-50">{images.length}/{MAX_IMAGES} uploaded</p>
              </>
            )}
          </button>
        )}

        {/* Empty placeholders */}
        {Array.from({ length: Math.max(0, MAX_IMAGES - images.length - 1) }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square border border-[var(--color-ink)]/10 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 opacity-10" />
          </div>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.size <= 10 * 1024 * 1024) uploadImage(file);
          else if (file) toast("Image must be under 10MB", "error");
        }}
      />

      <div className="flex flex-col gap-3">
        <Button onClick={save} disabled={saving || images.length === 0}>
          {saving ? "Saving…" : "Save gallery"}
        </Button>
        {images.length === 0 && (
          <p className="text-xs text-center text-[var(--color-muted)]">Upload at least one photo to save</p>
        )}
      </div>
    </div>
  );
}
