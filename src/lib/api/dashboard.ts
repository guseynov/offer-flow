import { apiClient } from "@/lib/api/client";
import type { DashboardDataDto } from "@/lib/dashboard-data";
import { dashboardDataSchema } from "@/lib/schemas/dashboard";

export async function getDashboardData(): Promise<DashboardDataDto> {
  const response = await apiClient.get<DashboardDataDto>("/dashboard");

  return dashboardDataSchema.parse(response.data);
}

