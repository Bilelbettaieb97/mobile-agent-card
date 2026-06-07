## Objectif

Sur l'écran de bienvenue du builder, quand l'utilisateur sélectionne un métier, l'aperçu propose **3 variantes de mise en page** au lieu d'une seule. Il peut basculer entre elles via des mini onglets juste au-dessus du téléphone, pour voir concrètement les compositions possibles avant même de commencer à éditer.

## Les 3 variantes

Chaque variante active un sous-ensemble différent de briques. Le ton et l'intention sont distincts pour bien montrer la souplesse du produit.

| Variante | Intention | Briques typiques |
|----------|-----------|------------------|
| **Essentielle** | Carte de visite minimaliste, va à l'essentiel | Identité, contact, vCard, à propos, 1 brique métier |
| **Vitrine** | Effet wow maximal, montre tout le potentiel visuel | Identité, contact, vCard, à propos, stats, services, listings, vidéo/CTA selon métier |
| **Pro** | Orientée prise de contact et crédibilité | Identité, contact, vCard, à propos, services, témoignages, langues, RDV/calendrier |

La composition exacte de chaque variante est adaptée par catégorie métier — la "Vitrine" d'un restaurateur met en avant les visuels et réseaux, celle d'un avocat met en avant l'expertise et les langues, celle d'un dev son portfolio et sa dispo. Le mapping suit la logique déjà en place dans `SECTION_PROFILES`.

## Navigation entre variantes

**Mini onglets** au-dessus du téléphone : `Essentielle · Vitrine · Pro`. Cliquables, l'aperçu se met à jour instantanément.

- Choix par défaut à l'arrivée sur un métier : **Vitrine** (effet wow maximal).
- Une bascule de variante ne change pas le métier sélectionné.
- À l'étape suivante (sections essentielles puis complémentaires), la variante choisie pré-coche les bons interrupteurs — l'utilisateur peut tout modifier.

## Détails techniques

### `src/lib/profession-personas.ts`
- Remplacer `SECTION_PROFILES: Record<category, Profile>` par `SECTION_PROFILES: Record<category, { essentielle, vitrine, pro }>`.
- Ajouter un type `VariantId = "essentielle" | "vitrine" | "pro"`.
- Définir les 3 profils pour chaque catégorie existante (Immobilier, Juridique, Finance, Tech, Santé, Beauté, Coaching, Sport, Restauration, Artisanat, Mode, Créatif, Éducation, Voyage, Événementiel, Média) + un fallback par défaut.
- Étendre `buildPreviewCard(profession, variant?: VariantId)` ; `variant` défaut = `"vitrine"`. Le profil sélectionné applique ses flags par-dessus `DEFAULT_CARD`.

### `src/components/builder/BuilderWelcome.tsx`
- Nouvel état `variant: VariantId` (défaut `"vitrine"`).
- Réinitialiser à `"vitrine"` à chaque changement de métier.
- `previewData` recalculé en fonction de `(selectedProfession, variant)`.
- Au-dessus du `PhoneFrame` à droite, ajouter une barre de 3 mini onglets `Essentielle · Vitrine · Pro`. Visible uniquement quand un métier est sélectionné (sinon : variante implicite, onglets masqués).
- `onConfirm` passe `buildPreviewCard(profession, variant)` au flux suivant pour que les étapes 2 et 3 démarrent avec la bonne composition pré-cochée.

### `src/routes/builder.tsx`
- Aucune modification de structure : reçoit déjà un `CardData` complet via `onConfirm`. La variante est déjà résolue à ce moment-là.

## Hors scope

- Pas de changement de l'ordre des sections dans le rendu (le composant `BusinessCard` garde son ordre fixe). Les 3 variantes diffèrent par les briques activées et leur emphase, pas par leur position.
- Pas de modification du composant `BusinessCard` ni du composant `BuilderSections`.
- Pas d'animation de transition entre variantes (juste un changement de données, déjà fluide grâce au `transition-opacity` existant).
