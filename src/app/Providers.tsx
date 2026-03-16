"use client";

import { LanguageProvider } from "./lib/LanguageContext";
import { RoastProvider } from "./lib/RoastContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <RoastProvider>{children}</RoastProvider>
    </LanguageProvider>
  );
}
