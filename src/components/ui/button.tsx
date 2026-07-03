import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-[color-mix(in_srgb,var(--primary)_52%,transparent)] bg-primary-strong text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary-strong)_88%,black)]",
        secondary:
          "border border-(--border-strong) bg-secondary text-foreground hover:bg-surface-strong",
        ghost:
          "text-(--muted) hover:bg-(--surface-hover) hover:text-foreground",
        muted:
          "border border-(--surface-overlay-strong) bg-transparent text-(--text-muted) hover:bg-(--surface-hover) hover:text-(--text-strong)",
        success:
          "border border-[color-mix(in_srgb,var(--success)_36%,transparent)] bg-success-soft text-success hover:bg-[color-mix(in_srgb,var(--success-soft)_82%,var(--surface))]",
        danger:
          "border border-[color-mix(in_srgb,var(--danger)_36%,transparent)] bg-danger-soft text-danger hover:bg-[color-mix(in_srgb,var(--danger-soft)_82%,var(--surface))]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  asChild = false,
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const buttonProps = asChild ? props : { type, ...props };

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...buttonProps}
    />
  );
}
