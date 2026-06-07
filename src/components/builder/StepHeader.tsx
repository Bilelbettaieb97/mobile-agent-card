import { Check, ArrowRight } from "lucide-react";

export type StepNum = 1 | 2 | 3 | 4;

export const STEPS: { n: StepNum; label: string }[] = [
  { n: 1, label: "Métier" },
  { n: 2, label: "Essentiels" },
  { n: 3, label: "Sections en plus" },
  { n: 4, label: "Finition" },
];

interface Props {
  step: StepNum;
  title: string;
  subtitle: string;
  /** Étape la plus avancée déjà atteinte — les puces ≤ à cette valeur sont cliquables. */
  completedThrough: StepNum;
  /** Permet de revenir à une étape précédente en cliquant sur sa puce. */
  onGoToStep?: (n: StepNum) => void;
  /** Une ligne discrète qui explique ce qui vient après. */
  nextHint?: string;
}

/** Stepper cliquable sticky + titre/sous-titre centrés. Utilisé sur les 5 étapes du builder. */
export function StepHeader({ step, title, subtitle, completedThrough, onGoToStep, nextHint }: Props) {
  return (
    <>
      {/* Sticky stepper */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3">
          <ol className="flex items-center justify-between gap-1 sm:gap-2">
            {STEPS.map((s, idx) => {
              const isActive = s.n === step;
              const isDone = s.n < step || s.n <= completedThrough;
              const isPast = s.n < step;
              const clickable = !!onGoToStep && s.n <= completedThrough && !isActive;
              return (
                <li key={s.n} className="flex-1 flex items-center min-w-0">
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => clickable && onGoToStep?.(s.n)}
                    className={`flex flex-col items-center gap-1 min-w-0 flex-1 group ${clickable ? "cursor-pointer" : "cursor-default"}`}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Étape ${s.n} : ${s.label}${isActive ? " (en cours)" : isDone ? " (terminée)" : ""}`}
                  >
                    <span
                      className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full grid place-items-center text-[11px] sm:text-xs font-semibold border transition shrink-0 ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow)]"
                          : isPast
                            ? "bg-primary/15 text-primary border-primary/40 group-hover:bg-primary/25"
                            : isDone
                              ? "bg-primary/10 text-primary border-primary/30 group-hover:bg-primary/20"
                              : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {isPast ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.n}
                    </span>
                    <span
                      className={`text-[10px] sm:text-[11px] truncate max-w-full leading-tight ${
                        isActive ? "text-foreground font-medium" : "text-muted-foreground"
                      } hidden xs:block sm:block`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <span
                      className={`h-px flex-1 mx-1 sm:mx-2 -mt-4 sm:-mt-5 ${
                        s.n < step ? "bg-primary/40" : "bg-border"
                      }`}
                      aria-hidden
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Centered header */}
      <div className="text-center max-w-2xl mx-auto pt-6 sm:pt-8 pb-5 sm:pb-6 px-5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-primary mb-2.5">
          Étape {step} sur 4
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-3 leading-tight">{title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
        {nextHint && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 border border-border rounded-full px-3 py-1">
            <ArrowRight className="h-3 w-3" /> {nextHint}
          </p>
        )}
      </div>
    </>
  );
}
