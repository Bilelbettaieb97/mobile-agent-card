import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, type ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Upload, Plus, Trash2, RotateCcw, Eye, X, ExternalLink, Sparkles,
} from "lucide-react";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { useCardStore } from "@/lib/card-store";
import type { CardData, Listing, Badge, Stat, ThemeAccent } from "@/lib/card-types";
import { useState } from "react";

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

          <Accordion type="single" collapsible defaultValue="identity" className="space-y-3">
            <Brick id="identity" title="Identité" subtitle="Photo, nom, titre, agence" alwaysOn>
              <IdentityBrick data={data} update={update} />
            </Brick>

            <Brick id="actions" title="Actions rapides" subtitle="Appel, WhatsApp, Mail, Site"
              enabled={Object.values(data.actions).some(Boolean)}
              onToggle={(v) => update("actions", { call: v, whatsapp: v, email: v, website: v })}
            >
              <ActionsBrick data={data} update={update} />
            </Brick>

            <Brick id="vcard" title="Enregistrer le contact" subtitle="Bouton vCard"
              enabled={data.vcardEnabled} onToggle={(v) => update("vcardEnabled", v)}
            >
              <p className="text-sm text-muted-foreground">
                Affiche un bouton « Enregistrer le contact » qui télécharge un fichier .vcf compatible iPhone/Android.
              </p>
            </Brick>

            <Brick id="stats" title="Statistiques" subtitle="Chiffres clés"
              enabled={data.statsEnabled} onToggle={(v) => update("statsEnabled", v)}
            >
              <StatsBrick data={data} update={update} />
            </Brick>

            <Brick id="about" title="À propos" subtitle="Bio + badges"
              enabled={data.aboutEnabled} onToggle={(v) => update("aboutEnabled", v)}
            >
              <AboutBrick data={data} update={update} />
            </Brick>

            <Brick id="listings" title="Sélection de biens" subtitle="Vos annonces phares"
              enabled={data.listingsEnabled} onToggle={(v) => update("listingsEnabled", v)}
            >
              <ListingsBrick data={data} update={update} />
            </Brick>

            <Brick id="contact" title="Coordonnées" subtitle="Téléphone, mail, site, secteur"
              enabled={data.contactEnabled} onToggle={(v) => update("contactEnabled", v)}
            >
              <ContactBrick data={data} update={update} />
            </Brick>

            <Brick id="socials" title="Réseaux sociaux" subtitle="LinkedIn, Instagram, WhatsApp"
              enabled={data.socialsEnabled} onToggle={(v) => update("socialsEnabled", v)}
            >
              <SocialsBrick data={data} update={update} />
            </Brick>

            <Brick id="theme" title="Thème" subtitle="Couleur d'accent" alwaysOn>
              <ThemeBrick data={data} update={update} />
            </Brick>
          </Accordion>

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
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-4 text-center">Aperçu live</p>
            <PhoneFrame><BusinessCard data={data} /></PhoneFrame>
          </div>
        </aside>
      </div>

      {/* Mobile preview drawer */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col">
          <div className="flex justify-end p-4">
            <button onClick={() => setPreviewOpen(false)} className="h-10 w-10 grid place-items-center rounded-full bg-card border border-border">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pb-8">
            <PhoneFrame><BusinessCard data={data} /></PhoneFrame>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- Brick shell ---------- */

function Brick({
  id, title, subtitle, children, enabled, onToggle, alwaysOn,
}: {
  id: string; title: string; subtitle?: string; children: ReactNode;
  enabled?: boolean; onToggle?: (v: boolean) => void; alwaysOn?: boolean;
}) {
  return (
    <AccordionItem value={id} className="border border-border rounded-2xl bg-card overflow-hidden data-[state=open]:shadow-[var(--shadow-elegant)]">
      <div className="flex items-center pr-4">
        <AccordionTrigger className="flex-1 px-4 py-4 hover:no-underline">
          <div className="text-left">
            <div className="font-medium">{title}</div>
            {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
          </div>
        </AccordionTrigger>
        {alwaysOn ? (
          <span className="text-[10px] uppercase tracking-wider text-primary">Toujours actif</span>
        ) : (
          <Switch checked={!!enabled} onCheckedChange={onToggle} onClick={(e) => e.stopPropagation()} />
        )}
      </div>
      <AccordionContent className="px-4 pb-5 pt-1">{children}</AccordionContent>
    </AccordionItem>
  );
}

/* ---------- Brick contents ---------- */

type BrickProps = { data: CardData; update: <K extends keyof CardData>(k: K, v: CardData[K]) => void };

function IdentityBrick({ data, update }: BrickProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => update("photo", String(reader.result));
    reader.readAsDataURL(f);
  };
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

const THEMES: { id: ThemeAccent; label: string; color: string }[] = [
  { id: "gold", label: "Or", color: "oklch(0.82 0.13 85)" },
  { id: "emerald", label: "Émeraude", color: "oklch(0.78 0.16 160)" },
  { id: "copper", label: "Cuivre", color: "oklch(0.74 0.16 45)" },
];
function ThemeBrick({ data, update }: BrickProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {THEMES.map((t) => {
        const active = data.accent === t.id;
        return (
          <button
            key={t.id}
            onClick={() => update("accent", t.id)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${active ? "border-primary" : "border-border"}`}
          >
            <span className="h-10 w-10 rounded-full" style={{ background: t.color }} />
            <span className="text-xs">{t.label}</span>
          </button>
        );
      })}
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
