import { useEffect, useRef, useState, type ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Plus, Trash2, Check } from "lucide-react";
import {
  CARD_THEMES,
  PROFESSIONS,
  PROFESSION_CATEGORIES,
  PROFESSIONS_BY_THEME,
  THEMES_BY_ID,
} from "@/lib/card-themes";
import type {
  CardData,
  Listing,
  Stat,
  TestimonialsStyle,
  BrickId,
} from "@/lib/card-types";
import { BRICK_VARIANTS } from "@/lib/brick-variants";

export type BrickProps = {
  data: CardData;
  update: <K extends keyof CardData>(k: K, v: CardData[K]) => void;
};

/* ---------- helpers ---------- */

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

/* ---------- Variant picker ---------- */

export function VariantPicker({
  brick,
  data,
  update,
}: {
  brick: BrickId;
  data: CardData;
  update: BrickProps["update"];
}) {
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
              onClick={() =>
                update(
                  "variants",
                  { ...data.variants, [brick]: o.id } as CardData["variants"],
                )
              }
              className={`rounded-xl border p-2.5 text-left transition ${active ? "border-primary bg-accent/40" : "border-border hover:border-foreground/30"}`}
            >
              <div className="text-xs font-medium">{o.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                {o.hint}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Identity ---------- */

export function IdentityBrick({ data, update }: BrickProps) {
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
          {data.photo ? (
            <img src={data.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1.5" /> Importer une photo
          </Button>
          {data.photo && (
            <Button type="button" variant="ghost" size="sm" onClick={() => update("photo", "")}>
              Retirer
            </Button>
          )}
        </div>
      </div>
      <Field label="Nom complet">
        <Input value={data.name} onChange={(e) => update("name", e.target.value)} />
      </Field>
      <Field label="Titre / poste">
        <Input value={data.title} onChange={(e) => update("title", e.target.value)} />
      </Field>
      <Field label="Agence">
        <Input value={data.agency} onChange={(e) => update("agency", e.target.value)} />
      </Field>
      <Field label="Secteur géographique">
        <Input value={data.area} onChange={(e) => update("area", e.target.value)} />
      </Field>

      {isCover && (
        <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-medium">Photo de couverture</div>
              <div className="text-xs text-muted-foreground">Affichée en bannière derrière votre photo.</div>
            </div>
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onCover(f);
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => coverRef.current?.click()}>
              <Upload className="h-4 w-4 mr-1.5" /> Importer
            </Button>
          </div>
          {data.coverPhoto && (
            <div className="space-y-2">
              <div className="aspect-[16/9] w-full rounded-md overflow-hidden bg-muted border border-border">
                <img src={data.coverPhoto} alt="" className="h-full w-full object-cover" />
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => update("coverPhoto", "")}>
                Retirer la couverture
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Actions ---------- */

export function ActionsBrick({ data, update }: BrickProps) {
  const toggle = (k: keyof CardData["actions"]) => (v: boolean) =>
    update("actions", { ...data.actions, [k]: v });
  return (
    <div className="space-y-3">
      <Row label="Appel"><Switch checked={data.actions.call} onCheckedChange={toggle("call")} /></Row>
      <Row label="WhatsApp"><Switch checked={data.actions.whatsapp} onCheckedChange={toggle("whatsapp")} /></Row>
      <Row label="Email"><Switch checked={data.actions.email} onCheckedChange={toggle("email")} /></Row>
      <Row label="Site web"><Switch checked={data.actions.website} onCheckedChange={toggle("website")} /></Row>
      <p className="text-xs text-muted-foreground pt-1">
        Les valeurs (numéro, email…) se règlent dans la brique « Coordonnées ».
      </p>
    </div>
  );
}

/* ---------- Stats ---------- */

export function StatsBrick({ data, update }: BrickProps) {
  const setStat = (i: number, patch: Partial<Stat>) =>
    update("stats", data.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const add = () =>
    data.stats.length < 4 && update("stats", [...data.stats, { label: "Label", value: "0" }]);
  const remove = (i: number) => update("stats", data.stats.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3">
      {data.stats.map((s, i) => (
        <div key={i} className="flex gap-2 items-end">
          <Field label="Valeur" className="w-24">
            <Input value={s.value} onChange={(e) => setStat(i, { value: e.target.value })} />
          </Field>
          <Field label="Label" className="flex-1">
            <Input value={s.label} onChange={(e) => setStat(i, { label: e.target.value })} />
          </Field>
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {data.stats.length < 4 && (
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-4 w-4 mr-1.5" />
          Ajouter une stat
        </Button>
      )}
    </div>
  );
}

/* ---------- About ---------- */

export function AboutBrick({ data, update }: BrickProps) {
  const setBadge = (i: number, label: string) =>
    update("badges", data.badges.map((b, idx) => (idx === i ? { ...b, label } : b)));
  const addBadge = () =>
    update("badges", [...data.badges, { id: crypto.randomUUID(), label: "Nouveau badge" }]);
  const removeBadge = (id: string) => update("badges", data.badges.filter((b) => b.id !== id));
  return (
    <div className="space-y-3">
      <Field label="Bio (2-3 lignes)">
        <Textarea rows={4} value={data.bio} onChange={(e) => update("bio", e.target.value)} />
      </Field>
      <div>
        <Label className="text-xs">Badges</Label>
        <div className="mt-2 space-y-2">
          {data.badges.map((b, i) => (
            <div key={b.id} className="flex gap-2">
              <Input value={b.label} onChange={(e) => setBadge(i, e.target.value)} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeBadge(b.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addBadge}>
            <Plus className="h-4 w-4 mr-1.5" />
            Ajouter un badge
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Listings ---------- */

export function ListingsBrick({ data, update }: BrickProps) {
  const setListing = (id: string, patch: Partial<Listing>) =>
    update("listings", data.listings.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const add = () =>
    update("listings", [
      ...data.listings,
      { id: crypto.randomUUID(), img: "", title: "Nouveau bien", meta: "", price: "" },
    ]);
  const remove = (id: string) => update("listings", data.listings.filter((l) => l.id !== id));
  const onImage = (id: string, f: File) => {
    const reader = new FileReader();
    reader.onload = () => setListing(id, { img: String(reader.result) });
    reader.readAsDataURL(f);
  };
  return (
    <div className="space-y-4">
      {data.listings.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun bien. Ajoutez votre première annonce.</p>
      )}
      {data.listings.map((l) => (
        <div key={l.id} className="rounded-xl border border-border p-3 space-y-2">
          <div className="flex gap-3">
            <label className="h-16 w-16 rounded-lg overflow-hidden bg-muted grid place-items-center cursor-pointer shrink-0">
              {l.img ? (
                <img src={l.img} alt="" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-4 w-4 text-muted-foreground" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onImage(l.id, f);
                }}
              />
            </label>
            <div className="flex-1 space-y-2">
              <Input
                placeholder="Titre"
                value={l.title}
                onChange={(e) => setListing(l.id, { title: e.target.value })}
              />
              <Input
                placeholder="120 m² · 3 pièces"
                value={l.meta}
                onChange={(e) => setListing(l.id, { meta: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="2 450 000 €"
              value={l.price}
              onChange={(e) => setListing(l.id, { price: e.target.value })}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(l.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4 mr-1.5" />
        Ajouter un bien
      </Button>
    </div>
  );
}

/* ---------- Contact ---------- */

export function ContactBrick({ data, update }: BrickProps) {
  return (
    <div className="space-y-3">
      <Field label="Téléphone (format E.164, ex: +33612345678)">
        <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} />
      </Field>
      <Field label="Téléphone (affichage)">
        <Input
          value={data.phoneDisplay}
          onChange={(e) => update("phoneDisplay", e.target.value)}
          placeholder="+33 6 12 34 56 78"
        />
      </Field>
      <Field label="Email">
        <Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} />
      </Field>
      <Field label="Site web (sans https)">
        <Input value={data.website} onChange={(e) => update("website", e.target.value)} />
      </Field>
      <Field label="WhatsApp (numéro sans +, ex: 33612345678)">
        <Input value={data.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
      </Field>
    </div>
  );
}

/* ---------- Socials ---------- */

export function SocialsBrick({ data, update }: BrickProps) {
  return (
    <div className="space-y-3">
      <Field label="LinkedIn (URL complète)">
        <Input value={data.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
      </Field>
      <Field label="Instagram (URL complète)">
        <Input value={data.instagram} onChange={(e) => update("instagram", e.target.value)} />
      </Field>
      <Field label="WhatsApp (numéro sans +)">
        <Input value={data.whatsappSocial} onChange={(e) => update("whatsappSocial", e.target.value)} />
      </Field>
    </div>
  );
}

/* ---------- vCard ---------- */

export function VCardBrick() {
  return (
    <p className="text-sm text-muted-foreground">
      Affiche un bouton « Enregistrer le contact » qui télécharge un fichier .vcf compatible iPhone/Android.
    </p>
  );
}

/* ---------- Video ---------- */

export function VideoBrick({ data, update }: BrickProps) {
  return (
    <div className="space-y-3">
      <Field label="Titre de la vidéo">
        <Input value={data.videoTitle} onChange={(e) => update("videoTitle", e.target.value)} />
      </Field>
      <Field label="Lien YouTube (watch, youtu.be ou shorts)">
        <Input
          value={data.videoUrl}
          onChange={(e) => update("videoUrl", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </Field>
      <p className="text-xs text-muted-foreground">L'aperçu intègre la vidéo via youtube.com/embed.</p>
    </div>
  );
}

/* ---------- Services ---------- */

export function ServicesBrick({ data, update }: BrickProps) {
  const set = (id: string, patch: Partial<(typeof data.services)[number]>) =>
    update("services", data.services.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const add = () =>
    update("services", [
      ...data.services,
      { id: crypto.randomUUID(), title: "Nouveau service", description: "" },
    ]);
  const remove = (id: string) => update("services", data.services.filter((s) => s.id !== id));
  return (
    <div className="space-y-3">
      {data.services.map((s) => (
        <div key={s.id} className="rounded-xl border border-border p-3 space-y-2">
          <Input placeholder="Titre" value={s.title} onChange={(e) => set(s.id, { title: e.target.value })} />
          <Textarea
            rows={2}
            placeholder="Description courte"
            value={s.description}
            onChange={(e) => set(s.id, { description: e.target.value })}
          />
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(s.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4 mr-1.5" />
        Ajouter un service
      </Button>
    </div>
  );
}

/* ---------- Testimonials ---------- */

const TESTIMONIAL_STYLES: { id: TestimonialsStyle; label: string; hint: string }[] = [
  { id: "cards", label: "Cartes", hint: "Carrousel large avec citation" },
  { id: "stacked", label: "Empilées", hint: "Liste verticale, avatar à gauche" },
  { id: "compact", label: "Compactes", hint: "Mini-cartes plus denses" },
];

export function TestimonialsBrick({ data, update }: BrickProps) {
  const set = (id: string, patch: Partial<(typeof data.testimonials)[number]>) =>
    update("testimonials", data.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const add = () =>
    update("testimonials", [
      ...data.testimonials,
      { id: crypto.randomUUID(), name: "Prénom N.", role: "Client", text: "", rating: 5, photo: "", link: "" },
    ]);
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
                {t.photo ? (
                  <img src={t.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-4 w-4 text-muted-foreground" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onPhoto(t.id, f);
                  }}
                />
              </label>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input placeholder="Nom" value={t.name} onChange={(e) => set(t.id, { name: e.target.value })} />
                <Input placeholder="Rôle / contexte" value={t.role} onChange={(e) => set(t.id, { role: e.target.value })} />
              </div>
            </div>

            {t.photo && (
              <button
                type="button"
                onClick={() => set(t.id, { photo: "" })}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                Retirer la photo
              </button>
            )}

            <Textarea
              rows={3}
              placeholder="Témoignage"
              value={t.text}
              onChange={(e) => set(t.id, { text: e.target.value })}
            />

            <div className="grid grid-cols-[6rem_1fr] gap-2">
              <Field label="Note (1-5)">
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={t.rating}
                  onChange={(e) =>
                    set(t.id, { rating: Math.max(1, Math.min(5, Number(e.target.value) || 5)) })
                  }
                />
              </Field>
              <Field label="Lien (optionnel)">
                <Input
                  placeholder="https://google.com/avis/..."
                  value={t.link}
                  onChange={(e) => set(t.id, { link: e.target.value })}
                />
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
          <Plus className="h-4 w-4 mr-1.5" />
          Ajouter un témoignage
        </Button>
      </div>
    </div>
  );
}

/* ---------- Calendar ---------- */

export function CalendarBrick({ data, update }: BrickProps) {
  return (
    <div className="space-y-3">
      <Field label="Libellé du bouton">
        <Input value={data.calendarLabel} onChange={(e) => update("calendarLabel", e.target.value)} />
      </Field>
      <Field label="URL (Calendly, Cal.com, Google Calendar…)">
        <Input
          value={data.calendarUrl}
          onChange={(e) => update("calendarUrl", e.target.value)}
          placeholder="https://calendly.com/..."
        />
      </Field>
    </div>
  );
}

/* ---------- Languages ---------- */

export function LanguagesBrick({ data, update }: BrickProps) {
  const set = (id: string, patch: Partial<(typeof data.languages)[number]>) =>
    update("languages", data.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const add = () =>
    update("languages", [...data.languages, { id: crypto.randomUUID(), name: "Langue", level: "Courant" }]);
  const remove = (id: string) => update("languages", data.languages.filter((l) => l.id !== id));
  return (
    <div className="space-y-2">
      {data.languages.map((l) => (
        <div key={l.id} className="flex gap-2">
          <Input placeholder="Langue" value={l.name} onChange={(e) => set(l.id, { name: e.target.value })} />
          <Input placeholder="Niveau" value={l.level} onChange={(e) => set(l.id, { level: e.target.value })} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(l.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4 mr-1.5" />
        Ajouter une langue
      </Button>
    </div>
  );
}

/* ---------- CTA ---------- */

export function CtaBrick({ data, update }: BrickProps) {
  return (
    <div className="space-y-3">
      <Field label="Titre">
        <Input value={data.ctaTitle} onChange={(e) => update("ctaTitle", e.target.value)} />
      </Field>
      <Field label="Texte">
        <Textarea rows={2} value={data.ctaText} onChange={(e) => update("ctaText", e.target.value)} />
      </Field>
      <Field label="Libellé du bouton">
        <Input value={data.ctaButtonLabel} onChange={(e) => update("ctaButtonLabel", e.target.value)} />
      </Field>
      <Field label="URL du bouton">
        <Input value={data.ctaButtonUrl} onChange={(e) => update("ctaButtonUrl", e.target.value)} />
      </Field>
    </div>
  );
}

/* ---------- Theme ---------- */

export function ThemeBrick({ data, update }: BrickProps) {
  const [tab, setTab] = useState<"profession" | "theme">("theme");
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (data.profession) setTab("profession");
  }, [data.profession]);

  const activeTheme = THEMES_BY_ID[data.accent];
  const activeProfession = data.profession
    ? PROFESSIONS.find((p) => p.id === data.profession)
    : undefined;

  const applyProfession = (profId: string, themeId: string) => {
    update("profession", profId);
    update("accent", themeId as typeof data.accent);
  };

  useEffect(() => {
    if (tab === "profession" && activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [tab]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? PROFESSIONS.filter(
        (p) => p.label.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      )
    : PROFESSIONS;

  const grouped = PROFESSION_CATEGORIES.map((cat) => ({
    cat,
    items: filtered.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-3 flex items-center gap-3">
        <span
          className="h-11 w-11 rounded-lg shrink-0 border relative overflow-hidden ring-2 ring-primary/50 ring-offset-2 ring-offset-card"
          style={{ background: activeTheme.palette.bg, borderColor: activeTheme.palette.border }}
          aria-hidden
        >
          <span className="absolute inset-1 rounded-md" style={{ background: activeTheme.palette.surface }} />
          <span
            className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full animate-pulse"
            style={{ background: activeTheme.palette.gradient }}
          />
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
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">{cat}</div>
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
                          <span
                            className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full ${active ? "animate-pulse" : ""}`}
                            style={{ background: theme.palette.gradient }}
                          />
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
                  <span
                    className="absolute inset-1 rounded-md"
                    style={{
                      background: p.surface,
                      borderColor: p.border,
                      borderWidth: 1,
                      borderStyle: "solid",
                    }}
                  />
                  <span
                    className={`absolute bottom-1 right-1 h-3 w-3 rounded-full ${active ? "animate-pulse" : ""}`}
                    style={{ background: p.gradient }}
                  />
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

/* ---------- Brick meta + helpers used by both BuilderSections and the edit view ---------- */

export const BRICK_META: Record<BrickId, { title: string; subtitle: string }> = {
  identity: { title: "Identité", subtitle: "Photo, nom, titre, agence" },
  actions: { title: "Actions rapides", subtitle: "Appel, WhatsApp, Mail, Site" },
  vcard: { title: "Enregistrer le contact", subtitle: "Bouton vCard" },
  stats: { title: "Statistiques", subtitle: "Chiffres clés" },
  about: { title: "À propos", subtitle: "Bio + badges" },
  video: { title: "Vidéo de présentation", subtitle: "Lien YouTube" },
  services: { title: "Services", subtitle: "Vos offres / prestations" },
  listings: { title: "Sélection de biens", subtitle: "Vos annonces phares" },
  testimonials: { title: "Témoignages", subtitle: "Avis clients" },
  calendar: { title: "Prendre rendez-vous", subtitle: "Lien Calendly / agenda" },
  languages: { title: "Langues parlées", subtitle: "Idiomes & niveau" },
  cta: { title: "Bannière CTA", subtitle: "Encart d'appel à l'action" },
  contact: { title: "Coordonnées", subtitle: "Téléphone, mail, site, secteur" },
  socials: { title: "Réseaux sociaux", subtitle: "LinkedIn, Instagram, WhatsApp" },
  theme: { title: "Thème", subtitle: "Couleur d'accent" },
};

export function renderBrickBody(id: BrickId, props: BrickProps): ReactNode {
  switch (id) {
    case "identity":     return <IdentityBrick {...props} />;
    case "actions":      return <ActionsBrick {...props} />;
    case "vcard":        return <VCardBrick />;
    case "stats":        return <StatsBrick {...props} />;
    case "about":        return <AboutBrick {...props} />;
    case "video":        return <VideoBrick {...props} />;
    case "services":     return <ServicesBrick {...props} />;
    case "listings":     return <ListingsBrick {...props} />;
    case "testimonials": return <TestimonialsBrick {...props} />;
    case "calendar":     return <CalendarBrick {...props} />;
    case "languages":    return <LanguagesBrick {...props} />;
    case "cta":          return <CtaBrick {...props} />;
    case "contact":      return <ContactBrick {...props} />;
    case "socials":      return <SocialsBrick {...props} />;
    case "theme":        return <ThemeBrick {...props} />;
  }
}
