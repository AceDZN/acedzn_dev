import "server-only";
import fs from "fs";
import path from "path";

export interface CvRole {
  title: string;
  note?: string;
  start: string;
  end: string;
  highlights: string[];
}

export interface CvExperience {
  company: string;
  description?: string;
  url?: string;
  location: string;
  start: string;
  end: string;
  roles: CvRole[];
  tech?: string[];
}

export interface Cv {
  name: string;
  headline: string;
  jobTitle: string;
  location: string;
  email: string;
  linkedin: string;
  pdf: string;
  updated: string;
  summary: string;
  skills: { label: string; items: string[] }[];
  experience: CvExperience[];
  earlier: { company: string; title: string; period: string }[];
  education: string[];
  languages: string[];
}

const CV_FILE = path.join(process.cwd(), "data", "cv.json");

export async function getCv(): Promise<Cv> {
  return JSON.parse(fs.readFileSync(CV_FILE, "utf-8"));
}

// The PDF is exported from the Google Doc and dropped into public/ by hand,
// so only link to it once it exists.
export function hasCvPdf(cv: Cv): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", cv.pdf));
}
