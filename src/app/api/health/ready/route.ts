import { NextResponse } from "next/server";
import { checkRepositoryReadiness } from "@/lib/server/deal-repository";

export async function GET() {
  try {
    const ready = await checkRepositoryReadiness();
    return NextResponse.json(
      { status: ready ? "ready" : "unavailable" },
      { status: ready ? 200 : 503 },
    );
  } catch {
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }
}
