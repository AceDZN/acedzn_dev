"use client";
/* eslint-disable @next/next/no-img-element -- Blog image URLs and dimensions come from authored content. */

import { motion } from "framer-motion";
import type { BlogContentBlock } from "../lib/blog";

function ParagraphBlock({ content }: { content: string }) {
  return (
    <p className="text-foreground/80 leading-relaxed text-[15px]">{content}</p>
  );
}

function HeadingBlock({ content, level }: { content: string; level: number }) {
  const sizes: Record<number, string> = {
    2: "text-2xl font-bold mt-10 mb-4",
    3: "text-xl font-semibold mt-8 mb-3",
    4: "text-lg font-semibold mt-6 mb-2",
  };
  const className = `${sizes[level] || sizes[2]} text-foreground`;

  if (level === 3) return <h3 className={className}>{content}</h3>;
  if (level === 4) return <h4 className={className}>{content}</h4>;
  return <h2 className={className}>{content}</h2>;
}

function CodeBlock({
  content,
  language,
}: {
  content: string;
  language?: string;
}) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border/60 bg-card/80">
      {language && (
        <div className="flex items-center px-4 py-2 bg-secondary/50 border-b border-border/40">
          <span className="text-xs font-mono text-muted-foreground">
            {language}
          </span>
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-foreground/90 leading-relaxed">
          {content}
        </code>
      </pre>
    </div>
  );
}

function ImageBlock({
  src,
  alt,
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  return (
    <figure className="my-8">
      <div className="rounded-xl overflow-hidden border border-border/40">
        <img src={src} alt={alt || ""} className="w-full" loading="lazy" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function QuoteBlock({ content, author }: { content: string; author?: string }) {
  return (
    <blockquote className="my-6 border-s-2 border-primary/40 ps-4 py-1">
      <p className="text-foreground/70 italic text-[15px]">{content}</p>
      {author && (
        <cite className="block mt-2 text-sm text-muted-foreground not-italic">
          &mdash; {author}
        </cite>
      )}
    </blockquote>
  );
}

function ListBlock({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`my-4 space-y-2 ${ordered ? "list-decimal" : "list-disc"} list-inside`}
    >
      {items.map((item, i) => (
        <li key={i} className="text-foreground/80 text-[15px] leading-relaxed">
          {item}
        </li>
      ))}
    </Tag>
  );
}

function EmbedBlock({
  platform,
  embedUrl,
  embedId,
}: {
  platform?: string;
  embedUrl?: string;
  embedId?: string;
}) {
  if (platform === "twitter" && embedId) {
    return (
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-lg p-4 rounded-xl border border-border/40 bg-secondary/30">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-xs text-muted-foreground">@AceDZN</span>
          </div>
          <a
            href={embedUrl || `https://x.com/AceDZN/status/${embedId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            View on X
          </a>
        </div>
      </div>
    );
  }

  if (platform === "linkedin" && embedUrl) {
    return (
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-lg p-4 rounded-xl border border-border/40 bg-secondary/30">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="text-xs text-muted-foreground">LinkedIn</span>
          </div>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            View on LinkedIn
          </a>
        </div>
      </div>
    );
  }

  return null;
}

export function BlogContentRenderer({
  blocks,
}: {
  blocks: BlogContentBlock[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-4"
    >
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return <ParagraphBlock key={i} content={block.content || ""} />;
          case "heading":
            return (
              <HeadingBlock
                key={i}
                content={block.content || ""}
                level={block.level || 2}
              />
            );
          case "code":
            return (
              <CodeBlock
                key={i}
                content={block.content || ""}
                language={block.language}
              />
            );
          case "image":
            return (
              <ImageBlock
                key={i}
                src={block.src || ""}
                alt={block.alt}
                caption={block.caption}
              />
            );
          case "quote":
            return (
              <QuoteBlock
                key={i}
                content={block.content || ""}
                author={block.author}
              />
            );
          case "list":
            return (
              <ListBlock
                key={i}
                items={block.items || []}
                ordered={block.ordered}
              />
            );
          case "embed":
            return (
              <EmbedBlock
                key={i}
                platform={block.platform}
                embedUrl={block.embedUrl}
                embedId={block.embedId}
              />
            );
          default:
            return null;
        }
      })}
    </motion.div>
  );
}
