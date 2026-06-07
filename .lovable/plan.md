# Refonte du parcours /builder en 5 étapes

Aujourd'hui le parcours est en 3 étapes (welcome → essentials → extras → édition). La variante (essentielle/vitrine/pro) est cachée dans un panneau latéral et la sélection des sections est binaire (toggle puis "Continuer"), sans saisie en ligne. On le réorganise pour rendre le choix de mise en page central et le remplissage progressif.

## Nouveau flux

```
Étape 1 — Choix du métier (ou thème) + aperçu live
   [Choisir ce template]   [Passer →]
        │                       │
        ▼                       ▼
Étape 2 — Comparaison 3 variantes plein écran (Vitrine mise en avant)
   [Choisir cette mise en page]
        │
        ▼
Étape 3 — Sections essentielles (toggle + formulaires inline)
   Identité · Contact · Boutons d'action · vCard · À propos
        │
        ▼
Étape 4 — Sections complémentaires (toggle ouvre le formulaire)
   Services · Stats · Réalisations · Témoignages · Vidéo · RDV · CTA · Langues · Réseaux
        │
        ▼
Étape 5 — Édition libre (liste complète des briques + design)
   [Activer ma carte]
```

## Détails par étape

**Étape 1 — Choix du template**
- Vue actuelle (BuilderWelcome), sans le panneau "variantes" à droite ni le bouton "Comparer les 3".
- Le clic "Choisir ce template" → étape 2.
- Lien secondaire "Passer cette étape" → applique un template par défaut (thème "gold" sans persona) et saute directement à l'étape 3.

**Étape 2 — Comparaison des 3 mises en page**
- Au lieu d'arriver sur l'édition directement, le mode plein écran "Comparer" s'ouvre automatiquement.
- Présentation : 3 cartes côte à côte (Essentielle / Vitrine / Pro), Vitrine au centre, légèrement plus grande, avec un badge "Recommandée — tout le potentiel".
- Chaque carte a un bouton "Choisir cette mise en page" → étape 3.
- Bouton retour "Changer de métier" → étape 1.

**Garantir que "Vitrine" montre toutes les briques disponibles**
Actuellement chaque catégorie active 4-5 sections seulement en variante Vitrine. On élargit `vitrine` pour activer la liste maximale (toutes les sections compatibles avec la persona) : about, stats, services, listings (si `withListings`), testimonials, video, calendar, languages, cta, socials. Seules les sections sans contenu cohérent dans la persona restent off. Ainsi le visiteur voit le potentiel maximal d'un coup d'œil dans l'aperçu Vitrine.

**Étape 3 — Sections essentielles avec saisie inline**
Réécriture de la vue actuelle "essentials" :
- Chaque ligne devient une carte expansible. Toggle ON → la carte s'ouvre et affiche ses champs (réutilise les composants `IdentityBrick`, `ContactBrick`, `ActionsBrick`, `AboutBrick` déjà dans `builder.tsx`).
- Identité reste verrouillée ON, ouverte par défaut.
- Aperçu live à droite (déjà en place) qui suit chaque saisie.
- Bouton "Continuer" → étape 4.

**Étape 4 — Sections complémentaires avec saisie inline**
Même principe que l'étape 3 : toggle ON ouvre le formulaire de la brique correspondante (`ServicesBrick`, `StatsBrick`, `ListingsBrick`, etc.) directement dans la liste, l'utilisateur peut remplir avant de continuer.
- Bouton "Continuer" → étape 5.

**Étape 5 — Édition libre + activation**
La vue "édition" actuelle (liste complète DnD avec toutes les briques, panneau aperçu, header). Le bouton principal en haut à droite devient "Activer ma carte" (gros bouton primaire, ouvre la `ShareDialog` existante avec lien public + QR). Les boutons existants (Réinitialiser, Changer de thème, Aperçu mobile) restent.

## Changements techniques

**`src/lib/profession-personas.ts`**
- Reformuler `SECTION_PROFILES` : pour chaque catégorie, la variante `vitrine` active la liste maximale de sections supportées. Helper `vitrineAll()` qui active tout sauf ce qui n'a pas de contenu persona.
- Garder `essentielle` (minimal) et `pro` (contact/crédibilité) inchangés.

**`src/components/builder/BuilderWelcome.tsx`**
- Retirer le mini-sélecteur de variantes et le bouton "Comparer les 3" (la comparaison devient une étape à part entière).
- Le bouton principal "Choisir ce template" remplace l'actuel CTA.
- Ajouter un lien discret "Passer cette étape →" sous le CTA.
- `onConfirm` reçoit maintenant juste la sélection métier/thème, sans variant.

**Nouveau `src/components/builder/BuilderCompare.tsx`**
- Vue plein écran dédiée (extraction du Dialog actuel).
- Props : `data`, `selectedProfession`, `onBack`, `onChoose(variant)`.
- Layout 3 colonnes desktop, carrousel mobile snap.
- Vitrine au centre, plus grande (scale ~1.05), badge "Recommandée".
- Chaque carte cliquable → `onChoose(v.id)`.

**`src/components/builder/BuilderSections.tsx`**
- Refonte : `<label>` simple devient `<div>` avec accordéon contrôlé par le toggle.
- Quand `toggles[key] === true`, render le formulaire de la brique (les composants `*Brick` doivent être exportés depuis `builder.tsx` ou déplacés dans `src/components/builder/bricks/` pour être partagés).
- Identité ouverte par défaut, toggle masqué.
- Le compteur "X sections actives" reste, l'aperçu live à droite reste.

**`src/routes/builder.tsx`**
- `step` devient `"welcome" | "compare" | "essentials" | "extras" | "edit"`.
- Après `welcome.onConfirm`, on passe à `"compare"` (au lieu d'`"essentials"`).
- `compare.onChoose(variant)` : applique le profil de sections de la variante via `buildPreviewCard(profession, variant)` au store, puis passe à `"essentials"`.
- Lien "Passer" depuis welcome → applique le thème seul → passe directement à `"essentials"`.
- Refactor : extraire `IdentityBrick`, `ContactBrick`, `ActionsBrick`, `AboutBrick`, `ServicesBrick`, `StatsBrick`, `ListingsBrick`, `TestimonialsBrick`, `VideoBrick`, `CalendarBrick`, `LanguagesBrick`, `CtaBrick`, `SocialsBrick` vers `src/components/builder/bricks.tsx` (ou un dossier `bricks/`) pour être réutilisables par `BuilderSections` et la vue d'édition finale.
- Bouton principal de la vue "edit" : "Activer ma carte" qui ouvre `ShareDialog`.

**Compteur d'étapes**
Étiquette "Étape N / 5" mise à jour dans Welcome (1), Compare (2), Essentials (3), Extras (4), Edit (5).
