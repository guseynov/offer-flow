import type { ReactNode } from "react";
import type { DealStatus } from "./deal";

export type MetricAccent =
  | "amber"
  | "emerald"
  | "rose"
  | "blue"
  | "violet";

export type ChildrenProps = {
  children: ReactNode;
};

export type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
  accent: MetricAccent;
};

export type StatusBadgeProps = {
  status: DealStatus;
};

export type DashboardMetric = Omit<MetricCardProps, "icon"> & {
  icon: string;
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
  icon: string;
};
