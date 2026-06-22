"use client";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = ({
  className,
  label,
  description,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & { label?: string; description?: string }) => (
  <div className="flex items-center justify-between gap-4">
    {(label || description) && (
      <div>
        {label && <p className="text-sm font-medium">{label}</p>}
        {description && <p className="text-xs text-[var(--color-muted)]">{description}</p>}
      </div>
    )}
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-ink)] data-[state=unchecked]:bg-[var(--color-ink)]/20",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
  </div>
);

export { Switch };
