import "server-only";
import fs from "fs";
import path from "path";
import { DICTATION_URL, DOCS_URL, WORKBOOK_URL } from "./constants";

export interface ProjectData {
  id: string;
  slug: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  longDescription: string;
  longDescriptionHe: string;
  url: string | null;
  urlKey: string | null;
  docsUrl: string | null;
  icon: "book" | "mic" | "code" | "layout" | "bot";
  color: string;
  technologies: string[];
  features: string[];
  featuresHe: string[];
  status: "live" | "beta" | "coming-soon";
  tags: string[];
  published: boolean;
  order: number;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  url: string;
  docsUrl?: string;
  icon: "book" | "mic" | "code" | "layout" | "bot";
  color: string;
  technologies: string[];
  features: string[];
  status: "live" | "beta" | "coming-soon";
  tags: string[];
}

const URL_MAP: Record<string, string> = {
  workbook: WORKBOOK_URL,
  dictation: DICTATION_URL,
};

const PROJECTS_DIR = path.join(process.cwd(), "data", "projects");

function resolveUrl(raw: ProjectData): string {
  if (raw.urlKey) {
    const mapped = URL_MAP[raw.urlKey];
    if (mapped) return mapped;
  }
  return raw.url ?? "";
}

function resolveDocsUrl(raw: ProjectData): string | undefined {
  if (!raw.docsUrl) return undefined;
  return `${DOCS_URL}${raw.docsUrl}`;
}

function localizeProject(raw: ProjectData, lang: string): Project {
  const isHe = lang === "he";
  return {
    id: raw.id,
    slug: raw.slug,
    name: isHe ? raw.nameHe : raw.name,
    description: isHe ? raw.descriptionHe : raw.description,
    longDescription: isHe ? raw.longDescriptionHe : raw.longDescription,
    url: resolveUrl(raw),
    docsUrl: resolveDocsUrl(raw),
    icon: raw.icon,
    color: raw.color,
    technologies: raw.technologies,
    features: isHe ? raw.featuresHe : raw.features,
    status: raw.status,
    tags: raw.tags,
  };
}

function loadAllRaw(): ProjectData[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));
  const projects: ProjectData[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf-8");
    const project: ProjectData = JSON.parse(content);
    if (project.published) {
      projects.push(project);
    }
  }

  projects.sort((a, b) => a.order - b.order);
  return projects;
}

export async function getAllProjects(lang: string): Promise<Project[]> {
  const raw = loadAllRaw();
  return raw.map((p) => localizeProject(p, lang));
}

export async function getProjectBySlug(
  slug: string,
  lang: string,
): Promise<Project | null> {
  const raw = loadAllRaw();
  const found = raw.find((p) => p.slug === slug);
  if (!found) return null;
  return localizeProject(found, lang);
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const raw = loadAllRaw();
  return raw.map((p) => p.slug);
}

export async function getProjectsByTag(
  tag: string,
  lang: string,
): Promise<Project[]> {
  const raw = loadAllRaw();
  return raw
    .filter((p) => p.tags.includes(tag))
    .map((p) => localizeProject(p, lang));
}
