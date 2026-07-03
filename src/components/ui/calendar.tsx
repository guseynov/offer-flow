"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CalendarProps = ComponentProps<typeof DayPicker> & {
  theme?: "light" | "dark";
};

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  theme = "light",
  ...props
}: CalendarProps) {
  const singleSelectedDayButtonClasses =
    theme === "dark"
      ? "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground [&>button:focus-visible]:bg-primary [&>button:focus-visible]:text-primary-foreground"
      : "[&>button]:bg-primary-strong [&>button]:text-primary-foreground [&>button:hover]:bg-primary-strong [&>button:hover]:text-primary-foreground [&>button:focus-visible]:bg-primary-strong [&>button:focus-visible]:text-primary-foreground";
  const rangeEndpointButtonClasses =
    theme === "dark"
      ? "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground [&>button:focus-visible]:bg-primary [&>button:focus-visible]:text-primary-foreground"
      : "[&>button]:bg-primary-strong [&>button]:text-primary-foreground [&>button:hover]:bg-primary-strong [&>button:hover]:text-primary-foreground [&>button:focus-visible]:bg-primary-strong [&>button:focus-visible]:text-primary-foreground";

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("relative p-3", className)}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row sm:gap-4",
        month: "space-y-4",
        month_caption: "flex items-center justify-center pt-1",
        caption_label: "text-sm font-semibold text-(--text-strong)",
        nav: "absolute inset-x-3 top-3 z-10 flex items-center justify-between",
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-7 rounded-md border border-(--surface-overlay-strong) bg-transparent p-0 text-(--text-muted) hover:bg-(--surface-hover) hover:text-(--text-strong)",
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-7 rounded-md border border-(--surface-overlay-strong) bg-transparent p-0 text-(--text-muted) hover:bg-(--surface-hover) hover:text-(--text-strong)",
        ),
        weekdays: "flex",
        weekday:
          "w-9 rounded-md text-[0.75rem] font-medium text-(--text-faint)",
        month_grid: "w-full border-collapse space-y-1",
        weeks: "mt-2",
        week: "mt-2 flex w-full",
        day: cn(
          "relative h-9 w-9 p-0 text-center text-sm",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-[color:color-mix(in_srgb,var(--primary-soft)_60%,transparent)]",
          "[&:has([aria-selected])]:bg-primary-soft",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20",
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 rounded-md p-0 font-normal text-(--text-soft) aria-selected:opacity-100 hover:bg-(--surface-hover) hover:text-(--text-strong)",
        ),
        selected: singleSelectedDayButtonClasses,
        range_start: cn("day-range-start rounded-md", rangeEndpointButtonClasses),
        range_end: cn("day-range-end rounded-md", rangeEndpointButtonClasses),
        range_middle:
          "[&>button]:rounded-none [&>button]:border-transparent [&>button]:bg-transparent [&>button]:!text-(--text-strong) [&>button:hover]:bg-transparent [&>button:hover]:!text-(--text-strong) [&>button:focus-visible]:bg-transparent [&>button:focus-visible]:!text-(--text-strong) aria-selected:bg-primary-soft",
        today: "border border-(--surface-overlay-strong) text-(--text-strong)",
        outside: "text-(--text-faint) opacity-60",
        disabled: "text-(--text-faint) opacity-40",
        hidden: "invisible",
        chevron: "size-4",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" {...iconProps} />
          ) : (
            <ChevronRight className="size-4" {...iconProps} />
          ),
      }}
      {...props}
    />
  );
}
