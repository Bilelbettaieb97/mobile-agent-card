import { Sparkles } from "lucide-react";

interface Props {
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
}

/** Sticky progress bar + centered step header used across all builder steps. */
export function StepHeader({ step, title, subtitle }: Props) {
  const pct = (step / 5) * 100;
  return (
    <>
      {/* Sticky progress bar */}
      <div className="sticky top-0 z-30 h-1 bg-muted/40 backdrop-blur">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, boxShadow: "0 0 12px var(--ring)" }}
        />
      </div>

      {/* Centered header */}
      <div className="text-center max-w-2xl mx-auto pt-8 pb-6 px-5">
        <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-primary mb-3 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
          <Sparkles className="h-3.5 w-3.5" /> Étape {step} / 5
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-3 leading-tight">{title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
      </div>
    </>
  );
}
