import {
  Code,
  Users,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface PillarItem {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export function Pillars({ items }: { items: PillarItem[] }) {
  return (
    <section className="px-6 sm:px-10 py-14 md:py-20 border-t border-border/60">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {items.map(({ title, description, Icon }) => (
            <div key={title}>
              <div className="w-10 h-10 flex items-center justify-center mb-5">
                <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-bold text-ink mb-2">{title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const PILLAR_ICONS = {
  Code,
  Users,
  GraduationCap,
  Sparkles,
};
