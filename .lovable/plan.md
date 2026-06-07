## Effet "waw" — Écran d'accueil du builder avec démo live

### Comportement

Quand on entre dans `/builder` sans avoir déjà choisi de métier, on tombe sur un **écran de bienvenue plein écran** en split-screen :

```
+--------------------------------------+------------------+
|  CHOISIR SON UNIVERS                 |                  |
|                                      |   [iPhone live]  |
|  [ Par métier ]  [ Par thème ]       |                  |
|  ─────────────────────────           |   Carte démo     |
|  🔍 Rechercher un métier…            |   du persona     |
|                                      |   sélectionné    |
|  ▸ Immobilier                        |   (transition    |
|     · Agent prestige     [GOLD]      |    fluide entre  |
|     · Chasseur           [NAVY]      |    palettes)     |
|     · …                              |                  |
|  ▸ Santé / …                         |                  |
|                                      |                  |
|  [ Commencer avec ce modèle → ]      |                  |
+--------------------------------------+------------------+
```

- **Hover/clic** sur un métier → la carte de droite **change immédiatement** de palette + de contenu (persona dédié).
- **Bouton "Commencer"** → applique le persona au store + bascule sur l'écran d'édition existant (les bricks).
- Si l'utilisateur a déjà sauvegardé une carte (profession existante en `localStorage`), on **saute** l'accueil et on va direct à l'édition. Un bouton **"Changer de thème"** dans la topbar permet de revenir à l'accueil à tout moment.

### Persona par métier (≈70)

Nouveau fichier `src/lib/profession-personas.ts` exportant `PERSONAS: Record<string, Persona>` indexé par `profession.id`. Chaque persona = override partiel de `CardData` :

- `name`, `title`, `agency`, `area`, `bio` (crédibles, FR, ton du métier)
- `stats` (3 chiffres clés métier — ex. "1 200 patients", "98 % de satisfaction")
- `services` (3 prestations réalistes)
- `badges` (2-3 certifications / labels du métier)
- `ctaTitle` / `ctaText` adaptés
- `photo` : portrait via `https://i.pravatar.cc/400?img=N` (déterministe, fiable, libre)
- `listings` : 1-3 photos via `https://picsum.photos/seed/<id>/800/600` (sinon vide pour les métiers sans portfolio visuel)
- Réutilise le `themeId` déjà défini dans `PROFESSIONS` pour la palette.

Un helper `buildPreviewCard(professionId)` retourne `{ ...DEFAULT_CARD, ...persona, accent: theme, profession: id }` prêt à être passé à `<BusinessCard>`.

### Composants à créer / modifier

**Nouveau : `src/components/builder/BuilderWelcome.tsx`**
- Split-screen : gauche = panneau de sélection, droite = `PhoneFrame` + `BusinessCard` du preview.
- Onglets **Par métier / Par thème** (logique reprise de l'actuel `ThemeBrick`, mais en pleine page).
- Recherche + liste groupée par catégorie, scroll fluide, badge ✓ sur l'item actif.
- Pied de panneau : bouton sticky **"Commencer avec ce modèle →"** (désactivé tant qu'aucun choix n'a été fait, sinon affiche le métier choisi).
- Transition de palette : utilise `transition: background 400ms ease, color 400ms ease` sur la racine de la carte pour un fondu propre entre thèmes.
- Touche "waw" : halo dégradé doux derrière le téléphone qui reprend la couleur d'accent du thème courant, badge "✨ Aperçu live" en haut à droite.

**Modifié : `src/routes/builder.tsx`**
- Nouveau state local `step: "welcome" | "edit"`, initialisé à `"welcome"` si `!data.profession`, sinon `"edit"`.
- Si `step === "welcome"` → rend `<BuilderWelcome onPick={...} onSkip={...} />` à la place du layout actuel.
- Bouton **"Changer de thème"** dans la topbar de l'édition → `setStep("welcome")`.
- Le ThemeBrick existant dans la colonne d'édition est conservé (toujours utile pour ajuster après coup).

**Inchangé**
- `BusinessCard`, `PhoneFrame`, store, vCard, ShareDialog : aucun changement.
- Bricks d'édition : inchangées.

### Détails techniques

- **Pré-chargement** des portraits du persona survolé pour éviter le flash (préfetch via `new Image()`).
- **Accessibilité** : navigation clavier sur la liste (flèches haut/bas → preview, Entrée → commencer), focus visible.
- **Mobile** : sur petit écran, l'aperçu passe en bas, en sticky réduite (180px), au-dessus de la liste — ou en drawer "Voir l'aperçu" comme aujourd'hui.
- **`prefers-reduced-motion`** : pas d'auto-rotation, juste fondu de couleur instantané.

### Fichiers touchés

- ➕ `src/lib/profession-personas.ts` (nouveau, ≈70 personas + helper)
- ➕ `src/components/builder/BuilderWelcome.tsx` (nouveau)
- ✏️ `src/routes/builder.tsx` (state `step`, montage conditionnel, bouton "Changer de thème")

### Hors scope

- Pas de modification de la carte fictive elle-même ni des bricks.
- Pas de cloud / auth / analytics.
- Pas de nouveaux thèmes ou nouveaux métiers — on s'appuie sur ce qui existe.
