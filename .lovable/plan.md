# Parcours builder plus clair, étape par étape

## Problème

Aujourd'hui chaque étape a son propre header, son propre bouton « Continuer », et chacun est nommé/placé différemment. Le visiteur sait sur quelle étape il est (1/5, 2/5…), mais pas :
- comment s'appellent les 5 étapes et ce qui reste à faire,
- comment revenir à une étape précédente (le bouton « Retour » renvoie d'une étape à l'autre, mais on ne peut pas sauter directement à l'étape 2 depuis l'étape 4),
- où se trouve « Suivant » à chaque étape — il change de label, de position, et parfois de couleur.

## Ce qu'on construit

### 1. Un stepper cliquable, partagé, sticky en haut

Remplacer la barre de progression `StepHeader` (simple barre 1px + pastille « Étape X/5 ») par un **vrai stepper visuel** sticky :

```
 ●━━━━━○━━━━━○━━━━━○━━━━━○
 1     2     3     4     5
Métier  Modèle Essentiels Plus  Finition
```

- 5 puces numérotées + label court sous chacune.
- Puce **active** : remplie en primary, label en `text-foreground`.
- Puce **complétée** (étape déjà visitée) : remplie discrètement avec un ✓, **cliquable** pour y retourner.
- Puce **future** : grise, non-cliquable.
- Sur mobile : les labels passent en dessous, plus petits ; les puces restent visibles.

Le composant remplace l'actuel `StepHeader` et est utilisé par les 5 étapes (welcome, compare, essentials, extras, edit) — c'est la **même barre** partout, ce qui ancre visuellement le parcours.

### 2. Une barre d'action fixe en bas de chaque étape

Aujourd'hui le bouton « Continuer » est en bas du contenu, qu'il faut scroller pour atteindre. On le sort dans une **barre sticky en bas de viewport**, identique sur les 5 étapes :

```
[← Retour]              Étape 3/5 — Essentiels              [Continuer →]
```

- Bouton **gauche** : toujours « ← Retour » (sauf étape 1 où il est désactivé / absent).
- Centre : titre court de l'étape courante + indicateur de complétion contextuel (ex. "5/5 sections actives", "Plan : Pro").
- Bouton **droite** : toujours **« Continuer → »** avec le même style (taille, couleur, glow). À l'étape 5 il devient **« Activer ma carte 🚀 »**.

Sticky en bas (`fixed bottom-0`), avec backdrop-blur et bordure haute. Padding-bottom ajouté au main pour éviter que la barre cache le contenu.

### 3. Uniformiser le vocabulaire des étapes

Aujourd'hui les titres sont variables ("Choisissez votre univers", "Choisissez votre mise en page", "Les sections essentielles"...). On clarifie en gardant un seul système :

| # | Label court (stepper) | Titre H1                                     |
| - | --------------------- | -------------------------------------------- |
| 1 | Métier                | Choisissez votre métier                      |
| 2 | Modèle                | Choisissez un modèle                         |
| 3 | Essentiels            | Remplissez les sections essentielles         |
| 4 | Sections en plus      | Ajoutez des sections complémentaires         |
| 5 | Finition              | Personnalisez et activez                     |

### 4. Aide contextuelle "Ce qui vous attend ensuite"

Sous le sous-titre de chaque étape, une ligne discrète indique **ce qui vient après** pour rassurer :

> *Après cette étape : choisir un modèle de mise en page.*

À l'étape 5, elle devient : *Dernière étape — votre carte sera prête à partager.*

### 5. Cohérence Retour ↔ Stepper

- Le bouton « Retour » de la barre du bas et le clic sur une puce passée du stepper font la même chose.
- L'étape 1 n'a pas de « Retour » (ou « Quitter le builder » qui ramène à `/`).

## Fichiers touchés

- `src/components/builder/StepHeader.tsx` — réécrire en stepper cliquable (5 puces + labels) + ligne « après cette étape ». Accepte `step`, `title`, `subtitle`, `onGoToStep?: (n) => void`, `completedThrough: number` (jusqu'où le user est allé), `nextHint?: string`.
- `src/components/builder/StepFooter.tsx` (nouveau) — barre sticky bas avec `onBack`, `onNext`, `nextLabel`, `centerInfo`, `step`.
- `src/components/builder/BuilderWelcome.tsx` — utiliser `StepHeader` nouvelle API + `StepFooter`. Supprimer le bouton sticky-top et le bloc CTA bas dupliqué (un seul CTA "Continuer" dans le footer). Conserver « Passer cette étape » comme lien discret au-dessus du footer.
- `src/components/builder/BuilderCompare.tsx` — utiliser `StepFooter` ; le footer affiche un message si aucun modèle n'est encore choisi, sinon « Continuer ». Le clic sur une carte sélectionne sans avancer ; un second clic OU le bouton "Continuer" du footer avance. (Variante simple : garder le click-to-advance actuel et masquer le bouton "Continuer" tant qu'aucune sélection.)
- `src/components/builder/BuilderSections.tsx` — utiliser `StepFooter`. Supprimer le bloc Retour/Continuer en bas du contenu. Le compteur "X/Y sections débloquées" reste dans le bandeau plan.
- `src/routes/builder.tsx` — exposer `completedThrough` (max step atteint) + `goToStep(n)` au stepper. Pour l'étape `edit`, intégrer le même `StepHeader`/`StepFooter` (aujourd'hui elle a son propre topbar custom — on garde le topbar pour les actions globales mais on ajoute le stepper en dessous et le footer en bas). Le bouton "Activer ma carte" devient le CTA droit du footer à l'étape 5.

## Hors scope

- Pas de changement aux écrans, au contenu, au mapping plan/section, ni à la logique de verrouillage.
- Pas de refonte visuelle des cartes de l'étape 2 ni des sections de l'étape 3/4 — uniquement la chrome (stepper + footer) qui les entoure.
- Pas d'animations Motion ajoutées (les transitions existantes suffisent).
