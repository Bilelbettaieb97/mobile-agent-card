import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Check, ChevronRight, Contact, CreditCard, Globe, Layers, Lock,
  Mail, MapPin, Menu, MessageCircle, Phone, QrCode, Share2, Smartphone,
  Star, TrendingUp, Users, X, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { DEFAULT_CARD } from "@/lib/card-types";
import agentPortrait from "@/assets/agent-portrait.jpg";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";

const DEMO = {
  ...DEFAULT_CARD,
  photo: agentPortrait,
  listings: [
    { id: "l1", img: listing1, title: "Loft Saint-Germain", price: "2 450 000 €", meta: "120 m² · 3 pièces" },
    { id: "l2", img: listing2, title: "Haussmannien Trocadéro", price: "3 890 000 €", meta: "180 m² · 5 pièces" },
    { id: "l3", img: listing3, title: "Villa Neuilly", price: "5 200 000 €", meta: "320 m² · 8 pièces" },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ma Carte — Votre carte de visite digitale NFC & QR" },
      { name: "description", content: "Créez votre carte de visite digitale en 2 minutes. Partagez-la en un tap NFC, par QR code ou lien. Idéale pour pros, indépendants et commerçants." },
      { property: "og:title", content: "Ma Carte — Votre carte de visite digitale" },
      { property: "og:description", content: "Créez, partagez et suivez votre carte de visite digitale. En un tap." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <PreviewSection />
      <HowItWorks />
      <Features />
      <SocialProof />
      <PricingTeaser />
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          Ma Carte
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#fonctionnalites" className="text-sm text-muted-foreground hover:text-foreground transition">
            Fonctionnalités
          </a>
          <a href="#tarifs" className="text-sm text-muted-foreground hover:text-foreground transition">
            Tarifs
          </a>
          <Link to="/demo" className="text-sm text-muted-foreground hover:text-foreground transition">
            Voir un exemple
          </Link>
          <Link to="/connexion" className="text-sm text-muted-foreground hover:text-foreground transition">
            Connexion
          </Link>
          <Link to="/builder">
            <Button size="sm" className="rounded-full px-4">
              Créer ma carte
            </Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent transition"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-5 pb-5 space-y-3 animate-fade-in">
          <a href="#fonctionnalites" onClick={() => setOpen(false)} className="block text-sm py-2 text-muted-foreground">Fonctionnalités</a>
          <a href="#tarifs" onClick={() => setOpen(false)} className="block text-sm py-2 text-muted-foreground">Tarifs</a>
          <Link to="/demo" onClick={() => setOpen(false)} className="block text-sm py-2 text-muted-foreground">Voir un exemple</Link>
          <Link to="/connexion" onClick={() => setOpen(false)} className="block text-sm py-2 text-muted-foreground">Connexion</Link>
          <Link to="/builder" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full rounded-full">Créer ma carte</Button>
          </Link>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 px-5 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.82 0.13 85 / 0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Zap className="h-3.5 w-3.5" />
          Nouveau — Carte NFC & QR haute définition
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight">
          Votre carte de visite
          <br />
          <span className="text-primary">digitale, en un tap.</span>
        </h1>

        <p className="mx-auto max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
          Créez en 2 minutes une carte de visite moderne, partageable par NFC, QR code ou lien.
          Parfaite pour les pros, indépendants et commerçants qui veulent marquer les esprits.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/builder">
            <Button size="lg" className="rounded-full px-7 h-12 text-base shadow-[var(--shadow-elegant)] group">
              Créer ma carte gratuitement
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <a href="#apercu">
            <Button variant="outline" size="lg" className="rounded-full px-7 h-12 text-base">
              Voir un aperçu
            </Button>
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground pt-2">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" /> Sans engagement
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" /> 7 jours gratuits
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" /> Annulable en 1 clic
          </span>
        </div>

        {/* Mini stats */}
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="text-center">
            <div className="font-display text-xl text-foreground">+2 400</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">cartes créées</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="font-display text-xl text-foreground">4,9/5</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">note moyenne</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="font-display text-xl text-foreground">100 %</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">compatible mobile</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Preview Section — live card demo                                   */
/* ------------------------------------------------------------------ */
function PreviewSection() {
  return (
    <section id="apercu" className="py-16 md:py-24 px-5">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-3">Ça ressemble à ça</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Une carte élégante, riche et interactive. Vos clients n'ont qu'à approcher leur téléphone ou scanner le QR.
          </p>
        </div>

        <div className="flex justify-center">
          <PhoneFrame>
            <BusinessCard data={DEMO} />
          </PhoneFrame>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/demo"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
          >
            Voir la démo complète <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: Layers,
      title: "Créez votre carte",
      desc: "Choisissez votre métier, votre style, et ajoutez vos briques (contact, services, réseaux, avis clients…).",
    },
    {
      num: "02",
      icon: CreditCard,
      title: "Activez-la",
      desc: "Recevez instantanément votre lien public personnalisé et votre QR code haute définition à imprimer.",
    },
    {
      num: "03",
      icon: Share2,
      title: "Partagez partout",
      desc: "NFC, QR code, lien, vCard, réseaux sociaux… Votre carte suit vous où que vous soyez.",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-5 bg-[oklch(0.14_0.015_250)]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-3">Comment ça marche ?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Trois étapes simples pour passer au digital. Sans technique, sans stress.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8 text-center hover:border-primary/30 transition group"
            >
              <div className="mx-auto mb-5 h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center group-hover:scale-110 transition">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">{s.num}</div>
              <h3 className="font-display text-xl mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */
function Features() {
  const feats = [
    { icon: Contact, title: "Contact & vCard", desc: "Téléchargement direct du contact dans l'agenda du visiteur." },
    { icon: Smartphone, title: "NFC + QR Code", desc: "Un tap sur le téléphone ou un scan suffit. Zéro friction." },
    { icon: TrendingUp, title: "Statistiques", desc: "Suivez les vues, clics et contacts en temps réel depuis votre dashboard." },
    { icon: Globe, title: "Lien personnalisé", desc: "Votre nom en URL : NomPrenom.cards. Mémorable et professionnel." },
    { icon: Zap, title: "Briques modulaires", desc: "Services, témoignages, vidéo, RDV, réseaux… Activez ce qui vous correspond." },
    { icon: Lock, title: "Sécurisé & rapide", desc: "Hébergement fiable, données chiffrées, conforme RGPD." },
    { icon: Mail, title: "Partage facile", desc: "Envoyez votre carte par email, SMS, WhatsApp ou réseaux sociaux." },
    { icon: MapPin, title: "Géolocalisation", desc: "Affichez votre zone d'activité et directions vers votre bureau." },
    { icon: MessageCircle, title: "Messagerie intégrée", desc: "WhatsApp, Messenger, email… Un clic et votre client vous contacte." },
  ];

  return (
    <section id="fonctionnalites" className="py-16 md:py-24 px-5">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-3">Tout ce qu'il faut</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Une carte qui va bien au-delà du simple contact. Votre vitrine mobile complète.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feats.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border/50 bg-card/30 p-5 hover:border-primary/20 hover:bg-card/50 transition"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center mb-3">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Social Proof                                                        */
/* ------------------------------------------------------------------ */
function SocialProof() {
  const reviews = [
    {
      name: "Alexandre M.",
      role: "Conseiller immobilier",
      text: "Mes clients sont bluffés. Un tap sur leur téléphone et ils ont mon contact, mes biens, tout. C'est devenu mon premier outil de prospection.",
      stars: 5,
    },
    {
      name: "Sarah L.",
      role: "Coiffeuse à domicile",
      text: "J'ai imprimé le QR sur mes cartes papier restantes. Le mix parfait. Mes clientes scanent et me rappellent directement.",
      stars: 5,
    },
    {
      name: "Thomas B.",
      role: "Consultant IT",
      text: "Le dashboard stats est super utile. Je vois exactement qui consulte ma carte et quand. Ça change la donne pour le suivi commercial.",
      stars: 5,
    },
  ];

  return (
    <section className="py-16 md:py-24 px-5 bg-[oklch(0.14_0.015_250)]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-3">Ils ont adopté</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Rejoignez +2 400 professionnels qui ont modernisé leur première impression.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border/60 bg-card/40 p-6 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs grid place-items-center font-medium">
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
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing teaser                                                      */
/* ------------------------------------------------------------------ */
function PricingTeaser() {
  return (
    <section id="tarifs" className="py-16 md:py-24 px-5">
      <div className="mx-auto max-w-4xl text-center space-y-6">
        <h2 className="font-display text-3xl md:text-4xl font-medium">Commencez gratuitement</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Testez 7 jours sans limite. Passez au plan qui vous correspond quand vous êtes prêt.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
          <div className="rounded-2xl border border-border bg-card/40 p-6 text-left">
            <div className="text-sm text-muted-foreground mb-1">Vitrine</div>
            <div className="font-display text-3xl mb-4">Gratuit</div>
            <ul className="space-y-2 mb-6">
              {["1 carte digitale", "Liens illimités", "QR code & NFC", "Stats basiques"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/builder" className="block">
              <Button variant="outline" className="w-full rounded-full">Créer gratuitement</Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6 text-left relative">
            <span className="absolute -top-2 right-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              Recommandé
            </span>
            <div className="text-sm text-muted-foreground mb-1">Pro</div>
            <div className="font-display text-3xl mb-4">9 €<span className="text-base text-muted-foreground">/mois</span></div>
            <ul className="space-y-2 mb-6">
              {["Tout le plan Vitrine", "Stats avancées", "CRM contacts & leads", "Intégrations (Zapier, etc.)"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/builder" className="block">
              <Button className="w-full rounded-full">Essai 7 jours gratuit</Button>
            </Link>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Sans engagement. Annulez en un clic. Prix TTC.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-border/50 px-5 py-12">
      <div className="mx-auto max-w-6xl grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="space-y-3">
          <div className="font-display text-lg font-medium">Ma Carte</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La carte de visite digitale moderne pour les pros qui veulent marquer les esprits.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Produit</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/builder" className="text-muted-foreground hover:text-foreground transition">Créer une carte</Link></li>
            <li><a href="#fonctionnalites" className="text-muted-foreground hover:text-foreground transition">Fonctionnalités</a></li>
            <li><Link to="/demo" className="text-muted-foreground hover:text-foreground transition">Exemple</Link></li>
            <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition">Tarifs</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Compte</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/connexion" className="text-muted-foreground hover:text-foreground transition">Connexion</Link></li>
            <li><Link to="/inscription" className="text-muted-foreground hover:text-foreground transition">Inscription</Link></li>
            <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Légal</div>
          <ul className="space-y-2 text-sm">
            <li><span className="text-muted-foreground">Mentions légales</span></li>
            <li><span className="text-muted-foreground">CGU</span></li>
            <li><span className="text-muted-foreground">Confidentialité</span></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground border-t border-border/50 pt-6">
        <div>© {new Date().getFullYear()} Ma Carte. Tous droits réservés.</div>
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          <span>+2 400 pros nous font confiance</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll-reveal wrapper (simple intersection observer)              */
/* ------------------------------------------------------------------ */
function useReveal(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}
