"use client";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = ({
  className,
  children,
  label,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & { label?: string }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <label className="text-xs tracking-widest uppercase text-[var(--color-muted)]">{label}</label>
    )}
    <SelectPrimitive.Trigger
      className={cn(
        "flex w-full items-center justify-between border-b border-[var(--color-ink)]/30 bg-transparent py-2.5 text-sm outline-none focus:border-[var(--color-ink)] [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  </div>
);

const SelectContent = ({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden bg-[var(--color-paper)] border border-[var(--color-ink)]/10 shadow-lg",
        position === "popper" && "translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) => (
  <SelectPrimitive.Item
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center py-2 px-3 text-sm outline-none hover:bg-black/5 data-[state=checked]:font-medium",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem };
