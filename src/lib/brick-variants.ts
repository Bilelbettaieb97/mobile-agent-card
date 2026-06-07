import type { BrickId } from "./card-types";

export type VariantOption = { id: string; label: string; hint: string };

/** Per-brick available variants. Order = display order in the picker. */
export const BRICK_VARIANTS: Partial<Record<BrickId, VariantOption[]>> = {
  identity: [
    { id: "centered",   label: "Centrée",     hint: "Avatar + nom centrés" },
    { id: "cover",      label: "Couverture",  hint: "Bandeau + avatar débordant" },
    { id: "horizontal", label: "Horizontal",  hint: "Avatar à gauche, infos à droite" },
  ],
  actions: [
    { id: "icons", label: "Icônes",  hint: "Rangée d'icônes rondes" },
    { id: "pills", label: "Pills",   hint: "Boutons pleine largeur" },
    { id: "grid",  label: "Grille",  hint: "Grille 2 × 2" },
  ],
  vcard: [
    { id: "gradient", label: "Gradient", hint: "Bouton large coloré" },
    { id: "outline",  label: "Outlined", hint: "Minimaliste, bordure" },
    { id: "card",     label: "Carte",    hint: "Icône + texte secondaire" },
  ],
  stats: [
    { id: "inline",  label: "Ligne",      hint: "Grille 3 colonnes" },
    { id: "stacked", label: "Empilées",   hint: "Gros chiffres en colonne" },
    { id: "pills",   label: "Pills",      hint: "Mini-cartes compactes" },
  ],
  about: [
    { id: "default", label: "Standard", hint: "Texte + badges" },
    { id: "quote",   label: "Citation", hint: "Style guillemets" },
    { id: "card",    label: "Carte",    hint: "Avec icône" },
  ],
  video: [
    { id: "embed",  label: "Embed",  hint: "Lecteur YouTube direct" },
    { id: "thumb",  label: "Vignette", hint: "Thumbnail + play (léger)" },
    { id: "cinema", label: "Cinéma", hint: "Titre overlay en bas" },
  ],
  services: [
    { id: "list",     label: "Liste",     hint: "Lignes avec icône" },
    { id: "numbered", label: "Numérotée", hint: "Grille 01 / 02 / 03" },
    { id: "carousel", label: "Carrousel", hint: "Cartes défilantes" },
  ],
  listings: [
    { id: "carousel", label: "Carrousel", hint: "Snap horizontal (actuel)" },
    { id: "stacked",  label: "Empilés",   hint: "Cartes pleine largeur" },
    { id: "compact",  label: "Compact",   hint: "Lignes mini-thumb" },
  ],
  calendar: [
    { id: "row",   label: "Row",    hint: "Ligne avec chevron" },
    { id: "cta",   label: "CTA",    hint: "Bouton pleine largeur" },
    { id: "block", label: "Bloc",   hint: "Icône agenda centrée" },
  ],
  languages: [
    { id: "chips", label: "Chips", hint: "Pastilles avec icône" },
    { id: "list",  label: "Liste", hint: "Avec puces de niveau" },
    { id: "grid",  label: "Grille", hint: "2 colonnes" },
  ],
  cta: [
    { id: "gradient", label: "Gradient", hint: "Bannière dégradée" },
    { id: "outline",  label: "Outlined", hint: "Minimaliste" },
    { id: "bold",     label: "Bold",     hint: "Fond accent fort" },
  ],
  contact: [
    { id: "list",    label: "Liste",   hint: "Rows (actuel)" },
    { id: "grid",    label: "Grille",  hint: "2 × 2 mini-cartes" },
    { id: "compact", label: "Compact", hint: "Icônes + valeurs" },
  ],
  socials: [
    { id: "icons",   label: "Icônes",  hint: "Ronds centrés" },
    { id: "pills",   label: "Pills",   hint: "Avec libellé" },
    { id: "branded", label: "Branded", hint: "Couleurs de marque" },
  ],
};

export const DEFAULT_VARIANTS = {
  identity: "centered",
  actions: "icons",
  vcard: "gradient",
  stats: "inline",
  about: "default",
  video: "embed",
  services: "list",
  listings: "carousel",
  calendar: "row",
  languages: "chips",
  cta: "gradient",
  contact: "list",
  socials: "icons",
} as const;

export type BrickVariants = {
  identity:  "centered" | "cover" | "horizontal";
  actions:   "icons" | "pills" | "grid";
  vcard:     "gradient" | "outline" | "card";
  stats:     "inline" | "stacked" | "pills";
  about:     "default" | "quote" | "card";
  video:     "embed" | "thumb" | "cinema";
  services:  "list" | "numbered" | "carousel";
  listings:  "carousel" | "stacked" | "compact";
  calendar:  "row" | "cta" | "block";
  languages: "chips" | "list" | "grid";
  cta:       "gradient" | "outline" | "bold";
  contact:   "list" | "grid" | "compact";
  socials:   "icons" | "pills" | "branded";
};
