import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "../../../../lib/dictionary";
import { createTranslator } from "@/lib/i18n";
import { getPostBySlug, getAllPosts } from "../../../../lib/blog";
import { BlogContentRenderer } from "../../../../components/blog-content-renderer";
import { ScrollReveal } from "../../../../components/scroll-reveal";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const params: { lang: string; slug: string }[] = [];
  for (const post of posts) {
    params.push({ lang: "en", slug: post.slug });
    params.push({ lang: "he", slug: post.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = lang === "he" && post.titleHe ? post.titleHe : post.title;
  const description =
    lang === "he" && post.excerptHe ? post.excerptHe : post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as "en" | "he");
  const t = createTranslator(dict);
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const title = lang === "he" && post.titleHe ? post.titleHe : post.title;
  const content =
    lang === "he" && post.contentHe ? post.contentHe : post.content;

  return (
    <div className="py-16 px-4 sm:px-6">
      <article className="mx-auto max-w-2xl">
        {/* Back link */}
        <ScrollReveal>
          <Link
            href={`/${lang}/blog`}
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:ltr:-translate-x-1 group-hover:rtl:translate-x-1 rtl:-scale-x-100 transition-transform" />
            {t("blog.backToBlog")}
          </Link>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal delay={0.1}>
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <time className="text-sm font-mono text-muted-foreground">
                {new Date(post.date).toLocaleDateString(
                  lang === "he" ? "he-IL" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </time>
              <span className="text-sm text-muted-foreground/40">&bull;</span>
              <span className="text-sm text-muted-foreground">
                {post.readTime} {t("blog.readTime")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
              {title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/${lang}/blog?tag=${tag}`}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-secondary/60 text-muted-foreground hover:text-primary transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </header>
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal delay={0.2}>
          <div className="border-t border-border/30 pt-8">
            <BlogContentRenderer blocks={content} />
          </div>
        </ScrollReveal>

        {/* Footer nav */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 pt-8 border-t border-border/30">
            <Link
              href={`/${lang}/blog`}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:ltr:-translate-x-1 group-hover:rtl:translate-x-1 rtl:-scale-x-100 transition-transform" />
              {t("blog.backToBlog")}
            </Link>
          </div>
        </ScrollReveal>
      </article>
    </div>
  );
}
