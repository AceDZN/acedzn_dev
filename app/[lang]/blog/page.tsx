import Link from "next/link";
import { getDictionary } from "../../../lib/dictionary";
import { createTranslator } from "@/lib/i18n";
import { getAllPosts, getAllTags } from "../../../lib/blog";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "../../../components/scroll-reveal";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "he" ? "בלוג" : "Blog",
    description:
      lang === "he"
        ? "מחשבות ורשימות על פיתוח ווב"
        : "Thoughts and notes about web development",
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { lang } = await params;
  const { tag: activeTag } = await searchParams;
  const dict = await getDictionary(lang as "en" | "he");
  const t = createTranslator(dict);
  const allPosts = await getAllPosts();
  const allTags = await getAllTags();

  const posts = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts;

  return (
    <div className="py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <ScrollReveal>
          <span className="text-sm font-mono text-primary uppercase tracking-wider">
            {t("blog.label")}
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mt-4 mb-4">
            {t("blog.title")}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="text-muted-foreground text-lg mb-8">
            {t("blog.subtitle")}
          </p>
        </ScrollReveal>

        {/* Tags */}
        {allTags.length > 0 && (
          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap gap-2 mb-10">
              <Link
                href={`/${lang}/blog`}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  !activeTag
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-secondary/50 text-muted-foreground border border-border/40 hover:text-foreground"
                }`}
              >
                {t("blog.allPosts")}
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/${lang}/blog?tag=${tag}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    activeTag === tag
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-secondary/50 text-muted-foreground border border-border/40 hover:text-foreground"
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Posts */}
        {posts.length === 0 ? (
          <ScrollReveal delay={0.2}>
            <div className="text-center py-20">
              <p className="text-muted-foreground">{t("blog.noPosts")}</p>
            </div>
          </ScrollReveal>
        ) : (
          <StaggerContainer className="space-y-4">
            {posts.map((post) => (
              <StaggerItem key={post.slug}>
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="group block p-6 rounded-xl bg-card border border-border/40 hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <time className="text-xs font-mono text-muted-foreground">
                          {new Date(post.date).toLocaleDateString(
                            lang === "he" ? "he-IL" : "en-US",
                            { year: "numeric", month: "long", day: "numeric" },
                          )}
                        </time>
                        <span className="text-xs text-muted-foreground/40">
                          &bull;
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {post.readTime} {t("blog.readTime")}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {lang === "he" && post.titleHe
                          ? post.titleHe
                          : post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {lang === "he" && post.excerptHe
                          ? post.excerptHe
                          : post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-secondary/60 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 rtl:-scale-x-100 transition-all flex-shrink-0 mt-2" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
