import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check, X, Crown, Sparkles, ShieldCheck, Clock, ArrowLeft, Rocket, Gift,
  Star, Users, Coffee, TrendingUp, Calendar,
} from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Activer ma carte — Choisissez votre plan" },
      { name: "description", content: "Activez votre carte de visite digitale dès aujourd'hui. Essai gratuit 7 jours sur le plan Vitrine. Sans engagement." },
    ],
  }),
  component: PricingPage,
});

type Billing = "monthly" | "yearly";

type Plan = {
  id: "essentielle" | "vitrine";
  label: string;
  tagline: string;
  monthly: number;          // monthly base price
  yearlyMonthly: number;    // effective monthly when paying yearly
  oldMonthly?: number;      // strike-through anchor
  trial?: number;
  ctaLabel: (b: Billing) => string;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "essentielle",
    label: "Essentielle",
    tagline: "Le minimum pour être joignable.",
    monthly: 9.8,
    yearlyMonthly: 8.16,    // 2 mois offerts ≈ 9.80 * 10 / 12
    ctaLabel: () => "Choisir Essentielle",
  },
  {
    id: "vitrine",
    label: "Vitrine",
    tagline: "Pour vendre votre savoir-faire et convertir vos visiteurs.",
    monthly: 15.8,
    yearlyMonthly: 13.16,
    oldMonthly: 19.8,
    trial: 7,
    ctaLabel: (b) =>
      b === "yearly" ? "Démarrer — 7 jours gratuits" : "Démarrer 7 jours gratuits",
    highlight: true,
  },
];

const FEATURES: { label: string; essentielle: boolean; vitrine: boolean }[] = [
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

const TESTIMONIALS = [
  { initial: "C", name: "Camille D.", role: "Agent immobilier — Paris", text: "1 seul client signé grâce au QR code = 14 mois d'abonnement remboursés. Aucun regret." },
  { initial: "M", name: "Marc L.", role: "Coach business", text: "J'ai remplacé mes cartes papier en 1 jour. Le dashboard est ultra simple." },
  { initial: "L", name: "Léa B.", role: "Architecte d'intérieur", text: "Les témoignages et le portfolio font toute la différence pour mes prospects." },
];

const FAQ = [
  { q: "Que se passe-t-il après les 7 jours d'essai ?", a: "Vous êtes prélevé du montant du plan choisi. Vous pouvez annuler à tout moment depuis votre dashboard, en 1 clic, avant la fin de l'essai — sans aucun prélèvement." },
  { q: "Puis-je changer de plan plus tard ?", a: "Oui, vous pouvez passer d'Essentielle à Vitrine (ou inversement) à tout moment depuis votre compte. La différence est calculée au prorata." },
  { q: "Mes données sont-elles sauvegardées si j'annule ?", a: "Oui. Votre carte est mise en pause mais conservée 6 mois. Vous pouvez la réactiver à tout moment sans rien re-remplir." },
  { q: "Mon lien public change si je modifie ma carte ?", a: "Non. Votre lien et votre QR code restent identiques à vie, même si vous modifiez vos informations." },
  { q: "Y a-t-il un engagement ?", a: "Aucun. Mensuel ou annuel, vous annulez quand vous voulez. L'annuel offre simplement 2 mois gratuits par rapport au mensuel." },
];

function PricingPage() {
  const [billing, setBilling] = useState<Billing>("yearly");
  const [selected, setSelected] = useState<Plan["id"]>("vitrine");

  const today = new Date();
  const trialEnd = new Date(today);
  trialEnd.setDate(today.getDate() + 7);
  const trialEndLabel = trialEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  const selectedPlan = PLANS.find((p) => p.id === selected)!;
  const dailyCost = (selectedPlan.yearlyMonthly / 30).toFixed(2).replace(".", ",");

  return (
    <main className="min-h-screen bg-background text-foreground pb-32">
      {/* Header */}
      <header className="border-b border-border bg-background/80 sticky top-0 z-30 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
          <Link to="/builder" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Paiement sécurisé · Sans engagement · Satisfait ou remboursé 14 jours
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-4 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium mb-4">
          <Sparkles className="h-3 w-3" /> Plus qu'une étape pour activer votre carte
        </span>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight">
          Choisissez votre plan
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Annulable à tout moment. Vous gardez l'accès à votre dashboard et à toutes vos modifications.
        </p>

        {/* Billing toggle */}
        <div className="mt-6 inline-flex items-center gap-1 p-1 rounded-full border border-border bg-card">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              billing === "monthly" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mensuel
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={`px-4 py-1.5 text-sm rounded-full transition inline-flex items-center gap-2 ${
              billing === "yearly" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annuel
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
              billing === "yearly" ? "bg-emerald-400/30 text-emerald-50" : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
            }`}>
              2 mois offerts
            </span>
          </button>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-5xl px-5 pt-8 pb-6 grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-5 items-stretch">
        {PLANS.map((p) => {
          const isSelected = selected === p.id;
          const isHighlight = !!p.highlight;
          const price = billing === "yearly" ? p.yearlyMonthly : p.monthly;
          const priceStr = price.toFixed(2).replace(".", ",");
          const yearlyTotal = (p.yearlyMonthly * 12).toFixed(2).replace(".", ",");

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className="group relative text-left transition focus:outline-none"
            >
              <Card
                className={`p-6 sm:p-7 h-full transition border-2 ${
                  isSelected
                    ? "border-primary shadow-[var(--shadow-elegant)]"
                    : "border-border hover:border-foreground/20"
                } ${isHighlight ? "bg-gradient-to-br from-primary/[0.06] to-transparent" : "opacity-95"}`}
              >
                <div className="flex items-start justify-between mb-4 gap-3 min-h-[28px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isHighlight && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-1 rounded-full font-medium">
                        <Crown className="h-3 w-3" /> Recommandé · 96% le choisissent
                      </span>
                    )}
                    {p.trial && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full font-medium">
                        <Gift className="h-3 w-3" /> {p.trial}j offerts
                      </span>
                    )}
                  </div>
                  <span
                    className={`h-5 w-5 rounded-full border-2 grid place-items-center transition shrink-0 ${
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                    aria-hidden
                  >
                    {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </div>

                <h2 className={`font-display ${isHighlight ? "text-3xl" : "text-2xl text-muted-foreground"}`}>
                  {p.label}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 mb-5">{p.tagline}</p>

                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  {isHighlight && p.oldMonthly && (
                    <span className="text-muted-foreground line-through text-lg">
                      {p.oldMonthly.toFixed(2).replace(".", ",")} €
                    </span>
                  )}
                  <span className={`font-display tabular-nums ${isHighlight ? "text-5xl" : "text-3xl"}`}>
                    {priceStr}
                  </span>
                  <span className="text-muted-foreground text-sm">€ / mois</span>
                </div>

                <div className="min-h-[36px] text-xs mb-4 space-y-0.5">
                  {billing === "yearly" ? (
                    <div className="text-muted-foreground">
                      Soit <span className="text-foreground font-medium">{yearlyTotal} € / an</span> · facturé une fois
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Facturation mensuelle, sans engagement</div>
                  )}
                  {p.trial ? (
                    <div className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                      <Clock className="h-3 w-3" />
                      Gratuit jusqu'au {trialEndLabel}, puis {priceStr} €/mois
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Paiement immédiat · pas de période d'essai</div>
                  )}
                </div>

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
                      + 7 fonctionnalités exclusives ↓
                    </li>
                  )}
                  {p.id === "essentielle" && (
                    <li className="text-xs text-muted-foreground pl-6">
                      Pas de services, témoignages, portfolio, stats…
                    </li>
                  )}
                </ul>

                <Button
                  className="w-full h-11 text-base"
                  variant={isHighlight ? "default" : "outline"}
                  size={isHighlight ? "lg" : "default"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(p.id);
                  }}
                >
                  {isHighlight && <Rocket className="h-4 w-4 mr-2" />}
                  {p.ctaLabel(billing)}
                </Button>
              </Card>
            </button>
          );
        })}
      </section>

      {/* Value framing */}
      <section className="mx-auto max-w-5xl px-5 pb-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ValueBlock
          icon={<Coffee className="h-4 w-4" />}
          title={`Moins de ${dailyCost} € / jour`}
          desc="Le prix d'un café par semaine pour une carte qui travaille pour vous 24h/24."
        />
        <ValueBlock
          icon={<TrendingUp className="h-4 w-4" />}
          title="1 client = ROI atteint"
          desc="Un seul prospect signé grâce à votre carte rembourse votre année entière."
        />
        <ValueBlock
          icon={<Users className="h-4 w-4" />}
          title="2 400+ pros actifs"
          desc="96% gardent leur abonnement après l'essai. Note moyenne 4,9/5."
        />
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-5 pb-12">
        <h2 className="font-display text-2xl text-center mb-6">Ils ont activé leur carte</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="p-5">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs grid place-items-center font-medium">
                  {t.initial}
                </div>
                <div className="text-xs">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-3xl px-5 pb-12">
        <h2 className="font-display text-xl mb-4 text-center">Comparaison détaillée</h2>
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
                  {f.essentielle ? <Check className="h-4 w-4 text-primary inline" /> : <X className="h-4 w-4 text-muted-foreground/40 inline" />}
                </span>
                <span className="text-center">
                  {f.vitrine ? <Check className="h-4 w-4 text-primary inline" /> : <X className="h-4 w-4 text-muted-foreground/40 inline" />}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 pb-12">
        <h2 className="font-display text-xl mb-4 text-center">Questions fréquentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Trust strip */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-5xl px-5 py-6 grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          <TrustItem icon={<ShieldCheck className="h-4 w-4 text-primary" />} title="Sans engagement" desc="Annulez en 1 clic depuis le dashboard." />
          <TrustItem icon={<Gift className="h-4 w-4 text-primary" />} title="14 jours satisfait ou remboursé" desc="Remboursement intégral, aucune justification." />
          <TrustItem icon={<Clock className="h-4 w-4 text-primary" />} title="Activation immédiate" desc="Lien & QR code prêts en 30 secondes." />
          <TrustItem icon={<Users className="h-4 w-4 text-primary" />} title="Support FR 7j/7" desc="Une vraie équipe basée en France." />
        </div>
      </section>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-5 py-3 flex items-center justify-between gap-3">
          <div className="text-sm min-w-0">
            <div className="truncate">
              <span className="text-muted-foreground">Plan : </span>
              <span className="font-medium">{selectedPlan.label}</span>
              <span className="text-muted-foreground"> · {billing === "yearly" ? "annuel" : "mensuel"}</span>
            </div>
            <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mt-0.5">
              {selected === "vitrine" ? (
                <>
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">0 € aujourd'hui</span>
                  <span>·</span>
                  <Calendar className="h-3 w-3" />
                  <span>1er prélèvement le {trialEndLabel}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Paiement immédiat sécurisé
                </>
              )}
            </div>
          </div>
          <Button size="lg" className="h-12 shadow-[var(--shadow-elegant)] shrink-0">
            {selected === "vitrine" ? (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Activer gratuitement
              </>
            ) : (
              <>Activer ma carte</>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}

function ValueBlock({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="p-4">
      <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-1.5">
        {icon} {title}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </Card>
  );
}

function TrustItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="shrink-0 mt-0.5">{icon}</span>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}
