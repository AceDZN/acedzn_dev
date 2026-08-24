import type { Metadata } from "next";
import { PostHogProvider } from "@/lib/analytics/posthog-provider";

import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { HtmlLangSetter } from "../../components/html-lang-setter";
import { MAIN_APP_URL } from "../../lib/constants";
import { getDictionary } from "../../lib/dictionary";
import { createTranslator } from "@/lib/i18n";

const getSeo = async (locale: "en" | "he") => {
  const dictionary = await import(`../../dictionaries/seo-${locale}.json`);
  return dictionary.default;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const seo = await getSeo(lang as "en" | "he");
  const baseUrl = MAIN_APP_URL;

  return {
    title: {
      default: seo.title,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords
      ? seo.keywords.split(",").map((k: string) => k.trim())
      : [],
    authors: [{ name: seo.author || "Alex Sindalovsky" }],
    creator: seo.creator || "AceDZN",
    publisher: seo.publisher || "AceDZN",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        en: `${baseUrl}/en`,
        he: `${baseUrl}/he`,
      },
    },
    openGraph: {
      siteName: seo.og?.siteName || seo.title,
      title: seo.og?.title || seo.title,
      description: seo.og?.description || seo.description,
      type: "website",
      locale: seo.og?.locale || (lang === "he" ? "he_IL" : "en_US"),
      url: `${baseUrl}/${lang}`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: seo.twitter?.card || "summary_large_image",
      title: seo.twitter?.title || seo.title,
      description: seo.twitter?.description || seo.description,
      site: seo.twitter?.site || "@AceDZN",
      images: [`${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "he" }];
}

function generateStructuredData(lang: string) {
  const baseUrl = MAIN_APP_URL;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alex Sindalovsky",
    alternateName: "AceDZN",
    url: baseUrl,
    sameAs: [
      "https://github.com/AceDZN",
      "https://www.linkedin.com/in/alexsindalovsky/",
      "https://x.com/AceDZN",
    ],
    jobTitle: "UI/UX Developer & Context Engineer",
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "AI-Augmented Development",
      "Context Engineering",
      "UI/UX Design",
      "EdTech",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AceDZN - Alex Sindalovsky",
    url: baseUrl,
    description: "Personal portfolio and tool directory of Alex Sindalovsky",
    inLanguage: lang === "he" ? "he-IL" : "en-US",
  };

  return [personSchema, websiteSchema];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const structuredData = generateStructuredData(lang);
  const dict = await getDictionary(lang as "en" | "he");
  const t = createTranslator(dict);

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <HtmlLangSetter lang={lang} />
      <PostHogProvider>
        <Header
          lang={lang}
          wordmark={t("hero.wordmark")}
          translations={{
            about: t("nav.about"),
            work: t("nav.work"),
            ideas: t("nav.ideas"),
            contact: t("nav.contact"),
          }}
        />
        <main className="flex-grow">{children}</main>
        <Footer
          lang={lang}
          translations={{
            profileBlurb: t("footer.profileBlurb"),
            getInTouch: t("footer.getInTouch"),
            elsewhere: t("footer.elsewhere"),
            tagline: t("footer.tagline"),
            rights: t("footer.rights"),
            contactEmail: t("contact.email"),
            contactCity: t("contact.city"),
            linkedin: "LinkedIn",
          }}
        />
      </PostHogProvider>
    </>
  );
}
