import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";
import { getContentSecurityPolicy } from "./src/proxy";

describe("Next.js production hardening", () => {
  it("disables framework disclosure and applies browser security headers", async () => {
    const routes = await nextConfig.headers?.();
    const headers = Object.fromEntries(
      routes?.[0]?.headers.map(({ key, value }) => [key, value]) ?? [],
    );
    const contentSecurityPolicy = getContentSecurityPolicy("test-nonce");

    expect(nextConfig.poweredByHeader).toBe(false);
    expect(routes?.[0]?.source).toBe("/(.*)");
    expect(contentSecurityPolicy).toContain("frame-ancestors 'none'");
    expect(contentSecurityPolicy).toContain("object-src 'none'");
    expect(contentSecurityPolicy).toContain("script-src 'self' 'nonce-test-nonce'");
    expect(contentSecurityPolicy).not.toMatch(/script-src[^;]*'unsafe-inline'/u);
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    expect(headers["X-Frame-Options"]).toBe("DENY");
  });
});
