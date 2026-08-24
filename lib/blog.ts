import "server-only";
import fs from "fs";
import path from "path";

export interface BlogContentBlock {
  type: "paragraph" | "heading" | "code" | "image" | "quote" | "list" | "embed";
  content?: string;
  level?: number;
  language?: string;
  src?: string;
  alt?: string;
  caption?: string;
  author?: string;
  items?: string[];
  ordered?: boolean;
  platform?: "twitter" | "linkedin";
  embedUrl?: string;
  embedId?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleHe?: string;
  date: string;
  tags: string[];
  excerpt: string;
  excerptHe?: string;
  readTime: number;
  content: BlogContentBlock[];
  contentHe?: BlogContentBlock[];
  published: boolean;
}

const BLOG_DIR = path.join(process.cwd(), "data", "blog");

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"));
  const posts: BlogPost[] = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const post: BlogPost = JSON.parse(content);
    if (post.published) {
      posts.push(post);
    }
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.includes(tag));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
