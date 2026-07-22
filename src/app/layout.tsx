import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";

const analyticsEnabled =
  process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";

export const metadata: Metadata = {
  title: { default: "OfferFlow", template: "%s | OfferFlow" },
  description:
    "Internal operations dashboard for reviewing, managing, and publishing partner offers.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">
        <ThemeProvider nonce={nonce}>
          {children}
          {analyticsEnabled ? <Analytics /> : null}
        </ThemeProvider>
      </body>
    </html>
  );
}
