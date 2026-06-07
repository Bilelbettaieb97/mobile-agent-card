import { useState } from "react";
import {
  Phone, Mail, MessageCircle, MapPin, Globe, Linkedin, Instagram,
  Share2, Download, BadgeCheck, Award, ChevronRight, Building2, ImageIcon,
} from "lucide-react";
import type { CardData, ThemeAccent, BrickId } from "@/lib/card-types";

const ACCENTS: Record<ThemeAccent, { primary: string; gradient: string }> = {
  gold:    { primary: "oklch(0.82 0.13 85)",  gradient: "linear-gradient(135deg, oklch(0.88 0.1 90), oklch(0.75 0.14 75))" },
  emerald: { primary: "oklch(0.78 0.16 160)", gradient: "linear-gradient(135deg, oklch(0.85 0.14 165), oklch(0.65 0.16 155))" },
  copper:  { primary: "oklch(0.74 0.16 45)",  gradient: "linear-gradient(135deg, oklch(0.82 0.14 55), oklch(0.62 0.17 35))" },
};

function buildVCard(d: CardData) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${d.name}`,
    `ORG:${d.agency}`,
    `TITLE:${d.title}`,
    `TEL;TYPE=CELL:${d.phone}`,
    `EMAIL:${d.email}`,
    `URL:https://${d.website}`,
    `ADR;TYPE=WORK:;;${d.area};;;;France`,
    "END:VCARD",
  ].join("\n");
}

export function BusinessCard({ data }: { data: CardData }) {
  const [copied, setCopied] = useState(false);
  const accent = ACCENTS[data.accent];

  const styleVars = {
    "--card-accent": accent.primary,
    "--card-accent-gradient": accent.gradient,
  } as React.CSSProperties;

  const handleSave = () => {
    const blob = new Blob([buildVCard(data)], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.name.toLowerCase().replace(/\s+/g, "-")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: data.name,
      text: `${data.name} — ${data.title}`,
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

  const anyAction = data.actions.call || data.actions.whatsapp || data.actions.email || data.actions.website;

  return (
    <div className="w-full bg-background text-foreground" style={styleVars}>
      {/* HERO */}
      <header
        className="relative overflow-hidden pt-8 pb-7 px-5"
        style={{ background: "radial-gradient(120% 80% at 50% 0%, oklch(0.28 0.05 250) 0%, oklch(0.16 0.018 250) 60%)" }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md grid place-items-center" style={{ background: "var(--card-accent-gradient)" }}>
              <Building2 className="h-4 w-4 text-primary-foreground" strokeWidth={2.4} />
            </div>
            <span className="font-display text-sm tracking-wide">{data.agency || "Agence"}</span>
          </div>
          <button
            onClick={handleShare}
            aria-label="Partager"
            className="h-9 w-9 grid place-items-center rounded-full bg-card/80 backdrop-blur border border-border active:scale-95 transition"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full opacity-60 blur-md" style={{ background: "var(--card-accent-gradient)" }} />
            {data.photo ? (
              <img
                src={data.photo}
                alt={data.name}
                className="relative h-28 w-28 rounded-full object-cover border-2 border-background"
              />
            ) : (
              <div className="relative h-28 w-28 rounded-full grid place-items-center bg-muted border-2 border-background">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <span
              className="absolute bottom-1 right-1 h-6 w-6 grid place-items-center rounded-full border-2 border-background"
              style={{ background: "var(--card-accent-gradient)" }}
              aria-label="Vérifié"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.6} />
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-display font-medium leading-tight">
            {data.name || "Votre nom"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{data.title || "Votre titre"}</p>

          {data.area && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" style={{ color: "var(--card-accent)" }} />
              <span>{data.area}</span>
            </div>
          )}
        </div>
      </header>

      {/* QUICK ACTIONS */}
      {anyAction && (
        <section className="px-5 -mt-4 relative z-10">
          <div className="flex gap-2 justify-center">
            {data.actions.call && (
              <QuickAction icon={Phone} label="Appeler" href={`tel:${data.phone}`} primary />
            )}
            {data.actions.whatsapp && (
              <QuickAction icon={MessageCircle} label="WhatsApp" href={`https://wa.me/${data.whatsapp}`} />
            )}
            {data.actions.email && (
              <QuickAction icon={Mail} label="Mail" href={`mailto:${data.email}`} />
            )}
            {data.actions.website && (
              <QuickAction icon={Globe} label="Site" href={`https://${data.website}`} />
            )}
          </div>

          {data.vcardEnabled && (
            <>
              <button
                onClick={handleSave}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-medium text-primary-foreground active:scale-[0.99] transition"
                style={{ background: "var(--card-accent-gradient)", boxShadow: "0 0 40px -8px var(--card-accent)" }}
              >
                <Download className="h-4 w-4" strokeWidth={2.4} />
                Enregistrer le contact
              </button>
              {copied && <p className="mt-2 text-center text-xs" style={{ color: "var(--card-accent)" }}>Lien copié ✓</p>}
            </>
          )}
        </section>
      )}

      {/* STATS */}
      {data.statsEnabled && data.stats.length > 0 && (
        <section className="px-5 mt-6">
          <div className="grid rounded-2xl bg-card border border-border overflow-hidden" style={{ gridTemplateColumns: `repeat(${data.stats.length}, minmax(0,1fr))` }}>
            {data.stats.map((s, i) => (
              <div key={i} className={`py-4 px-2 text-center ${i < data.stats.length - 1 ? "border-r border-border" : ""}`}>
                <div className="font-display text-2xl" style={{ color: "var(--card-accent)" }}>{s.value}</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {data.aboutEnabled && (
        <section className="px-5 mt-7">
          <SectionTitle>À propos</SectionTitle>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{data.bio}</p>
          {data.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.badges.map((b) => (
                <span key={b.id} className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs">
                  <Award className="h-3.5 w-3.5" style={{ color: "var(--card-accent)" }} />
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* LISTINGS */}
      {data.listingsEnabled && data.listings.length > 0 && (
        <section className="mt-8">
          <div className="px-5 flex items-end justify-between">
            <SectionTitle>Sélection en vente</SectionTitle>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {data.listings.map((l) => (
              <article key={l.id} className="snap-start shrink-0 w-[78%] rounded-2xl overflow-hidden bg-card border border-border">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {l.img ? (
                    <img src={l.img} alt={l.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full grid place-items-center"><ImageIcon className="h-8 w-8 text-muted-foreground" /></div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg leading-tight">{l.title || "Sans titre"}</h3>
                  {l.meta && <p className="mt-0.5 text-xs text-muted-foreground">{l.meta}</p>}
                  {l.price && <p className="mt-2 font-medium" style={{ color: "var(--card-accent)" }}>{l.price}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT DETAILS */}
      {data.contactEnabled && (
        <section className="px-5 mt-7">
          <SectionTitle>Coordonnées</SectionTitle>
          <ul className="mt-3 rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
            <ContactRow icon={Phone} label="Téléphone" value={data.phoneDisplay || data.phone} href={`tel:${data.phone}`} />
            <ContactRow icon={Mail} label="Email" value={data.email} href={`mailto:${data.email}`} />
            <ContactRow icon={Globe} label="Site web" value={data.website} href={`https://${data.website}`} />
            <ContactRow icon={MapPin} label="Secteur" value={data.area} />
          </ul>
        </section>
      )}

      {/* SOCIALS */}
      {data.socialsEnabled && (
        <section className="px-5 mt-6">
          <div className="flex justify-center gap-3">
            {data.linkedin && <SocialIcon icon={Linkedin} href={data.linkedin} label="LinkedIn" />}
            {data.instagram && <SocialIcon icon={Instagram} href={data.instagram} label="Instagram" />}
            {data.whatsappSocial && <SocialIcon icon={MessageCircle} href={`https://wa.me/${data.whatsappSocial}`} label="WhatsApp" />}
          </div>
        </section>
      )}

      <footer className="px-5 pt-8 pb-10 text-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {data.agency} · Carte digitale</p>
      </footer>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-xs uppercase tracking-[0.18em]" style={{ color: "var(--card-accent)" }}>{children}</h2>;
}

function QuickAction({ icon: Icon, label, href, primary }: { icon: any; label: string; href: string; primary?: boolean }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex flex-col items-center gap-1.5">
      <span
        className={`h-12 w-12 grid place-items-center rounded-2xl border border-border active:scale-95 transition ${primary ? "" : "bg-card"}`}
        style={primary ? { background: "var(--card-accent-gradient)" } : undefined}
      >
        <Icon className={`h-4.5 w-4.5 ${primary ? "text-primary-foreground" : "text-foreground"}`} strokeWidth={2} />
      </span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </a>
  );
}

function ContactRow({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  if (!value) return null;
  const Inner = (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="h-9 w-9 grid place-items-center rounded-xl bg-accent">
        <Icon className="h-4 w-4" style={{ color: "var(--card-accent)" }} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm truncate">{value}</div>
      </div>
      {href && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
  return <li>{href ? <a href={href} className="block active:bg-accent/60 transition">{Inner}</a> : Inner}</li>;
}

function SocialIcon({ icon: Icon, href, label }: { icon: any; href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="h-11 w-11 grid place-items-center rounded-full bg-card border border-border active:scale-95 transition">
      <Icon className="h-5 w-5" style={{ color: "var(--card-accent)" }} />
    </a>
  );
}
