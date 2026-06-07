import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check, X, Crown, Sparkles, ShieldCheck, Clock, ArrowLeft, Rocket, Gift,
} from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Activer ma carte — Choisissez votre plan" },
      { name: "description", content: "Activez votre carte de visite digitale dès aujourd'hui. Essai gratuit 7 jours sur le plan Vitrine." },
    ],
  }),
  component: PricingPage,
});

type Plan = {
  id: "essentielle" | "vitrine";
  label: string;
  tagline: string;
  monthly: number;
  trial?: number;
  ctaLabel: string;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "essentielle",
    label: "Essentielle",
    tagline: "Pour être joignable et faire bonne impression.",
    monthly: 9.8,
    ctaLabel: "Choisir Essentielle",
  },
  {
    id: "vitrine",
    label: "Vitrine",
    tagline: "Pour vendre votre savoir-faire et convertir vos visiteurs.",
    monthly: 15.8,
    trial: 7,
    ctaLabel: "Démarrer 7 jours gratuits",
    highlight: true,
  },
];

const FEATURES: { label: string; essentielle: boolean | string; vitrine: boolean | string }[] = [
  { label: "Identité, contact, vCard",                essentielle: true,  vitrine: true },
  { label: "Boutons d'action (appel, WhatsApp, email)", essentielle: true, vitrine: true },
  { label: "Bio, badges et certifications",           essentielle: true,  vitrine: true },
  { label: "Lien public + QR code",                   essentielle: true,  vitrine: true },
  { label: "Modifications illimitées",                essentielle: true,  vitrine: true },
  { label: "Services & spécialités",                  essentielle: false, vitrine: true },
  { label: "Témoignages clients",                     essentielle: false, vitrine: true },
  { label: "Réalisations / portfolio",                essentielle: false, vitrine: true },
  { label: "Vidéo de présentation",                   essentielle: false, vitrine: true },
  { label: "Prise de rendez-vous",                    essentielle: false, vitrine: true },
  { label: "Réseaux sociaux & CTA personnalisé",      essentielle: false, vitrine: true },
  { label: "Statistiques de vues & clics",            essentielle: false, vitrine: true },
];

function PricingPage() {
  const [selected, setSelected] = useState<Plan["id"]>("vitrine");
  const diff = (PLANS[1].monthly - PLANS[0].monthly).toFixed(2).replace(".", ",");

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 sticky top-0 z-30 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
          <Link to="/builder" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Paiement sécurisé · Sans engagement
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pt-10 pb-6 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium mb-4">
          <Sparkles className="h-3 w-3" /> Plus qu'une étape pour activer votre carte
        </span>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight">
          Choisissez votre plan
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Annulable à tout moment. Vous gardez l'accès à votre dashboard et à toutes vos modifications.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-5xl px-5 pb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {PLANS.map((p) => {
          const isSelected = selected === p.id;
          const isHighlight = !!p.highlight;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className={`group relative text-left transition focus:outline-none ${
                isHighlight ? "md:-mt-2" : ""
              }`}
            >
              <Card
                className={`p-6 sm:p-7 h-full transition border-2 ${
                  isSelected
                    ? "border-primary shadow-[var(--shadow-elegant)]"
                    : "border-border hover:border-foreground/20"
                } ${isHighlight ? "bg-gradient-to-br from-primary/[0.04] to-transparent" : ""}`}
              >
                {/* Top badges */}
                <div className="flex items-start justify-between mb-4 gap-3 min-h-[28px]">
                  <div className="flex items-center gap-2">
                    {isHighlight && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-1 rounded-full font-medium">
                        <Crown className="h-3 w-3" /> Le plus choisi
                      </span>
                    )}
                    {p.trial && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full font-medium">
                        <Gift className="h-3 w-3" /> {p.trial} jours offerts
                      </span>
                    )}
                  </div>
                  <span
                    className={`h-5 w-5 rounded-full border-2 grid place-items-center transition ${
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                    aria-hidden
                  >
                    {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </div>

                <h2 className="font-display text-2xl">{p.label}</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-5">{p.tagline}</p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-4xl tabular-nums">
                    {p.monthly.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-muted-foreground text-sm">€ / mois</span>
                </div>

                <div className="min-h-[20px] text-xs mb-5">
                  {p.trial ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                      <Clock className="h-3 w-3" />
                      Gratuit pendant {p.trial} jours, puis {p.monthly.toFixed(2).replace(".", ",")} €/mois
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Paiement immédiat — sans période d'essai</span>
                  )}
                </div>

                {/* Top 4 inline features */}
                <ul className="space-y-2 mb-6">
                  {FEATURES.slice(0, 5).map((f) => {
                    const has = p.id === "essentielle" ? f.essentielle : f.vitrine;
                    return (
                      <li key={f.label} className="flex items-start gap-2 text-sm">
                        {has ? (
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                        )}
                        <span className={has ? "" : "text-muted-foreground line-through"}>{f.label}</span>
                      </li>
                    );
                  })}
                  {p.id === "vitrine" && (
                    <li className="text-xs text-primary font-medium pl-6">
                      + 7 fonctionnalités supplémentaires ↓
                    </li>
                  )}
                </ul>

                <Button
                  className="w-full h-11 text-base"
                  variant={isHighlight ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(p.id);
                  }}
                >
                  {isHighlight && <Rocket className="h-4 w-4 mr-2" />}
                  {p.ctaLabel}
                </Button>
              </Card>
            </button>
          );
        })}
      </section>

      {/* Conversion hint */}
      <p className="text-center text-sm text-muted-foreground -mt-4 mb-10 px-5">
        Pour seulement <span className="text-foreground font-medium">+{diff} €/mois</span>, débloquez
        toutes les briques qui font vraiment vendre.{" "}
        <span className="text-primary font-medium">7 jours offerts pour tester.</span>
      </p>

      {/* Comparison table */}
      <section className="mx-auto max-w-3xl px-5 pb-12">
        <h2 className="font-display text-xl mb-4">Comparaison détaillée</h2>
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[1fr_110px_110px] text-xs uppercase tracking-wider text-muted-foreground bg-muted/40 px-4 py-2.5 border-b border-border">
            <span>Fonctionnalité</span>
            <span className="text-center">Essentielle</span>
            <span className="text-center">Vitrine</span>
          </div>
          <ul className="divide-y divide-border">
            {FEATURES.map((f) => (
              <li key={f.label} className="grid grid-cols-[1fr_110px_110px] items-center px-4 py-2.5 text-sm">
                <span>{f.label}</span>
                <span className="text-center">
                  {f.essentielle === true ? (
                    <Check className="h-4 w-4 text-primary inline" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground/40 inline" />
                  )}
                </span>
                <span className="text-center">
                  {f.vitrine === true ? (
                    <Check className="h-4 w-4 text-primary inline" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground/40 inline" />
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Trust strip */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-5xl px-5 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Sans engagement</div>
              <div className="text-xs text-muted-foreground">Annulez en un clic depuis votre dashboard.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Activation immédiate</div>
              <div className="text-xs text-muted-foreground">Votre lien et QR code sont prêts en moins de 30 secondes.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Gift className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">7 jours gratuits</div>
              <div className="text-xs text-muted-foreground">Sur l'offre Vitrine. Aucun prélèvement avant la fin de l'essai.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky bottom CTA */}
      <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-5 py-3 flex items-center justify-between gap-3">
          <div className="text-sm min-w-0 truncate">
            <span className="text-muted-foreground">Plan sélectionné : </span>
            <span className="font-medium">{PLANS.find((p) => p.id === selected)?.label}</span>
            {selected === "vitrine" && (
              <span className="ml-2 text-emerald-700 dark:text-emerald-400 text-xs">· 7 jours gratuits</span>
            )}
          </div>
          <Button size="lg" className="h-11 shadow-[var(--shadow-elegant)]">
            {selected === "vitrine" ? (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Activer gratuitement
              </>
            ) : (
              <>
                Activer ma carte
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
