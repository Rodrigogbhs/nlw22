"use client";

import { useLanguage } from "../lib/LanguageContext";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 text-xs font-primary rounded transition-colors ${
          language === "en"
            ? "text-[var(--accent-green)]"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
        }`}
      >
        EN
      </button>
      <span className="text-[var(--text-tertiary)]">/</span>
      <button
        type="button"
        onClick={() => setLanguage("pt")}
        className={`px-2 py-1 text-xs font-primary rounded transition-colors ${
          language === "pt"
            ? "text-[var(--accent-green)]"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
        }`}
      >
        PT
      </button>
    </div>
  );
}
