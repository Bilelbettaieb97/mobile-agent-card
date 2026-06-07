# Thèmes complets par secteur (pas juste l'accent)

## Problème

Aujourd'hui un « thème » ne change que `--card-accent` et `--card-accent-gradient`. Le fond, les surfaces (cartes/bordures) et les textes utilisent les tokens globaux (`bg-background`, `bg-card`, `border-border`, `text-muted-foreground`) — donc visuellement, seule la couleur autour de la photo bouge. C'est pour ça que tous les thèmes se ressemblent.

## Objectif

Un thème = **palette complète** appliquée à la carte (fond, surfaces, bordures, textes, accent, dégradé). Le reste de l'app (le builder, le shell) n'est pas touché.

## Architecture

### 1. Élargir le contrat de thème — `src/components/card/BusinessCard.tsx`

Remplacer `ACCENTS` (record `accent → {primary, gradient}`) par `THEMES` (record `accent → palette complète`) :

```ts
type ThemePalette = {
  mode: "light" | "dark";   // pour info / debug
  bg: string;               // fond global de la carte
  surface: string;          // fond des cartes/sections internes
  surfaceAlt: string;       // fond accent doux (chips, tags, hover)
  border: string;           // bordures
  text: string;             // texte principal
  textMuted: string;        // texte secondaire
  accent: string;           // accent (icônes, prix, points forts)
  gradient: string;         // dégradé bouton CTA + halo identité
  headerBg: string;         // dégradé de l'en-tête centré
};
```

Le composant publie ces tokens en CSS variables sur la racine de la carte (`--card-bg`, `--card-surface`, `--card-surface-alt`, `--card-border`, `--card-text`, `--card-text-muted`, `--card-accent`, `--card-accent-gradient`, `--card-header-bg`).

### 2. Refactor des classes Tailwind → tokens carte

Dans `BusinessCard.tsx`, remplacer **uniquement à l'intérieur de la carte** :

- `bg-background` → `style={{ background: "var(--card-bg)" }}` sur la racine
- `bg-card` → `style={{ background: "var(--card-surface)" }}`
- `bg-accent` → `style={{ background: "var(--card-surface-alt)" }}`
- `border-border` / `divide-border` → `style={{ borderColor: "var(--card-border)" }}` (ou classes utilitaires)
- `text-foreground` → couvert par `color: var(--card-text)` sur la racine
- `text-muted-foreground` → `style={{ color: "var(--card-text-muted)" }}`
- L'en-tête centré (radial gradient codé en dur) → `var(--card-header-bg)`

Pour limiter la verbosité, j'ajoute en haut du fichier une ou deux classes utilitaires conventionnelles (ex. constants `SURFACE_STYLE`, `BORDER_STYLE`) et je les réutilise.

### 3. Catalogue de thèmes — couvrir ~20 secteurs

Plan de la palette : chaque thème choisit explicitement clair ou sombre, avec un accent qui s'accorde. Liste cible (~20 secteurs) :

| ID | Nom | Secteur | Mode |
|---|---|---|---|
| `gold` | Or | Immobilier prestige | Sombre |
| `noir` | Noir & Or | Luxe / Joaillerie | Sombre |
| `emerald` | Émeraude | Finance / Conseil | Sombre |
| `forest` | Forêt | Écologie / Outdoor | Sombre |
| `navy` | Marine | Avocat / Notaire | Sombre |
| `sapphire` | Saphir | Tech / SaaS | Sombre |
| `graphite` | Graphite | Éditorial / Photographe | Sombre |
| `bordeaux` | Bordeaux | Sommellerie / Gastronomie | Sombre |
| `copper` | Cuivre | Artisanat | Clair chaud |
| `cream` | Crème | Coach / Lifestyle | Clair chaud |
| `sand` | Sable | Architecture / Déco | Clair chaud |
| `clay` | Terracotta | Restauration / Café | Clair chaud |
| `rose` | Rose poudré | Beauté / Esthétique | Clair |
| `blush` | Pêche | Coiffure / Maquillage | Clair |
| `mint` | Menthe | Santé / Bien-être | Clair |
| `sky` | Azur | Éducation / Enfance | Clair |
| `paper` | Papier | Avocat / Notaire (clair) | Clair |
| `slate` | Ardoise | Industrie / BTP | Sombre froid |
| `violet` | Violet | Créatif / Design | Sombre |
| `crimson` | Cramoisi | Sport / Salle de sport | Sombre |
| `magenta` | Magenta | Mode / Événementiel | Sombre |
| `sun` | Soleil | Voyage / Hôtellerie | Clair chaud |

≈ 22 thèmes. Chacun avec sa palette complète (bg, surface, surfaceAlt, border, text, textMuted, accent, gradient, headerBg).

### 4. Sélecteur dans le builder — `src/routes/builder.tsx`

- Remplacer le `THEMES` actuel par la même liste avec `{ id, label, sector }` (sans dupliquer les palettes — on importe juste les IDs depuis card-types/un fichier dédié).
- Carte de prévisualisation : au lieu d'un dégradé seul, afficher une **mini-puce** combinant `bg` + bande `surface` + pastille `accent`, pour qu'on devine le rendu réel de la carte.
- Grille en 2 colonnes, scroll vertical naturel (~22 items).

### 5. Stockage

`ThemeAccent` reste un union de string IDs. Pas de changement au store. Les anciens IDs (`gold`, `emerald`, `copper`) restent valides → pas de migration nécessaire.

## Hors scope

- Pas de thème « clair/sombre auto » du système.
- Pas d'override par l'utilisateur des couleurs (custom picker).
- Pas de typographie variable par thème (la font display reste globale).
- Pas d'override de l'app builder / shell.

## Fichiers modifiés

- `src/lib/card-types.ts` — élargir `ThemeAccent` (union de ~22 IDs)
- `src/components/card/BusinessCard.tsx` — définir `THEMES` (palettes complètes), publier les CSS vars sur la racine, remplacer les classes globales par les tokens carte dans tous les sous-composants
- `src/routes/builder.tsx` — nouveau `THEMES_META` (id/label/sector + 3 swatches pour preview), grille 2 col
