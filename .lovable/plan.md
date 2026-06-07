# Corriger le chevauchement entre briques

## Le problème

Chaque section (Identité, Actions, vCard, Stats…) gère elle-même son espacement vertical via des classes `mt-4`, `mt-5`, `mt-6` posées sur sa balise racine. Certaines variantes utilisent en plus des effets visuels qui « débordent » de leur boîte logique :

- **Identité « Couverture »** : bannière 144px + bloc contenu tiré vers le haut avec `-mt-12` → la hauteur réelle du header est plus petite que ce que l'œil perçoit, et le visuel descend plus bas que le flux.
- **Identité « Horizontal »** : carte avec bordure et padding propres.
- **Actions « Pills » / « Grid »** : éléments pleine largeur qui collent visuellement à ce qui précède s'il n'y a pas de respiration garantie.

Comme chaque brique a sa propre marge, le mélange de variantes produit des espacements incohérents — et dans le cas Couverture + Pills, les deux blocs se touchent / se chevauchent.

## La solution

Centraliser l'espacement dans **un seul conteneur parent** dans `BusinessCard.tsx`, et retirer toutes les marges verticales individuelles des sections.

### 1. `src/components/card/BusinessCard.tsx` — conteneur unique

Envelopper Identity + la boucle des sections ordonnées dans un wrapper qui impose un gap uniforme :

```tsx
<div className="flex flex-col gap-6 pt-4 pb-2">
  <IdentitySection data={data} />
  {data.sectionOrder.filter(...).map(...)}
</div>
```

Avantages :
- Espacement **identique** entre toutes les briques (24px), quelle que soit la variante.
- Aucune brique ne peut « manger » l'espace d'une autre.
- Le drag-and-drop reste valide : l'ordre change, l'espacement reste constant.

### 2. Nettoyer chaque section

Pour **chaque** sous-composant (`IdentitySection`, `ActionsSection`, `VCardSection`, `StatsSection`, `AboutSection`, `VideoSection`, `ServicesSection`, `ListingsSection`, `TestimonialsSection`, `CalendarSection`, `LanguagesSection`, `CtaSection`, `ContactSection`, `SocialsSection`) et **chaque variante** :

- Retirer `mt-2`, `mt-3`, `mt-4`, `mt-5`, `mt-6`, `mt-8` de la balise racine de la section.
- Garder `px-5` (gouttières) et le padding interne.
- Pour la variante **Identité Couverture** : remplacer le `-mt-12` par un layout sans débordement négatif — soit un `padding-top` réservé pour l'avatar, soit un avatar positionné en absolu avec un `padding-top` équivalent sur le bloc texte. La boîte logique correspondra alors au visuel.
- Pour la variante **Identité par défaut (centered)** : déjà `pt-3 pb-7`, simplement retirer le `mt-2`.

### 3. Garantir qu'aucune variante future ne casse l'alignement

Ajouter un commentaire en tête de chaque sous-composant : « Ne pas poser de marge verticale sur la racine — l'espacement est géré par le parent. »

## Hors scope

- Pas de changement de design des variantes (couleurs, formes, typo).
- Pas de changement du système de variantes ni du store.
- Pas de touche au builder ni au drag-and-drop.

## Fichiers modifiés

- `src/components/card/BusinessCard.tsx` (seul fichier)
