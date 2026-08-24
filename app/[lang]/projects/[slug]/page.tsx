import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "../../../../lib/dictionary";
import { createTranslator } from "@/lib/i18n";
import { getProjectBySlug, getAllProjectSlugs } from "../../../../lib/projects";
import { getPostsByTag } from "../../../../lib/blog";
import { ScrollReveal } from "../../../../components/scroll-reveal";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Check,
  Book,
  Mic,
  Code,
  Layout,
  Bot,
} from "lucide-react";
import type { Metadata } from "next";

const iconMap = {
  book: Book,
  mic: Mic,
  code: Code,
  layout: Layout,
  bot: Bot,
};

const statusConfig = {
  live: {
    label: "Live",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  beta: {
    label: "Beta",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  "coming-soon": {
    label: "Coming Soon",
    color: "bg-muted text-muted-foreground border-border",
  },
};

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  const params: { lang: string; slug: string }[] = [];
  for (const slug of slugs) {
    params.push({ lang: "en", slug });
    params.push({ lang: "he", slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = await getProjectBySlug(slug, lang);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      type: "website",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as "en" | "he");
  const t = createTranslator(dict);
  const project = await getProjectBySlug(slug, lang);

  if (!project) notFound();

  const Icon = iconMap[project.icon];
  const status = statusConfig[project.status];
  const relatedPosts = await getPostsByTag(project.id);

  return (
    <div className="py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <ScrollReveal>
          <Link
            href={`/${lang}/projects`}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:ltr:-translate-x-1 group-hover:rtl:translate-x-1 rtl:-scale-x-100 transition-transform" />
            {t("projects.backToProjects")}
          </Link>
        </ScrollReveal>

        {/* Project Header */}
        <ScrollReveal delay={0.1}>
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${project.color}`}
              >
                <Icon className="h-6 w-6 text-white/90" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {project.name}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
            </div>
            <div
              className={`h-1 rounded-full bg-gradient-to-r ${project.color} mb-6`}
            />
            <p className="text-muted-foreground text-lg leading-relaxed">
              {project.longDescription}
            </p>
          </header>
        </ScrollReveal>

        {/* Features */}
        <ScrollReveal delay={0.2}>
          <section className="mb-10">
            <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
              {t("projects.features")}
            </h2>
            <ul className="space-y-3">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>

        {/* Technologies */}
        <ScrollReveal delay={0.25}>
          <section className="mb-10">
            <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
              {t("projects.technologies")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-secondary/80 text-muted-foreground border border-border/40"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Action Buttons */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap items-center gap-3 mb-10 pt-6 border-t border-border/30">
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t("projects.visitProject")}
              <ExternalLink className="h-4 w-4" />
            </Link>
            {/* {project.docsUrl && (
              <Link
                href={project.docsUrl}
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/50 text-foreground font-medium rounded-lg border border-border/40 hover:bg-secondary hover:border-border transition-colors"
              >
                <FileText className="h-4 w-4" />
                {t("projects.viewDocs")}
              </Link>
            )} */}
          </div>
        </ScrollReveal>

        {/* Related Blog Posts */}
        {relatedPosts.length > 0 && (
          <ScrollReveal delay={0.35}>
            <section className="mb-10 pt-6 border-t border-border/30">
              <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
                {t("projects.relatedPosts")}
              </h2>
              <div className="space-y-3">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/${lang}/blog/${post.slug}`}
                    className="group flex items-center justify-between p-4 rounded-lg bg-card border border-border/40 hover:border-primary/20 transition-all"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {lang === "he" && post.titleHe
                          ? post.titleHe
                          : post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lang === "he" && post.excerptHe
                          ? post.excerptHe
                          : post.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 rtl:-scale-x-100 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Footer nav */}
        <ScrollReveal delay={0.4}>
          <div className="pt-8 border-t border-border/30">
            <Link
              href={`/${lang}/projects`}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:ltr:-translate-x-1 group-hover:rtl:translate-x-1 rtl:-scale-x-100 transition-transform" />
              {t("projects.backToProjects")}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
