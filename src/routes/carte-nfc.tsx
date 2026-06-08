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
import cardStudio from "@/assets/nfc-card-studio.jpg";
import cardHand from "@/assets/nfc-card-hand.jpg";
import cardMacro from "@/assets/nfc-card-macro.jpg";



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
      <StockBar />
      <Nav />
      <Hero />
      <SocialProofBar />
      <Gallery />
      <VideoSection />
      <ProblemSection />
      <HowItWorks />

      <Configurator />
      <Models />
      <ComparisonTable />
      <FeatureGrid />
      <GuaranteeSection />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <FomoToasts />
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
          <a href="#configurer">Commander · 29 €</a>
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
              <a href="#configurer">
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

        {/* RIGHT — Real product shot */}
        <div className="relative h-[480px] flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img
              src={cardStudio}
              alt="Carte NFC noire avec gravure dorée Alex Martin sur fond studio"
              className="absolute inset-0 h-full w-full object-cover"
              width={1280}
              height={960}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
          {/* NFC waves overlay */}
          <div className={`absolute left-[55%] top-[55%] -translate-x-1/2 -translate-y-1/2 pointer-events-none ${tapped ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
            <div className="absolute h-20 w-20 rounded-full border border-amber-400/60 -translate-x-1/2 -translate-y-1/2 animate-ping" />
            <div className="absolute h-32 w-32 rounded-full border border-amber-400/40 -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDelay: "0.2s" }} />
            <div className="absolute h-44 w-44 rounded-full border border-amber-400/20 -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDelay: "0.4s" }} />
          </div>
          {/* Floating badge */}
          <div className="absolute bottom-5 left-5 rounded-2xl bg-black/70 backdrop-blur-xl border border-amber-400/30 px-3 py-2 flex items-center gap-2 animate-fade-in">
            <div className="h-7 w-7 rounded-lg bg-amber-400 grid place-items-center">
              <Nfc className="h-4 w-4 text-black" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-400/80">Tap & connect</div>
              <div className="text-xs text-white font-medium">macarte.app/alex</div>
            </div>
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
   PRODUCT GALLERY
   ============================================================ */
function Gallery() {
  const shots = [
    {
      src: cardStudio,
      title: "Studio noir",
      caption: "La carte premium, posée comme un objet de statut.",
      alt: "Carte NFC noire gravée sur fond noir en studio",
      featured: true,
    },
    {
      src: cardHand,
      title: "Dans la main",
      caption: "Le geste simple qui remplace les cartes papier.",
      alt: "Carte NFC tenue dans une main près d'un smartphone",
      featured: false,
    },
    {
      src: cardMacro,
      title: "Gravure macro",
      caption: "Finition mate, détail précis, présence immédiate.",
      alt: "Plan macro de la gravure et de la finition d'une carte NFC noire",
      featured: false,
    },
  ];

  return (
    <section className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="max-w-2xl mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3">L'objet, en vrai</p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight tracking-tight">
            Une carte qu'on remarque avant même de la toucher.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:auto-rows-[260px]">
          {shots.map((shot) => (
            <figure
              key={shot.title}
              className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl shadow-primary/10 ${shot.featured ? "md:col-span-2 md:row-span-2" : ""}`}
            >
              <img
                src={shot.src}
                alt={shot.alt}
                loading="lazy"
                width={1280}
                height={960}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">{shot.title}</p>
                <p className="max-w-sm text-sm md:text-base text-foreground/90">{shot.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
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
              <a href="#configurer">Choisir {m.name}</a>
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
              <a href="#configurer">Commander ma carte · 29 € <ArrowRight className="h-4 w-4 ml-1.5" /></a>
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
            <a href="#configurer">Commander ma carte · 29 € <ArrowRight className="h-4 w-4 ml-1.5" /></a>
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

/* ============================================================
   STOCK BAR — sticky urgency
   ============================================================ */
function StockBar() {
  const [stock, setStock] = useState(47);
  useEffect(() => {
    const id = setInterval(() => setStock((s) => (s > 12 ? s - 1 : s)), 38000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-black text-xs font-medium py-2 px-4 text-center relative overflow-hidden">
      <div className="relative flex items-center justify-center gap-2 flex-wrap">
        <Flame className="h-3.5 w-3.5 animate-pulse" />
        <span>Édition Aurum 2026 — <strong>{stock} cartes restantes</strong> · Livraison avant Noël garantie si commande sous 72h</span>
      </div>
    </div>
  );
}

/* ============================================================
   VIDEO SECTION — "le tap en action"
   ============================================================ */
function VideoSection() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 md:py-20">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-3">Vu de l'extérieur</p>
        <h2 className="font-display text-3xl md:text-4xl tracking-tight">Le moment où tout bascule.</h2>
        <p className="text-sm text-muted-foreground mt-2">3 secondes. Pas une de plus.</p>
      </div>
      <button
        onClick={() => setPlaying(true)}
        className="group relative w-full aspect-video rounded-3xl overflow-hidden border border-border bg-card/40 hover:border-amber-500/40 transition"
      >
        {/* Faux video frame */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, oklch(0.22 0.02 250) 0%, oklch(0.12 0.02 250) 100%)" }} />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Subject mock */}
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          <div className="h-32 w-52 rounded-xl rotate-[-8deg] shadow-2xl" style={{ background: "linear-gradient(135deg,#0a0a0a,#1a1a1a)", border: "1px solid rgba(234,179,8,0.3)" }}>
            <div className="p-3 flex justify-between">
              <Hexagon className="h-3 w-3 text-amber-400" />
              <Nfc className="h-3 w-3 text-amber-400" />
            </div>
          </div>
          <div className="h-44 w-24 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 rotate-[5deg] shadow-2xl border border-white/10" />
        </div>
        {/* Play button */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-20 w-20 rounded-full bg-amber-400/90 grid place-items-center group-hover:scale-110 transition shadow-[0_10px_50px_-10px_rgba(234,179,8,0.8)]">
            <Play className="h-8 w-8 text-black fill-black ml-1" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-xs text-white/70 font-mono">▶ tap-to-share.mp4 · 0:03</div>
      </button>
      {playing && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur grid place-items-center p-4" onClick={() => setPlaying(false)}>
          <button onClick={() => setPlaying(false)} className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 grid place-items-center text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
          <div className="aspect-video w-full max-w-4xl rounded-2xl bg-card border border-border grid place-items-center">
            <p className="text-muted-foreground text-sm">Vidéo de démonstration à intégrer ici</p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   CONFIGURATOR — live preview
   ============================================================ */
function Configurator() {
  const [name, setName] = useState("Alex Martin");
  const [model, setModel] = useState<"onyx" | "aurum" | "carbone">("aurum");
  const [ordered, setOrdered] = useState(false);
  const [position, setPosition] = useState<"bas" | "centre">("bas");
  const variant = useMemo(() => ({
    onyx: { bg: "linear-gradient(135deg,#0a0a0a 0%,#1f1f1f 100%)", border: "rgba(255,255,255,0.15)", text: "linear-gradient(180deg,#ffffff,#a3a3a3)", price: "29 €", accent: "text-white/80" },
    aurum: { bg: "linear-gradient(135deg,#0a0a0a 0%,#2a2419 50%,#0d0d0d 100%)", border: "rgba(234,179,8,0.35)", text: "linear-gradient(180deg,#f5e4a0,#c9a84c)", price: "59 €", accent: "text-amber-400" },
    carbone: { bg: "linear-gradient(135deg,#0a0a0a 0%,#161616 100%)", border: "rgba(180,180,180,0.25)", text: "linear-gradient(180deg,#e5e5e5,#737373)", price: "79 €", accent: "text-zinc-300" },
  } as const)[model], [model]);
  const slug = (name || "vous").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return (
    <section id="configurer" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-20 md:py-28 border-t border-border/50">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-3">Configurateur live</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">Vois ta carte. Maintenant.</h2>
        <p className="text-muted-foreground mt-3">Tape ton nom. Choisis ton modèle. C'est ta carte qui s'affiche.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Live card */}
        <div className="relative h-[340px] grid place-items-center">
          <div
            className="relative h-56 w-[22rem] rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] -rotate-6 transition-all duration-500 overflow-hidden"
            style={{ background: variant.bg, border: `1px solid ${variant.border}` }}
          >
            <div className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)" }} />
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <Hexagon className={`h-4 w-4 ${variant.accent}`} />
              <span className={`text-[10px] uppercase tracking-[0.25em] font-semibold ${variant.accent}`}>Ma carte</span>
            </div>
            <div className="absolute top-5 right-5 h-8 w-10 rounded-md grid place-items-center" style={{ border: `1px solid ${variant.border}`, background: "rgba(255,255,255,0.03)" }}>
              <Nfc className={`h-4 w-4 ${variant.accent}`} />
            </div>
            <div className={`absolute left-5 right-5 transition-all duration-500 ${position === "centre" ? "top-1/2 -translate-y-1/2 text-center" : "bottom-6"}`}>
              <div className="font-display text-2xl tracking-wide truncate" style={{ backgroundImage: variant.text, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {name || "Votre nom"}
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5 truncate">
                macarte.app/{slug || "vous"}
              </div>
            </div>
          </div>
        </div>
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Nom gravé</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={28} placeholder="Votre nom et prénom" className="h-12 text-base" />
            <div className="text-[10px] text-muted-foreground mt-1">{name.length}/28 caractères</div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Modèle</label>
            <div className="grid grid-cols-3 gap-2">
              {(["onyx", "aurum", "carbone"] as const).map((m) => (
                <button key={m} onClick={() => setModel(m)}
                  className={`rounded-xl border p-3 text-left transition ${model === m ? "border-amber-500/60 bg-amber-500/5" : "border-border hover:border-amber-500/30"}`}>
                  <div className="font-display text-sm capitalize">{m}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{m === "onyx" ? "29 €" : m === "aurum" ? "59 €" : "79 €"}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Position du nom</label>
            <div className="grid grid-cols-2 gap-2">
              {(["bas", "centre"] as const).map((p) => (
                <button key={p} onClick={() => setPosition(p)}
                  className={`rounded-xl border p-3 text-left transition ${position === p ? "border-amber-500/60 bg-amber-500/5" : "border-border hover:border-amber-500/30"}`}>
                  <div className="font-display text-sm capitalize">{p === "bas" ? "En bas" : "Au centre"}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{p === "bas" ? "Style classique" : "Style minimaliste"}</div>
                </button>
              ))}
            </div>
          </div>

            size="lg"
            onClick={() => setOrdered(true)}
            className="w-full h-14 bg-gradient-to-br from-amber-400 to-amber-600 text-black hover:from-amber-300 hover:to-amber-500 shadow-[0_10px_40px_-10px_rgba(234,179,8,0.6)]"
          >
            Passer commande · {variant.price} <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">Gravure offerte · Modification possible jusqu'à l'expédition</p>
        </div>
      </div>

      {ordered && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-5 animate-in fade-in" onClick={() => setOrdered(false)}>
          <div className="relative max-w-md w-full rounded-3xl border border-amber-500/40 bg-gradient-to-br from-card to-background p-8 text-center shadow-[0_30px_120px_-20px_rgba(234,179,8,0.4)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOrdered(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-amber-500/15 grid place-items-center">
              <Check className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="font-display text-2xl tracking-tight mb-2">Votre carte est prête</h3>
            <p className="text-sm text-muted-foreground mb-5">
              <strong className="text-foreground">{name || "Votre nom"}</strong> · modèle <strong className="text-foreground capitalize">{model}</strong> · {variant.price}
            </p>
            <div className="rounded-xl border border-border bg-background/60 p-4 text-left text-xs text-muted-foreground mb-6">
              Étape suivante : redirection vers la page de paiement sécurisée Stripe (CB, Apple Pay, Google Pay). Livraison sous 48h en France.
            </div>
            <Button size="lg" disabled className="w-full h-12 bg-gradient-to-br from-amber-400 to-amber-600 text-black opacity-90">
              Redirection paiement Stripe…
            </Button>
            <p className="text-[10px] text-muted-foreground mt-3">Démo · paiement non branché</p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   COMPARISON TABLE
   ============================================================ */
function ComparisonTable() {
  const rows = [
    { f: "Partage de contact", paper: "Manuel, dicté", concur: "QR à scanner", us: "Tap NFC instantané" },
    { f: "Mise à jour infos", paper: "Réimprimer", concur: "Réimprimer", us: "Auto, à vie" },
    { f: "Taux de sauvegarde", paper: "11%", concur: "34%", us: "84%" },
    { f: "Effet 'wow'", paper: "Aucun", concur: "Faible", us: "Garanti" },
    { f: "Coût sur 5 ans", paper: "~350 €", concur: "~120 €", us: "29-79 € à vie" },
    { f: "Empreinte écologique", paper: "Élevée", concur: "Moyenne", us: "Minimale" },
  ];
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 md:py-28 border-t border-border/50">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-3">Le verdict</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">Pourquoi 12 400+ pros<br />ont fait le switch.</h2>
      </div>
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-4 bg-card/60 border-b border-border text-xs uppercase tracking-wider">
          <div className="p-4 font-medium">Critère</div>
          <div className="p-4 text-muted-foreground">Carte papier</div>
          <div className="p-4 text-muted-foreground">QR autocollant</div>
          <div className="p-4 text-amber-400 font-semibold flex items-center gap-1.5">
            <Crown className="h-3 w-3" /> Carte NFC
          </div>
        </div>
        {rows.map((r, i) => (
          <div key={r.f} className={`grid grid-cols-4 text-sm ${i % 2 ? "bg-card/20" : ""}`}>
            <div className="p-4 font-medium">{r.f}</div>
            <div className="p-4 text-muted-foreground">{r.paper}</div>
            <div className="p-4 text-muted-foreground">{r.concur}</div>
            <div className="p-4 text-amber-400 font-medium bg-amber-500/[0.04]">{r.us}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   GUARANTEE SECTION
   ============================================================ */
function GuaranteeSection() {
  const badges = [
    { icon: ShieldCheck, t: "Satisfait ou remboursé", d: "30 jours · sans question · remboursement sous 48h" },
    { icon: RefreshCw, t: "Sync à vie", d: "Modifie ta carte digitale, la NFC suit. Pour toujours." },
    { icon: PackageCheck, t: "Casse remplacée", d: "Si ta carte casse en 5 ans, on t'en renvoie une à prix coûtant" },
    { icon: BadgeCheck, t: "Fabriqué en France", d: "Atelier Lyon · QC manuel sur chaque pièce" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28 border-t border-border/50">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-amber-400 mb-3">Zéro risque</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">Le risque est de notre côté.<br /><span className="text-muted-foreground">Pas du tien.</span></h2>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((b) => (
          <div key={b.t} className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] to-transparent p-5 text-center">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 grid place-items-center mx-auto mb-3">
              <b.icon className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="font-medium text-sm mb-1.5">{b.t}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{b.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   FOMO TOASTS — social proof live
   ============================================================ */
function FomoToasts() {
  const events = [
    { name: "Camille L.", city: "Lyon", model: "Aurum", ago: "il y a 2 min" },
    { name: "Théo P.", city: "Paris", model: "Onyx", ago: "il y a 4 min" },
    { name: "Inès D.", city: "Bordeaux", model: "Carbone", ago: "il y a 7 min" },
    { name: "Marc R.", city: "Marseille", model: "Aurum", ago: "il y a 11 min" },
    { name: "Sophie B.", city: "Nantes", model: "Aurum", ago: "il y a 14 min" },
  ];
  const [idx, setIdx] = useState(-1);
  useEffect(() => {
    const start = setTimeout(() => setIdx(0), 6000);
    const id = setInterval(() => setIdx((i) => (i + 1) % events.length), 9000);
    return () => { clearTimeout(start); clearInterval(id); };
  }, []);
  if (idx < 0) return null;
  const e = events[idx];
  return (
    <div key={idx} className="fixed bottom-4 left-4 z-40 max-w-xs animate-fade-in">
      <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-xl shadow-2xl p-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 grid place-items-center text-black font-medium text-sm shrink-0">
          {e.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs">
            <strong>{e.name}</strong> vient de commander
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-2.5 w-2.5" /> {e.city} · {e.model} · <Clock className="h-2.5 w-2.5" /> {e.ago}
          </div>
        </div>
        <BadgeCheck className="h-4 w-4 text-amber-400 shrink-0" />
      </div>
    </div>
  );
}

