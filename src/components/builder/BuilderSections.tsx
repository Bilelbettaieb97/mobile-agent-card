import { useMemo, useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { THEMES_BY_ID } from "@/lib/card-themes";
import type { CardData, BrickId } from "@/lib/card-types";
import { renderBrickBody } from "@/components/builder/bricks";

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

type SectionKey = EnabledKey | "actions" | "identity";

interface SectionDef {
  key: SectionKey;
  /** BrickId to render the inline edit form. */
  brick: BrickId;
  label: string;
  description: string;
  recommended?: boolean;
}

const ESSENTIALS: SectionDef[] = [
  { key: "identity",       brick: "identity", label: "Identité",                       description: "Nom, titre, photo et couverture — toujours visible.",                 recommended: true },
  { key: "contactEnabled", brick: "contact",  label: "Contact",                        description: "Téléphone, email et site web — l'essentiel pour être joignable.",     recommended: true },
  { key: "actions",        brick: "actions",  label: "Boutons d'action",               description: "Appeler, WhatsApp, email, site — accès rapide en un tap.",            recommended: true },
  { key: "vcardEnabled",   brick: "vcard",    label: "Ajouter au répertoire (vCard)",  description: "Un bouton pour s'enregistrer dans les contacts.",                     recommended: true },
  { key: "aboutEnabled",   brick: "about",    label: "À propos",                       description: "Bio courte et badges de certification.",                              recommended: true },
];

const EXTRAS: SectionDef[] = [
  { key: "servicesEnabled",     brick: "services",     label: "Services",                     description: "Liste de vos prestations ou spécialités." },
  { key: "statsEnabled",        brick: "stats",        label: "Chiffres clés",                description: "Années d'expérience, projets, note clients." },
  { key: "listingsEnabled",     brick: "listings",     label: "Réalisations / biens",         description: "Vitrine visuelle de vos projets ou produits." },
  { key: "testimonialsEnabled", brick: "testimonials", label: "Témoignages",                  description: "Avis clients pour rassurer." },
  { key: "videoEnabled",        brick: "video",        label: "Vidéo de présentation",        description: "Une vidéo YouTube intégrée." },
  { key: "calendarEnabled",     brick: "calendar",     label: "Prise de rendez-vous",         description: "Lien Calendly ou équivalent." },
  { key: "ctaEnabled",          brick: "cta",          label: "Bannière d'appel à l'action",  description: "Message + bouton pour convertir." },
  { key: "languagesEnabled",    brick: "languages",    label: "Langues parlées",              description: "Pratique pour un public international." },
  { key: "socialsEnabled",      brick: "socials",      label: "Réseaux sociaux",              description: "LinkedIn, Instagram, WhatsApp public." },
];

function isEnabled(data: CardData, key: SectionKey): boolean {
  if (key === "identity") return true;
  if (key === "actions") {
    return data.actions.call || data.actions.whatsapp || data.actions.email || data.actions.website;
  }
  return Boolean(data[key as EnabledKey]);
}

function applyToggle(data: CardData, key: SectionKey, value: boolean): CardData {
  if (key === "identity") return data;
  if (key === "actions") {
    if (!value) return { ...data, actions: { call: false, whatsapp: false, email: false, website: false } };
    const anyOn = data.actions.call || data.actions.whatsapp || data.actions.email || data.actions.website;
    return {
      ...data,
      actions: anyOn ? data.actions : { call: true, whatsapp: true, email: true, website: true },
    };
  }
  return { ...data, [key]: value } as CardData;
}

interface Props {
  step: "essentials" | "extras";
  data: CardData;
  setData: (d: CardData) => void;
  update: <K extends keyof CardData>(k: K, v: CardData[K]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function BuilderSections({ step, data, setData, update, onBack, onNext }: Props) {
  const isEssentials = step === "essentials";
  const defs = isEssentials ? ESSENTIALS : EXTRAS;

  // Which sections are expanded (form visible).
  const [openSet, setOpenSet] = useState<Set<SectionKey>>(() => {
    const s = new Set<SectionKey>();
    if (isEssentials) s.add("identity");
    for (const d of defs) if (isEnabled(data, d.key)) s.add(d.key);
    return s;
  });

  const toggleEnabled = (key: SectionKey, value: boolean) => {
    setData(applyToggle(data, key, value));
    setOpenSet((prev) => {
      const n = new Set(prev);
      if (value) n.add(key);
      else n.delete(key);
      return n;
    });
  };

  const toggleOpen = (key: SectionKey) => {
    setOpenSet((prev) => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });
  };

  const activeTheme = THEMES_BY_ID[data.accent] ?? THEMES_BY_ID.gold;
  const total = defs.filter((d) => isEnabled(data, d.key)).length;

  const stepLabel = isEssentials ? "Étape 3 / 5" : "Étape 4 / 5";
  const heading = isEssentials ? "Les sections essentielles" : "Sections complémentaires";
  const intro = isEssentials
    ? "Ce que toute carte de visite digitale doit contenir. Activez et remplissez les champs — l'aperçu se met à jour en direct."
    : "Enrichissez votre carte avec ce qui vous différencie. Cliquez pour activer, puis remplissez directement.";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 py-8 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10">
        {/* LEFT — sections list with inline forms */}
        <section className="flex flex-col min-h-0">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> {stepLabel}
            </p>
            <h1 className="font-display text-4xl mb-2">{heading}</h1>
            <p className="text-sm text-muted-foreground">{intro}</p>
          </div>

          <div className="space-y-3">
            {defs.map((d) => {
              const checked = isEnabled(data, d.key);
              const locked = d.key === "identity";
              const open = openSet.has(d.key) && checked;
              return (
                <div
                  key={d.key}
                  className={`rounded-2xl border bg-card overflow-hidden transition ${
                    checked ? "border-primary/40" : "border-border"
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-start gap-3 p-4">
                    <button
                      type="button"
                      onClick={() => checked && toggleOpen(d.key)}
                      className="flex-1 min-w-0 text-left disabled:cursor-default"
                      disabled={!checked}
                      aria-expanded={open}
                    >
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
                    </button>

                    <div className="shrink-0 flex items-center gap-2 pt-0.5">
                      {checked && (
                        <button
                          type="button"
                          onClick={() => toggleOpen(d.key)}
                          aria-label={open ? "Replier" : "Déplier"}
                          className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </button>
                      )}
                      {locked ? (
                        <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center">
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </span>
                      ) : (
                        <Switch
                          checked={checked}
                          onCheckedChange={(v) => toggleEnabled(d.key, v)}
                          aria-label={`Activer ${d.label}`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Inline form */}
                  {open && (
                    <div className="px-4 pb-5 pt-1 border-t border-border/60">
                      {renderBrickBody(d.brick, { data, update })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-border flex items-center justify-between gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Retour
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                {total} section{total > 1 ? "s" : ""} active{total > 1 ? "s" : ""}
              </span>
              <Button size="lg" onClick={onNext}>
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
              <span className="text-[10px] text-muted-foreground">Met à jour à chaque saisie</span>
            </div>
            <div className="relative">
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-40 transition-all duration-500"
                style={{ background: activeTheme.palette.gradient }}
                aria-hidden
              />
              <PhoneFrame>
                <BusinessCard data={data} />
              </PhoneFrame>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
