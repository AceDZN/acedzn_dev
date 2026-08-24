"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Book, Mic, Code, Layout, Bot } from "lucide-react";
import type { Project } from "../lib/projects";

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

export function ProjectCard({
  project,
  index = 0,
  lang = "en",
}: {
  project: Project;
  index?: number;
  lang?: string;
}) {
  const Icon = iconMap[project.icon];
  const status = statusConfig[project.status];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-xl overflow-hidden bg-card border border-border/60 hover:border-primary/30 transition-all duration-300"
    >
      {/* Gradient top bar */}
      <div className={`h-1 bg-gradient-to-r ${project.color}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg bg-gradient-to-br ${project.color} bg-opacity-10`}
            >
              <Icon className="h-5 w-5 text-white/90" />
            </div>
            <div>
              <Link href={`/${lang}/projects/${project.slug}`}>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
              </Link>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.color}`}
              >
                {status.label}
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-secondary/80 text-muted-foreground border border-border/40"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/40">
          <Link
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors border border-primary/20"
          >
            <span>Launch</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          {/* {project.docsUrl && (
            <Link
              href={project.docsUrl}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary/50 text-muted-foreground text-sm font-medium rounded-lg hover:text-foreground hover:bg-secondary transition-colors border border-border/40"
            >
              Docs
            </Link>
          )} */}
        </div>
      </div>
    </motion.article>
  );
}
