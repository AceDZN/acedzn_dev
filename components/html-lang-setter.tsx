"use client";

import { useEffect } from "react";
import { getLangDir } from "@/lib/i18n";

export function HtmlLangSetter({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = getLangDir(lang);
  }, [lang]);
  return null;
}
