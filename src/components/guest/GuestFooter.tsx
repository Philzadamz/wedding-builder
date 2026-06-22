import type { Couple } from "@/lib/types";

interface Props {
  couple: Couple;
}

export function GuestFooter({ couple }: Props) {
  return (
    <footer className="relative overflow-hidden py-16 px-6 border-t border-[var(--color-ink)]/10">
      {/* Large watermark couple name */}
      <p
        className="absolute inset-0 flex items-center justify-center text-[12vw] font-script text-[var(--color-ink)]/5 select-none pointer-events-none whitespace-nowrap"
      >
        {couple.bride_name} & {couple.groom_name}
      </p>

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <p className="font-script text-5xl">{couple.bride_name} & {couple.groom_name}</p>
        {couple.wedding_date && (
          <p className="text-xs tracking-widest uppercase text-[var(--color-muted)]">
            {new Date(couple.wedding_date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <p className="text-[10px] tracking-widest uppercase text-[var(--color-muted)]/50 mt-6">
          Built with Velvet
        </p>
      </div>
    </footer>
  );
}