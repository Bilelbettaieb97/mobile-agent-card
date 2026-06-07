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

const SECTION_FLAGS: (keyof CardData)[] = [
  "vcardEnabled", "statsEnabled", "aboutEnabled", "videoEnabled",
  "servicesEnabled", "listingsEnabled", "testimonialsEnabled",
  "calendarEnabled", "languagesEnabled", "ctaEnabled",
  "contactEnabled", "socialsEnabled",
];

function countSections(data: CardData): number {
  return SECTION_FLAGS.reduce((n, k) => n + (data[k] ? 1 : 0), 0);
}

const VARIANT_BULLETS: Record<VariantId, string[]> = {
  essentielle: [
    "Identité + contact rapide",
    "Ajout au répertoire (vCard)",
    "À propos court",
  ],
  vitrine: [
    "Tout d'Essentielle + Pro",
    "Services, témoignages, galerie",
    "Réseaux, agenda, langues",
  ],
  pro: [
    "Essentielle + crédibilité",
    "Témoignages & certifications",
    "Réseaux pro",
  ],
};

export function BuilderCompare({ profession, onBack, onChoose }: Props) {
  const cards = useMemo(
    () => VARIANTS.map((v) => {
      const data = buildPreviewCard(profession, v.id);
      return { ...v, data, sectionCount: countSections(data) };
    }),
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Layers className="h-4 w-4 text-primary shrink-0" />
            La différence entre les 3 mises en page&nbsp;: <span className="text-foreground font-medium">le nombre de sections activées</span>. Vous pourrez tout ajuster ensuite.
          </p>
          <Button variant="ghost" size="sm" onClick={onBack} className="self-end sm:self-auto">
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

                    {/* Titre + nombre de sections */}
                    <div className="text-center">
                      <div className="font-display text-lg">{v.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{v.hint}</div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                        <Layers className="h-3 w-3" /> {v.sectionCount} sections incluses
                      </div>
                    </div>

                    {/* Puces différenciantes */}
                    <ul className="w-full space-y-1.5 text-xs text-foreground/80">
                      {VARIANT_BULLETS[v.id].map((b) => (
                        <li key={b} className="flex items-start gap-1.5">
                          <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Phone preview */}
                    <div className="origin-top">
                      <div className="scale-[0.88] lg:scale-[0.75] xl:scale-[0.85] 2xl:scale-100 -mx-4">
                        <PhoneFrame scrollHint>
                          <BusinessCard data={v.data} />
                        </PhoneFrame>
                      </div>
                    </div>

                    {/* Indice scroll */}
                    <div className="-mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <ChevronDown className="h-3 w-3 animate-bounce" />
                      Faites défiler l'aperçu
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
