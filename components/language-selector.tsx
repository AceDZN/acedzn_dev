"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { motion } from "framer-motion";

const COOKIE_NAME = "NEXT_LOCALE";

export function LanguageSelector({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = useCallback(
    (newLang: string) => {
      const domain = window.location.hostname.includes("acedzn.dev")
        ? ".acedzn.dev"
        : window.location.hostname;
      document.cookie = `${COOKIE_NAME}=${newLang}; path=/; max-age=31536000; SameSite=Lax; domain=${domain}`;

      const segments = pathname.split("/");
      if (segments.length > 1) {
        segments[1] = newLang;
        const newPath = segments.join("/");
        router.push(newPath);
        router.refresh();
      }
    },
    [pathname, router],
  );

  return (
    <div className="flex items-center bg-secondary/50 rounded-lg p-0.5 border border-border/40">
      {["en", "he"].map((lang) => (
        <button
          key={lang}
          onClick={() => switchLanguage(lang)}
          className={`relative px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            currentLang === lang
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {currentLang === lang && (
            <motion.div
              layoutId="lang-active"
              className="absolute inset-0 bg-primary/10 rounded-md border border-primary/20"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{lang === "en" ? "EN" : "HE"}</span>
        </button>
      ))}
    </div>
  );
}
