import { Alef } from "next/font/google";
import { cookies, headers } from "next/headers";
import {
  getLangDir,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from "@/lib/i18n";
import "./globals.css";

const alef = Alef({
  weight: ["400", "700"],
  subsets: ["latin", "hebrew"],
  display: "swap",
  variable: "--font-alef",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const headerLocale = headerStore.get("x-locale");
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const candidate = headerLocale || cookieLocale || DEFAULT_LOCALE;
  const lang = (SUPPORTED_LOCALES as readonly string[]).includes(candidate)
    ? candidate
    : DEFAULT_LOCALE;
  const dir = getLangDir(lang);

  return (
    <html lang={lang} dir={dir} className={alef.variable}>
      <body className="font-sans flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
