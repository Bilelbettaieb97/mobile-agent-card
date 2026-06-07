import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Nfc, Sparkles, Check, ArrowRight, Zap, Shield, Smartphone,
  Crown, Star, Quote, ChevronDown, Infinity as InfinityIcon,
  Leaf, Truck, Award, Hexagon, Play, X, Flame, MapPin, RefreshCw,
  ShieldCheck, PackageCheck, Clock, BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export const Route = createFileRoute("/carte-nfc")({
  head: () => ({
    meta: [
      { title: "Carte NFC — Votre carte digitale dans votre poche" },
      {
        name: "description",
        content:
          "La carte physique premium connectée à votre profil digital. Un geste, un tap, un contact sauvegardé. L'objet qui transforme votre première impression.",
      },
      { property: "og:title", content: "Carte NFC — L'objet qui vous fait passer pro" },
      {
        property: "og:description",
        content:
          "Approchez. Tap. Connecté. La carte qui remplace papier, scan QR et présentations maladroites.",
      },
    ],
  }),
  component: NfcLandingPage,
});

function NfcLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <SocialProofBar />
      <ProblemSection />
      <HowItWorks />
      <Models />
      <FeatureGrid />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </div>
  );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 grid place-items-center shadow-[0_4px_20px_-4px_rgba(234,179,8,0.5)]">
            <Hexagon className="h-3.5 w-3.5 text-black" />
          </span>
          <span className="font-display text-sm tracking-tight">Ma carte · NFC</span>
        </Link>
        <Button asChild size="sm" className="h-9 bg-gradient-to-br from-amber-400 to-amber-600 text-black hover:from-amber-300 hover:to-amber-500 shadow-[0_4px_20px_-4px_rgba(234,179,8,0.5)]">
          <a href="#commander">Commander · 29 €</a>
        </Button>
      </div>
    </header>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero() {
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTapped(true);
      setTimeout(() => setTapped(false), 1800);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, rgba(234,179,8,0.4) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)" }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-400 mb-6">
            <Sparkles className="h-3 w-3" /> Édition limitée 2026
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
            La carte qui<br />
            <span
              className="italic"
              style={{
                background: "linear-gradient(135deg, oklch(0.92 0.13 90), oklch(0.7 0.18 60))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              change tout
            </span>
            <br />en un geste.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
            Approchez votre carte d'un smartphone. <strong className="text-foreground">Votre profil s'ouvre instantanément.</strong> Pas d'app à installer. Pas de scan. Juste vous, prêt à marquer les esprits.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="h-14 px-7 text-base bg-gradient-to-br from-amber-400 to-amber-600 text-black hover:from-amber-300 hover:to-amber-500 shadow-[0_10px_40px_-10px_rgba(234,179,8,0.6)]">
              <a href="#commander">
                Commander ma carte <ArrowRight className="h-4 w-4 ml-1.5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-7 text-base">
              <a href="#how">Voir comment ça marche</a>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Livraison 48h</div>
            <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Garantie à vie</div>
            <div className="flex items-center gap-1.5"><InfinityIcon className="h-3.5 w-3.5" /> Pas d'abonnement</div>
          </div>
        </div>

        {/* RIGHT — Card visual */}
        <div className="relative h-[480px] flex items-center justify-center perspective-[1200px]">
          {/* Phone mockup behind */}
          <div className="absolute right-4 top-12 h-72 w-40 rounded-[28px] border border-border bg-card shadow-2xl rotate-[8deg] overflow-hidden">
            <div className="h-full p-2.5">
              <div className="h-full rounded-[20px] bg-gradient-to-br from-zinc-900 to-zinc-800 p-3 flex flex-col">
                <div className="h-1 w-8 rounded-full bg-white/20 mx-auto mb-3" />
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mx-auto mb-2" />
                <div className="text-center">
                  <div className="text-[10px] font-medium text-white">Alex Martin</div>
                  <div className="text-[8px] text-white/50">Designer · Paris</div>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="h-5 rounded-md bg-white/5" />
                  <div className="h-5 rounded-md bg-white/5" />
                  <div className="h-5 rounded-md bg-amber-400/20 border border-amber-400/40" />
                </div>
              </div>
            </div>
            {/* Notification slide */}
            <div
              className={`absolute top-3 left-2 right-2 rounded-xl bg-black/80 backdrop-blur border border-white/10 p-2 transition-all duration-500 ${
                tapped ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded bg-amber-400/80 grid place-items-center">
                  <Nfc className="h-2.5 w-2.5 text-black" />
                </div>
                <div className="text-[8px] text-white">macarte.app/alex</div>
              </div>
            </div>
          </div>

          {/* The card */}
          <div
            className="relative h-56 w-[22rem] rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] -rotate-6 hover:rotate-0 transition-transform duration-700"
            style={{
              background:
                "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
              border: "1px solid rgba(234,179,8,0.2)",
            }}
          >
            {/* Sheen */}
            <div
              className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 30%, rgba(234,179,8,0.15) 50%, transparent 70%)",
              }}
            />
            {/* Embossed logo */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <Hexagon className="h-4 w-4 text-amber-400" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400/80 font-semibold">
                Ma carte
              </span>
            </div>
            {/* NFC chip */}
            <div className="absolute top-5 right-5 h-8 w-10 rounded-md border border-amber-400/30 grid place-items-center"
              style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))" }}>
              <Nfc className="h-4 w-4 text-amber-400" />
            </div>
            {/* Engraved name */}
            <div className="absolute bottom-6 left-5 right-5">
              <div
                className="font-display text-2xl tracking-wide"
                style={{
                  background: "linear-gradient(180deg, #f5e4a0 0%, #c9a84c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Alex Martin
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                macarte.app/alex
              </div>
            </div>
            {/* QR back hint */}
            <div className="absolute bottom-5 right-5 h-10 w-10 rounded-md border border-white/10 grid grid-cols-3 gap-px p-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={`rounded-sm ${[0, 2, 4, 6, 8].includes(i) ? "bg-white/40" : "bg-white/10"}`} />
              ))}
            </div>
          </div>

          {/* NFC waves */}
          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none ${tapped ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
            <div className="absolute h-20 w-20 rounded-full border border-amber-400/60 -translate-x-1/2 -translate-y-1/2 animate-ping" />
            <div className="absolute h-32 w-32 rounded-full border border-amber-400/40 -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDelay: "0.2s" }} />
            <div className="absolute h-44 w-44 rounded-full border border-amber-400/20 -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SOCIAL PROOF BAR
   ============================================================ */
function SocialProofBar() {
  return (
    <section className="border-y border-border/50 bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { v: "12 400+", l: "cartes en circulation" },
          { v: "4.9/5", l: "sur 1 200 avis vérifiés" },
          { v: "+84%", l: "de contacts sauvegardés" },
          { v: "0 €", l: "d'abonnement à vie" },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-2xl md:text-3xl tracking-tight">{s.v}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PROBLEM
   ============================================================ */
function ProblemSection() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 md:py-28">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-3">Le constat</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight leading-tight">
          Vous avez la carte digitale.<br />
          <span className="text-muted-foreground">Il vous manque le geste.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-border bg-card/40 p-6">
          <div className="text-xs uppercase tracking-wider text-rose-400 mb-3">Sans carte NFC</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              "Vous dictez votre URL en bruyante terrasse",
              "On vous demande de répéter — trois fois",
              "Le prospect note sur un coin de serviette",
              "48h plus tard, il a déjà oublié votre nom",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-rose-400">✕</span> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="text-xs uppercase tracking-wider text-amber-400 mb-3 relative">Avec carte NFC</div>
          <ul className="space-y-3 text-sm relative">
            {[
              "Vous sortez la carte. Silence. Tout le monde regarde.",
              "Un tap. Le profil s'ouvre sur son écran.",
              "Il enregistre votre contact en un swipe.",
              "Vous venez de gagner un client — pas une carte oubliée.",
            ].map((t) => (
              <li key={t} className="flex gap-2 text-foreground/90">
                <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS
   ============================================================ */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Vous commandez", d: "Choisissez votre modèle. Personnalisez le nom. On grave, on imprime, on expédie sous 48h.", icon: Truck },
    { n: "02", t: "Vous tapez", d: "Approchez la carte d'un smartphone. Votre profil s'ouvre — pas d'app, pas de scan, juste la magie NFC.", icon: Smartphone },
    { n: "03", t: "Ils se souviennent", d: "Le contact est sauvegardé en un geste. Vous restez à jour automatiquement, à vie.", icon: Star },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-20 md:py-28 border-t border-border/50">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-3">3 étapes</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">C'est aussi simple que ça.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {steps.map((s, i) => (
          <div key={s.n} className="relative rounded-2xl border border-border bg-card/40 p-6 hover:border-amber-500/40 hover:-translate-y-1 transition">
            <div className="flex items-center justify-between mb-5">
              <span className="font-display text-5xl text-muted-foreground/30">{s.n}</span>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 grid place-items-center">
                <s.icon className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <h3 className="font-display text-xl mb-2">{s.t}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            {i < steps.length - 1 && (
              <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   MODELS
   ============================================================ */
function Models() {
  const models = [
    {
      name: "Onyx",
      mat: "PVC noir mat",
      price: "29 €",
      desc: "L'essentiel. Sobre, élégant, indestructible.",
      bg: "linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%)",
      accent: "text-white/80",
      popular: false,
    },
    {
      name: "Aurum",
      mat: "Métal brossé · gravé laser",
      price: "59 €",
      desc: "L'objet qui fait dire 'wow'. Le plus commandé.",
      bg: "linear-gradient(135deg, #1a1a1a 0%, #2a2419 50%, #0d0d0d 100%)",
      accent: "text-amber-400",
      popular: true,
    },
    {
      name: "Carbone",
      mat: "Fibre carbone tissée",
      price: "79 €",
      desc: "Ultra-léger. Texture tactile. Édition limitée.",
      bg: "linear-gradient(135deg, #0a0a0a 0%, #161616 100%)",
      accent: "text-zinc-300",
      popular: false,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28 border-t border-border/50">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-3">3 modèles</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">Choisissez votre signature.</h2>
        <p className="text-muted-foreground mt-3">Tous gravés à votre nom. Tous connectés à votre carte digitale.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {models.map((m) => (
          <div
            key={m.name}
            className={`relative rounded-3xl border ${m.popular ? "border-amber-500/40" : "border-border"} bg-card/40 p-6 hover:-translate-y-1 transition group`}
          >
            {m.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-black shadow-[0_4px_20px_-4px_rgba(234,179,8,0.6)]">
                <Crown className="h-3 w-3" /> le + commandé
              </div>
            )}
            <div
              className="h-40 rounded-2xl border border-white/5 mb-5 relative overflow-hidden grid place-items-center"
              style={{ background: m.bg }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)" }}
              />
              <div className={`font-display text-3xl tracking-wider ${m.accent} group-hover:scale-105 transition-transform`}>
                {m.name}
              </div>
              <Nfc className={`absolute bottom-3 right-3 h-4 w-4 ${m.accent}`} />
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-display text-2xl">{m.name}</h3>
              <span className="font-display text-2xl text-amber-400">{m.price}</span>
            </div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{m.mat}</p>
            <p className="text-sm text-foreground/80 mb-5">{m.desc}</p>
            <Button asChild className="w-full bg-gradient-to-br from-amber-400 to-amber-600 text-black hover:from-amber-300 hover:to-amber-500">
              <a href="#commander">Choisir {m.name}</a>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   FEATURE GRID
   ============================================================ */
function FeatureGrid() {
  const features = [
    { icon: Zap, t: "Tap instantané", d: "0,3 sec entre le tap et l'ouverture du profil. Plus rapide qu'un QR." },
    { icon: InfinityIcon, t: "Sync à vie", d: "Modifiez votre carte digitale, la NFC suit. Aucune réimpression." },
    { icon: Smartphone, t: "Compatible 100%", d: "iPhone (Xs+) et Android. Aucune app requise côté visiteur." },
    { icon: Shield, t: "Garantie 5 ans", d: "Puce et carte garanties. Casse accidentelle remplacée à prix coûtant." },
    { icon: Leaf, t: "Éco-responsable", d: "PVC recyclé · métal sans terre rare · packaging 100% carton FSC." },
    { icon: Award, t: "Fabriqué en UE", d: "Atelier Lyon · gravure laser maison · QC manuel sur chaque carte." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28 border-t border-border/50">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-3">Pourquoi notre carte</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">Pensée comme un objet pro.<br />Pas comme un gadget.</h2>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.t} className="rounded-2xl border border-border bg-card/40 p-5 hover:border-amber-500/30 transition">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 grid place-items-center mb-4">
              <f.icon className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="font-medium mb-1.5">{f.t}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */
function Testimonials() {
  const reviews = [
    { name: "Camille R.", role: "Photographe · Marseille", q: "J'ai signé 3 mariages en 2 semaines juste avec la carte. L'effet wow est réel — les gens demandent où je l'ai eue avant même de regarder mon portfolio." },
    { name: "Théo M.", role: "Consultant · Paris", q: "Plus jamais de papier. Mes prospects me retrouvent à 100%. ROI atteint dès le 2ème client signé." },
    { name: "Inès D.", role: "Architecte d'intérieur", q: "Le modèle Aurum est devenu un sujet de conversation à chaque RDV. Mes confrères en sont jaloux 😏" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28 border-t border-border/50">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">Ils sont passés pro.</h2>
        <p className="text-muted-foreground mt-3">1 200+ avis vérifiés · 4.9/5 moyenne</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {reviews.map((r) => (
          <div key={r.name} className="rounded-2xl border border-border bg-card/40 p-6 hover:border-amber-500/30 transition">
            <Quote className="h-6 w-6 text-amber-400/40 mb-3" />
            <p className="text-sm leading-relaxed text-foreground/90 mb-5">"{r.q}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 grid place-items-center text-black font-medium text-sm">
                {r.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PRICING / ORDER
   ============================================================ */
function Pricing() {
  return (
    <section id="commander" className="relative mx-auto max-w-5xl px-5 py-20 md:py-28 border-t border-border/50">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(234,179,8,0.4) 0%, transparent 70%)" }} />
      </div>

      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-3">Commander</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">Un seul paiement.<br />Une carte à vie.</h2>
      </div>

      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-card to-card/40 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="grid md:grid-cols-2 gap-10 items-center relative">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-400 mb-3">À partir de</div>
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="font-display text-7xl tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #f5e4a0 0%, #c9a84c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                29€
              </span>
              <span className="text-sm text-muted-foreground">à vie · 0 abonnement</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Carte NFC gravée à votre nom",
                "Sync auto avec votre profil digital",
                "QR code de secours imprimé au dos",
                "Garantie 5 ans · Sync à vie",
                "Livraison France 48h offerte dès 2 cartes",
                "Satisfait ou remboursé 30 jours",
              ].map((t) => (
                <li key={t} className="flex gap-2.5 text-sm">
                  <Check className="h-5 w-5 text-amber-400 shrink-0" /> <span>{t}</span>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="w-full h-14 text-base bg-gradient-to-br from-amber-400 to-amber-600 text-black hover:from-amber-300 hover:to-amber-500 shadow-[0_10px_40px_-10px_rgba(234,179,8,0.6)]">
              <a href="#">Commander ma carte · 29 € <ArrowRight className="h-4 w-4 ml-1.5" /></a>
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">Paiement sécurisé · CB, Apple Pay, Google Pay</p>
          </div>

          <div className="relative h-72 grid place-items-center">
            <div
              className="h-48 w-72 rounded-2xl shadow-[0_30px_80px_-20px_rgba(234,179,8,0.4)] rotate-3"
              style={{
                background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
                border: "1px solid rgba(234,179,8,0.3)",
              }}
            >
              <div className="absolute inset-0 rounded-2xl"
                style={{ background: "linear-gradient(105deg, transparent 30%, rgba(234,179,8,0.12) 50%, transparent 70%)" }} />
              <div className="p-5 h-full flex flex-col justify-between relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hexagon className="h-4 w-4 text-amber-400" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400/80 font-semibold">Ma carte</span>
                  </div>
                  <Nfc className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <div
                    className="font-display text-xl"
                    style={{
                      background: "linear-gradient(180deg, #f5e4a0 0%, #c9a84c 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Votre nom ici
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">macarte.app/vous</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ
   ============================================================ */
function FAQ() {
  const items = [
    { q: "Comment ça marche sans app ?", a: "La technologie NFC est intégrée nativement dans tous les smartphones modernes (iPhone Xs+, Android récents). Un simple tap suffit : votre profil s'ouvre dans le navigateur, instantanément." },
    { q: "Et si je change de métier ou de coordonnées ?", a: "Aucun souci. Vous modifiez votre carte digitale dans le dashboard, la NFC se met à jour automatiquement. Vous gardez la même carte physique à vie." },
    { q: "Combien de temps pour la recevoir ?", a: "48h après validation de votre design pour la France métropolitaine. 3-5j ouvrés pour l'UE. Livraison offerte dès 2 cartes." },
    { q: "Puis-je commander pour mon équipe ?", a: "Oui — tarif dégressif dès 5 cartes (-15%), 10 cartes (-25%). Contactez-nous pour les volumes 50+." },
    { q: "Est-ce vraiment sans abonnement ?", a: "Confirmé. Vous payez la carte une fois, elle fonctionne à vie. Votre carte digitale reste sur votre plan actuel — gratuit ou payant, vous décidez." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 md:py-28 border-t border-border/50">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-3">Questions</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">On vous a vu venir.</h2>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left rounded-2xl border border-border bg-card/40 hover:border-amber-500/30 transition p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium">{it.q}</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </div>
            <div
              className={`grid transition-all duration-300 ${
                open === i ? "grid-rows-[1fr] mt-3 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sm text-muted-foreground leading-relaxed">{it.a}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA
   ============================================================ */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border/50">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(234,179,8,0.15) 0%, transparent 70%)",
          }} />
      </div>
      <div className="mx-auto max-w-4xl px-5 py-24 md:py-32 text-center">
        <Sparkles className="h-8 w-8 text-amber-400 mx-auto mb-6 animate-pulse" />
        <h2 className="font-display text-5xl md:text-7xl tracking-tight leading-[0.95]">
          C'est juste ça<br />
          <span
            className="italic"
            style={{
              background: "linear-gradient(135deg, #f5e4a0, #c9a84c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            qui vous manque.
          </span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          Le détail qui fait basculer un prospect en client. L'objet qui dit "je suis pro" avant même que vous ouvriez la bouche.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="h-14 px-8 text-base bg-gradient-to-br from-amber-400 to-amber-600 text-black hover:from-amber-300 hover:to-amber-500 shadow-[0_10px_40px_-10px_rgba(234,179,8,0.6)]">
            <a href="#commander">Commander ma carte · 29 € <ArrowRight className="h-4 w-4 ml-1.5" /></a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base">
            <Link to="/dashboard">Retour au dashboard</Link>
          </Button>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          Livraison 48h · Satisfait ou remboursé 30j · Garantie 5 ans
        </p>
      </div>
    </section>
  );
}
