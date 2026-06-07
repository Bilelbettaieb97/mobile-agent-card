## Objectif

Permettre à l'utilisateur de choisir un **métier** dans la brique « Thème » : la sélection applique automatiquement la palette complète associée. Chaque thème existant est mappé à plusieurs métiers courants, et un même thème peut être proposé pour plusieurs métiers (ex. « Coach sportif » → `crimson`, « Coach de vie » → `cream`).

## Ce qui sera ajouté / modifié

### 1. `src/lib/card-themes.ts`
Ajouter un mapping **métier → themeId** (typé) à côté du catalogue existant.

- Nouvelle constante `PROFESSIONS: { id, label, category, themeId }[]` (~60 métiers courants regroupés par catégorie : Immobilier, Juridique, Santé, Beauté, Restauration, Tech, Finance, Coaching, Artisanat, Mode, Sport, Éducation, Voyage, Créatif, BTP, Événementiel, etc.).
- Chaque entrée pointe vers un `themeId` existant parmi les 22 palettes déjà définies — **pas de nouvelle palette créée**.
- Export `PROFESSIONS_BY_THEME` (groupement inverse) pour afficher les métiers suggérés sous chaque thème.

### 2. `src/routes/builder.tsx` — refonte du `ThemeBrick`
Deux onglets dans la brique Thème :

```text
┌─ Par métier ─┬─ Par thème ─┐
│ [Combobox / select]        │
│  Catégorie ▾  Métier ▾     │
│                            │
│  ou liste filtrée :        │
│  • Agent immobilier  → Or  │
│  • Avocat            → ... │
└────────────────────────────┘
```

- **Onglet « Par métier »** (par défaut) : un champ de recherche + liste groupée par catégorie. Cliquer sur un métier appelle `update("accent", themeId)`. Le métier sélectionné est mémorisé dans `data.profession` pour ré-afficher l'état actif.
- **Onglet « Par thème »** : grille actuelle des 22 palettes, inchangée visuellement, avec en plus la liste des métiers suggérés affichée sous le label.

### 3. `src/lib/card-types.ts`
Ajouter un champ optionnel `profession?: string` à `CardData` pour mémoriser le métier choisi (utile pour pré-cocher l'onglet « Par métier » et ré-ouvrir l'app sur le bon item). Valeur par défaut : `undefined`.

### 4. `src/lib/card-store.ts`
Inclure `profession: undefined` dans l'état initial pour que la persistance locale ne casse pas.

## Hors périmètre

- Pas de nouvelle palette de couleurs (le set actuel de 22 thèmes reste tel quel).
- Pas de modification du rendu de `BusinessCard` — seul le sélecteur change.
- Pas d'auto-suggestion basée sur le titre/poste saisi dans Identité (uniquement sélection explicite).

## Fichiers touchés

- `src/lib/card-themes.ts` (ajout mapping métiers)
- `src/lib/card-types.ts` (champ `profession`)
- `src/lib/card-store.ts` (defaut)
- `src/routes/builder.tsx` (refonte `ThemeBrick` avec onglets + recherche)
