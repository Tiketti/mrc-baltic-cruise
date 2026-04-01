import { ChevronDown } from "lucide-react";

interface HeroIntroProps {
  tagline: string;
  blurb: string;
  details: { label: string; value: string }[];
  ctaText?: string;
  ctaHref?: string;
}

export const HeroIntro = ({
  tagline,
  blurb,
  details,
  ctaText,
  ctaHref,
}: HeroIntroProps) => (
  <section className="flex flex-col items-center px-8 text-center">
    <h2 className="text-accent">{tagline}</h2>
    <p className="mt-4 max-w-xl text-lg">{blurb}</p>

    <div className="mt-8 flex flex-col gap-4 md:flex-row md:gap-12">
      {details.map(({ label, value }) => (
        <div key={label}>
          <span className="font-[windsor] text-sm uppercase tracking-widest">
            {label}
          </span>
          <p className="mt-1 text-lg">{value}</p>
        </div>
      ))}
    </div>

    {ctaText && ctaHref && (
      <a
        href={ctaHref}
        className="mt-8 inline-flex items-center gap-1 border-surface border-b text-lg hover:border-accent"
      >
        {ctaText}
        <ChevronDown className="h-4 w-4" />
      </a>
    )}
  </section>
);
