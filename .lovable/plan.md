# Plan : ergonomie guidée du Builder (5 étapes)

## Objectif
Transformer le `/builder` en parcours fluide et guidé où chaque étape est immédiatement compréhensible, avec un CTA toujours visible et des repères visuels clairs.

## État actuel identifié
- Le header d'étape est aligné à gauche, peu visible.
- Le CTA "Choisir ce template" est en bas, compact, pas suffisamment mis en avant.
- Les étapes 3/4 ont le même pattern de header à gauche.
- Pas de barre de progression globale.

## Décisions de design
- **Header centré** sur chaque étape : badge "Étape X / 5", titre H1, sous-titre explicatif. Centré horizontalement avec un max-width lisible.
- **CTA double** sur l'étape 1 : un bouton principal "Choisir ce template" flottant sticky en **haut** de la zone de contenu (desktop) / en bas de l'écran (mobile), ET un second bouton identique en bas de la liste de métiers. Cela évite le scroll infini pour trouver le bouton.
- **Boutons plus visibles** : taille `size="lg"`, icône, style plein avec `shadow-glow`, possiblement un `transform scale` subtil au hover.
- **Barre de progression** fine en haut de page pour montrer visuellement où on en est dans les 5 étapes.
- **Indicateurs de sélection** renforcés sur les cartes métier (bordure plus épaisse, fond plus contrasté).

## Changements détaillés

### 1. `BuilderWelcome.tsx`
- Refactor le header : centrer verticalement et horizontalement le bloc titre/badge/sous-titre au-dessus du contenu principal.
- Ajouter une **barre de progression sticky** fine en haut de page (h-1, couleur primary, width = step/5).
- Ajouter un **CTA sticky en haut** de la colonne gauche (ou bandeau flottant desktop) : "Choisir ce template" `size="lg"` avec icône `ArrowRight`, style `shadow-glow`.
- Garder le CTA existant en bas de la liste, mais le rendre plus visible (pleine largeur sur mobile, plus grand).
- Le bouton "Passer" devient un lien texte discret à côté du CTA principal plutôt qu'un bouton ghost isolé.
- Renforcer le style de la carte métier sélectionnée : ajouter un fond `primary/10`, une bordure `primary/50`, et un badge "Sélectionné".

### 2. `BuilderCompare.tsx`
- Uniformiser le header : centrer le titre/badge/sous-titre comme sur l'étape 1.
- Conserver le CTA "Choisir cette mise en page" mais le rendre plus visible sur la variante Vitrine (badge + bouton plein + `shadow-glow`).
- Ajouter la barre de progression sticky (2/5).

### 3. `BuilderSections.tsx`
- Uniformiser le header : centrer le titre/badge/sous-titre.
- Ajouter la barre de progression sticky (3/5 ou 4/5).
- Renforcer le CTA "Continuer" / "Personnaliser ma carte" en bas (pleine largeur mobile, `size="lg"`, `shadow-glow`).
- Ajouter un petit texte "X sections activées" plus visible (badge de statut).

### 4. `builder.tsx` (étape 5)
- Uniformiser le header : centrer le titre/badge/sous-titre si applicable, ou ajouter le badge étape dans la topbar existante.
- Ajouter la barre de progression sticky (5/5).
- Renforcer le bouton "Activer ma carte" (`size="lg"`, `shadow-glow`).

### 5. `styles.css`
- Ajouter si besoin un token `--shadow-glow-strong` pour les CTA principaux.

## Mise en page textuelle

```text
┌─────────────────────────────────────────────────────────────────┐
│ [==========●====]  ← barre de progression fine sticky          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              ● Étape 1 / 5  (badge centré)                      │
│            Choisissez votre univers  (H1 centré)                │
│     Sélectionnez votre métier — votre carte sera…  (sous-titre) │
│                                                                 │
├────────────────────────────┬──────────────────────────────────────┤
│ [CTA sticky] Choisir ce  │                                      │
│  template  (Passer →)      │         Aperçu live                │
│                            │         [PhoneFrame]               │
│  [Tabs: Par métier /       │                                      │
│   Par thème]               │                                      │
│                            │                                      │
│  [Rechercher…]             │                                      │
│                            │                                      │
│  ○ Agent immobilier        │                                      │
│  ● Architecte   ← fond     │                                      │
│    plus visible            │                                      │
│  ○ …                       │                                      │
│                            │                                      │
│  [CTA bas] Choisir ce      │                                      │
│   template  (Passer →)     │                                      │
├────────────────────────────┴──────────────────────────────────────┤
```

## Dépendances
Aucun package supplémentaire. Tout est réalisable avec les composants existants (Button, Badge) et Tailwind.

## Non inclus dans ce plan
- Refonte des couleurs ou thème global.
- Ajout d'animations complexes (hors hover/focus standards).
- Modification du contenu des briques d'édition.