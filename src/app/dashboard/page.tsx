import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getDashboardData } from "@/lib/server/deal-repository";

export const metadata: Metadata = { title: "Overview" };

export default async function DashboardPage() {
  const initialData = await getDashboardData();
  return <DashboardOverview initialData={initialData} />;
}
