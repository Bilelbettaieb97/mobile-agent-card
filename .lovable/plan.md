# Sections verrouillées par plan + upgrade en un clic

## Pourquoi

Aujourd'hui, le visiteur choisit une mise en page à l'étape 2 mais peut ensuite activer **n'importe quelle** section à l'étape 3/4 — la promesse des 3 plans devient floue. On va verrouiller les sections selon le plan choisi et proposer un upgrade contextuel quand il clique sur une section non-incluse.

## Le mapping section → plan minimum

Un seul mapping canonique, indépendant du métier (plus simple à comprendre que les variations actuelles par catégorie).

| Plan         | Sections incluses                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------- |
| **Essentielle** | Identité, Contact, Boutons d'action, vCard, À propos                                            |
| **Pro**         | tout Essentielle + Services, Témoignages, Prise de rendez-vous, Langues, Réseaux sociaux       |
| **Vitrine**     | tout Pro + Chiffres clés, Réalisations/biens, Vidéo, Bannière CTA                              |

Logique : Essentielle = se présenter, Pro = convertir/rassurer, Vitrine = tout montrer.

## Ce qu'on construit

### 1. État du builder : ajouter `plan`

Dans `src/routes/builder.tsx`, ajouter un champ `plan: VariantId` au state, défini quand l'utilisateur clique "Choisir cette mise en page" à l'étape 2. Persisté avec le reste (localStorage si déjà en place).

### 2. Bandeau "Plan actuel" en haut des étapes 3 & 4

Au-dessus de la liste des sections, un bandeau compact, **toujours visible** :

```text
[●] Plan actuel : Pro    5 / 9 sections débloquées    [Changer de plan ▾]
```

Le bouton "Changer de plan" ouvre un petit menu (3 options + nombre de sections + court descriptif) pour switcher sans repasser par l'étape 2.

### 3. Sections verrouillées : visibles mais désactivées

C'est la **best practice** pour ce genre de gating (Notion, Linear, Figma le font tous ainsi) — montrer la valeur de l'upgrade vaut mieux que cacher.

Pour chaque section non-incluse dans le plan actuel :

- La carte reste dans la liste, **opacité 60%**, le Switch est remplacé par un petit cadenas + badge `Pro` ou `Vitrine` (couleur du plan).
- Toute la carte est cliquable et ouvre une **mini-modale inline** (pas un dialog plein écran, juste un encart qui se déplie) :

  ```text
  🔒 « Témoignages » fait partie du plan Pro

  Passez à Pro pour activer cette section
  (+ Services, Prise de RDV, Langues, Réseaux sociaux).

  [Passer à Pro et activer]   [Annuler]
  ```

- Clic sur "Passer à Pro et activer" → on met à jour `plan` ET on active la section cliquée, puis on affiche un toast :  
  *"Plan passé à Pro. Témoignages activé."*

### 4. Compteur de sections actives, contextualisé

Au lieu de "X sections actives", afficher :  
*"5 / 5 sections du plan Essentielle actives — débloquez-en plus en passant à Pro"*

## Fichiers touchés

- `src/routes/builder.tsx` — ajouter `plan` au state, le passer aux composants enfants, l'initialiser quand `onChoose` est appelé dans `BuilderCompare`.
- `src/lib/profession-personas.ts` — exporter une constante `SECTION_TIER: Record<EnabledKey | "actions" | "identity", VariantId>` (le mapping ci-dessus) + helper `isSectionAllowed(plan, key)` et `planRank(plan)`.
- `src/components/builder/BuilderSections.tsx` — recevoir `plan` + `setPlan`, ajouter le bandeau "Plan actuel", remplacer le Switch par cadenas + mini-modale inline pour les sections verrouillées, brancher l'upgrade auto + toast.
- `src/components/builder/BuilderCompare.tsx` — au `onChoose`, transmettre aussi le `variant` choisi pour qu'il devienne le `plan` du state (déjà le cas via la signature actuelle, juste à câbler côté `builder.tsx`).

## Hors scope

- Pas de changement au mapping persona/contenu existant (`SECTION_PROFILES` reste pour le **pré-remplissage** à l'étape 2, mais c'est `SECTION_TIER` qui gouverne le **verrouillage** à l'étape 3/4).
- Pas de paiement réel — "Passer à Pro" change juste le plan en cours, c'est gratuit pour l'instant. Le hook est posé pour brancher Stripe/Paddle plus tard.
- Pas de changement aux étapes 1 et 5.
