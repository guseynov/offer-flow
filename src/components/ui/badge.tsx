import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-(--surface-overlay-strong) bg-(--surface-overlay) text-(--text-soft)",
        secondary:
          "border-(--surface-overlay-strong) bg-(--surface-overlay) text-(--text-soft)",
        outline: "border-(--surface-overlay-strong) bg-transparent text-(--text-muted)",
        success:
          "border-[color-mix(in_srgb,var(--success)_36%,transparent)] bg-success-soft text-success",
        warning:
          "border-[color-mix(in_srgb,var(--warning)_36%,transparent)] bg-warning-soft text-warning",
        danger:
          "border-[color-mix(in_srgb,var(--danger)_36%,transparent)] bg-danger-soft text-danger",
        muted:
          "border-[color-mix(in_srgb,var(--muted)_28%,transparent)] bg-(--surface-hover) text-(--muted)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
