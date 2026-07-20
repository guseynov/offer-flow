"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTheme } from "next-themes";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateTimeRangePickerProps = {
  idPrefix: string;
  startsAt: string;
  endsAt: string;
  onStartsAtChange: (value: string) => void;
  onEndsAtChange: (value: string) => void;
  onBlur?: () => void;
  startAriaInvalid?: boolean;
  endAriaInvalid?: boolean;
  dateAriaDescribedBy?: string;
  startAriaDescribedBy?: string;
  endAriaDescribedBy?: string;
  className?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
};

function subscribe() {
  return () => {};
}

function useIsMounted() {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

const twoMonthCalendarQuery = "(min-width: 640px)";

function subscribeToCalendarLayout(callback: () => void) {
  const mediaQuery = window.matchMedia(twoMonthCalendarQuery);
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
}

function getTwoMonthCalendarSnapshot() {
  return window.matchMedia(twoMonthCalendarQuery).matches;
}

function useTwoMonthCalendar() {
  return React.useSyncExternalStore(
    subscribeToCalendarLayout,
    getTwoMonthCalendarSnapshot,
    () => false,
  );
}

function parseDatePart(value: string) {
  if (!value) {
    return undefined;
  }

  const [datePart] = value.split("T");

  if (!datePart) {
    return undefined;
  }

  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function getTimePart(value: string) {
  if (!value.includes("T")) {
    return "";
  }

  return value.slice(11, 16);
}

function toDateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatRangeLabel(range: DateRange | undefined) {
  if (!range?.from) {
    return "Pick a date range";
  }

  if (!range.to) {
    return `${format(range.from, "MMM d, yyyy")} - Pick end date`;
  }

  return `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`;
}

type TimePickerInputProps = {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

function TimePickerInput({
  id,
  label,
  value,
  disabled,
  ariaInvalid,
  ariaDescribedBy,
  onChange,
  onBlur,
}: TimePickerInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="time"
        step="60"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "h-11 appearance-none border-white/6 bg-surface-soft font-normal scheme-dark [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
          ariaInvalid && "border-danger focus-visible:ring-danger",
        )}
      />
    </div>
  );
}

export function DateTimeRangePicker({
  idPrefix,
  startsAt,
  endsAt,
  onStartsAtChange,
  onEndsAtChange,
  onBlur,
  startAriaInvalid,
  endAriaInvalid,
  dateAriaDescribedBy,
  startAriaDescribedBy,
  endAriaDescribedBy,
  className,
  defaultStartTime = "09:00",
  defaultEndTime = "18:00",
}: DateTimeRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const mounted = useIsMounted();
  const showTwoMonths = useTwoMonthCalendar();
  const { resolvedTheme } = useTheme();
  const activeTheme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const startDate = parseDatePart(startsAt);
  const endDate = parseDatePart(endsAt);
  const startTime = getTimePart(startsAt);
  const endTime = getTimePart(endsAt);
  const range = startDate ? { from: startDate, to: endDate } : undefined;
  const hasError = startAriaInvalid || endAriaInvalid;

  function handleRangeSelect(nextRange: DateRange | undefined) {
    if (!nextRange?.from) {
      onStartsAtChange("");
      onEndsAtChange("");
      onBlur?.();
      return;
    }

    onStartsAtChange(
      `${toDateValue(nextRange.from)}T${startTime || defaultStartTime}`,
    );

    if (nextRange.to) {
      onEndsAtChange(
        `${toDateValue(nextRange.to)}T${endTime || defaultEndTime}`,
      );
    } else {
      onEndsAtChange("");
    }

    onBlur?.();
  }

  function handleStartTimeChange(nextTime: string) {
    if (!startDate) {
      return;
    }

    onStartsAtChange(
      `${toDateValue(startDate)}T${nextTime || defaultStartTime}`,
    );
  }

  function handleEndTimeChange(nextTime: string) {
    if (!endDate) {
      return;
    }

    onEndsAtChange(`${toDateValue(endDate)}T${nextTime || defaultEndTime}`);
  }

  return (
    <div className={cn("mt-2 grid gap-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={`${idPrefix}-date-range`}
            type="button"
            variant="secondary"
            aria-invalid={hasError}
            aria-describedby={dateAriaDescribedBy}
            data-empty={!range?.from}
            className={cn(
              "h-11 w-full justify-start rounded-lg border-white/6 bg-surface-soft px-3 text-left font-normal text-(--text-soft) hover:bg-surface-strong",
              !range?.from && "text-(--text-faint)",
              hasError && "border-danger focus-visible:ring-danger",
            )}
          >
            <CalendarIcon className="size-4 text-(--text-muted)" />
            <span>{formatRangeLabel(range)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          collisionPadding={16}
          className="max-h-[var(--radix-popover-content-available-height)] w-auto max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain p-0"
        >
          <Calendar
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={handleRangeSelect}
            numberOfMonths={showTwoMonths ? 2 : 1}
            autoFocus
            theme={activeTheme}
          />
        </PopoverContent>
      </Popover>

      <div className="grid gap-3 sm:grid-cols-2">
        <TimePickerInput
          id={`${idPrefix}-start-time`}
          label="Start time (UTC)"
          value={startTime}
          disabled={!startDate}
          ariaInvalid={startAriaInvalid}
          ariaDescribedBy={startAriaDescribedBy}
          onChange={handleStartTimeChange}
          onBlur={onBlur}
        />
        <TimePickerInput
          id={`${idPrefix}-end-time`}
          label="End time (UTC)"
          value={endTime}
          disabled={!endDate}
          ariaInvalid={endAriaInvalid}
          ariaDescribedBy={endAriaDescribedBy}
          onChange={handleEndTimeChange}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}
