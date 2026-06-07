import { useMemo, useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { THEMES_BY_ID } from "@/lib/card-themes";
import type { CardData } from "@/lib/card-types";

type EnabledKey =
  | "vcardEnabled"
  | "statsEnabled"
  | "aboutEnabled"
  | "videoEnabled"
  | "servicesEnabled"
  | "listingsEnabled"
  | "testimonialsEnabled"
  | "calendarEnabled"
  | "languagesEnabled"
  | "ctaEnabled"
  | "contactEnabled"
  | "socialsEnabled";

interface SectionDef {
  key: EnabledKey | "actions" | "identity";
  label: string;
  description: string;
  recommended?: boolean;
}

const ESSENTIALS: SectionDef[] = [
  { key: "identity", label: "Identité", description: "Nom, titre, photo et couverture — toujours visible.", recommended: true },
  { key: "contactEnabled", label: "Contact", description: "Téléphone, email et site web — l'essentiel pour être joignable.", recommended: true },
  { key: "actions", label: "Boutons d'action", description: "Appeler, WhatsApp, email, site — accès rapide en un tap.", recommended: true },
  { key: "vcardEnabled", label: "Ajouter au répertoire (vCard)", description: "Un bouton pour s'enregistrer dans les contacts.", recommended: true },
  { key: "aboutEnabled", label: "À propos", description: "Bio courte et badges de certification.", recommended: true },
];

const EXTRAS: SectionDef[] = [
  { key: "servicesEnabled", label: "Services", description: "Liste de vos prestations ou spécialités." },
  { key: "statsEnabled", label: "Chiffres clés", description: "Années d'expérience, projets, note clients." },
  { key: "listingsEnabled", label: "Réalisations / biens", description: "Vitrine visuelle de vos projets ou produits." },
  { key: "testimonialsEnabled", label: "Témoignages", description: "Avis clients pour rassurer." },
  { key: "videoEnabled", label: "Vidéo de présentation", description: "Une vidéo YouTube intégrée." },
  { key: "calendarEnabled", label: "Prise de rendez-vous", description: "Lien Calendly ou équivalent." },
  { key: "ctaEnabled", label: "Bannière d'appel à l'action", description: "Message + bouton pour convertir." },
  { key: "languagesEnabled", label: "Langues parlées", description: "Pratique pour un public international." },
  { key: "socialsEnabled", label: "Réseaux sociaux", description: "LinkedIn, Instagram, WhatsApp public." },
];

interface Props {
  step: "essentials" | "extras";
  data: CardData;
  onBack: () => void;
  onConfirm: (next: CardData) => void;
}

export function BuilderSections({ step, data, onBack, onConfirm }: Props) {
  const isEssentials = step === "essentials";
  const defs = isEssentials ? ESSENTIALS : EXTRAS;

  // Local toggle state, seeded from current data
  const initial = useMemo(() => {
    const m: Record<string, boolean> = {};
    for (const d of defs) {
      if (d.key === "identity") m[d.key] = true;
      else if (d.key === "actions") {
        m[d.key] = data.actions.call || data.actions.whatsapp || data.actions.email || data.actions.website;
      } else {
        m[d.key] = Boolean(data[d.key as EnabledKey]);
      }
    }
    return m;
  }, [defs, data]);

  const [toggles, setToggles] = useState<Record<string, boolean>>(initial);

  const previewData = useMemo<CardData>(() => {
    const next: CardData = { ...data };
    for (const d of defs) {
      if (d.key === "identity") continue;
      if (d.key === "actions") {
        if (!toggles[d.key]) next.actions = { call: false, whatsapp: false, email: false, website: false };
        else next.actions = data.actions.call || data.actions.whatsapp || data.actions.email || data.actions.website
          ? data.actions
          : { call: true, whatsapp: true, email: true, website: true };
        continue;
      }
      (next as unknown as Record<string, boolean>)[d.key] = toggles[d.key];
    }
    return next;
  }, [data, defs, toggles]);

  const activeTheme = THEMES_BY_ID[data.accent] ?? THEMES_BY_ID.gold;

  const handleNext = () => onConfirm(previewData);

  const total = Object.values(toggles).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-8 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 min-h-screen">
        {/* LEFT */}
        <section className="flex flex-col min-h-0">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Étape {isEssentials ? "2" : "3"} / 3
            </p>
            <h1 className="font-display text-4xl mb-2">
              {isEssentials ? "Les sections essentielles" : "Sections complémentaires"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEssentials
                ? "Ce que toute carte de visite digitale doit contenir. Activées par défaut — vous pouvez ajuster."
                : "Enrichissez votre carte avec ce qui vous différencie. Activez seulement ce qui est utile."}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[62vh] lg:max-h-none">
            {defs.map((d) => {
              const checked = toggles[d.key];
              const locked = d.key === "identity";
              return (
                <label
                  key={d.key}
                  className={`flex items-start gap-3 rounded-xl border p-4 transition cursor-pointer ${
                    checked
                      ? "border-primary/60 bg-primary/5"
                      : "border-border hover:border-foreground/30 bg-background"
                  } ${locked ? "opacity-90 cursor-default" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium">{d.label}</span>
                      {d.recommended && (
                        <span className="text-[9px] uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          Recommandé
                        </span>
                      )}
                      {locked && (
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          Obligatoire
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{d.description}</p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    {locked ? (
                      <Check className="h-5 w-5 text-primary" strokeWidth={3} />
                    ) : (
                      <Switch
                        checked={checked}
                        onCheckedChange={(v) => setToggles((t) => ({ ...t, [d.key]: v }))}
                      />
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Retour
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {total} section{total > 1 ? "s" : ""} active{total > 1 ? "s" : ""}
              </span>
              <Button size="lg" onClick={handleNext}>
                {isEssentials ? "Continuer" : "Personnaliser ma carte"}
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </section>

        {/* RIGHT preview */}
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-[0.18em] text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Aperçu live
              </p>
              <span className="text-[10px] text-muted-foreground">Met à jour à chaque toggle</span>
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-40 transition-all duration-500"
                style={{ background: activeTheme.palette.gradient }}
                aria-hidden
              />
              <PhoneFrame>
                <BusinessCard data={previewData} />
              </PhoneFrame>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
