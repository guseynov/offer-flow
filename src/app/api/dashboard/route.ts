import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/server/deal-repository";

export async function GET() {
  const response = await getDashboardData();

  return NextResponse.json(response);
}
