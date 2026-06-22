"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { Couple, WeddingEvent, EventColor } from "@/lib/types";

interface Props {
  couple: Couple;
}

const EMPTY_EVENT: Omit<WeddingEvent, "id" | "couple_id" | "created_at"> = {
  name: "",
  date: null,
  time: null,
  venue_name: null,
  venue_address: null,
  dress_groom: null,
  dress_bride: null,
  colors: [],
  position: 0,
};

export function ScheduleStep({ couple }: Props) {
  const { toast } = useToast();
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("wedding_events")
        .select("*")
        .eq("couple_id", couple.id)
        .order("position");
      setEvents(data ?? []);
      setLoading(false);
    }
    load();
  }, [couple.id]);

  async function addEvent() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wedding_events")
      .insert({ ...EMPTY_EVENT, couple_id: couple.id, position: events.length })
      .select()
      .single();
    if (error) { toast("Failed to add event", "error"); return; }
    setEvents([...events, data]);
  }

  async function updateEvent(id: string, patch: Partial<WeddingEvent>) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  async function saveEvent(event: WeddingEvent) {
    setSaving(event.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("wedding_events")
      .update({
        name: event.name,
        date: event.date,
        time: event.time,
        venue_name: event.venue_name,
        venue_address: event.venue_address,
        dress_groom: event.dress_groom,
        dress_bride: event.dress_bride,
        colors: event.colors,
      })
      .eq("id", event.id);
    setSaving(null);
    if (error) toast("Failed to save event", "error");
    else toast("Event saved");
  }

  async function deleteEvent(id: string) {
    const supabase = createClient();
    await supabase.from("wedding_events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast("Event removed");
  }

  function addColor(eventId: string) {
    const event = events.find((e) => e.id === eventId)!;
    updateEvent(eventId, {
      colors: [...event.colors, { label: "", hex: "#C9A96E" }],
    });
  }

  function updateColor(eventId: string, idx: number, patch: Partial<EventColor>) {
    const event = events.find((e) => e.id === eventId)!;
    const newColors = event.colors.map((c, i) => (i === idx ? { ...c, ...patch } : c));
    updateEvent(eventId, { colors: newColors });
  }

  function removeColor(eventId: string, idx: number) {
    const event = events.find((e) => e.id === eventId)!;
    updateEvent(eventId, { colors: event.colors.filter((_, i) => i !== idx) });
  }

  if (loading) return <p className="text-sm text-[var(--color-muted)]">Loading…</p>;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-1">Step 02</p>
        <h2 className="font-display text-4xl font-light">Schedule</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Add each event of your wedding day. Guests will see them in order.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {events.map((event, idx) => (
          <div key={event.id} className="border border-[var(--color-ink)]/10 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-[var(--color-muted)] opacity-40" />
                <span className="text-xs tracking-widest uppercase text-[var(--color-muted)]">
                  Event #{idx + 1}
                </span>
              </div>
              <button
                onClick={() => deleteEvent(event.id)}
                className="text-[var(--color-muted)] hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <Input
              label="Event name"
              placeholder="e.g. Church Ceremony"
              value={event.name}
              onChange={(e) => updateEvent(event.id, { name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date"
                value={event.date ?? ""}
                onChange={(e) => updateEvent(event.id, { date: e.target.value || null })}
              />
              <Input
                type="time"
                label="Time"
                value={event.time ?? ""}
                onChange={(e) => updateEvent(event.id, { time: e.target.value || null })}
              />
            </div>

            <Input
              label="Venue name"
              placeholder="e.g. St. Paul's Cathedral"
              value={event.venue_name ?? ""}
              onChange={(e) => updateEvent(event.id, { venue_name: e.target.value || null })}
            />
            <Input
              label="Venue address"
              placeholder="Full address"
              value={event.venue_address ?? ""}
              onChange={(e) => updateEvent(event.id, { venue_address: e.target.value || null })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Dress theme (groom's side)"
                placeholder="e.g. Black tie"
                value={event.dress_groom ?? ""}
                onChange={(e) => updateEvent(event.id, { dress_groom: e.target.value || null })}
              />
              <Input
                label="Dress theme (bride's side)"
                placeholder="e.g. Dusty rose"
                value={event.dress_bride ?? ""}
                onChange={(e) => updateEvent(event.id, { dress_bride: e.target.value || null })}
              />
            </div>

            {/* Colours of the day */}
            <div>
              <p className="text-xs tracking-widest uppercase text-[var(--color-muted)] mb-3">
                Colours of the day
              </p>
              <div className="flex flex-wrap gap-3">
                {event.colors.map((color, i) => (
                  <div key={i} className="flex items-center gap-2 border border-[var(--color-ink)]/10 p-2">
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateColor(event.id, i, { hex: e.target.value })}
                      className="w-8 h-8 cursor-pointer border-none bg-transparent"
                    />
                    <input
                      type="text"
                      value={color.label}
                      placeholder="Label"
                      onChange={(e) => updateColor(event.id, i, { label: e.target.value })}
                      className="text-xs w-24 border-b border-[var(--color-ink)]/20 bg-transparent outline-none py-1"
                    />
                    <button
                      onClick={() => removeColor(event.id, i)}
                      className="text-[var(--color-muted)] hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addColor(event.id)}
                  className="flex items-center gap-1 border border-dashed border-[var(--color-ink)]/20 px-3 py-2 text-xs text-[var(--color-muted)] hover:border-[var(--color-ink)]/40 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add colour
                </button>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => saveEvent(event)}
              disabled={saving === event.id}
              className="self-end"
            >
              {saving === event.id ? "Saving…" : "Save event"}
            </Button>
          </div>
        ))}
      </div>

      <button
        onClick={addEvent}
        className="flex items-center gap-2 border-2 border-dashed border-[var(--color-ink)]/20 p-5 text-sm text-[var(--color-muted)] hover:border-[var(--color-ink)]/40 transition-colors"
      >
        <Plus className="h-4 w-4" /> Add event
      </button>
    </div>
  );
}