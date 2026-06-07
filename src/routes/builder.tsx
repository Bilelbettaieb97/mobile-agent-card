import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Upload, Plus, Trash2, RotateCcw, Eye, X, ExternalLink, Sparkles, GripVertical, Grid3x3, Check,
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { useCardStore } from "@/lib/card-store";
import type { CardData, Listing, Badge, Stat, BrickId, TestimonialsStyle } from "@/lib/card-types";
import { BRICK_VARIANTS } from "@/lib/brick-variants";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Builder — Carte de visite digitale" },
      { name: "description", content: "Construisez votre carte de visite digitale brique par brique, avec aperçu mobile en direct." },
    ],
  }),
  component: BuilderPage,
});

function BuilderPage() {
  const { data, setData, update, reset, hydrated } = useCardStore();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [gridOn, setGridOn] = useState(false);

  if (!hydrated) {
    return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground">Chargement…</div>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md grid place-items-center" style={{ background: "var(--gradient-gold)" }}>
              <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.4} />
            </div>
            <span className="font-display text-base">Builder</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1.5" /> Réinitialiser
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-1.5" /> Voir démo
              </Button>
            </Link>
            <Button size="sm" className="lg:hidden" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4 mr-1.5" /> Aperçu
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
        {/* LEFT: editor */}
        <section>
          <h1 className="font-display text-3xl mb-1">Composez votre carte</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Activez une brique, remplissez les champs — l'aperçu se met à jour en direct.
          </p>

          <BrickList data={data} update={update} setData={setData} />


          <div className="mt-8 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "carte.json"; a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Exporter JSON
            </Button>
            <ImportJsonButton onImport={setData} />
          </div>
        </section>

        {/* RIGHT: preview (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">Aperçu live</p>
              <Button
                variant={gridOn ? "default" : "outline"}
                size="sm"
                onClick={() => setGridOn((v) => !v)}
                aria-pressed={gridOn}
              >
                <Grid3x3 className="h-4 w-4 mr-1.5" />
                Grille
              </Button>
            </div>
            <PhoneFrame gridOverlay={gridOn}><BusinessCard data={data} /></PhoneFrame>
          </div>
        </aside>
      </div>

      {/* Mobile preview drawer */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col">
          <div className="flex items-center justify-between p-4">
            <Button
              variant={gridOn ? "default" : "outline"}
              size="sm"
              onClick={() => setGridOn((v) => !v)}
              aria-pressed={gridOn}
            >
              <Grid3x3 className="h-4 w-4 mr-1.5" />
              Grille
            </Button>
            <button onClick={() => setPreviewOpen(false)} className="h-10 w-10 grid place-items-center rounded-full bg-card border border-border">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pb-8">
            <PhoneFrame gridOverlay={gridOn}><BusinessCard data={data} /></PhoneFrame>
          </div>
        </div>
      )}

    </main>
  );
}

/* ---------- Brick shell ---------- */

const BRICK_META: Record<BrickId, { title: string; subtitle: string }> = {
  identity:     { title: "Identité",            subtitle: "Photo, nom, titre, agence" },
  actions:      { title: "Actions rapides",     subtitle: "Appel, WhatsApp, Mail, Site" },
  vcard:        { title: "Enregistrer le contact", subtitle: "Bouton vCard" },
  stats:        { title: "Statistiques",        subtitle: "Chiffres clés" },
  about:        { title: "À propos",            subtitle: "Bio + badges" },
  video:        { title: "Vidéo de présentation", subtitle: "Lien YouTube" },
  services:     { title: "Services",            subtitle: "Vos offres / prestations" },
  listings:     { title: "Sélection de biens",  subtitle: "Vos annonces phares" },
  testimonials: { title: "Témoignages",         subtitle: "Avis clients" },
  calendar:     { title: "Prendre rendez-vous", subtitle: "Lien Calendly / agenda" },
  languages:    { title: "Langues parlées",     subtitle: "Idiomes & niveau" },
  cta:          { title: "Bannière CTA",        subtitle: "Encart d'appel à l'action" },
  contact:      { title: "Coordonnées",         subtitle: "Téléphone, mail, site, secteur" },
  socials:      { title: "Réseaux sociaux",     subtitle: "LinkedIn, Instagram, WhatsApp" },
  theme:        { title: "Thème",               subtitle: "Couleur d'accent" },
};

function BrickList({ data, update, setData }: {
  data: CardData;
  update: <K extends keyof CardData>(k: K, v: CardData[K]) => void;
  setData: (d: CardData) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = data.sectionOrder.indexOf(active.id as BrickId);
    const newIdx = data.sectionOrder.indexOf(over.id as BrickId);
    if (oldIdx < 0 || newIdx < 0) return;
    setData({ ...data, sectionOrder: arrayMove(data.sectionOrder, oldIdx, newIdx) });
  };

  const wrap = (id: BrickId, body: ReactNode): ReactNode => (
    <div className="space-y-4">
      <VariantPicker brick={id} data={data} update={update} />
      {body}
    </div>
  );

  const renderBody = (id: BrickId): ReactNode => {
    switch (id) {
      case "identity":     return wrap(id, <IdentityBrick data={data} update={update} />);
      case "actions":      return wrap(id, <ActionsBrick data={data} update={update} />);
      case "vcard":        return wrap(id, <p className="text-sm text-muted-foreground">Affiche un bouton « Enregistrer le contact » qui télécharge un fichier .vcf compatible iPhone/Android.</p>);
      case "stats":        return wrap(id, <StatsBrick data={data} update={update} />);
      case "about":        return wrap(id, <AboutBrick data={data} update={update} />);
      case "video":        return wrap(id, <VideoBrick data={data} update={update} />);
      case "services":     return wrap(id, <ServicesBrick data={data} update={update} />);
      case "listings":     return wrap(id, <ListingsBrick data={data} update={update} />);
      case "testimonials": return <TestimonialsBrick data={data} update={update} />;
      case "calendar":     return wrap(id, <CalendarBrick data={data} update={update} />);
      case "languages":    return wrap(id, <LanguagesBrick data={data} update={update} />);
      case "cta":          return wrap(id, <CtaBrick data={data} update={update} />);
      case "contact":      return wrap(id, <ContactBrick data={data} update={update} />);
      case "socials":      return wrap(id, <SocialsBrick data={data} update={update} />);
      case "theme":        return <ThemeBrick data={data} update={update} />;
    }

  };

  const enabledOf = (id: BrickId): boolean | undefined => {
    switch (id) {
      case "actions":      return Object.values(data.actions).some(Boolean);
      case "vcard":        return data.vcardEnabled;
      case "stats":        return data.statsEnabled;
      case "about":        return data.aboutEnabled;
      case "video":        return data.videoEnabled;
      case "services":     return data.servicesEnabled;
      case "listings":     return data.listingsEnabled;
      case "testimonials": return data.testimonialsEnabled;
      case "calendar":     return data.calendarEnabled;
      case "languages":    return data.languagesEnabled;
      case "cta":          return data.ctaEnabled;
      case "contact":      return data.contactEnabled;
      case "socials":      return data.socialsEnabled;
      default:             return undefined;
    }
  };

  const toggleOf = (id: BrickId) => (v: boolean) => {
    switch (id) {
      case "actions":      update("actions", { call: v, whatsapp: v, email: v, website: v }); break;
      case "vcard":        update("vcardEnabled", v); break;
      case "stats":        update("statsEnabled", v); break;
      case "about":        update("aboutEnabled", v); break;
      case "video":        update("videoEnabled", v); break;
      case "services":     update("servicesEnabled", v); break;
      case "listings":     update("listingsEnabled", v); break;
      case "testimonials": update("testimonialsEnabled", v); break;
      case "calendar":     update("calendarEnabled", v); break;
      case "languages":    update("languagesEnabled", v); break;
      case "cta":          update("ctaEnabled", v); break;
      case "contact":      update("contactEnabled", v); break;
      case "socials":      update("socialsEnabled", v); break;
    }
  };


  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={data.sectionOrder} strategy={verticalListSortingStrategy}>
        <Accordion type="single" collapsible defaultValue={data.sectionOrder[0]} className="space-y-3">
          {data.sectionOrder.map((id) => {
            const meta = BRICK_META[id];
            const alwaysOn = id === "identity" || id === "theme";
            return (
              <SortableBrick
                key={id}
                id={id}
                title={meta.title}
                subtitle={meta.subtitle}
                alwaysOn={alwaysOn}
                enabled={alwaysOn ? undefined : enabledOf(id)}
                onToggle={alwaysOn ? undefined : toggleOf(id)}
              >
                {renderBody(id)}
              </SortableBrick>
            );
          })}
        </Accordion>
      </SortableContext>
    </DndContext>
  );
}

function SortableBrick({
  id, title, subtitle, children, enabled, onToggle, alwaysOn,
}: {
  id: BrickId; title: string; subtitle?: string; children: ReactNode;
  enabled?: boolean; onToggle?: (v: boolean) => void; alwaysOn?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 30 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem value={id} className="border border-border rounded-2xl bg-card overflow-hidden data-[state=open]:shadow-[var(--shadow-elegant)]">
        <div className="flex items-center pr-4">
          <button
            type="button"
            aria-label="Réordonner la brique"
            className="px-2 py-4 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <AccordionTrigger className="flex-1 px-1 py-4 hover:no-underline">
            <div className="text-left">
              <div className="font-medium">{title}</div>
              {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
            </div>
          </AccordionTrigger>
          {alwaysOn ? (
            <span className="text-[10px] uppercase tracking-wider text-primary ml-2">Toujours actif</span>
          ) : (
            <Switch checked={!!enabled} onCheckedChange={onToggle} onClick={(e) => e.stopPropagation()} />
          )}
        </div>
        <AccordionContent className="px-4 pb-5 pt-1">{children}</AccordionContent>
      </AccordionItem>
    </div>
  );
}


/* ---------- Brick contents ---------- */

type BrickProps = { data: CardData; update: <K extends keyof CardData>(k: K, v: CardData[K]) => void };

function IdentityBrick({ data, update }: BrickProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => update("photo", String(reader.result));
    reader.readAsDataURL(f);
  };
  const onCover = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => update("coverPhoto", String(reader.result));
    reader.readAsDataURL(f);
  };
  const isCover = data.variants.identity === "cover";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-muted border border-border grid place-items-center shrink-0">
          {data.photo ? <img src={data.photo} alt="" className="h-full w-full object-cover" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1.5" /> Importer une photo
          </Button>
          {data.photo && <Button type="button" variant="ghost" size="sm" onClick={() => update("photo", "")}>Retirer</Button>}
        </div>
      </div>
      <Field label="Nom complet"><Input value={data.name} onChange={(e) => update("name", e.target.value)} /></Field>
      <Field label="Titre / poste"><Input value={data.title} onChange={(e) => update("title", e.target.value)} /></Field>
      <Field label="Agence"><Input value={data.agency} onChange={(e) => update("agency", e.target.value)} /></Field>
      <Field label="Secteur géographique"><Input value={data.area} onChange={(e) => update("area", e.target.value)} /></Field>

      {isCover && (
        <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-medium">Photo de couverture</div>
              <div className="text-xs text-muted-foreground">Affichée en bannière derrière votre photo.</div>
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onCover(f); }} />
            <Button type="button" variant="outline" size="sm" onClick={() => coverRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1.5" /> Importer
            </Button>
          </div>
          {data.coverPhoto && (
            <div className="space-y-2">
              <div className="aspect-[16/9] w-full rounded-md overflow-hidden bg-muted border border-border">
                <img src={data.coverPhoto} alt="" className="h-full w-full object-cover" />
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => update("coverPhoto", "")}>Retirer la couverture</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActionsBrick({ data, update }: BrickProps) {
  const toggle = (k: keyof CardData["actions"]) => (v: boolean) => update("actions", { ...data.actions, [k]: v });
  return (
    <div className="space-y-3">
      <Row label="Appel"><Switch checked={data.actions.call} onCheckedChange={toggle("call")} /></Row>
      <Row label="WhatsApp"><Switch checked={data.actions.whatsapp} onCheckedChange={toggle("whatsapp")} /></Row>
      <Row label="Email"><Switch checked={data.actions.email} onCheckedChange={toggle("email")} /></Row>
      <Row label="Site web"><Switch checked={data.actions.website} onCheckedChange={toggle("website")} /></Row>
      <p className="text-xs text-muted-foreground pt-1">Les valeurs (numéro, email…) se règlent dans la brique « Coordonnées ».</p>
    </div>
  );
}

function StatsBrick({ data, update }: BrickProps) {
  const setStat = (i: number, patch: Partial<Stat>) => update("stats", data.stats.map((s, idx) => idx === i ? { ...s, ...patch } : s));
  const add = () => data.stats.length < 4 && update("stats", [...data.stats, { label: "Label", value: "0" }]);
  const remove = (i: number) => update("stats", data.stats.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3">
      {data.stats.map((s, i) => (
        <div key={i} className="flex gap-2 items-end">
          <Field label="Valeur" className="w-24"><Input value={s.value} onChange={(e) => setStat(i, { value: e.target.value })} /></Field>
          <Field label="Label" className="flex-1"><Input value={s.label} onChange={(e) => setStat(i, { label: e.target.value })} /></Field>
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
      {data.stats.length < 4 && <Button type="button" variant="outline" size="sm" onClick={add}><Plus className="h-4 w-4 mr-1.5" />Ajouter une stat</Button>}
    </div>
  );
}

function AboutBrick({ data, update }: BrickProps) {
  const setBadge = (i: number, label: string) => update("badges", data.badges.map((b, idx) => idx === i ? { ...b, label } : b));
  const addBadge = () => update("badges", [...data.badges, { id: crypto.randomUUID(), label: "Nouveau badge" }]);
  const removeBadge = (id: string) => update("badges", data.badges.filter((b) => b.id !== id));
  return (
    <div className="space-y-3">
      <Field label="Bio (2-3 lignes)"><Textarea rows={4} value={data.bio} onChange={(e) => update("bio", e.target.value)} /></Field>
      <div>
        <Label className="text-xs">Badges</Label>
        <div className="mt-2 space-y-2">
          {data.badges.map((b, i) => (
            <div key={b.id} className="flex gap-2">
              <Input value={b.label} onChange={(e) => setBadge(i, e.target.value)} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeBadge(b.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addBadge}><Plus className="h-4 w-4 mr-1.5" />Ajouter un badge</Button>
        </div>
      </div>
    </div>
  );
}

function ListingsBrick({ data, update }: BrickProps) {
  const setListing = (id: string, patch: Partial<Listing>) =>
    update("listings", data.listings.map((l) => l.id === id ? { ...l, ...patch } : l));
  const add = () => update("listings", [...data.listings, { id: crypto.randomUUID(), img: "", title: "Nouveau bien", meta: "", price: "" }]);
  const remove = (id: string) => update("listings", data.listings.filter((l) => l.id !== id));
  const onImage = (id: string, f: File) => {
    const reader = new FileReader();
    reader.onload = () => setListing(id, { img: String(reader.result) });
    reader.readAsDataURL(f);
  };
  return (
    <div className="space-y-4">
      {data.listings.length === 0 && <p className="text-sm text-muted-foreground">Aucun bien. Ajoutez votre première annonce.</p>}
      {data.listings.map((l) => (
        <div key={l.id} className="rounded-xl border border-border p-3 space-y-2">
          <div className="flex gap-3">
            <label className="h-16 w-16 rounded-lg overflow-hidden bg-muted grid place-items-center cursor-pointer shrink-0">
              {l.img ? <img src={l.img} alt="" className="h-full w-full object-cover" /> : <Upload className="h-4 w-4 text-muted-foreground" />}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImage(l.id, f); }} />
            </label>
            <div className="flex-1 space-y-2">
              <Input placeholder="Titre" value={l.title} onChange={(e) => setListing(l.id, { title: e.target.value })} />
              <Input placeholder="120 m² · 3 pièces" value={l.meta} onChange={(e) => setListing(l.id, { meta: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2">
            <Input placeholder="2 450 000 €" value={l.price} onChange={(e) => setListing(l.id, { price: e.target.value })} />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}><Plus className="h-4 w-4 mr-1.5" />Ajouter un bien</Button>
    </div>
  );
}

function ContactBrick({ data, update }: BrickProps) {
  return (
    <div className="space-y-3">
      <Field label="Téléphone (format E.164, ex: +33612345678)">
        <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} />
      </Field>
      <Field label="Téléphone (affichage)">
        <Input value={data.phoneDisplay} onChange={(e) => update("phoneDisplay", e.target.value)} placeholder="+33 6 12 34 56 78" />
      </Field>
      <Field label="Email"><Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} /></Field>
      <Field label="Site web (sans https)"><Input value={data.website} onChange={(e) => update("website", e.target.value)} /></Field>
      <Field label="WhatsApp (numéro sans +, ex: 33612345678)"><Input value={data.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} /></Field>
    </div>
  );
}

function SocialsBrick({ data, update }: BrickProps) {
  return (
    <div className="space-y-3">
      <Field label="LinkedIn (URL complète)"><Input value={data.linkedin} onChange={(e) => update("linkedin", e.target.value)} /></Field>
      <Field label="Instagram (URL complète)"><Input value={data.instagram} onChange={(e) => update("instagram", e.target.value)} /></Field>
      <Field label="WhatsApp (numéro sans +)"><Input value={data.whatsappSocial} onChange={(e) => update("whatsappSocial", e.target.value)} /></Field>
    </div>
  );
}

import {
  CARD_THEMES,
  PROFESSIONS,
  PROFESSION_CATEGORIES,
  PROFESSIONS_BY_THEME,
  THEMES_BY_ID,
} from "@/lib/card-themes";

function ThemeBrick({ data, update }: BrickProps) {
  const [tab, setTab] = useState<"profession" | "theme">(
    data.profession ? "profession" : "theme",
  );
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const activeTheme = THEMES_BY_ID[data.accent];
  const activeProfession = data.profession
    ? PROFESSIONS.find((p) => p.id === data.profession)
    : undefined;

  const applyProfession = (profId: string, themeId: string) => {
    update("profession", profId);
    update("accent", themeId as typeof data.accent);
  };

  // Auto-scroll active profession into view when switching to that tab
  useEffect(() => {
    if (tab === "profession" && activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [tab]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? PROFESSIONS.filter(
        (p) =>
          p.label.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    : PROFESSIONS;

  const grouped = PROFESSION_CATEGORIES.map((cat) => ({
    cat,
    items: filtered.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-3">
      {/* Sélection courante */}
      <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-3 flex items-center gap-3">
        <span
          className="h-11 w-11 rounded-lg shrink-0 border relative overflow-hidden ring-2 ring-primary/50 ring-offset-2 ring-offset-card"
          style={{ background: activeTheme.palette.bg, borderColor: activeTheme.palette.border }}
          aria-hidden
        >
          <span className="absolute inset-1 rounded-md" style={{ background: activeTheme.palette.surface }} />
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full animate-pulse" style={{ background: activeTheme.palette.gradient }} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-wider text-primary font-medium">Sélection actuelle</div>
          <div className="text-sm font-medium truncate">
            {activeProfession ? activeProfession.label : "Thème personnalisé"}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            Palette : {activeTheme.label}
            {activeProfession && <span> · {activeProfession.category}</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
        <button
          type="button"
          onClick={() => setTab("profession")}
          className={`px-3 py-1.5 rounded-md transition ${tab === "profession" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
        >
          Par métier
        </button>
        <button
          type="button"
          onClick={() => setTab("theme")}
          className={`px-3 py-1.5 rounded-md transition ${tab === "theme" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
        >
          Par thème
        </button>
      </div>

      {tab === "profession" ? (
        <div className="space-y-3">
          <Input
            placeholder="Rechercher un métier…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div ref={listRef} className="max-h-[420px] overflow-y-auto space-y-4 pr-1">
            {grouped.map(({ cat, items }) => (
              <div key={cat}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                  {cat}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {items.map((p) => {
                    const theme = THEMES_BY_ID[p.themeId];
                    const active = data.profession === p.id;
                    return (
                      <button
                        key={p.id}
                        ref={active ? activeRef : undefined}
                        type="button"
                        onClick={() => applyProfession(p.id, p.themeId)}
                        className={`relative flex items-center gap-2.5 rounded-lg border p-2 text-left transition ${
                          active
                            ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2 ring-offset-card"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <span
                          className="h-7 w-7 rounded-md shrink-0 border relative overflow-hidden"
                          style={{ background: theme.palette.bg, borderColor: theme.palette.border }}
                          aria-hidden
                        >
                          <span className="absolute inset-1 rounded-sm" style={{ background: theme.palette.surface }} />
                          <span className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full ${active ? "animate-pulse" : ""}`} style={{ background: theme.palette.gradient }} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-medium truncate">{p.label}</span>
                          <span className="block text-[10px] text-muted-foreground truncate">Thème {theme.label}</span>
                        </span>
                        {active && (
                          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium px-2 py-0.5">
                            <Check className="h-3 w-3" strokeWidth={3} />
                            Actif
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {grouped.length === 0 && (
              <div className="text-xs text-muted-foreground py-6 text-center">Aucun métier ne correspond.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {CARD_THEMES.map((t) => {
            const active = data.accent === t.id;
            const p = t.palette;
            const suggested = PROFESSIONS_BY_THEME[t.id] ?? [];
            const hint = suggested.slice(0, 2).map((s) => s.label).join(", ");
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  update("accent", t.id as typeof data.accent);
                  update("profession", undefined);
                }}
                className={`relative flex items-center gap-2.5 rounded-xl border p-2 text-left transition ${
                  active
                    ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2 ring-offset-card"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                <span
                  className="h-10 w-10 rounded-lg shrink-0 border overflow-hidden relative"
                  style={{ background: p.bg, borderColor: p.border }}
                  aria-hidden
                >
                  <span className="absolute inset-1 rounded-md" style={{ background: p.surface, borderColor: p.border, borderWidth: 1, borderStyle: "solid" }} />
                  <span className={`absolute bottom-1 right-1 h-3 w-3 rounded-full ${active ? "animate-pulse" : ""}`} style={{ background: p.gradient }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium truncate">{t.label}</span>
                  <span className="block text-[10px] text-muted-foreground truncate">{hint || t.sector}</span>
                </span>
                {active && (
                  <span className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground grid place-items-center shadow">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="flex items-center justify-between"><span className="text-sm">{label}</span>{children}</div>;
}

function ImportJsonButton({ onImport }: { onImport: (d: CardData) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" accept="application/json" className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]; if (!f) return;
          const reader = new FileReader();
          reader.onload = () => { try { onImport(JSON.parse(String(reader.result))); } catch {} };
          reader.readAsText(f);
        }} />
      <Button variant="ghost" onClick={() => ref.current?.click()}>Importer JSON</Button>
    </>
  );
}

/* ---------- Additional brick bodies ---------- */

function VideoBrick({ data, update }: BrickProps) {
  return (
    <div className="space-y-3">
      <Field label="Titre de la vidéo">
        <Input value={data.videoTitle} onChange={(e) => update("videoTitle", e.target.value)} />
      </Field>
      <Field label="Lien YouTube (watch, youtu.be ou shorts)">
        <Input value={data.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
      </Field>
      <p className="text-xs text-muted-foreground">L'aperçu intègre la vidéo via youtube.com/embed.</p>
    </div>
  );
}

function ServicesBrick({ data, update }: BrickProps) {
  const set = (id: string, patch: Partial<typeof data.services[number]>) =>
    update("services", data.services.map((s) => s.id === id ? { ...s, ...patch } : s));
  const add = () => update("services", [...data.services, { id: crypto.randomUUID(), title: "Nouveau service", description: "" }]);
  const remove = (id: string) => update("services", data.services.filter((s) => s.id !== id));
  return (
    <div className="space-y-3">
      {data.services.map((s) => (
        <div key={s.id} className="rounded-xl border border-border p-3 space-y-2">
          <Input placeholder="Titre" value={s.title} onChange={(e) => set(s.id, { title: e.target.value })} />
          <Textarea rows={2} placeholder="Description courte" value={s.description} onChange={(e) => set(s.id, { description: e.target.value })} />
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}><Plus className="h-4 w-4 mr-1.5" />Ajouter un service</Button>
    </div>
  );
}

const TESTIMONIAL_STYLES: { id: TestimonialsStyle; label: string; hint: string }[] = [
  { id: "cards",   label: "Cartes",    hint: "Carrousel large avec citation" },
  { id: "stacked", label: "Empilées",  hint: "Liste verticale, avatar à gauche" },
  { id: "compact", label: "Compactes", hint: "Mini-cartes plus denses" },
];

function TestimonialsBrick({ data, update }: BrickProps) {
  const set = (id: string, patch: Partial<typeof data.testimonials[number]>) =>
    update("testimonials", data.testimonials.map((t) => t.id === id ? { ...t, ...patch } : t));
  const add = () => update("testimonials", [...data.testimonials, {
    id: crypto.randomUUID(), name: "Prénom N.", role: "Client", text: "", rating: 5, photo: "", link: "",
  }]);
  const remove = (id: string) => update("testimonials", data.testimonials.filter((t) => t.id !== id));
  const onPhoto = (id: string, f: File) => {
    const reader = new FileReader();
    reader.onload = () => set(id, { photo: String(reader.result) });
    reader.readAsDataURL(f);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Style du carrousel</Label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TESTIMONIAL_STYLES.map((s) => {
            const active = data.testimonialsStyle === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => update("testimonialsStyle", s.id)}
                className={`rounded-xl border p-2.5 text-left transition ${active ? "border-primary bg-accent/40" : "border-border hover:border-foreground/30"}`}
              >
                <div className="text-xs font-medium">{s.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {data.testimonials.map((t) => (
          <div key={t.id} className="rounded-xl border border-border p-3 space-y-3">
            <div className="flex gap-3">
              <label className="h-14 w-14 rounded-full overflow-hidden bg-muted border border-border grid place-items-center cursor-pointer shrink-0">
                {t.photo
                  ? <img src={t.photo} alt="" className="h-full w-full object-cover" />
                  : <Upload className="h-4 w-4 text-muted-foreground" />}
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) onPhoto(t.id, f); }} />
              </label>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input placeholder="Nom" value={t.name} onChange={(e) => set(t.id, { name: e.target.value })} />
                <Input placeholder="Rôle / contexte" value={t.role} onChange={(e) => set(t.id, { role: e.target.value })} />
              </div>
            </div>

            {t.photo && (
              <button type="button" onClick={() => set(t.id, { photo: "" })}
                className="text-[11px] text-muted-foreground hover:text-foreground">
                Retirer la photo
              </button>
            )}

            <Textarea rows={3} placeholder="Témoignage" value={t.text} onChange={(e) => set(t.id, { text: e.target.value })} />

            <div className="grid grid-cols-[6rem_1fr] gap-2">
              <Field label="Note (1-5)">
                <Input type="number" min={1} max={5} value={t.rating}
                  onChange={(e) => set(t.id, { rating: Math.max(1, Math.min(5, Number(e.target.value) || 5)) })} />
              </Field>
              <Field label="Lien (optionnel)">
                <Input placeholder="https://google.com/avis/..." value={t.link}
                  onChange={(e) => set(t.id, { link: e.target.value })} />
              </Field>
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(t.id)}>
                <Trash2 className="h-4 w-4 mr-1.5" /> Supprimer
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-4 w-4 mr-1.5" />Ajouter un témoignage
        </Button>
      </div>
    </div>
  );
}


function CalendarBrick({ data, update }: BrickProps) {
  return (
    <div className="space-y-3">
      <Field label="Libellé du bouton"><Input value={data.calendarLabel} onChange={(e) => update("calendarLabel", e.target.value)} /></Field>
      <Field label="URL (Calendly, Cal.com, Google Calendar…)">
        <Input value={data.calendarUrl} onChange={(e) => update("calendarUrl", e.target.value)} placeholder="https://calendly.com/..." />
      </Field>
    </div>
  );
}

function LanguagesBrick({ data, update }: BrickProps) {
  const set = (id: string, patch: Partial<typeof data.languages[number]>) =>
    update("languages", data.languages.map((l) => l.id === id ? { ...l, ...patch } : l));
  const add = () => update("languages", [...data.languages, { id: crypto.randomUUID(), name: "Langue", level: "Courant" }]);
  const remove = (id: string) => update("languages", data.languages.filter((l) => l.id !== id));
  return (
    <div className="space-y-2">
      {data.languages.map((l) => (
        <div key={l.id} className="flex gap-2">
          <Input placeholder="Langue" value={l.name} onChange={(e) => set(l.id, { name: e.target.value })} />
          <Input placeholder="Niveau" value={l.level} onChange={(e) => set(l.id, { level: e.target.value })} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}><Plus className="h-4 w-4 mr-1.5" />Ajouter une langue</Button>
    </div>
  );
}

function CtaBrick({ data, update }: BrickProps) {
  return (
    <div className="space-y-3">
      <Field label="Titre"><Input value={data.ctaTitle} onChange={(e) => update("ctaTitle", e.target.value)} /></Field>
      <Field label="Texte"><Textarea rows={2} value={data.ctaText} onChange={(e) => update("ctaText", e.target.value)} /></Field>
      <Field label="Libellé du bouton"><Input value={data.ctaButtonLabel} onChange={(e) => update("ctaButtonLabel", e.target.value)} /></Field>
      <Field label="URL du bouton"><Input value={data.ctaButtonUrl} onChange={(e) => update("ctaButtonUrl", e.target.value)} /></Field>
    </div>
  );
}


/* ---------- Variant picker ---------- */

function VariantPicker({ brick, data, update }: { brick: BrickId; data: CardData; update: BrickProps["update"] }) {
  const options = BRICK_VARIANTS[brick];
  if (!options || options.length < 2) return null;
  const current = (data.variants as Record<string, string>)[brick];
  return (
    <div>
      <Label className="text-xs">Style</Label>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {options.map((o) => {
          const active = current === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => update("variants", { ...data.variants, [brick]: o.id } as CardData["variants"])}
              className={`rounded-xl border p-2.5 text-left transition ${active ? "border-primary bg-accent/40" : "border-border hover:border-foreground/30"}`}
            >
              <div className="text-xs font-medium">{o.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{o.hint}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
