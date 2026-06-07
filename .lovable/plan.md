# Étape 2 — Mieux guider la comparaison

Deux ajouts ciblés sur `src/components/builder/BuilderCompare.tsx` (+ petit toggle sur `PhoneFrame`).

## 1. Indice "scrollable" sur l'aperçu téléphone

Aujourd'hui le `PhoneFrame` a un viewport scrollable de 720px de haut, mais rien n'indique visuellement qu'on peut faire défiler la carte. Résultat : l'utilisateur croit voir tout le contenu, surtout sur la variante Vitrine qui contient bien plus de sections.

Ajouts :
- Un **fondu en bas** du téléphone (gradient `from-transparent to-background`, h≈40px, `pointer-events-none`, absolu, dans le `PhoneFrame`) pour signaler que le contenu continue.
- Un **petit badge "Faites défiler ↓"** sous chaque téléphone dans `BuilderCompare`, avec une légère animation `animate-bounce` (atténuée). Disparaît au premier scroll (état local par carte, optionnel — sinon on le laisse en permanence, c'est plus simple).
- Option discrète : faire apparaître une **mini scrollbar visible** uniquement dans le contexte builder via une prop `showScrollHint` sur `PhoneFrame`, pour ne pas casser l'aperçu "vrai téléphone" ailleurs.

Choix retenu : fondu + badge sous le téléphone (le plus lisible, zéro effet de bord).

## 2. Différencier clairement les 3 mises en page

Les hints actuels ("L'indispensable", "Tout le potentiel", "Contact & crédibilité") sont trop abstraits. On ajoute, sous le titre de chaque carte, une **liste courte de 2–3 puces** qui dit explicitement *ce qui est inclus*, en insistant sur le fait que la différence = nombre de sections.

Exemples (à formuler en français court, puces avec `Check` icon) :

- **Essentielle** — *~4 sections*
  - Identité + contact rapide
  - Ajout au répertoire (vCard)
  - À propos court
- **Vitrine** ⭐ — *toutes les sections (~10)*
  - Tout d'Essentielle + Pro
  - Services, témoignages, galerie
  - Réseaux, agenda, langues
- **Pro** — *~6 sections*
  - Essentielle + crédibilité
  - Témoignages & certifications
  - Réseaux pro

Les chiffres exacts sont calculés depuis `buildPreviewCard(profession, v.id)` en comptant les flags `*Enabled === true` → affiché dynamiquement (`{count} sections incluses`) pour rester honnête par métier.

Aussi : juste sous le sous-titre du `StepHeader` (ou en bandeau au-dessus de la grille), une ligne d'explication unique :
> *La différence entre les 3 mises en page = le nombre de sections activées. Vous pourrez tout ajuster ensuite.*

## Détails techniques

- `PhoneFrame` : nouvelle prop optionnelle `scrollHint?: boolean`. Si vraie, ajouter un `<div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />` à l'intérieur du conteneur `overflow-hidden`.
- `BuilderCompare.tsx` :
  - Passer `scrollHint` au `PhoneFrame`.
  - Ajouter sous le bloc téléphone : `<div className="text-[11px] text-muted-foreground flex items-center gap-1"><ChevronDown className="h-3 w-3 animate-bounce" /> Faites défiler l'aperçu</div>`.
  - Ajouter un helper `countSections(data: CardData): number` local (somme des flags `*Enabled`).
  - Remplacer le bloc "Titre" par : titre + badge `{count} sections` + liste 2–3 puces différenciantes (texte statique par variante, pas par métier — c'est la promesse de la mise en page).
  - Ajouter la ligne explicative globale juste sous le `StepHeader`.

## Hors scope

- Pas de changement aux variantes elles-mêmes ni à `profession-personas.ts`.
- Pas de modif de l'étape 1, 3, 4, 5.
