import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StepNum } from "./StepHeader";
import { STEPS } from "./StepHeader";

interface Props {
  step: StepNum;
  onBack?: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  /** Affiche un message ou rien à la place du bouton Continuer (ex. étape 2). */
  nextSlot?: ReactNode;
  /** Info contextuelle au centre (compteur de sections, plan, etc.). */
  centerInfo?: ReactNode;
}

/** Barre d'action sticky en bas du viewport. Identique sur les 5 étapes du builder. */
export function StepFooter({
  step, onBack, backLabel = "Retour", onNext, nextLabel = "Continuer",
  nextDisabled, nextSlot, centerInfo,
}: Props) {
  const stepLabel = STEPS.find((s) => s.n === step)?.label ?? "";
  return (
    <>
      {/* Espace pour que le contenu ne soit pas caché par la barre fixe */}
      <div aria-hidden className="h-24" />

      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            {onBack ? (
              <Button variant="ghost" onClick={onBack} className="h-10">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Button>
            ) : <span />}
          </div>

          <div className="hidden md:flex flex-col items-center text-center min-w-0 px-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Étape {step} / 5 — {stepLabel}
            </span>
            {centerInfo && (
              <span className="text-xs text-foreground/80 mt-0.5 truncate max-w-[40ch]">
                {centerInfo}
              </span>
            )}
          </div>

          <div className="flex-1 flex justify-end min-w-0">
            {nextSlot ?? (
              onNext && (
                <Button
                  size="lg"
                  onClick={onNext}
                  disabled={nextDisabled}
                  className="h-11 text-sm sm:text-base shadow-[var(--shadow-glow)]"
                >
                  {nextLabel}
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
