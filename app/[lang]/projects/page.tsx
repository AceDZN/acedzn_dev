import { getDictionary } from "../../../lib/dictionary";
import { createTranslator } from "@/lib/i18n";
import { getAllProjects } from "../../../lib/projects";
import { ProjectCard } from "../../../components/project-card";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "../../../components/scroll-reveal";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "he" ? "פרויקטים" : "Projects",
    description:
      lang === "he" ? "כלים ואפליקציות שבניתי" : "Tools and apps I've built",
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "he");
  const t = createTranslator(dict);
  const projects = await getAllProjects(lang);

  return (
    <div className="py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <ScrollReveal>
          <span className="text-sm font-mono text-primary uppercase tracking-wider">
            {t("projects.label")}
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mt-4 mb-4">
            {t("projects.title")}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            {t("projects.subtitle")}
          </p>
        </ScrollReveal>

        {/* Projects Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {projects.map((project, index) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} index={index} lang={lang} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Coming Soon */}
        <ScrollReveal delay={0.3}>
          <div className="text-center p-10 rounded-xl border border-dashed border-border/60 bg-secondary/20">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-lg">+</span>
            </div>
            <p className="text-muted-foreground font-medium mb-1">
              {t("projects.comingSoon")}
            </p>
            <p className="text-muted-foreground/60 text-sm">
              {t("projects.comingSoonDesc")}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
