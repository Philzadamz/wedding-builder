"use client";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-body tracking-widest text-xs uppercase transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-ink)] text-white hover:opacity-80",
        outline: "border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white",
        ghost: "text-[var(--color-ink)] hover:bg-black/5",
        accent: "bg-[var(--color-accent)] text-white hover:opacity-80",
        "outline-white": "border border-white text-white hover:bg-white hover:text-[var(--color-ink)]",
      },
      size: {
        default: "h-11 px-8",
        sm: "h-9 px-5",
        lg: "h-14 px-12 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
