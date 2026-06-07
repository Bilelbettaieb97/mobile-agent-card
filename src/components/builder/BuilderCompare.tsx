import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Star, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { StepHeader } from "@/components/builder/StepHeader";
import { THEMES_BY_ID, type Profession } from "@/lib/card-themes";
import { buildPreviewCard, VARIANTS, type VariantId } from "@/lib/profession-personas";
import type { CardData } from "@/lib/card-types";

interface Props {
  profession: Profession;
  onBack: () => void;
  onChoose: (variant: VariantId, data: CardData) => void;
}

export function BuilderCompare({ profession, onBack, onChoose }: Props) {
  const cards = useMemo(
    () => VARIANTS.map((v) => ({ ...v, data: buildPreviewCard(profession, v.id) })),
    [profession],
  );

  const activeTheme = THEMES_BY_ID[profession.themeId];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StepHeader
        step={2}
        title="Choisissez votre mise en page"
        subtitle={`3 façons de présenter votre carte ${profession.label}. La Vitrine active toutes les briques — vous pourrez désactiver ce qui ne sert pas.`}
      />

      <div className="mx-auto max-w-7xl px-5 pb-10">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Changer de métier
          </Button>
        </div>



        {/* Halo */}
        <div className="relative">
          <div
            className="absolute inset-x-0 -top-10 h-[400px] -z-10 blur-3xl opacity-25 pointer-events-none"
            style={{ background: activeTheme.palette.gradient }}
            aria-hidden
          />

          {/* Grid desktop, snap-carousel mobile */}
          <div className="overflow-x-auto overflow-y-visible -mx-5 lg:mx-0 lg:overflow-visible">
            <div
              role="radiogroup"
              aria-label="Choisir une mise en page"
              className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-6 px-5 lg:px-0 py-4 snap-x snap-mandatory lg:snap-none items-end"
            >
              {cards.map((v) => {
                const isVitrine = v.id === "vitrine";
                return (
                  <article
                    key={v.id}
                    className={`snap-center shrink-0 lg:shrink w-[300px] lg:w-auto flex flex-col items-center gap-4 rounded-3xl p-4 lg:p-5 transition ${
                      isVitrine
                        ? "bg-primary/5 border border-primary/30 ring-1 ring-primary/30 lg:scale-[1.04]"
                        : "bg-card border border-border"
                    }`}
                  >
                    {/* Badge */}
                    <div className="h-7 flex items-center">
                      {isVitrine ? (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-medium text-primary-foreground bg-primary px-2.5 py-1 rounded-full">
                          <Star className="h-3 w-3" strokeWidth={2.5} aria-hidden /> Recommandée
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {v.id === "essentielle" ? "Sobre" : "Crédibilité"}
                        </span>
                      )}
                    </div>

                    {/* Titre */}
                    <div className="text-center">
                      <div className="font-display text-lg">{v.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{v.hint}</div>
                    </div>

                    {/* Phone preview */}
                    <div className="origin-top">
                      <div className="scale-[0.88] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-100 -mx-4">
                        <PhoneFrame>
                          <BusinessCard data={v.data} />
                        </PhoneFrame>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      size="lg"
                      variant={isVitrine ? "default" : "outline"}
                      onClick={() => onChoose(v.id, v.data)}
                      className={`w-full h-12 text-base ${isVitrine ? "shadow-[var(--shadow-glow)]" : ""}`}
                    >
                      <Check className="h-4 w-4 mr-1.5" />
                      Choisir cette mise en page
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>

                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
