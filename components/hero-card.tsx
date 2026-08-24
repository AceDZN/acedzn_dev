import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FigurineMount } from "./figurine-mount";

interface HeroCardProps {
  lang: string;
  headlineLead: string;
  headlineAccent: string;
  bio: string;
  ctaConnect: string;
  ctaWork: string;
  imageAlt: string;
}

export function HeroCard({
  headlineLead,
  headlineAccent,
  bio,
  ctaConnect,
  imageAlt,
}: HeroCardProps) {
  return (
    <section className="relative px-6 sm:px-10 pt-10 pb-14 md:pt-14 md:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-[1fr_1.15fr] gap-6 md:gap-10 items-center">
          <div className="relative order-2 md:order-1 max-w-xl">
            <h1 className="text-[40px] sm:text-5xl lg:text-[56px] font-bold tracking-tight text-ink leading-[1.1]">
              {headlineLead}{" "}
              <span className="text-primary">{headlineAccent}</span>
              <span className="text-ink">.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-ink-soft leading-relaxed max-w-md">
              {bio}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-ink text-background font-medium rounded-lg hover:bg-ink/90 transition-colors cursor-pointer"
              >
                {ctaConnect}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform" />
              </a>
              {/* <Link
                href={`/${lang}/projects`}
                prefetch
                className="group inline-flex items-center gap-2 text-ink font-medium hover:text-primary transition-colors cursor-pointer"
              >
                {ctaWork}
                <ArrowRight className="h-4 w-4 rtl:-scale-x-100 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform" />
              </Link> */}
            </div>
          </div>

          <div className="relative order-1 md:order-2 flex justify-center md:justify-end">
            <div
              className="relative w-full max-w-[640px] md:max-w-none md:w-[min(100%,680px)] aspect-[1/1] md:aspect-[4/5]"
              role="img"
              aria-label={imageAlt}
            >
              <Image
                src="/hero-background.png"
                alt=""
                aria-hidden="true"
                fill
                priority
                sizes="(min-width: 1280px) 680px, (min-width: 768px) 55vw, 90vw"
                className="object-contain pointer-events-none select-none"
              />
              <div className="absolute inset-0">
                <FigurineMount />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
