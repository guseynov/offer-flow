import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { consumeMutationRateLimit } from "@/lib/server/deal-repository";

const CLIENT_MUTATIONS_PER_MINUTE = 60;
const GLOBAL_MUTATIONS_PER_MINUTE = 600;
const WINDOW_SECONDS = 60;

function getClientKey(request: Request): string {
  const forwardedAddress = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const address =
    forwardedAddress || request.headers.get("x-real-ip")?.trim() || "unknown";

  return createHash("sha256").update(address.slice(0, 512)).digest("hex");
}

export async function getMutationRateLimitResponse(
  request: Request,
): Promise<NextResponse | null> {
  const result = await consumeMutationRateLimit({
    clientKey: getClientKey(request),
    clientLimit: CLIENT_MUTATIONS_PER_MINUTE,
    globalLimit: GLOBAL_MUTATIONS_PER_MINUTE,
    windowSeconds: WINDOW_SECONDS,
  });

  if (result.allowed) {
    return null;
  }

  return NextResponse.json(
    { message: "Too many mutation requests. Try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSeconds),
        "RateLimit-Limit": String(result.limit),
        "RateLimit-Remaining": String(result.remaining),
        "RateLimit-Reset": String(result.retryAfterSeconds),
      },
    },
  );
}
