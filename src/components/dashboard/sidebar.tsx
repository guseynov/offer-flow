"use client";

import { cva } from "class-variance-authority";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarNavItem } from "@/types/dashboard";

const navItems: SidebarNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "▦" },
  { label: "Deals", href: "/dashboard/deals", icon: "◇" },
  { label: "Partners", href: "#", icon: "◎" },
  { label: "Orders", href: "#", icon: "▤" },
];

const navLinkVariants = cva(
  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
  {
    variants: {
      active: {
        true: "bg-white/10 text-white ring-1 ring-white/10",
        false: "text-slate-400 hover:bg-white/5 hover:text-slate-100",
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

  return pathname.startsWith(item.href);
}

function getAriaCurrent(isActive: boolean): "page" | undefined {
  if (isActive) {
    return "page";
  }

  return undefined;
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "relative border-b border-slate-800 bg-[#13231b] text-white",
        "lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0",
      )}
    >
      <div className="flex h-18 items-center justify-between px-5 lg:h-auto lg:px-7 lg:py-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-400 text-lg font-black text-[#13231b] shadow-[0_8px_24px_rgba(52,211,153,0.18)]">
            C
          </span>
          <span>
            <span className="block text-sm font-bold tracking-wide">
              COMMERCE
            </span>
            <span className="block text-[10px] font-semibold tracking-[0.3em] text-emerald-300">
              OPS CONSOLE
            </span>
          </span>
        </Link>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200 lg:hidden">
          Internal
        </span>
      </div>

      <nav
        aria-label="Primary navigation"
        className="overflow-x-auto px-4 pb-4 lg:px-5 lg:pb-0"
      >
        <ul className="flex min-w-max gap-2 lg:block lg:min-w-0 lg:space-y-1.5">
          {navItems.map((item) => {
            const isActive = isNavItemActive(pathname, item);

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={getAriaCurrent(isActive)}
                  className={navLinkVariants({ active: isActive })}
                >
                  <span aria-hidden="true" className="w-5 text-center text-lg">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
