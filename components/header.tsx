"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSelector } from "./language-selector";

interface NavProps {
  lang: string;
  wordmark: string;
  translations: {
    about: string;
    work: string;
    ideas: string;
    contact: string;
  };
}

export function Header({ lang, wordmark, translations }: NavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: translations.about, href: `/${lang}#about` },
    // { label: translations.work, href: `/${lang}/projects` },
    // { label: translations.ideas, href: `/${lang}/blog` },
    { label: translations.contact, href: `/${lang}#contact` },
  ];

  const isActive = (href: string) => {
    if (href.includes("#")) {
      return pathname === `/${lang}`;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="relative z-40 bg-transparent">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="flex items-center justify-between h-20">
            <Link
              href={`/${lang}`}
              className="text-sm md:text-lg lg:text-2xl font-semibold tracking-[0.22em] text-ink hover:text-primary transition-colors"
            >
              {wordmark}
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  className={`relative text-[15px] text-ink-soft hover:text-ink transition-colors cursor-pointer ${
                    isActive(item.href) ? "text-ink" : ""
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1.5 inset-x-0 h-[2px] bg-ink rounded-full" />
                  )}
                </Link>
              ))}
              <LanguageSelector currentLang={lang} />
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <LanguageSelector currentLang={lang} />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-ink-soft hover:text-ink hover:bg-secondary/60 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-page-tint/95 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="absolute top-6 end-6 p-2 rounded-lg text-ink hover:bg-secondary/60 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          <nav className="relative pt-24 px-8 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-lg text-ink hover:bg-secondary/60 transition-colors cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
