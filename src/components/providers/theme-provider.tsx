"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, type ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
  nonce?: string;
};

export function ThemeProvider({ children, nonce }: ThemeProviderProps) {
  const [initialNonce] = useState(nonce);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      nonce={initialNonce}
    >
      {children}
    </NextThemesProvider>
  );
}
