import { useState } from "react";
import {
  Phone, Mail, MessageCircle, MapPin, Globe, Linkedin, Instagram,
  Share2, Download, BadgeCheck, Award, ChevronRight, Building2, ImageIcon,
  Star, Calendar, Languages as LangIcon, Sparkles, PlayCircle, ArrowRight, Quote, ExternalLink,
} from "lucide-react";
import type { CardData, Testimonial, TestimonialsStyle, Listing, Service, Language, Stat, Badge } from "@/lib/card-types";
import { THEMES_BY_ID } from "@/lib/card-themes";

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
  const theme = (THEMES_BY_ID[data.accent] ?? THEMES_BY_ID.gold).palette;

  const styleVars = {
    "--card-bg":               theme.bg,
    "--card-surface":          theme.surface,
    "--card-surface-alt":      theme.surfaceAlt,
    "--card-border":           theme.border,
    "--card-text":             theme.text,
    "--card-text-muted":       theme.textMuted,
    "--card-accent":           theme.accent,
    "--card-accent-gradient":  theme.gradient,
    "--card-header-bg":        theme.headerBg,
    background:                theme.bg,
    color:                     theme.text,
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

  return (
    <div className="w-full bg-background text-foreground" style={styleVars}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5">
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

      {/* IDENTITY + ORDERED SECTIONS — spacing is centralized here.
          Do NOT add vertical margins on section roots. */}
      <div className="flex flex-col gap-6 pb-2">
        <IdentitySection data={data} />
        {data.sectionOrder
          .filter((id) => id !== "identity" && id !== "theme")
          .map((id) => {
            switch (id) {
              case "actions":      return <ActionsSection key={id} data={data} />;
              case "vcard":        return <VCardSection key={id} data={data} onSave={handleSave} copied={copied} />;
              case "stats":        return <StatsSection key={id} data={data} />;
              case "about":        return <AboutSection key={id} data={data} />;
              case "video":        return <VideoSection key={id} data={data} />;
              case "services":     return <ServicesSection key={id} data={data} />;
              case "listings":     return <ListingsSection key={id} data={data} />;
              case "testimonials": return <TestimonialsSection key={id} data={data} />;
              case "calendar":     return <CalendarSection key={id} data={data} />;
              case "languages":    return <LanguagesSection key={id} data={data} />;
              case "cta":          return <CtaSection key={id} data={data} />;
              case "contact":      return <ContactSection key={id} data={data} />;
              case "socials":      return <SocialsSection key={id} data={data} />;
              default:             return null;
            }
          })}
      </div>


      <footer className="px-5 pt-8 pb-10 text-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {data.agency} · Carte digitale</p>
      </footer>
    </div>
  );
}

/* ============================================================
   IDENTITY
   ============================================================ */

function IdentitySection({ data }: { data: CardData }) {
  const v = data.variants.identity;
  const Photo = ({ size }: { size: number }) => (
    data.photo
      ? <img src={data.photo} alt={data.name} className="h-full w-full object-cover" style={{ width: size, height: size }} />
      : <div className="grid place-items-center bg-muted h-full w-full" style={{ width: size, height: size }}><ImageIcon className="h-6 w-6 text-muted-foreground" /></div>
  );

  if (v === "horizontal") {
    return (
      <header className="px-5">
        <div className="flex items-center gap-4 rounded-2xl bg-card border border-border p-4">
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-2xl overflow-hidden border border-border">
              <Photo size={80} />
            </div>
            <span className="absolute -bottom-1 -right-1 h-6 w-6 grid place-items-center rounded-full border-2 border-card"
              style={{ background: "var(--card-accent-gradient)" }}>
              <BadgeCheck className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.6} />
            </span>
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-xl leading-tight truncate">{data.name || "Votre nom"}</h1>
            <p className="text-xs text-muted-foreground truncate">{data.title || "Votre titre"}</p>
            {data.area && (
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3" style={{ color: "var(--card-accent)" }} />
                <span className="truncate">{data.area}</span>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  if (v === "cover") {
    return (
      <header className="mx-5 rounded-3xl overflow-hidden border border-border">
        <div className="relative h-36 w-full" style={{ background: "var(--card-accent-gradient)" }}>
          {data.coverPhoto ? (
            <img src={data.coverPhoto} alt="" aria-hidden
              className="absolute inset-0 h-full w-full object-cover" />
          ) : data.photo ? (
            <img src={data.photo} alt="" aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-40 blur-[2px] scale-110" />
          ) : null}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, oklch(0.16 0.018 250 / 0.6) 100%)" }} />
        </div>
        <div className="relative bg-card px-5 pb-5 pt-0 -mt-12 flex flex-col items-center text-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-card shadow-xl">
              <Photo size={96} />
            </div>
            <span className="absolute bottom-0 right-0 h-6 w-6 grid place-items-center rounded-full border-2 border-card"
              style={{ background: "var(--card-accent-gradient)" }}>
              <BadgeCheck className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.6} />
            </span>
          </div>
          <h1 className="mt-3 text-xl font-display font-medium leading-tight">{data.name || "Votre nom"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{data.title || "Votre titre"}</p>
          {data.area && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" style={{ color: "var(--card-accent)" }} />
              <span>{data.area}</span>
            </div>
          )}
        </div>
      </header>
    );
  }

  // default: centered
  return (
    <header className="relative overflow-hidden pt-3 pb-7 px-5"
      style={{ background: "radial-gradient(120% 80% at 50% 0%, oklch(0.28 0.05 250) 0%, oklch(0.16 0.018 250) 60%)" }}>
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full opacity-60 blur-md" style={{ background: "var(--card-accent-gradient)" }} />
          <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-background">
            <Photo size={112} />
          </div>
          <span className="absolute bottom-1 right-1 h-6 w-6 grid place-items-center rounded-full border-2 border-background"
            style={{ background: "var(--card-accent-gradient)" }}>
            <BadgeCheck className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.6} />
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-display font-medium leading-tight">{data.name || "Votre nom"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{data.title || "Votre titre"}</p>
        {data.area && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" style={{ color: "var(--card-accent)" }} />
            <span>{data.area}</span>
          </div>
        )}
      </div>
    </header>
  );
}

/* ============================================================
   ACTIONS
   ============================================================ */

function ActionsSection({ data }: { data: CardData }) {
  const any = data.actions.call || data.actions.whatsapp || data.actions.email || data.actions.website;
  if (!any) return null;
  const items = [
    data.actions.call     && { icon: Phone,         label: "Appeler",  href: `tel:${data.phone}` },
    data.actions.whatsapp && { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${data.whatsapp}` },
    data.actions.email    && { icon: Mail,          label: "Mail",     href: `mailto:${data.email}` },
    data.actions.website  && { icon: Globe,         label: "Site",     href: `https://${data.website}` },
  ].filter(Boolean) as Array<{ icon: any; label: string; href: string }>;

  const v = data.variants.actions;

  if (v === "pills") {
    return (
      <section className="px-5 space-y-2">
        {items.map((it, i) => (
          <a key={i} href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-card border border-border px-4 py-3 active:scale-[0.99] transition">
            <span className="h-9 w-9 grid place-items-center rounded-xl" style={{ background: "var(--card-accent-gradient)" }}>
              <it.icon className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="text-sm font-medium flex-1">{it.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </a>
        ))}
      </section>
    );
  }

  if (v === "grid") {
    return (
      <section className="px-5 grid grid-cols-2 gap-2">
        {items.map((it, i) => (
          <a key={i} href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-card border border-border py-5 active:scale-[0.99] transition">
            <span className="h-10 w-10 grid place-items-center rounded-xl" style={{ background: "var(--card-accent-gradient)" }}>
              <it.icon className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="text-xs font-medium">{it.label}</span>
          </a>
        ))}
      </section>
    );
  }

  // default icons
  return (
    <section className="px-5 relative z-10">
      <div className="flex gap-2 justify-center">
        {items.map((it, i) => (
          <QuickActionIcon key={i} icon={it.icon} label={it.label} href={it.href} primary={it.label === "Appeler"} />
        ))}
      </div>
    </section>
  );
}

function QuickActionIcon({ icon: Icon, label, href, primary }: { icon: any; label: string; href: string; primary?: boolean }) {
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

/* ============================================================
   vCARD
   ============================================================ */

function VCardSection({ data, onSave, copied }: { data: CardData; onSave: () => void; copied: boolean }) {
  if (!data.vcardEnabled) return null;
  const v = data.variants.vcard;

  if (v === "outline") {
    return (
      <section className="px-5">
        <button onClick={onSave}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-medium border-2 active:scale-[0.99] transition"
          style={{ borderColor: "var(--card-accent)", color: "var(--card-accent)" }}>
          <Download className="h-4 w-4" strokeWidth={2.4} />
          Enregistrer le contact
        </button>
        {copied && <p className="mt-2 text-center text-xs" style={{ color: "var(--card-accent)" }}>Lien copié ✓</p>}
      </section>
    );
  }

  if (v === "card") {
    return (
      <section className="px-5">
        <button onClick={onSave}
          className="w-full flex items-center gap-3 rounded-2xl bg-card border border-border p-4 active:scale-[0.99] transition text-left">
          <span className="h-11 w-11 grid place-items-center rounded-xl" style={{ background: "var(--card-accent-gradient)" }}>
            <Download className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-medium">Enregistrer le contact</span>
            <span className="block text-[11px] text-muted-foreground">Ajouter à votre carnet d'adresses</span>
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
        {copied && <p className="mt-2 text-center text-xs" style={{ color: "var(--card-accent)" }}>Lien copié ✓</p>}
      </section>
    );
  }

  return (
    <section className="px-5">
      <button onClick={onSave}
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-medium text-primary-foreground active:scale-[0.99] transition"
        style={{ background: "var(--card-accent-gradient)", boxShadow: "0 0 40px -8px var(--card-accent)" }}>
        <Download className="h-4 w-4" strokeWidth={2.4} />
        Enregistrer le contact
      </button>
      {copied && <p className="mt-2 text-center text-xs" style={{ color: "var(--card-accent)" }}>Lien copié ✓</p>}
    </section>
  );
}

/* ============================================================
   STATS
   ============================================================ */

function StatsSection({ data }: { data: CardData }) {
  if (!data.statsEnabled || data.stats.length === 0) return null;
  const v = data.variants.stats;

  if (v === "stacked") {
    return (
      <section className="px-5 space-y-2">
        {data.stats.map((s, i) => (
          <div key={i} className="flex items-end justify-between rounded-2xl bg-card border border-border px-4 py-3">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
            <span className="font-display text-3xl leading-none" style={{ color: "var(--card-accent)" }}>{s.value}</span>
          </div>
        ))}
      </section>
    );
  }

  if (v === "pills") {
    return (
      <section className="px-5 flex flex-wrap gap-2">
        {data.stats.map((s, i) => (
          <span key={i} className="inline-flex items-baseline gap-1.5 rounded-full bg-card border border-border px-3.5 py-2">
            <span className="font-display text-base" style={{ color: "var(--card-accent)" }}>{s.value}</span>
            <span className="text-[11px] text-muted-foreground">{s.label}</span>
          </span>
        ))}
      </section>
    );
  }

  return (
    <section className="px-5">
      <div className="grid rounded-2xl bg-card border border-border overflow-hidden" style={{ gridTemplateColumns: `repeat(${data.stats.length}, minmax(0,1fr))` }}>
        {data.stats.map((s, i) => (
          <div key={i} className={`py-4 px-2 text-center ${i < data.stats.length - 1 ? "border-r border-border" : ""}`}>
            <div className="font-display text-2xl" style={{ color: "var(--card-accent)" }}>{s.value}</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */

function AboutSection({ data }: { data: CardData }) {
  if (!data.aboutEnabled) return null;
  const v = data.variants.about;

  if (v === "quote") {
    return (
      <section className="px-5">
        <SectionTitle>À propos</SectionTitle>
        <div className="mt-3 relative rounded-2xl bg-card border border-border p-5">
          <Quote className="absolute top-3 right-3 h-6 w-6 opacity-30" style={{ color: "var(--card-accent)" }} />
          <p className="text-sm leading-relaxed italic">« {data.bio} »</p>
          {data.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.badges.map((b) => <Chip key={b.id}>{b.label}</Chip>)}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (v === "card") {
    return (
      <section className="px-5">
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-9 w-9 grid place-items-center rounded-xl" style={{ background: "var(--card-accent-gradient)" }}>
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <h2 className="font-display text-base">À propos</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{data.bio}</p>
          {data.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.badges.map((b) => <Chip key={b.id}>{b.label}</Chip>)}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="px-5">
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
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1.5 text-xs">
      <Award className="h-3.5 w-3.5" style={{ color: "var(--card-accent)" }} />
      {children}
    </span>
  );
}

/* ============================================================
   VIDEO
   ============================================================ */

function VideoSection({ data }: { data: CardData }) {
  if (!data.videoEnabled || !data.videoUrl) return null;
  const v = data.variants.video;
  const id = parseYoutubeId(data.videoUrl);

  if (!id) {
    return (
      <section className="px-5">
        <SectionTitle>{data.videoTitle || "Vidéo"}</SectionTitle>
        <div className="mt-3 rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
          URL YouTube invalide.
        </div>
      </section>
    );
  }

  if (v === "thumb") {
    return (
      <section className="px-5">
        <SectionTitle>{data.videoTitle || "Vidéo"}</SectionTitle>
        <YoutubeLite id={id} title={data.videoTitle} />
      </section>
    );
  }

  if (v === "cinema") {
    return (
      <section className="px-5">
        <div className="relative rounded-3xl overflow-hidden border border-border bg-black aspect-video">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${id}?rel=0`}
            title={data.videoTitle || "YouTube"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--card-accent)" }}>Vidéo</div>
            <div className="text-sm font-display text-white truncate">{data.videoTitle || "Présentation"}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5">
      <SectionTitle>{data.videoTitle || "Vidéo"}</SectionTitle>
      <div className="mt-3 relative rounded-2xl overflow-hidden border border-border bg-black aspect-video">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${id}?rel=0`}
          title={data.videoTitle || "YouTube"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </section>
  );
}

function YoutubeLite({ id, title }: { id: string; title?: string }) {
  const [loaded, setLoaded] = useState(false);
  if (loaded) {
    return (
      <div className="mt-3 relative rounded-2xl overflow-hidden border border-border bg-black aspect-video">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title={title || "YouTube"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button type="button" onClick={() => setLoaded(true)}
      className="mt-3 group relative block w-full rounded-2xl overflow-hidden border border-border bg-black aspect-video">
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title || "Vidéo"} className="absolute inset-0 h-full w-full object-cover opacity-90 group-hover:opacity-100 transition" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="h-14 w-14 grid place-items-center rounded-full bg-black/60 backdrop-blur border border-white/20">
          <PlayCircle className="h-7 w-7" style={{ color: "var(--card-accent)" }} />
        </span>
      </div>
    </button>
  );
}

/* ============================================================
   SERVICES
   ============================================================ */

function ServicesSection({ data }: { data: CardData }) {
  if (!data.servicesEnabled || data.services.length === 0) return null;
  const v = data.variants.services;

  if (v === "numbered") {
    return (
      <section className="px-5">
        <SectionTitle>Services</SectionTitle>
        <ul className="mt-3 space-y-2">
          {data.services.map((s, i) => (
            <li key={s.id} className="rounded-2xl bg-card border border-border p-4 flex gap-3">
              <span className="font-display text-2xl shrink-0 w-9 text-right" style={{ color: "var(--card-accent)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 border-l border-border pl-3">
                <h3 className="text-sm font-medium">{s.title}</h3>
                {s.description && <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{s.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (v === "carousel") {
    return (
      <section className="">
        <div className="px-5"><SectionTitle>Services</SectionTitle></div>
        <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {data.services.map((s) => (
            <article key={s.id} className="snap-start shrink-0 w-[72%] rounded-2xl bg-card border border-border p-4">
              <span className="h-9 w-9 grid place-items-center rounded-xl" style={{ background: "var(--card-accent-gradient)" }}>
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <h3 className="mt-3 text-sm font-medium">{s.title}</h3>
              {s.description && <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.description}</p>}
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-5">
      <SectionTitle>Services</SectionTitle>
      <ul className="mt-3 space-y-2">
        {data.services.map((s) => (
          <li key={s.id} className="rounded-2xl bg-card border border-border p-4 flex gap-3">
            <span className="h-9 w-9 grid place-items-center rounded-xl shrink-0" style={{ background: "var(--card-accent-gradient)" }}>
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium">{s.title}</h3>
              {s.description && <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{s.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ============================================================
   LISTINGS
   ============================================================ */

function ListingsSection({ data }: { data: CardData }) {
  if (!data.listingsEnabled || data.listings.length === 0) return null;
  const v = data.variants.listings;

  if (v === "stacked") {
    return (
      <section className="px-5 space-y-3">
        <SectionTitle>Sélection en vente</SectionTitle>
        {data.listings.map((l) => (
          <article key={l.id} className="rounded-2xl overflow-hidden bg-card border border-border">
            <div className="aspect-[16/9] overflow-hidden bg-muted">
              {l.img ? <img src={l.img} alt={l.title} className="h-full w-full object-cover" /> :
                <div className="h-full w-full grid place-items-center"><ImageIcon className="h-8 w-8 text-muted-foreground" /></div>}
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg leading-tight">{l.title || "Sans titre"}</h3>
              {l.meta && <p className="mt-0.5 text-xs text-muted-foreground">{l.meta}</p>}
              {l.price && <p className="mt-2 font-medium" style={{ color: "var(--card-accent)" }}>{l.price}</p>}
            </div>
          </article>
        ))}
      </section>
    );
  }

  if (v === "compact") {
    return (
      <section className="px-5">
        <SectionTitle>Sélection en vente</SectionTitle>
        <ul className="mt-3 space-y-2">
          {data.listings.map((l) => (
            <li key={l.id} className="flex gap-3 rounded-xl bg-card border border-border p-2 pr-3 items-center">
              <div className="h-16 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                {l.img ? <img src={l.img} alt={l.title} className="h-full w-full object-cover" /> :
                  <div className="h-full w-full grid place-items-center"><ImageIcon className="h-5 w-5 text-muted-foreground" /></div>}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium truncate">{l.title || "Sans titre"}</h3>
                {l.meta && <p className="text-[11px] text-muted-foreground truncate">{l.meta}</p>}
              </div>
              {l.price && <span className="text-sm font-medium shrink-0" style={{ color: "var(--card-accent)" }}>{l.price}</span>}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="">
      <div className="px-5"><SectionTitle>Sélection en vente</SectionTitle></div>
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {data.listings.map((l) => (
          <article key={l.id} className="snap-start shrink-0 w-[78%] rounded-2xl overflow-hidden bg-card border border-border">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              {l.img ? <img src={l.img} alt={l.title} className="h-full w-full object-cover" /> :
                <div className="h-full w-full grid place-items-center"><ImageIcon className="h-8 w-8 text-muted-foreground" /></div>}
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
  );
}

/* ============================================================
   TESTIMONIALS (reuse testimonialsStyle for backwards compat)
   ============================================================ */

function TestimonialsSection({ data }: { data: CardData }) {
  if (!data.testimonialsEnabled || data.testimonials.length === 0) return null;
  return (
    <section className="">
      <div className="px-5"><SectionTitle>Ils en parlent</SectionTitle></div>
      <TestimonialsBlock testimonials={data.testimonials} style={data.testimonialsStyle} />
    </section>
  );
}

/* ============================================================
   CALENDAR
   ============================================================ */

function CalendarSection({ data }: { data: CardData }) {
  if (!data.calendarEnabled || !data.calendarUrl) return null;
  const v = data.variants.calendar;
  const label = data.calendarLabel || "Réserver un rendez-vous";

  if (v === "cta") {
    return (
      <section className="px-5">
        <a href={data.calendarUrl} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-medium text-primary-foreground active:scale-[0.99] transition"
          style={{ background: "var(--card-accent-gradient)" }}>
          <Calendar className="h-4 w-4" />
          {label}
        </a>
      </section>
    );
  }

  if (v === "block") {
    return (
      <section className="px-5">
        <a href={data.calendarUrl} target="_blank" rel="noopener noreferrer"
          className="block rounded-2xl bg-card border border-border p-5 text-center active:scale-[0.99] transition">
          <span className="mx-auto h-12 w-12 grid place-items-center rounded-2xl" style={{ background: "var(--card-accent-gradient)" }}>
            <Calendar className="h-6 w-6 text-primary-foreground" />
          </span>
          <div className="mt-3 font-display text-base">{label}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Choisissez un créneau qui vous convient</div>
        </a>
      </section>
    );
  }

  return (
    <section className="px-5">
      <a href={data.calendarUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4 active:scale-[0.99] transition">
        <span className="h-11 w-11 grid place-items-center rounded-xl" style={{ background: "var(--card-accent-gradient)" }}>
          <Calendar className="h-5 w-5 text-primary-foreground" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Agenda</div>
          <div className="text-sm font-medium">{label}</div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </a>
    </section>
  );
}

/* ============================================================
   LANGUAGES
   ============================================================ */

function LanguagesSection({ data }: { data: CardData }) {
  if (!data.languagesEnabled || data.languages.length === 0) return null;
  const v = data.variants.languages;

  const levelDots = (level: string) => {
    const m: Record<string, number> = { "Débutant": 1, "Intermédiaire": 2, "Avancé": 3, "Courant": 4, "Natif": 5 };
    return m[level] ?? 3;
  };

  if (v === "list") {
    return (
      <section className="px-5">
        <SectionTitle>Langues parlées</SectionTitle>
        <ul className="mt-3 rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
          {data.languages.map((l) => {
            const n = levelDots(l.level);
            return (
              <li key={l.id} className="flex items-center gap-3 px-4 py-3">
                <LangIcon className="h-4 w-4" style={{ color: "var(--card-accent)" }} />
                <span className="flex-1 text-sm font-medium">{l.name}</span>
                <span className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full"
                      style={{ background: i < n ? "var(--card-accent)" : "oklch(0.4 0 0 / 0.3)" }} />
                  ))}
                </span>
                <span className="text-[11px] text-muted-foreground w-16 text-right">{l.level}</span>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  if (v === "grid") {
    return (
      <section className="px-5">
        <SectionTitle>Langues parlées</SectionTitle>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {data.languages.map((l) => (
            <div key={l.id} className="rounded-2xl bg-card border border-border p-3">
              <div className="flex items-center gap-2">
                <LangIcon className="h-4 w-4" style={{ color: "var(--card-accent)" }} />
                <span className="text-sm font-medium truncate">{l.name}</span>
              </div>
              {l.level && <div className="mt-1 text-[11px] text-muted-foreground">{l.level}</div>}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-5">
      <SectionTitle>Langues parlées</SectionTitle>
      <div className="mt-3 flex flex-wrap gap-2">
        {data.languages.map((l) => (
          <span key={l.id} className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1.5 text-xs">
            <LangIcon className="h-3.5 w-3.5" style={{ color: "var(--card-accent)" }} />
            <span className="font-medium">{l.name}</span>
            {l.level && <span className="text-muted-foreground">· {l.level}</span>}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   CTA
   ============================================================ */

function CtaSection({ data }: { data: CardData }) {
  if (!data.ctaEnabled) return null;
  const v = data.variants.cta;
  const hasBtn = data.ctaButtonLabel && data.ctaButtonUrl;

  if (v === "outline") {
    return (
      <section className="px-5">
        <div className="rounded-2xl border-2 p-5" style={{ borderColor: "var(--card-accent)" }}>
          <h3 className="font-display text-lg leading-tight">{data.ctaTitle}</h3>
          {data.ctaText && <p className="mt-1.5 text-sm text-muted-foreground">{data.ctaText}</p>}
          {hasBtn && (
            <a href={data.ctaButtonUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--card-accent)" }}>
              {data.ctaButtonLabel} <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </section>
    );
  }

  if (v === "bold") {
    return (
      <section className="px-5">
        <div className="rounded-2xl p-5 text-primary-foreground" style={{ background: "var(--card-accent-gradient)" }}>
          <h3 className="font-display text-xl leading-tight">{data.ctaTitle}</h3>
          {data.ctaText && <p className="mt-1.5 text-sm opacity-90">{data.ctaText}</p>}
          {hasBtn && (
            <a href={data.ctaButtonUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold bg-background text-foreground active:scale-[0.99] transition">
              {data.ctaButtonLabel} <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="px-5">
      <div className="rounded-2xl p-5 border border-border"
        style={{ background: "linear-gradient(135deg, oklch(0.22 0.02 250), oklch(0.14 0.02 250))" }}>
        <h3 className="font-display text-lg leading-tight">{data.ctaTitle}</h3>
        {data.ctaText && <p className="mt-1.5 text-sm text-muted-foreground">{data.ctaText}</p>}
        {hasBtn && (
          <a href={data.ctaButtonUrl} target="_blank" rel="noopener noreferrer"
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium text-primary-foreground active:scale-[0.99] transition"
            style={{ background: "var(--card-accent-gradient)" }}>
            {data.ctaButtonLabel} <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT
   ============================================================ */

function ContactSection({ data }: { data: CardData }) {
  if (!data.contactEnabled) return null;
  const v = data.variants.contact;
  const rows = [
    { icon: Phone, label: "Téléphone", value: data.phoneDisplay || data.phone, href: data.phone ? `tel:${data.phone}` : undefined },
    { icon: Mail,  label: "Email",     value: data.email,                       href: data.email ? `mailto:${data.email}` : undefined },
    { icon: Globe, label: "Site web",  value: data.website,                     href: data.website ? `https://${data.website}` : undefined },
    { icon: MapPin, label: "Secteur",  value: data.area,                        href: undefined as string | undefined },
  ].filter((r) => r.value);

  if (v === "grid") {
    return (
      <section className="px-5">
        <SectionTitle>Coordonnées</SectionTitle>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {rows.map((r, i) => {
            const Inner = (
              <div className="rounded-2xl bg-card border border-border p-3">
                <span className="h-8 w-8 grid place-items-center rounded-xl bg-accent">
                  <r.icon className="h-4 w-4" style={{ color: "var(--card-accent)" }} />
                </span>
                <div className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">{r.label}</div>
                <div className="text-xs font-medium truncate">{r.value}</div>
              </div>
            );
            return r.href
              ? <a key={i} href={r.href} className="active:scale-[0.99] transition">{Inner}</a>
              : <div key={i}>{Inner}</div>;
          })}
        </div>
      </section>
    );
  }

  if (v === "compact") {
    return (
      <section className="px-5">
        <SectionTitle>Coordonnées</SectionTitle>
        <ul className="mt-3 space-y-1.5">
          {rows.map((r, i) => {
            const Inner = (
              <div className="flex items-center gap-3 py-1.5">
                <r.icon className="h-4 w-4 shrink-0" style={{ color: "var(--card-accent)" }} />
                <span className="text-sm truncate">{r.value}</span>
              </div>
            );
            return <li key={i}>{r.href ? <a href={r.href} className="block">{Inner}</a> : Inner}</li>;
          })}
        </ul>
      </section>
    );
  }

  return (
    <section className="px-5">
      <SectionTitle>Coordonnées</SectionTitle>
      <ul className="mt-3 rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
        <ContactRow icon={Phone}  label="Téléphone" value={data.phoneDisplay || data.phone} href={`tel:${data.phone}`} />
        <ContactRow icon={Mail}   label="Email"     value={data.email}   href={`mailto:${data.email}`} />
        <ContactRow icon={Globe}  label="Site web"  value={data.website} href={`https://${data.website}`} />
        <ContactRow icon={MapPin} label="Secteur"   value={data.area} />
      </ul>
    </section>
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

/* ============================================================
   SOCIALS
   ============================================================ */

const SOCIAL_BRAND: Record<string, string> = {
  LinkedIn:  "oklch(0.55 0.13 245)",
  Instagram: "oklch(0.65 0.2 15)",
  WhatsApp:  "oklch(0.7 0.17 150)",
};

function SocialsSection({ data }: { data: CardData }) {
  if (!data.socialsEnabled) return null;
  const v = data.variants.socials;
  const items = [
    data.linkedin       && { icon: Linkedin,      label: "LinkedIn",  href: data.linkedin },
    data.instagram      && { icon: Instagram,     label: "Instagram", href: data.instagram },
    data.whatsappSocial && { icon: MessageCircle, label: "WhatsApp",  href: `https://wa.me/${data.whatsappSocial}` },
  ].filter(Boolean) as Array<{ icon: any; label: string; href: string }>;
  if (items.length === 0) return null;

  if (v === "pills") {
    return (
      <section className="px-5 space-y-2">
        {items.map((it, i) => (
          <a key={i} href={it.href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-card border border-border px-4 py-3 active:scale-[0.99] transition">
            <it.icon className="h-4 w-4" style={{ color: "var(--card-accent)" }} />
            <span className="text-sm font-medium flex-1">{it.label}</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        ))}
      </section>
    );
  }

  if (v === "branded") {
    return (
      <section className="px-5 flex justify-center gap-3">
        {items.map((it, i) => (
          <a key={i} href={it.href} target="_blank" rel="noopener noreferrer" aria-label={it.label}
            className="h-12 w-12 grid place-items-center rounded-2xl active:scale-95 transition"
            style={{ background: SOCIAL_BRAND[it.label] }}>
            <it.icon className="h-5 w-5 text-white" />
          </a>
        ))}
      </section>
    );
  }

  return (
    <section className="px-5 flex justify-center gap-3">
      {items.map((it, i) => (
        <a key={i} href={it.href} target="_blank" rel="noopener noreferrer" aria-label={it.label}
          className="h-11 w-11 grid place-items-center rounded-full bg-card border border-border active:scale-95 transition">
          <it.icon className="h-5 w-5" style={{ color: "var(--card-accent)" }} />
        </a>
      ))}
    </section>
  );
}

/* ============================================================
   Shared helpers
   ============================================================ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-xs uppercase tracking-[0.18em]" style={{ color: "var(--card-accent)" }}>{children}</h2>;
}

function parseYoutubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/\/(embed|shorts)\/([\w-]{6,})/);
      if (m) return m[2];
    }
  } catch {
    const m = url.match(/[\w-]{11}/);
    if (m) return m[0];
  }
  return null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5"
          fill={i < rating ? "currentColor" : "transparent"}
          style={{ color: "var(--card-accent)" }} strokeWidth={1.5} />
      ))}
    </div>
  );
}

function Avatar({ photo, name, size = 40 }: { photo: string; name: string; size?: number }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");
  return (
    <span
      className="grid place-items-center rounded-full overflow-hidden bg-muted border border-border shrink-0 text-xs font-medium"
      style={{ width: size, height: size }}
    >
      {photo
        ? <img src={photo} alt={name} className="h-full w-full object-cover" />
        : <span className="text-muted-foreground">{initials || "?"}</span>}
    </span>
  );
}

function TestimonialLinkWrap({ link, children }: { link?: string; children: React.ReactNode }) {
  if (!link) return <>{children}</>;
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block active:opacity-90 transition">
      {children}
    </a>
  );
}

function TestimonialsBlock({ testimonials, style }: { testimonials: Testimonial[]; style: TestimonialsStyle }) {
  if (style === "stacked") {
    return (
      <ul className="mt-3 px-5 space-y-3">
        {testimonials.map((t) => (
          <li key={t.id}>
            <TestimonialLinkWrap link={t.link}>
              <article className="rounded-2xl bg-card border border-border p-4">
                <div className="flex items-start gap-3">
                  <Avatar photo={t.photo} name={t.name} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{t.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{t.role}</div>
                      </div>
                      <Stars rating={t.rating} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">« {t.text} »</p>
                    {t.link && (
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px]" style={{ color: "var(--card-accent)" }}>
                        Voir l'avis <ExternalLink className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </TestimonialLinkWrap>
          </li>
        ))}
      </ul>
    );
  }

  if (style === "compact") {
    return (
      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {testimonials.map((t) => (
          <TestimonialLinkWrap key={t.id} link={t.link}>
            <article className="snap-start shrink-0 w-[68%] rounded-xl bg-card border border-border p-3">
              <div className="flex items-center gap-2">
                <Avatar photo={t.photo} name={t.name} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate">{t.name}</div>
                  <Stars rating={t.rating} />
                </div>
              </div>
              <p className="mt-2 text-xs leading-snug text-muted-foreground line-clamp-3">« {t.text} »</p>
            </article>
          </TestimonialLinkWrap>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {testimonials.map((t) => (
        <TestimonialLinkWrap key={t.id} link={t.link}>
          <article className="snap-start shrink-0 w-[82%] rounded-2xl bg-card border border-border p-4 relative">
            <Quote className="absolute top-3 right-3 h-5 w-5 opacity-30" style={{ color: "var(--card-accent)" }} />
            <Stars rating={t.rating} />
            <p className="mt-3 text-sm leading-relaxed">« {t.text} »</p>
            <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
              <Avatar photo={t.photo} name={t.name} size={36} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{t.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{t.role}</div>
              </div>
              {t.link && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
            </div>
          </article>
        </TestimonialLinkWrap>
      ))}
    </div>
  );
}
