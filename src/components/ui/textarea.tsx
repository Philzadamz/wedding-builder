import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs tracking-widest uppercase text-[var(--color-muted)]">
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        rows={4}
        className={cn(
          "w-full border border-[var(--color-ink)]/20 bg-transparent p-3 text-sm outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-ink)] resize-none",
          error && "border-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
