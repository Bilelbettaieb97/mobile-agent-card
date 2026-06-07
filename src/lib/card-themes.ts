/**
 * Card themes — full palettes, not just an accent.
 *
 * Each theme defines the card background, surfaces, borders, text colors,
 * accent and gradients. They are published as CSS variables on the
 * BusinessCard root so every section inherits the palette.
 */

export type ThemeMode = "light" | "dark";

export interface ThemePalette {
  mode: ThemeMode;
  bg: string;          // card global background
  surface: string;     // inner cards / sections
  surfaceAlt: string;  // chips, hover, soft accent surfaces
  border: string;
  text: string;        // primary text color
  textMuted: string;
  accent: string;      // accent color (icons, prices, key marks)
  gradient: string;    // CTA gradient + identity halo
  headerBg: string;    // centered identity header background
  onAccent: string;    // text/icon color on top of accent gradient or solid accent
}

export interface ThemeMeta {
  id: string;
  label: string;
  sector: string;
  palette: ThemePalette;
}

const grad = (a: string, b: string) =>
  `linear-gradient(135deg, ${a}, ${b})`;

const radial = (a: string, b: string) =>
  `radial-gradient(120% 80% at 50% 0%, ${a} 0%, ${b} 60%)`;

/* ------------------------------- DARK ---------------------------------- */

const gold: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.16 0.018 250)",
  surface: "oklch(0.21 0.02 250)",
  surfaceAlt: "oklch(0.26 0.025 250)",
  border: "oklch(0.32 0.02 250 / 0.6)",
  text: "oklch(0.97 0.005 80)",
  textMuted: "oklch(0.7 0.015 250)",
  accent: "oklch(0.82 0.13 85)",
  gradient: grad("oklch(0.88 0.1 90)", "oklch(0.75 0.14 75)"),
  headerBg: radial("oklch(0.28 0.05 250)", "oklch(0.16 0.018 250)"),
};

const noir: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.12 0 0)",
  surface: "oklch(0.17 0 0)",
  surfaceAlt: "oklch(0.22 0 0)",
  border: "oklch(0.3 0 0 / 0.7)",
  text: "oklch(0.97 0 0)",
  textMuted: "oklch(0.68 0 0)",
  accent: "oklch(0.85 0.12 88)",
  gradient: grad("oklch(0.9 0.1 92)", "oklch(0.74 0.14 78)"),
  headerBg: radial("oklch(0.2 0 0)", "oklch(0.1 0 0)"),
};

const emerald: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.16 0.025 165)",
  surface: "oklch(0.21 0.03 165)",
  surfaceAlt: "oklch(0.26 0.035 165)",
  border: "oklch(0.32 0.03 165 / 0.6)",
  text: "oklch(0.97 0.01 165)",
  textMuted: "oklch(0.7 0.02 165)",
  accent: "oklch(0.78 0.16 160)",
  gradient: grad("oklch(0.85 0.14 165)", "oklch(0.6 0.16 155)"),
  headerBg: radial("oklch(0.28 0.06 165)", "oklch(0.15 0.025 165)"),
};

const forest: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.18 0.03 145)",
  surface: "oklch(0.23 0.035 145)",
  surfaceAlt: "oklch(0.28 0.04 145)",
  border: "oklch(0.34 0.03 145 / 0.6)",
  text: "oklch(0.96 0.015 145)",
  textMuted: "oklch(0.72 0.02 145)",
  accent: "oklch(0.7 0.14 140)",
  gradient: grad("oklch(0.78 0.13 140)", "oklch(0.55 0.15 150)"),
  headerBg: radial("oklch(0.3 0.06 145)", "oklch(0.17 0.03 145)"),
};

const navy: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.17 0.04 260)",
  surface: "oklch(0.22 0.045 260)",
  surfaceAlt: "oklch(0.27 0.05 260)",
  border: "oklch(0.34 0.05 260 / 0.6)",
  text: "oklch(0.97 0.005 250)",
  textMuted: "oklch(0.72 0.02 250)",
  accent: "oklch(0.7 0.14 250)",
  gradient: grad("oklch(0.75 0.13 245)", "oklch(0.5 0.15 260)"),
  headerBg: radial("oklch(0.3 0.08 260)", "oklch(0.16 0.04 260)"),
};

const sapphire: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.16 0.04 250)",
  surface: "oklch(0.21 0.05 250)",
  surfaceAlt: "oklch(0.27 0.06 250)",
  border: "oklch(0.35 0.06 250 / 0.55)",
  text: "oklch(0.97 0.005 250)",
  textMuted: "oklch(0.72 0.02 250)",
  accent: "oklch(0.7 0.18 245)",
  gradient: grad("oklch(0.75 0.18 240)", "oklch(0.55 0.22 255)"),
  headerBg: radial("oklch(0.3 0.1 250)", "oklch(0.15 0.04 250)"),
};

const graphite: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.18 0.005 250)",
  surface: "oklch(0.23 0.006 250)",
  surfaceAlt: "oklch(0.28 0.008 250)",
  border: "oklch(0.36 0.01 250 / 0.6)",
  text: "oklch(0.97 0.002 250)",
  textMuted: "oklch(0.7 0.005 250)",
  accent: "oklch(0.78 0.01 250)",
  gradient: grad("oklch(0.82 0.005 250)", "oklch(0.55 0.01 250)"),
  headerBg: radial("oklch(0.28 0.008 250)", "oklch(0.16 0.005 250)"),
};

const bordeaux: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.18 0.05 20)",
  surface: "oklch(0.23 0.06 20)",
  surfaceAlt: "oklch(0.28 0.07 20)",
  border: "oklch(0.35 0.06 20 / 0.6)",
  text: "oklch(0.97 0.01 30)",
  textMuted: "oklch(0.72 0.03 25)",
  accent: "oklch(0.68 0.18 20)",
  gradient: grad("oklch(0.75 0.18 25)", "oklch(0.5 0.2 15)"),
  headerBg: radial("oklch(0.32 0.1 20)", "oklch(0.17 0.05 20)"),
};

const slate: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.2 0.015 240)",
  surface: "oklch(0.25 0.02 240)",
  surfaceAlt: "oklch(0.3 0.025 240)",
  border: "oklch(0.38 0.02 240 / 0.6)",
  text: "oklch(0.97 0.005 240)",
  textMuted: "oklch(0.72 0.015 240)",
  accent: "oklch(0.75 0.13 230)",
  gradient: grad("oklch(0.8 0.12 225)", "oklch(0.6 0.15 235)"),
  headerBg: radial("oklch(0.32 0.04 240)", "oklch(0.18 0.015 240)"),
};

const violet: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.17 0.05 295)",
  surface: "oklch(0.22 0.06 295)",
  surfaceAlt: "oklch(0.27 0.07 295)",
  border: "oklch(0.35 0.07 295 / 0.55)",
  text: "oklch(0.97 0.01 295)",
  textMuted: "oklch(0.72 0.03 295)",
  accent: "oklch(0.72 0.2 295)",
  gradient: grad("oklch(0.78 0.18 290)", "oklch(0.55 0.22 300)"),
  headerBg: radial("oklch(0.3 0.1 295)", "oklch(0.16 0.05 295)"),
};

const crimson: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.16 0.04 25)",
  surface: "oklch(0.21 0.05 25)",
  surfaceAlt: "oklch(0.26 0.06 25)",
  border: "oklch(0.34 0.06 25 / 0.55)",
  text: "oklch(0.97 0.01 30)",
  textMuted: "oklch(0.72 0.03 25)",
  accent: "oklch(0.7 0.21 25)",
  gradient: grad("oklch(0.75 0.2 30)", "oklch(0.55 0.24 20)"),
  headerBg: radial("oklch(0.3 0.1 25)", "oklch(0.15 0.04 25)"),
};

const magenta: ThemePalette = {
  mode: "dark",
  bg: "oklch(0.17 0.05 330)",
  surface: "oklch(0.22 0.06 330)",
  surfaceAlt: "oklch(0.27 0.07 330)",
  border: "oklch(0.35 0.07 330 / 0.55)",
  text: "oklch(0.97 0.01 330)",
  textMuted: "oklch(0.73 0.03 330)",
  accent: "oklch(0.7 0.24 330)",
  gradient: grad("oklch(0.75 0.22 325)", "oklch(0.55 0.26 335)"),
  headerBg: radial("oklch(0.3 0.1 330)", "oklch(0.16 0.05 330)"),
};

/* ------------------------------- LIGHT --------------------------------- */

const copper: ThemePalette = {
  mode: "light",
  bg: "oklch(0.97 0.015 60)",
  surface: "oklch(1 0.005 60)",
  surfaceAlt: "oklch(0.94 0.025 50)",
  border: "oklch(0.86 0.03 50 / 0.8)",
  text: "oklch(0.22 0.03 40)",
  textMuted: "oklch(0.5 0.04 40)",
  accent: "oklch(0.62 0.17 40)",
  gradient: grad("oklch(0.78 0.14 55)", "oklch(0.58 0.18 35)"),
  headerBg: grad("oklch(0.96 0.025 60)", "oklch(0.9 0.04 50)"),
};

const cream: ThemePalette = {
  mode: "light",
  bg: "oklch(0.97 0.012 80)",
  surface: "oklch(1 0.005 80)",
  surfaceAlt: "oklch(0.94 0.02 80)",
  border: "oklch(0.87 0.025 80 / 0.8)",
  text: "oklch(0.24 0.02 80)",
  textMuted: "oklch(0.52 0.03 80)",
  accent: "oklch(0.65 0.14 65)",
  gradient: grad("oklch(0.8 0.13 75)", "oklch(0.62 0.16 55)"),
  headerBg: grad("oklch(0.96 0.02 80)", "oklch(0.9 0.04 70)"),
};

const sand: ThemePalette = {
  mode: "light",
  bg: "oklch(0.95 0.018 80)",
  surface: "oklch(0.99 0.008 80)",
  surfaceAlt: "oklch(0.92 0.025 75)",
  border: "oklch(0.84 0.03 75 / 0.8)",
  text: "oklch(0.22 0.02 70)",
  textMuted: "oklch(0.5 0.03 70)",
  accent: "oklch(0.5 0.04 70)",
  gradient: grad("oklch(0.7 0.06 65)", "oklch(0.45 0.05 70)"),
  headerBg: grad("oklch(0.92 0.025 75)", "oklch(0.85 0.04 70)"),
};

const clay: ThemePalette = {
  mode: "light",
  bg: "oklch(0.95 0.02 45)",
  surface: "oklch(0.99 0.01 45)",
  surfaceAlt: "oklch(0.92 0.03 40)",
  border: "oklch(0.84 0.04 40 / 0.8)",
  text: "oklch(0.22 0.04 30)",
  textMuted: "oklch(0.5 0.05 30)",
  accent: "oklch(0.58 0.18 30)",
  gradient: grad("oklch(0.7 0.18 35)", "oklch(0.5 0.2 22)"),
  headerBg: grad("oklch(0.93 0.03 40)", "oklch(0.86 0.05 30)"),
};

const rose: ThemePalette = {
  mode: "light",
  bg: "oklch(0.97 0.012 0)",
  surface: "oklch(1 0.005 0)",
  surfaceAlt: "oklch(0.94 0.025 0)",
  border: "oklch(0.87 0.03 0 / 0.8)",
  text: "oklch(0.24 0.03 0)",
  textMuted: "oklch(0.52 0.04 0)",
  accent: "oklch(0.66 0.18 355)",
  gradient: grad("oklch(0.82 0.12 5)", "oklch(0.62 0.2 350)"),
  headerBg: grad("oklch(0.96 0.025 0)", "oklch(0.88 0.05 355)"),
};

const blush: ThemePalette = {
  mode: "light",
  bg: "oklch(0.97 0.018 30)",
  surface: "oklch(1 0.008 30)",
  surfaceAlt: "oklch(0.94 0.03 30)",
  border: "oklch(0.87 0.035 30 / 0.8)",
  text: "oklch(0.24 0.04 25)",
  textMuted: "oklch(0.52 0.05 25)",
  accent: "oklch(0.7 0.17 25)",
  gradient: grad("oklch(0.85 0.13 35)", "oklch(0.65 0.19 18)"),
  headerBg: grad("oklch(0.96 0.025 30)", "oklch(0.88 0.05 25)"),
};

const mint: ThemePalette = {
  mode: "light",
  bg: "oklch(0.97 0.018 175)",
  surface: "oklch(1 0.008 175)",
  surfaceAlt: "oklch(0.93 0.03 175)",
  border: "oklch(0.86 0.035 175 / 0.8)",
  text: "oklch(0.22 0.03 175)",
  textMuted: "oklch(0.5 0.04 175)",
  accent: "oklch(0.62 0.14 170)",
  gradient: grad("oklch(0.78 0.12 175)", "oklch(0.55 0.16 165)"),
  headerBg: grad("oklch(0.94 0.025 175)", "oklch(0.86 0.05 170)"),
};

const sky: ThemePalette = {
  mode: "light",
  bg: "oklch(0.97 0.018 225)",
  surface: "oklch(1 0.008 225)",
  surfaceAlt: "oklch(0.93 0.03 225)",
  border: "oklch(0.86 0.035 225 / 0.8)",
  text: "oklch(0.22 0.03 230)",
  textMuted: "oklch(0.5 0.04 230)",
  accent: "oklch(0.62 0.15 230)",
  gradient: grad("oklch(0.78 0.12 225)", "oklch(0.55 0.17 235)"),
  headerBg: grad("oklch(0.94 0.025 225)", "oklch(0.86 0.05 230)"),
};

const paper: ThemePalette = {
  mode: "light",
  bg: "oklch(0.98 0.003 250)",
  surface: "oklch(1 0 0)",
  surfaceAlt: "oklch(0.93 0.01 250)",
  border: "oklch(0.85 0.015 250 / 0.8)",
  text: "oklch(0.2 0.01 250)",
  textMuted: "oklch(0.48 0.015 250)",
  accent: "oklch(0.45 0.13 255)",
  gradient: grad("oklch(0.6 0.13 250)", "oklch(0.38 0.15 260)"),
  headerBg: grad("oklch(0.96 0.01 250)", "oklch(0.88 0.02 250)"),
};

const sun: ThemePalette = {
  mode: "light",
  bg: "oklch(0.97 0.02 75)",
  surface: "oklch(1 0.008 75)",
  surfaceAlt: "oklch(0.94 0.035 75)",
  border: "oklch(0.86 0.04 75 / 0.8)",
  text: "oklch(0.24 0.03 60)",
  textMuted: "oklch(0.52 0.04 60)",
  accent: "oklch(0.7 0.17 70)",
  gradient: grad("oklch(0.85 0.14 80)", "oklch(0.68 0.18 60)"),
  headerBg: grad("oklch(0.95 0.03 75)", "oklch(0.86 0.05 65)"),
};

/* ----------------------------- catalog --------------------------------- */

export const CARD_THEMES: ThemeMeta[] = [
  // Dark
  { id: "gold",     label: "Or",         sector: "Immobilier prestige",   palette: gold },
  { id: "noir",     label: "Noir & Or",  sector: "Luxe / Joaillerie",     palette: noir },
  { id: "emerald",  label: "Émeraude",   sector: "Finance / Conseil",     palette: emerald },
  { id: "forest",   label: "Forêt",      sector: "Écologie / Outdoor",    palette: forest },
  { id: "navy",     label: "Marine",     sector: "Avocat / Notaire",      palette: navy },
  { id: "sapphire", label: "Saphir",     sector: "Tech / SaaS",           palette: sapphire },
  { id: "graphite", label: "Graphite",   sector: "Éditorial / Photo",     palette: graphite },
  { id: "bordeaux", label: "Bordeaux",   sector: "Sommellerie / Gastro",  palette: bordeaux },
  { id: "slate",    label: "Ardoise",    sector: "Industrie / BTP",       palette: slate },
  { id: "violet",   label: "Violet",     sector: "Créatif / Design",      palette: violet },
  { id: "crimson",  label: "Cramoisi",   sector: "Sport / Fitness",       palette: crimson },
  { id: "magenta",  label: "Magenta",    sector: "Mode / Événementiel",   palette: magenta },
  // Light
  { id: "copper",   label: "Cuivre",     sector: "Artisanat",             palette: copper },
  { id: "cream",    label: "Crème",      sector: "Coach / Lifestyle",     palette: cream },
  { id: "sand",     label: "Sable",      sector: "Architecture / Déco",   palette: sand },
  { id: "clay",     label: "Terracotta", sector: "Restauration / Café",   palette: clay },
  { id: "rose",     label: "Rose poudré",sector: "Beauté / Esthétique",   palette: rose },
  { id: "blush",    label: "Pêche",      sector: "Coiffure / Maquillage", palette: blush },
  { id: "mint",     label: "Menthe",     sector: "Santé / Bien-être",     palette: mint },
  { id: "sky",      label: "Azur",       sector: "Éducation / Enfance",   palette: sky },
  { id: "paper",    label: "Papier",     sector: "Avocat clair / Édito",  palette: paper },
  { id: "sun",      label: "Soleil",     sector: "Voyage / Hôtellerie",   palette: sun },
];

export const THEMES_BY_ID: Record<string, ThemeMeta> = Object.fromEntries(
  CARD_THEMES.map((t) => [t.id, t])
);

export type ThemeId = (typeof CARD_THEMES)[number]["id"];
