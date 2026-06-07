## Objectif

Améliorer la brique « Thème » pour que :
1. La sélection d'un métier applique la palette **immédiatement** (déjà le cas — confirmer le comportement).
2. La sélection courante soit **visuellement évidente** à tout moment, où qu'on soit dans la liste.

## Modifications dans `src/routes/builder.tsx` — `ThemeBrick`

### a. Bandeau de sélection courante (toujours visible, en haut)
Au-dessus des onglets, afficher une carte récapitulative :

```text
┌──────────────────────────────────────────────┐
│ ● [swatch]  Métier : Avocat                  │
│            Thème appliqué : Marine           │
└──────────────────────────────────────────────┘
```

- Swatch carré (bg + surface + pastille accent) du thème actif.
- Si `data.profession` est défini → libellé du métier ; sinon → « Thème personnalisé ».
- Toujours affiché, sticky en haut du contenu de la brique.

### b. Indicateur de sélection renforcé sur les items
Remplacer le `border-primary bg-accent/40` discret par :
- Anneau extérieur 2px `ring-2 ring-primary ring-offset-2 ring-offset-card`.
- Pastille « ✓ Sélectionné » (badge) en haut à droite de l'item actif.
- Léger fond `bg-primary/5` pour distinguer du hover.
- Petit point clignotant/animé `animate-pulse` sur le swatch actif (subtil).

Appliqué aux deux onglets (liste métiers + grille thèmes).

### c. Scroll automatique vers l'élément actif
Quand on ouvre l'onglet « Par métier », si un métier est déjà sélectionné, scroller pour l'amener en vue (`ref.scrollIntoView({ block: "nearest" })` au mount).

### d. Application immédiate (déjà OK)
Le clic appelle déjà `update("profession", id)` + `update("accent", themeId)` qui propagent instantanément la palette via le store Zustand-like et CSS variables. Aucune action différée — confirmer simplement.

## Hors périmètre
- Pas de nouveaux métiers ni de nouvelles palettes.
- Pas de modification de `BusinessCard`, `card-themes.ts`, `card-store.ts`.

## Fichier touché
- `src/routes/builder.tsx` (uniquement la fonction `ThemeBrick`).
