import { createTranslator } from "@/lib/i18n";
import { getDictionary } from "../../lib/dictionary";
import { HeroCard } from "../../components/hero-card";
import { Pillars, PILLAR_ICONS } from "../../components/pillars";

const PILLAR_KEYS = [
  { key: "webDev", Icon: PILLAR_ICONS.Code },
  { key: "techLead", Icon: PILLAR_ICONS.Users },
  { key: "edtech", Icon: PILLAR_ICONS.GraduationCap },
  { key: "ai", Icon: PILLAR_ICONS.Sparkles },
] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "he");
  const t = createTranslator(dict);
  const pillars = PILLAR_KEYS.map(({ key, Icon }) => ({
    title: t(`pillars.${key}.title`),
    description: t(`pillars.${key}.description`),
    Icon,
  }));

  return (
    <div id="about" className="relative">
      <HeroCard
        lang={lang}
        headlineLead={t("hero.headlineLead")}
        headlineAccent={t("hero.headlineAccent")}
        bio={t("hero.bio")}
        ctaConnect={t("hero.ctaConnect")}
        ctaWork={t("hero.ctaWork")}
        imageAlt={t("hero.imageAlt")}
      />

      <Pillars items={pillars} />

      {/* <section id="work" className="px-6 sm:px-10 py-14 md:py-20 border-t border-border/60">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              {t("projects.title")}
            </h2>
            <Link
              href={`/${lang}/projects`}
              prefetch
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors cursor-pointer"
            >
              {t("projects.viewAll")}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((project, index) => (
              <HomeProjectCard
                key={project.id}
                project={project}
                lang={lang}
                ctaLabel={ctaByIndex[index] ?? t("projects.details")}
              />
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}
