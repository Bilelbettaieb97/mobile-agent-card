import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Check, ChevronDown, Lock, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { StepHeader } from "@/components/builder/StepHeader";
import { StepFooter } from "@/components/builder/StepFooter";
import { THEMES_BY_ID } from "@/lib/card-themes";
import type { CardData, BrickId } from "@/lib/card-types";
import { renderBrickBody } from "@/components/builder/bricks";
import {
  VARIANTS,
  PLAN_LABEL,
  SECTION_TIER,
  isSectionAllowed,
  planRank,
  type VariantId,
  type GatedSectionKey,
} from "@/lib/profession-personas";

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

function sectionTier(key: SectionKey): VariantId {
  return SECTION_TIER[key as GatedSectionKey] ?? "essentielle";
}

function sectionAllowed(plan: VariantId, key: SectionKey): boolean {
  return isSectionAllowed(plan, key as GatedSectionKey);
}

interface Props {
  step: "essentials" | "extras";
  data: CardData;
  setData: (d: CardData) => void;
  update: <K extends keyof CardData>(k: K, v: CardData[K]) => void;
  plan: VariantId;
  setPlan: (p: VariantId) => void;
  completedThrough: import("./StepHeader").StepNum;
  onGoToStep: (n: import("./StepHeader").StepNum) => void;
  onBack: () => void;
  onNext: () => void;
}

export function BuilderSections({ step, data, setData, update, plan, setPlan, completedThrough, onGoToStep, onBack, onNext }: Props) {
  const isEssentials = step === "essentials";
  const defs = isEssentials
    ? ESSENTIALS
    : [...EXTRAS].sort((a, b) => planRank(sectionTier(a.key)) - planRank(sectionTier(b.key)));

  const [openSet, setOpenSet] = useState<Set<SectionKey>>(() => {
    const s = new Set<SectionKey>();
    if (isEssentials) s.add("identity");
    for (const d of defs) if (isEnabled(data, d.key)) s.add(d.key);
    return s;
  });

  /** Quelle section est en train de proposer un upgrade (mini-modale inline). */
  const [pendingUpgrade, setPendingUpgrade] = useState<SectionKey | null>(null);

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

  const upgradeAndActivate = (key: SectionKey) => {
    const tier = sectionTier(key);
    setPlan(tier);
    // Si on monte de plan, on active la section directement.
    setData(applyToggle(data, key, true));
    setOpenSet((prev) => new Set(prev).add(key));
    setPendingUpgrade(null);
    const label = defs.find((d) => d.key === key)?.label ?? "Section";
    toast.success(`Plan passé à ${PLAN_LABEL[tier]}. ${label} activée.`);
  };

  const changePlan = (next: VariantId) => {
    if (next === plan) return;
    // Désactive automatiquement les sections au-dessus du nouveau plan
    let nextData = data;
    if (planRank(next) < planRank(plan)) {
      const toDisable: SectionKey[] = [
        ...ESSENTIALS.map((d) => d.key),
        ...EXTRAS.map((d) => d.key),
      ];
      for (const k of toDisable) {
        if (!sectionAllowed(next, k) && isEnabled(nextData, k)) {
          nextData = applyToggle(nextData, k, false);
        }
      }
    }
    setData(nextData);
    setPlan(next);
    toast.success(`Plan passé à ${PLAN_LABEL[next]}.`);
  };

  const activeTheme = THEMES_BY_ID[data.accent] ?? THEMES_BY_ID.gold;

  // Compteur : sections actives / sections incluses dans le plan
  const allDefs = [...ESSENTIALS, ...EXTRAS];
  const allowedDefs = allDefs.filter((d) => sectionAllowed(plan, d.key));
  const activeAllowed = allowedDefs.filter((d) => isEnabled(data, d.key)).length;
  const totalAllowed = allowedDefs.length;

  const stepNum: 3 | 4 = isEssentials ? 3 : 4;
  const heading = isEssentials ? "Remplissez les sections essentielles" : "Ajoutez des sections complémentaires";
  const intro = isEssentials
    ? "Ce que toute carte de visite digitale doit contenir. Activez et remplissez les champs — l'aperçu se met à jour en direct."
    : "Enrichissez votre carte avec ce qui vous différencie. Les sections grisées nécessitent un plan supérieur.";
  const nextHint = isEssentials
    ? "Après cette étape : ajouter des sections complémentaires."
    : "Après cette étape : personnaliser et activer votre carte.";
  const nextLabel = isEssentials ? "Continuer" : "Personnaliser ma carte";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StepHeader
        step={stepNum}
        title={heading}
        subtitle={intro}
        completedThrough={completedThrough}
        onGoToStep={onGoToStep}
        nextHint={nextHint}
      />


      <div className="mx-auto max-w-7xl px-5 pb-8 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10">
        {/* LEFT — sections list */}
        <section className="flex flex-col min-h-0">

          {/* Bandeau plan actuel — visible uniquement à l'étape 4 */}
          {!isEssentials && (
            <PlanBanner
              plan={plan}
              onChange={changePlan}
              activeCount={activeAllowed}
              totalCount={totalAllowed}
            />
          )}

          <div className="space-y-3 mt-4">
            {defs.map((d) => {
              const checked = isEnabled(data, d.key);
              const locked = d.key === "identity";
              const allowed = sectionAllowed(plan, d.key);
              const tier = sectionTier(d.key);
              const open = openSet.has(d.key) && checked && allowed;
              const upgrading = pendingUpgrade === d.key;

              if (!allowed) {
                return (
                  <LockedSection
                    key={d.key}
                    def={d}
                    requiredPlan={tier}
                    expanded={upgrading}
                    onAskUpgrade={() => setPendingUpgrade(upgrading ? null : d.key)}
                    onConfirmUpgrade={() => upgradeAndActivate(d.key)}
                  />
                );
              }

              return (
                <div
                  key={d.key}
                  className={`rounded-2xl border bg-card overflow-hidden transition ${
                    checked ? "border-primary/40" : "border-border"
                  }`}
                >
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

                  {open && (
                    <div className="px-4 pb-5 pt-1 border-t border-border/60">
                      {renderBrickBody(d.brick, { data, update })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6" />

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

      <StepFooter
        step={stepNum}
        onBack={onBack}
        onNext={onNext}
        nextLabel={nextLabel}
        centerInfo={`Plan ${PLAN_LABEL[plan]} — ${activeAllowed} / ${totalAllowed} sections actives`}
      />
    </main>
  );
}

/* ---------------- Plan banner ---------------- */

function planIcon(p: VariantId) {
  if (p === "vitrine") return <Crown className="h-3.5 w-3.5" />;
  if (p === "pro") return <Zap className="h-3.5 w-3.5" />;
  return <Check className="h-3.5 w-3.5" />;
}

function PlanBanner({
  plan, onChange, activeCount, totalCount,
}: {
  plan: VariantId;
  onChange: (p: VariantId) => void;
  activeCount: number;
  totalCount: number;
}) {
  const nextPlan: VariantId | null = plan === "essentielle" ? "pro" : plan === "pro" ? "vitrine" : null;
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3 flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/15 border border-primary/30 rounded-full px-2.5 py-1">
        {planIcon(plan)} Plan : {PLAN_LABEL[plan]}
      </span>
      <span className="text-xs text-muted-foreground">
        <span className="text-foreground font-medium">{activeCount} / {totalCount}</span> sections débloquées
        {nextPlan && (
          <> — passez à <span className="text-primary font-medium">{PLAN_LABEL[nextPlan]}</span> pour plus</>
        )}
      </span>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Changer de plan <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Choisir un plan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={plan} onValueChange={(v) => onChange(v as VariantId)}>
              {VARIANTS.map((v) => (
                <DropdownMenuRadioItem key={v.id} value={v.id} className="flex-col items-start gap-0.5 py-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                    {planIcon(v.id)} {v.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground pl-5">{v.hint}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/* ---------------- Locked section ---------------- */

function LockedSection({
  def, requiredPlan, expanded, onAskUpgrade, onConfirmUpgrade,
}: {
  def: SectionDef;
  requiredPlan: VariantId;
  expanded: boolean;
  onAskUpgrade: () => void;
  onConfirmUpgrade: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 overflow-hidden transition">
      <button
        type="button"
        onClick={onAskUpgrade}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/30 transition"
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0 opacity-70">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium">{def.label}</span>
            <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-primary bg-primary/10 border border-primary/30 px-1.5 py-0.5 rounded">
              {planIcon(requiredPlan)} {PLAN_LABEL[requiredPlan]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{def.description}</p>
        </div>
        <div className="shrink-0 pt-0.5">
          <span className="h-7 w-7 rounded-full bg-muted text-muted-foreground grid place-items-center">
            <Lock className="h-3.5 w-3.5" />
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-border/60 bg-background/40">
          <p className="text-sm">
            <span className="font-medium">« {def.label} »</span> fait partie du plan{" "}
            <span className="text-primary font-medium">{PLAN_LABEL[requiredPlan]}</span>.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Passez à {PLAN_LABEL[requiredPlan]} pour activer cette section. Vous pourrez aussi débloquer les autres sections de ce plan.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={onConfirmUpgrade}>
              {planIcon(requiredPlan)}
              <span className="ml-1.5">Passer à {PLAN_LABEL[requiredPlan]} et activer</span>
            </Button>
            <Button size="sm" variant="ghost" onClick={onAskUpgrade}>Annuler</Button>
          </div>
        </div>
      )}
    </div>
  );
}
