## Idée

Une page `/builder` en deux colonnes (desktop) :
- **Gauche** : un panneau d'édition organisé en sections (briques), chacune avec un **toggle on/off** pour l'activer/désactiver + les champs pour remplir les infos.
- **Droite** : un **mockup de téléphone** qui affiche en temps réel la carte de visite, exactement avec le rendu actuel (même design dark + or).

Sur mobile, l'éditeur s'affiche en premier et un bouton flottant "Aperçu" ouvre le rendu en plein écran.

## Briques activables

Chaque brique = un switch + ses champs. L'utilisateur compose sa carte morceau par morceau.

1. **Identité** (toujours active) — photo (upload), nom, titre, agence, secteur
2. **Actions rapides** — choix des boutons à afficher : Appel, WhatsApp, Mail, Site
3. **Bouton "Enregistrer le contact"** (vCard) — on/off
4. **Statistiques** — 3 chiffres clés éditables (label + valeur)
5. **À propos** — bio + badges (FNAIM, Top 1%, etc.)
6. **Sélection de biens** — liste de cartes (photo, titre, surface, prix), ajout/suppression
7. **Coordonnées détaillées** — téléphone, email, site, secteur
8. **Réseaux sociaux** — LinkedIn, Instagram, WhatsApp (chaque lien on/off)
9. **Thème** (bonus léger) — choix entre 2-3 accents de couleur (or, émeraude, cuivre)

Chaque section a aussi un petit indicateur "✓ Complétée" / "À remplir".

## Aperçu live

- Composant `<BusinessCardPreview data={...} />` réutilisable, extrait du code actuel de `src/routes/index.tsx`.
- À droite : un **cadre iPhone** (encoche, bords arrondis, ombre) qui contient la carte, scrollable à l'intérieur.
- Mise à jour instantanée via un store local (React state ou Zustand léger).

## Persistance et export

- **Sauvegarde automatique** dans `localStorage` (pas de backend nécessaire pour cette V1).
- Bouton **"Réinitialiser"** + bouton **"Exporter en JSON"** (pour réimporter plus tard).
- Bouton **"Voir la carte en plein écran"** → ouvre `/` avec les données du builder.

## Structure technique

```
src/
  routes/
    index.tsx              → carte finale (lit les données du store)
    builder.tsx            → la page éditeur (split layout)
  components/
    card/
      BusinessCard.tsx     → composant carte réutilisable (refacto de l'actuel)
      PhoneFrame.tsx       → cadre iPhone pour l'aperçu
    builder/
      BrickSection.tsx     → wrapper accordéon + toggle on/off
      IdentityBrick.tsx
      ActionsBrick.tsx
      StatsBrick.tsx
      AboutBrick.tsx
      ListingsBrick.tsx
      ContactBrick.tsx
      SocialsBrick.tsx
      ThemeBrick.tsx
  lib/
    card-store.ts          → state + persistance localStorage
    card-types.ts          → types TS partagés
```

## UX du panneau gauche

- Accordéon vertical : une brique ouverte à la fois pour ne pas surcharger.
- Switch à droite du titre de chaque brique pour l'activer/désactiver (la brique apparaît/disparaît dans l'aperçu en live, avec une petite animation).
- Champs avec labels clairs, placeholders d'exemple, validation douce (email, téléphone).
- Upload photo en drag & drop, stockée en base64 dans le state (V1).

## Hors scope V1

- Pas de comptes utilisateurs / sauvegarde cloud (on reste en localStorage).
- Pas de génération de QR code ni d'URL publique partageable (à ajouter en V2 avec Lovable Cloud si besoin).
- Pas de multi-thèmes complets ; juste l'accent de couleur.

## Questions avant de lancer

1. Est-ce que la page actuelle `/` reste telle quelle (avec les données d'exemple) ou doit-elle afficher la carte du builder ?
2. Tu veux uniquement **localStorage** pour V1, ou tu préfères qu'on active **Lovable Cloud** dès maintenant pour pouvoir sauvegarder en base et avoir une URL publique partageable par agent (genre `/c/alexandre`) ?
