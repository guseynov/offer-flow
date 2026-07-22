import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { consumeMutationRateLimit } from "@/lib/server/deal-repository";

const CLIENT_MUTATIONS_PER_MINUTE = 60;
const GLOBAL_MUTATIONS_PER_MINUTE = 600;
const WINDOW_SECONDS = 60;

function getClientKey(request: Request, scopePrefix: string): string {
  const forwardedAddress = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const address =
    forwardedAddress || request.headers.get("x-real-ip")?.trim() || "unknown";

  return createHash("sha256")
    .update(`${scopePrefix}:${address.slice(0, 512)}`)
    .digest("hex");
}

type RateLimitOptions = {
  scopePrefix?: string;
  clientLimit?: number;
  globalLimit?: number;
  windowSeconds?: number;
  message?: string;
};

export async function getMutationRateLimitResponse(
  request: Request,
  options: RateLimitOptions = {},
): Promise<NextResponse | null> {
  const scopePrefix = options.scopePrefix ?? "mutation";
  const clientLimit = options.clientLimit ?? CLIENT_MUTATIONS_PER_MINUTE;
  const globalLimit = options.globalLimit ?? GLOBAL_MUTATIONS_PER_MINUTE;
  const windowSeconds = options.windowSeconds ?? WINDOW_SECONDS;
  const result = await consumeMutationRateLimit({
    scopePrefix,
    clientKey: getClientKey(request, scopePrefix),
    clientLimit,
    globalLimit,
    windowSeconds,
  });

  if (result.allowed) {
    return null;
  }

  return NextResponse.json(
    { message: options.message ?? "Too many mutation requests. Try again shortly." },
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
