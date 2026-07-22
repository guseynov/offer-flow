"use client";

import { cva } from "class-variance-authority";
import clsx from "clsx";
import { LayoutGrid, Plus, SquareStack, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { SidebarNavItem } from "@/types/dashboard";

const operationsItems: SidebarNavItem[] = [
  {
    label: "dashboard",
    href: "/dashboard",
    icon: <LayoutGrid size={14} strokeWidth={2} />,
  },
  {
    label: "offers",
    href: "/dashboard/deals",
    icon: <SquareStack size={14} strokeWidth={2} />,
  },
  {
    label: "new_offer",
    href: "/dashboard/deals/new",
    icon: <Plus size={14} strokeWidth={2} />,
  },
];

const navLinkVariants = cva(
  "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  {
    variants: {
      active: {
        true: "bg-(--surface-selected) text-(--text-strong) ring-1 ring-inset ring-(--surface-overlay-strong)",
        false:
          "text-(--text-faint) hover:bg-(--surface-hover) hover:text-(--text-soft)",
      },
    },
    defaultVariants: { active: false },
  },
);

function isNavItemActive(pathname: string, item: SidebarNavItem) {
  if (item.href === "#") {
    return false;
  }

  if (item.href === "/dashboard") {
    return pathname === item.href;
  }

  if (item.href === "/dashboard/deals/new") {
    return pathname === item.href;
  }

  if (item.href === "/dashboard/deals") {
    return (
      pathname.startsWith(item.href) && pathname !== "/dashboard/deals/new"
    );
  }

  return pathname.startsWith(item.href);
}

function getAriaCurrent(isActive: boolean): "page" | undefined {
  if (isActive) {
    return "page";
  }

  return undefined;
}

function NavSection({
  title,
  items,
  pathname,
}: {
  title: string;
  items: SidebarNavItem[];
  pathname: string;
}) {
  return (
    <nav aria-label="Primary" className="space-y-2">
      <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--text-faint)">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = isNavItemActive(pathname, item);

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={getAriaCurrent(isActive)}
                className={navLinkVariants({ active: isActive })}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    "grid h-5 w-5 place-items-center",
                    isActive ? "text-(--text-soft)" : "text-(--text-faint)",
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto text-(--text-muted)">•</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Operator workspace"
      className={clsx(
        "relative border-b border-sidebar-border bg-sidebar text-foreground",
        "lg:sticky lg:top-0 lg:h-screen lg:w-46 lg:border-r lg:border-b-0",
      )}
    >
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
            <Zap size={12} strokeWidth={2.75} />
          </span>
          <span className="text-sm font-bold text-(--text-strong)">
            offerflow
          </span>
        </Link>
        <Badge
          variant="outline"
          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase"
        >
          public
        </Badge>
      </div>

      <div className="space-y-4 px-2 py-4">
        <NavSection
          title="operations"
          items={operationsItems}
          pathname={pathname}
        />
        <div className="px-1">
          <ThemeToggle />
        </div>
      </div>

      <div className="hidden border-t border-sidebar-border px-3 py-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--text-soft)">
          public demo
        </p>
        <p className="mt-1 text-[10px] text-(--text-faint)">
          Changes are shared with everyone.
        </p>
      </div>
    </aside>
  );
}
