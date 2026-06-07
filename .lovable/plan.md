# Champs de formulaire conditionnels par variante

## Principe

Quand une variante introduit un élément visuel nouveau (image, label, couleur…), le formulaire doit exposer un champ pour le piloter. Sinon la variante reste « cosmétique » et impossible à personnaliser.

## Audit des variantes

J'ai relu chaque variante existante. Une seule introduit un nouvel élément non géré :

| Section | Variante | Nouvel élément | Statut actuel | Action |
|---|---|---|---|---|
| **Identité** | **Couverture** | Bandeau image en arrière-plan de l'en-tête | Réutilise `data.photo` flouté (donc pas de vrai contrôle séparé) | **Ajouter `coverPhoto`** |
| Identité | Horizontal | — | OK | rien |
| Actions | pills / grid / icons | — (même data) | OK | rien |
| vCard | gradient / outline / card | — | OK | rien |
| Stats | inline / stacked / pills | — | OK | rien |
| About | standard / quote / card | — | OK | rien |
| Vidéo | embed / thumb / cinema | — (même `videoUrl` / `videoTitle`) | OK | rien |
| Services | list / numbered / carousel | — | OK | rien |
| Listings | carousel / stacked / compact | — | OK | rien |
| Calendar | row / cta / block | — | OK | rien |
| Languages | chips / list / grid | — | OK | rien |
| CTA | gradient / outline / bold | — | OK | rien |
| Contact | list / grid / compact | — | OK | rien |
| Socials | icons / pills / branded | — (couleurs câblées en interne) | OK | rien |

Seule **Identité Couverture** a besoin d'un champ supplémentaire pour le moment.

## Changements

### 1. `src/lib/card-types.ts`
- Ajouter `coverPhoto: string` à `CardData`.
- `DEFAULT_CARD.coverPhoto = ""`.

### 2. `src/lib/card-store.ts`
- Le merge avec `localStorage` reprend tous les champs manquants par défaut — vérifier qu'il prend bien `coverPhoto` (logique identique à `variants`).

### 3. `src/components/card/BusinessCard.tsx` — `IdentitySection` variante `cover`
- Bannière : si `data.coverPhoto` est défini → image plein cadre (object-cover, sans flou ni opacité 40%). Sinon → fallback dégradé actuel + photo floutée si dispo, puis dégradé plat si rien.
- Avatar dans le rond : continue d'utiliser `data.photo`.

### 4. `src/routes/builder.tsx` — `IdentityBrick`
- Ajouter, **sous le champ « Secteur géographique »**, un bloc **conditionnel** qui n'apparaît que si `data.variants.identity === "cover"` :
  - Label : « Photo de couverture »
  - Hint : « Affichée en bannière derrière votre photo. »
  - Bouton import (FileReader → `coverPhoto` en data-URL)
  - Aperçu miniature 16/9 + bouton « Retirer »
- Pattern identique à l'upload `photo` déjà en place.

### 5. Règle pour le futur
Ajouter un commentaire en tête de `BRICK_VARIANTS` dans `src/lib/brick-variants.ts` : « Si une nouvelle variante introduit un élément visuel pilotable (image, libellé, lien…), créer le champ correspondant dans `CardData` ET dans le `*Brick` du builder, avec affichage conditionnel sur la variante. »

## Hors scope

- Pas de refonte des autres variantes.
- Pas de système générique « schema → form » (overkill pour ce besoin).

## Fichiers modifiés

- `src/lib/card-types.ts`
- `src/lib/card-store.ts` (vérif seulement, modif si nécessaire)
- `src/components/card/BusinessCard.tsx`
- `src/routes/builder.tsx`
- `src/lib/brick-variants.ts` (commentaire de règle)
