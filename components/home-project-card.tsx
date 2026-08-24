import Link from "next/link";
import { ArrowRight, Book, Mic, Code, Layout, Bot } from "lucide-react";
import type { Project } from "../lib/projects";

const iconMap = {
  book: Book,
  mic: Mic,
  code: Code,
  layout: Layout,
  bot: Bot,
};

export function HomeProjectCard({
  project,
  lang,
  ctaLabel,
}: {
  project: Project;
  lang: string;
  ctaLabel: string;
}) {
  const Icon = iconMap[project.icon];
  const href = project.url || `/${lang}/projects/${project.slug}`;
  const isExternal = href.startsWith("http");

  return (
    <article className="group rounded-2xl bg-card border border-border/60 overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
      <div
        className={`relative h-36 bg-gradient-to-br ${project.color} flex items-center justify-center`}
      >
        <Icon className="h-12 w-12 text-white/95" strokeWidth={1.5} />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-ink mb-2">{project.name}</h3>
        <p className="text-sm text-ink-soft leading-relaxed mb-5">
          {project.description}
        </p>
        <Link
          href={href}
          prefetch={!isExternal}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100 group-hover/link:ltr:translate-x-1 group-hover/link:rtl:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
