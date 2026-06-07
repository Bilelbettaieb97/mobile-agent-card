
# Variantes de design par brique

Objectif : pour chaque brique (Identité, Actions, Stats, etc.), proposer 2 à 3 **styles visuels** que vous choisissez dans le builder (en haut de la brique, comme pour Témoignages). Toutes les variantes restent **100 % optimisées mobile** (largeur 360 px du PhoneFrame, gouttières 20 px, cibles tactiles ≥ 44 px).

## Catalogue de variantes proposé

| Brique | Variant A (actuelle) | Variant B | Variant C |
|---|---|---|---|
| **Identité** | Centrée (avatar + nom + titre alignés au centre) | Couverture floue + avatar débordant en bas | Horizontal (avatar à gauche, infos à droite) |
| **Actions rapides** | Rangée d'icônes rondes | Pills empilées full-width | Grille 2×2 carrée |
| **vCard** | Bouton gradient large | Bouton outlined minimal | Carte avec icône + texte secondaire |
| **Stats** | Grille inline 3 colonnes | Gros chiffres empilés, label en dessous | Pills compactes en ligne |
| **À propos** | Texte + badges chips | Style citation (Quote, fond léger) | Carte avec icône et titre |
| **Vidéo YouTube** | Embed direct | Thumbnail + bouton play (lite, charge à la demande) | Cinéma : 16:9 plein, titre overlay en bas |
| **Services** | Liste à icônes (actuelle) | Grille numérotée (01 / 02 / 03) | Carrousel de cartes |
| **Listings** | Carrousel snap large | Cartes empilées full-width | Lignes compactes (mini-thumb + infos) |
| **Témoignages** | Cartes / Empilées / Compactes (déjà en place) | — | — |
| **Calendrier** | Carte-row avec chevron | Bouton CTA pleine largeur | Bloc icône agenda + texte centré |
| **Langues** | Chips avec icône | Liste avec puce de niveau (●●●○○) | Grille 2 colonnes avec drapeau emoji optionnel |
| **CTA** | Bannière gradient | Outlined minimal | Pleine largeur bold (fond accent fort) |
| **Coordonnées** | Liste de rows (actuelle) | Grille 2×2 de mini-cartes | Liste compacte icônes + valeurs |
| **Réseaux sociaux** | Icônes rondes centrées | Pills full-width avec label | Boutons branded (couleurs LinkedIn/IG/WhatsApp) |

> Si une variante vous semble inutile, on l'enlève. Si vous en voulez plus pour une brique précise, on l'ajoute.

## UX dans le builder

- En haut du contenu de chaque brique : sélecteur **3 boutons** (Style A / B / C) avec petit libellé + indice (« Centrée », « Couverture », « Horizontal »…) — même pattern que la brique Témoignages actuelle.
- Le choix est instantanément reflété dans l'aperçu mobile à droite.
- Persisté dans `localStorage` (réinitialisation = retour aux variantes par défaut, identiques à l'actuel).

## Architecture technique

1. **`src/lib/card-types.ts`**
   - Ajouter `BrickVariants` :
     ```ts
     interface BrickVariants {
       identity: "centered" | "cover" | "horizontal";
       actions: "icons" | "pills" | "grid";
       vcard: "gradient" | "outline" | "card";
       stats: "inline" | "stacked" | "pills";
       about: "default" | "quote" | "card";
       video: "embed" | "thumb" | "cinema";
       services: "list" | "numbered" | "carousel";
       listings: "carousel" | "stacked" | "compact";
       calendar: "row" | "cta" | "block";
       languages: "chips" | "list" | "grid";
       cta: "gradient" | "outline" | "bold";
       contact: "list" | "grid" | "compact";
       socials: "icons" | "pills" | "branded";
     }
     ```
   - Ajouter `variants: BrickVariants` à `CardData` + valeurs par défaut (= rendu actuel).
   - Garder `testimonialsStyle` tel quel (déjà fait).
   - `card-store.ts` : merger `variants` champ par champ pour les anciens localStorage.

2. **`src/components/card/BusinessCard.tsx`**
   - Refactor : extraire chaque section en sous-composant `IdentitySection`, `ActionsSection`, etc. Chacun reçoit `data` + lit `data.variants.<brick>` et `switch` sur la variante.
   - Le rendu actuel devient la variante par défaut de chaque brique — zéro régression visuelle initiale.
   - Tailles, paddings et cibles tactiles audités sur largeur 320 px (innerW = 300) ET 360 px.

3. **`src/routes/builder.tsx`**
   - Nouveau composant `<VariantPicker brick="identity" />` réutilisable, placé en première position dans chaque BrickBody.
   - Catalogue des variantes (label + hint) centralisé dans un fichier `src/lib/brick-variants.ts` partagé entre builder et card.

## Hors-scope (V1)

- Pas de previews thumbnail SVG des variantes dans le picker — uniquement labels + hint courts (rapide à shipper, lisible). Les vraies previews se voient dans le PhoneFrame à droite.
- Pas de variantes pour `theme` (déjà un sélecteur de couleur).
- Pas de variantes mixables (ex : choisir séparément le style des boutons CTA dans une variante d'Actions).

## Livraison

1. Types + defaults + store
2. Refactor BusinessCard en sections + variantes (toutes les bricks)
3. VariantPicker + intégration dans chaque brique du builder
4. Vérification visuelle dans le PhoneFrame + mode Grille activé (déjà dispo) pour valider l'alignement
