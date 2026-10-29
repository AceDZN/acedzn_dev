import Link from "next/link";
import { Download, ExternalLink, Mail } from "lucide-react";
import type { Metadata } from "next";
import { getDictionary } from "../../../lib/dictionary";
import { createTranslator } from "@/lib/i18n";
import { getCv, hasCvPdf } from "../../../lib/cv";
import { MAIN_APP_URL } from "../../../lib/constants";
import { ScrollReveal } from "../../../components/scroll-reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const cv = await getCv();
  const title = `${cv.name} CV`;

  return {
    title,
    description: cv.summary,
    alternates: {
      canonical: `${MAIN_APP_URL}/${lang}/cv`,
      languages: {
        en: `${MAIN_APP_URL}/en/cv`,
        he: `${MAIN_APP_URL}/he/cv`,
      },
    },
    openGraph: {
      title,
      description: cv.headline,
      type: "profile",
    },
  };
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
      {children}
    </h2>
  );
}

export default async function CvPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "he");
  const t = createTranslator(dict);
  const cv = await getCv();
  const showPdf = hasCvPdf(cv);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${MAIN_APP_URL}/${lang}/cv`,
    mainEntity: {
      "@type": "Person",
      name: cv.name,
      jobTitle: cv.jobTitle,
      description: cv.summary,
      email: `mailto:${cv.email}`,
      url: MAIN_APP_URL,
      sameAs: [cv.linkedin],
      worksFor: { "@type": "Organization", name: "TinyTap" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hod HaSharon",
        addressCountry: "IL",
      },
      knowsLanguage: ["he", "en"],
      knowsAbout: cv.skills.flatMap((group) => group.items),
    },
  };

  return (
    <div className="py-12 md:py-16 px-6 sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {lang !== "en" && (
        <p className="mx-auto max-w-3xl mb-6 text-sm text-ink-soft">
          {t("cv.englishOnly")}
        </p>
      )}

      {/* The CV itself is English-only, so it stays LTR on the Hebrew route */}
      <article dir="ltr" lang="en" className="mx-auto max-w-3xl">
        <ScrollReveal>
          <header className="mb-10 pb-8 border-b border-border/60">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
              {cv.name}
            </h1>
            <p className="mt-3 text-lg sm:text-xl font-medium text-primary">
              {cv.headline}
            </p>
            <p className="mt-2 text-sm text-ink-soft">{cv.location}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {showPdf && (
                <a
                  href={cv.pdf}
                  download
                  className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-background font-medium rounded-lg hover:bg-ink/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  {t("cv.downloadPdf")}
                </a>
              )}
              <a
                href={`mailto:${cv.email}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-secondary/60 text-ink font-medium rounded-lg border border-border/60 hover:bg-secondary transition-colors"
              >
                <Mail className="h-4 w-4" />
                {cv.email}
              </a>
              <Link
                href={cv.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-secondary/60 text-ink font-medium rounded-lg border border-border/60 hover:bg-secondary transition-colors"
              >
                LinkedIn
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <section className="mb-10">
            <SectionTitle>Professional Summary</SectionTitle>
            <p className="text-ink-soft leading-relaxed">{cv.summary}</p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section className="mb-10">
            <SectionTitle>Skills</SectionTitle>
            <dl className="space-y-4">
              {cv.skills.map((group) => (
                <div key={group.label}>
                  <dt className="text-sm font-semibold text-ink mb-2">
                    {group.label}
                  </dt>
                  <dd className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-md text-xs bg-secondary/80 text-ink-soft border border-border/40"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </ScrollReveal>

        <section className="mb-10">
          <ScrollReveal>
            <SectionTitle>Professional Experience</SectionTitle>
          </ScrollReveal>
          <div className="space-y-10">
            {cv.experience.map((job) => (
              <ScrollReveal key={job.company}>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-lg font-bold text-ink">
                      {job.url ? (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {job.company}
                        </a>
                      ) : (
                        job.company
                      )}
                    </h3>
                    <span className="text-sm text-ink-soft tabular-nums">
                      {job.location} · {job.start} - {job.end}
                    </span>
                  </div>
                  {job.description && (
                    <p className="mt-1 text-sm italic text-muted-foreground">
                      {job.description}
                    </p>
                  )}

                  {job.roles.map((role) => (
                    <div key={role.title} className="mt-4">
                      <p className="text-ink">
                        <span className="font-semibold">{role.title}</span>
                        {role.note && (
                          <span className="text-ink-soft"> ({role.note})</span>
                        )}
                        {job.roles.length > 1 && (
                          <span className="text-sm text-ink-soft tabular-nums">
                            {" "}
                            · {role.start} - {role.end}
                          </span>
                        )}
                      </p>
                      <ul className="mt-2 space-y-1.5 list-disc ps-5 marker:text-primary/60">
                        {role.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="text-sm text-ink-soft leading-relaxed"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {job.tech && (
                    <p className="mt-3 text-xs font-mono text-muted-foreground">
                      {job.tech.join(" · ")}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-10">
              <h3 className="text-base font-semibold text-ink mb-2">
                Earlier Experience
              </h3>
              <ul className="space-y-1 text-sm text-ink-soft">
                {cv.earlier.map((job) => (
                  <li key={job.company}>
                    <span className="font-medium text-ink">{job.company}</span>,{" "}
                    {job.title} ({job.period})
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </section>

        <ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-10 pt-8 border-t border-border/60">
            <section>
              <SectionTitle>Education &amp; Certifications</SectionTitle>
              <ul className="space-y-1.5 text-sm text-ink-soft">
                {cv.education.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <SectionTitle>Languages</SectionTitle>
              <ul className="space-y-1.5 text-sm text-ink-soft">
                {cv.languages.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </ScrollReveal>
      </article>
    </div>
  );
}
