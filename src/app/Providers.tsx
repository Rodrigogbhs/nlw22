"use client";

import { RoastProvider } from "./lib/RoastContext";

export function Providers({ children }: { children: React.ReactNode }) {
	return <RoastProvider>{children}</RoastProvider>;
}
