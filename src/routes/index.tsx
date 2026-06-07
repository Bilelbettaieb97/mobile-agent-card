import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone, Mail, MessageCircle, MapPin, Globe, Linkedin, Instagram,
  Share2, Download, BadgeCheck, Star, Home, Award, ChevronRight, Building2,
} from "lucide-react";
import agentPortrait from "@/assets/agent-portrait.jpg";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alexandre Moreau — Conseiller immobilier de prestige" },
      { name: "description", content: "Carte de visite digitale d'Alexandre Moreau, conseiller immobilier à Paris. Appelez, envoyez un message ou enregistrez le contact en un geste." },
      { property: "og:title", content: "Alexandre Moreau — Immobilier de prestige" },
      { property: "og:description", content: "Carte de visite digitale — Paris & Île-de-France" },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: BusinessCard,
});

const AGENT = {
  name: "Alexandre Moreau",
  title: "Conseiller immobilier de prestige",
  agency: "Maison Vendôme",
  area: "Paris & Île-de-France",
  phone: "+33612345678",
  phoneDisplay: "+33 6 12 34 56 78",
  email: "alexandre@maison-vendome.fr",
  website: "maison-vendome.fr",
  whatsapp: "33612345678",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  bio: "12 ans d'expertise sur le marché parisien. Spécialiste des biens d'exception, je vous accompagne avec discrétion et exigence à chaque étape de votre projet.",
};

const STATS = [
  { label: "Biens vendus", value: "240+" },
  { label: "Note clients", value: "4.9" },
  { label: "Années", value: "12" },
];

const LISTINGS = [
  { img: listing1, title: "Loft Saint-Germain", price: "2 450 000 €", meta: "120 m² · 3 pièces" },
  { img: listing2, title: "Haussmannien Trocadéro", price: "3 890 000 €", meta: "180 m² · 5 pièces" },
  { img: listing3, title: "Villa Neuilly", price: "5 200 000 €", meta: "320 m² · 8 pièces" },
];

function buildVCard() {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${AGENT.name}`,
    `N:Moreau;Alexandre;;;`,
    `ORG:${AGENT.agency}`,
    `TITLE:${AGENT.title}`,
    `TEL;TYPE=CELL:${AGENT.phone}`,
    `EMAIL:${AGENT.email}`,
    `URL:https://${AGENT.website}`,
    `ADR;TYPE=WORK:;;${AGENT.area};;;;France`,
    "END:VCARD",
  ].join("\n");
}

function BusinessCard() {
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    const blob = new Blob([buildVCard()], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alexandre-moreau.vcf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: AGENT.name,
      text: `${AGENT.name} — ${AGENT.title}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {}
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[440px]">
        {/* HERO */}
        <header
          className="relative overflow-hidden pt-10 pb-8 px-6"
          style={{ background: "var(--gradient-hero)" }}
        >
          {/* top bar */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-md grid place-items-center"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Building2 className="h-4 w-4 text-primary-foreground" strokeWidth={2.4} />
              </div>
              <span className="font-display text-sm tracking-wide">{AGENT.agency}</span>
            </div>
            <button
              onClick={handleShare}
              aria-label="Partager"
              className="h-10 w-10 grid place-items-center rounded-full bg-card/80 backdrop-blur border border-border active:scale-95 transition"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-full opacity-60 blur-md"
                style={{ background: "var(--gradient-gold)" }}
              />
              <img
                src={agentPortrait}
                alt={AGENT.name}
                width={1024}
                height={1024}
                className="relative h-32 w-32 rounded-full object-cover border-2 border-background shadow-[var(--shadow-elegant)]"
              />
              <span
                className="absolute bottom-1 right-1 h-7 w-7 grid place-items-center rounded-full border-2 border-background"
                style={{ background: "var(--gradient-gold)" }}
                aria-label="Vérifié"
              >
                <BadgeCheck className="h-4 w-4 text-primary-foreground" strokeWidth={2.6} />
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-display font-medium leading-tight">
              {AGENT.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{AGENT.title}</p>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{AGENT.area}</span>
            </div>
          </div>
        </header>

        {/* QUICK ACTIONS */}
        <section className="px-6 -mt-4 relative z-10">
          <div className="grid grid-cols-4 gap-2.5">
            <QuickAction icon={Phone} label="Appeler" href={`tel:${AGENT.phone}`} primary />
            <QuickAction icon={MessageCircle} label="WhatsApp" href={`https://wa.me/${AGENT.whatsapp}`} />
            <QuickAction icon={Mail} label="Mail" href={`mailto:${AGENT.email}`} />
            <QuickAction icon={Globe} label="Site" href={`https://${AGENT.website}`} />
          </div>

          <button
            onClick={handleSave}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-medium text-primary-foreground shadow-[var(--shadow-glow)] active:scale-[0.99] transition"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Download className="h-4 w-4" strokeWidth={2.4} />
            Enregistrer le contact
          </button>
          {copied && (
            <p className="mt-2 text-center text-xs text-primary">Lien copié ✓</p>
          )}
        </section>

        {/* STATS */}
        <section className="px-6 mt-7">
          <div className="grid grid-cols-3 rounded-2xl bg-card border border-border overflow-hidden">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`py-4 px-2 text-center ${i < STATS.length - 1 ? "border-r border-border" : ""}`}
              >
                <div className="font-display text-2xl text-primary">{s.value}</div>
                <div className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section className="px-6 mt-8">
          <SectionTitle>À propos</SectionTitle>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {AGENT.bio}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill icon={Award}>FNAIM certifié</Pill>
            <Pill icon={Star}>Top 1% Paris</Pill>
            <Pill icon={Home}>Prestige</Pill>
          </div>
        </section>

        {/* LISTINGS */}
        <section className="mt-9">
          <div className="px-6 flex items-end justify-between">
            <SectionTitle>Sélection en vente</SectionTitle>
            <a href="#" className="text-xs text-primary flex items-center gap-0.5">
              Tout voir <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto px-6 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {LISTINGS.map((l) => (
              <article
                key={l.title}
                className="snap-start shrink-0 w-[78%] rounded-2xl overflow-hidden bg-card border border-border shadow-[var(--shadow-elegant)]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={l.img}
                    alt={l.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg leading-tight">{l.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{l.meta}</p>
                  <p className="mt-2 text-primary font-medium">{l.price}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CONTACT DETAILS */}
        <section className="px-6 mt-8">
          <SectionTitle>Coordonnées</SectionTitle>
          <ul className="mt-3 rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
            <ContactRow icon={Phone} label="Téléphone" value={AGENT.phoneDisplay} href={`tel:${AGENT.phone}`} />
            <ContactRow icon={Mail} label="Email" value={AGENT.email} href={`mailto:${AGENT.email}`} />
            <ContactRow icon={Globe} label="Site web" value={AGENT.website} href={`https://${AGENT.website}`} />
            <ContactRow icon={MapPin} label="Secteur" value={AGENT.area} />
          </ul>
        </section>

        {/* SOCIALS */}
        <section className="px-6 mt-7">
          <div className="flex justify-center gap-3">
            <SocialIcon icon={Linkedin} href={AGENT.linkedin} label="LinkedIn" />
            <SocialIcon icon={Instagram} href={AGENT.instagram} label="Instagram" />
            <SocialIcon icon={MessageCircle} href={`https://wa.me/${AGENT.whatsapp}`} label="WhatsApp" />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 pt-10 pb-12 text-center">
          <div
            className="mx-auto h-8 w-8 rounded-md grid place-items-center mb-3"
            style={{ background: "var(--gradient-gold)" }}
          >
            <Building2 className="h-4 w-4 text-primary-foreground" strokeWidth={2.4} />
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {AGENT.agency} · Carte digitale
          </p>
        </footer>
      </div>
    </main>
  );
}

/* --- subcomponents --- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xs uppercase tracking-[0.18em] text-primary">
      {children}
    </h2>
  );
}

function QuickAction({
  icon: Icon, label, href, primary,
}: { icon: any; label: string; href: string; primary?: boolean }) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center gap-1.5 group"
    >
      <span
        className={`h-14 w-14 grid place-items-center rounded-2xl border border-border active:scale-95 transition shadow-[var(--shadow-elegant)] ${
          primary ? "" : "bg-card"
        }`}
        style={primary ? { background: "var(--gradient-gold)" } : undefined}
      >
        <Icon
          className={`h-5 w-5 ${primary ? "text-primary-foreground" : "text-foreground"}`}
          strokeWidth={2}
        />
      </span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </a>
  );
}

function Pill({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs">
      <Icon className="h-3.5 w-3.5 text-primary" />
      {children}
    </span>
  );
}

function ContactRow({
  icon: Icon, label, value, href,
}: { icon: any; label: string; value: string; href?: string }) {
  const Inner = (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="h-9 w-9 grid place-items-center rounded-xl bg-accent">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-sm truncate">{value}</div>
      </div>
      {href && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
  return (
    <li>
      {href ? (
        <a href={href} className="block active:bg-accent/60 transition">{Inner}</a>
      ) : Inner}
    </li>
  );
}

function SocialIcon({ icon: Icon, href, label }: { icon: any; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="h-12 w-12 grid place-items-center rounded-full bg-card border border-border active:scale-95 transition"
    >
      <Icon className="h-5 w-5 text-primary" />
    </a>
  );
}
