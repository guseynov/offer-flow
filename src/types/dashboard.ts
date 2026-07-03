import type { ReactNode } from "react";
import type { DealStatus } from "./deal";

export type ChildrenProps = {
  children: ReactNode;
};

export type StatusBadgeProps = {
  status: DealStatus;
};

export type DealActivity = {
  title: string;
  partner: string;
  status: DealStatus;
  time: string;
};

export type SidebarNavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};
