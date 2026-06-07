import { CreditCard, Globe, Nfc, Sparkles, ArrowRight, Check, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface Props {
  variant?: "full" | "compact";
  title?: string;
  subtitle?: string;
}

export function UpsellSection({
  variant = "full",
  title = "Allez plus loin",
  subtitle = "Deux upgrades premium qui transforment votre carte digitale en machine à convertir.",
}: Props) {
  if (variant === "compact") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CompactCard
          icon={Nfc}
          tag="Carte physique NFC"
          title="Votre carte digitale dans votre poche"
          price="dès 29 €"
          gradient="from-amber-500/15 via-amber-500/5 to-transparent"
        />
        <CompactCard
          icon={Globe}
          tag="Site web pro"
          title="Un vrai site vitrine connecté à votre carte"
          price="dès 490 €"
          gradient="from-sky-500/15 via-sky-500/5 to-transparent"
        />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-10">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-primary inline-flex items-center gap-1.5 mb-2">
          <Sparkles className="h-3 w-3" /> Add-ons premium
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* UPSELL 1 — Physical NFC card */}
        <UpsellCard
          tag="Carte physique"
          tagIcon={Nfc}
          gradient="linear-gradient(135deg, oklch(0.88 0.1 90) 0%, oklch(0.75 0.14 75) 100%)"
          glowColor="rgba(234, 179, 8, 0.25)"
          title="Carte NFC connectée"
          subtitle="L'objet premium que vos prospects n'oublieront pas."
          price="29 €"
          priceSuffix="à vie · sans abonnement"
          features={[
            "Approche du smartphone → carte s'ouvre instantanément",
            "Carte en métal ou PVC noir mat — gravée à votre nom",
            "QR code de secours imprimé au dos",
            "Sync automatique : modifiez votre carte, la NFC reste à jour",
            "Livraison France 48h offerte dès 2 cartes",
          ]}
          cta="Commander ma carte"
          ctaSecondary="Voir les modèles"
          highlight="🔥 +84% de prospects sauvegardent un contact reçu via NFC vs carte papier."
          visual={<NFCVisual />}
        />

        {/* UPSELL 2 — Website creation */}
        <UpsellCard
          tag="Site web sur-mesure"
          tagIcon={Globe}
          gradient="linear-gradient(135deg, oklch(0.7 0.18 240) 0%, oklch(0.55 0.2 260) 100%)"
          glowColor="rgba(59, 130, 246, 0.25)"
          title="Site vitrine pro clé en main"
          subtitle="On crée votre site, vous gardez la main."
          price="dès 490 €"
          priceSuffix="livré en 7 jours · paiement en 3×"
          features={[
            "Design sur-mesure — adapté à votre métier",
            "Pages : Accueil, Services, Réalisations, Contact",
            "Connecté à votre carte digitale (lien & QR partagés)",
            "SEO local optimisé — soyez trouvé sur Google Maps",
            "Hébergement & domaine inclus la 1ʳᵉ année",
            "Modifications illimitées les 30 premiers jours",
          ]}
          cta="Réserver un appel découverte"
          ctaSecondary="Voir des exemples"
          highlight="💎 Un site + une carte digitale = la stack complète des indépendants à 100k€+ /an."
          visual={<WebVisual />}
        />
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Ces add-ons sont facturés une fois — pas de surprise sur votre abonnement.
      </p>
    </section>
  );
}

/* ============================================================
   Card
   ============================================================ */

function UpsellCard({
  tag, tagIcon: TagIcon, gradient, glowColor, title, subtitle,
  price, priceSuffix, features, cta, ctaSecondary, highlight, visual,
}: {
  tag: string; tagIcon: any; gradient: string; glowColor: string;
  title: string; subtitle: string; price: string; priceSuffix: string;
  features: string[]; cta: string; ctaSecondary: string;
  highlight: string; visual: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-3xl border border-border bg-gradient-to-br from-card to-card/40 p-6 overflow-hidden transition hover:-translate-y-0.5 hover:border-primary/40">
      {/* glow */}
      <div
        className="absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: glowColor }}
        aria-hidden
      />

      {/* tag */}
      <div className="relative inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium">
        <span className="h-4 w-4 grid place-items-center rounded text-white" style={{ background: gradient }}>
          <TagIcon className="h-2.5 w-2.5" />
        </span>
        {tag}
      </div>

      {/* visual */}
      <div className="relative my-5 h-32 rounded-2xl border border-border overflow-hidden" style={{ background: `linear-gradient(135deg, oklch(0.22 0.02 250), oklch(0.18 0.02 250))` }}>
        <div className="absolute inset-0 grid place-items-center">{visual}</div>
      </div>

      {/* header */}
      <div className="relative">
        <h3 className="font-display text-2xl leading-tight">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>

      {/* price */}
      <div className="relative flex items-baseline gap-2 mt-4 mb-4">
        <span className="font-display text-3xl font-medium" style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {price}
        </span>
        <span className="text-xs text-muted-foreground">{priceSuffix}</span>
      </div>

      {/* features */}
      <ul className="relative space-y-1.5 mb-5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="text-foreground/85">{f}</span>
          </li>
        ))}
      </ul>

      {/* highlight */}
      <div className="relative rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5 text-xs leading-relaxed text-foreground/85 mb-5">
        {highlight}
      </div>

      {/* CTAs */}
      <div className="relative flex flex-col sm:flex-row gap-2">
        <Button className="flex-1 h-11 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-[0_4px_20px_-4px] shadow-primary/40">
          {cta} <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
        <Button variant="outline" className="h-11 sm:flex-none">
          {ctaSecondary}
        </Button>
      </div>
    </div>
  );
}

function CompactCard({ icon: Icon, tag, title, price, gradient }: { icon: any; tag: string; title: string; price: string; gradient: string }) {
  return (
    <button className={`group text-left rounded-2xl border border-border bg-gradient-to-br ${gradient} p-4 transition hover:-translate-y-0.5 hover:border-primary/40`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 grid place-items-center rounded-lg bg-background/60 backdrop-blur text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">{tag}</span>
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
      <div className="text-sm font-medium leading-snug mb-1">{title}</div>
      <div className="text-xs text-primary font-medium">{price}</div>
    </button>
  );
}

/* ============================================================
   Visuals
   ============================================================ */

function NFCVisual() {
  return (
    <div className="relative">
      {/* Card mockup */}
      <div className="relative h-20 w-32 rounded-lg border border-amber-500/30 shadow-2xl"
        style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)" }}>
        <div className="absolute inset-2 flex flex-col justify-between">
          <div className="flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-amber-400" />
            <span className="text-[7px] uppercase tracking-wider text-amber-400 font-semibold">Ma carte</span>
          </div>
          <div>
            <div className="h-0.5 w-12 bg-amber-400/60 rounded mb-1" />
            <div className="h-0.5 w-8 bg-white/30 rounded" />
          </div>
        </div>
        {/* NFC wave */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
          <div className="h-1 w-1 rounded-full bg-amber-400/80 animate-ping" />
          <div className="h-2 w-2 rounded-full border border-amber-400/60 absolute -right-1 top-1/2 -translate-y-1/2" />
          <div className="h-3 w-3 rounded-full border border-amber-400/40 absolute -right-2 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="absolute -bottom-2 -left-2 text-[8px] text-amber-400/80 font-mono">tap to connect</div>
    </div>
  );
}

function WebVisual() {
  return (
    <div className="relative">
      {/* Browser mockup */}
      <div className="h-24 w-40 rounded-lg border border-sky-500/30 bg-card overflow-hidden shadow-2xl">
        {/* chrome */}
        <div className="h-3 bg-muted/60 flex items-center gap-0.5 px-1">
          <div className="h-1 w-1 rounded-full bg-rose-400/60" />
          <div className="h-1 w-1 rounded-full bg-amber-400/60" />
          <div className="h-1 w-1 rounded-full bg-emerald-400/60" />
        </div>
        {/* content */}
        <div className="p-2 space-y-1">
          <div className="h-1 w-12 rounded bg-sky-400/60" />
          <div className="h-1 w-20 rounded bg-white/20" />
          <div className="grid grid-cols-3 gap-0.5 mt-1.5">
            <div className="h-4 rounded bg-white/10" />
            <div className="h-4 rounded bg-sky-400/30" />
            <div className="h-4 rounded bg-white/10" />
          </div>
          <div className="h-1.5 w-8 rounded bg-sky-400/80 mt-1" />
        </div>
      </div>
      {/* Connection line to card icon */}
      <div className="absolute -bottom-3 -right-3 h-6 w-6 rounded-md border border-sky-500/40 bg-card grid place-items-center">
        <CreditCard className="h-3 w-3 text-sky-400" />
      </div>
      <div className="absolute -top-1.5 -right-1.5">
        <Zap className="h-3 w-3 text-sky-400 fill-sky-400/40" />
      </div>
    </div>
  );
}
