"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

function subscribe() {
  return () => {};
}

function useIsMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function ThemeToggle() {
  const mounted = useIsMounted();
  const { resolvedTheme, setTheme } = useTheme();

  const activeTheme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const label =
    activeTheme === "dark" ? "switch to light mode" : "switch to dark mode";

  function toggleTheme() {
    setTheme(activeTheme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={activeTheme === "dark"}
      title={label}
      className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-(--surface-overlay-strong) bg-surface-soft px-3 py-2.5 text-left transition-colors hover:bg-(--surface-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="space-y-0.5">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-(--text-faint)">
          theme
        </span>
        <span
          suppressHydrationWarning
          className="block text-sm font-semibold text-(--text-strong)"
        >
          {mounted ? activeTheme : "system"}
        </span>
      </span>

      <span
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors",
          activeTheme === "dark"
            ? "border-[color-mix(in_srgb,var(--primary)_35%,transparent)] bg-(--surface-selected)"
            : "border-(--surface-overlay-strong) bg-surface",
        )}
      >
        <span
          suppressHydrationWarning
          className={cn(
            "absolute left-1 grid size-5 place-items-center rounded-full transition-transform duration-200",
            activeTheme === "dark"
              ? "translate-x-5 bg-primary text-primary-foreground"
              : "translate-x-0 bg-surface-strong text-(--text-muted)",
          )}
        >
          {activeTheme === "dark" ? (
            <Moon size={12} strokeWidth={2.25} />
          ) : (
            <Sun size={12} strokeWidth={2.25} />
          )}
        </span>
      </span>
    </button>
  );
}
