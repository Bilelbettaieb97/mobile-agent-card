import { DEFAULT_CARD, type CardData, type Stat, type Service, type Badge, type Listing } from "./card-types";
import { PROFESSIONS, type Profession } from "./card-themes";

export interface Persona {
  name: string;
  title: string;
  agency: string;
  area: string;
  bio: string;
  stats: Stat[];
  services: Service[];
  badges: Badge[];
  pravatarId: number; // 1..70 — deterministic portrait
  withListings?: boolean; // emit 3 picsum images if true
  ctaTitle?: string;
  ctaText?: string;
  email?: string;
  website?: string;
  phoneDisplay?: string;
  phone?: string;
}

function s(label: string, value: string): Stat { return { label, value }; }
function svc(id: string, title: string, description: string): Service { return { id, title, description }; }
function bdg(id: string, label: string): Badge { return { id, label }; }

/* Pravatar offers IDs 1..70. We assign each profession a stable ID
   so portraits never change between renders. */

export const PERSONAS: Record<string, Persona> = {
  /* ---------- Immobilier ---------- */
  "agent-immo-prestige": {
    name: "Alexandre Moreau",
    title: "Conseiller immobilier de prestige",
    agency: "Maison Vendôme",
    area: "Paris & Île-de-France",
    bio: "12 ans d'expertise sur le marché parisien. Spécialiste des biens d'exception, je vous accompagne avec discrétion et exigence à chaque étape.",
    stats: [s("Biens vendus", "240+"), s("Note clients", "4.9"), s("Années", "12")],
    services: [
      svc("s1", "Estimation premium", "Évaluation discrète sous 48 h par expert du secteur."),
      svc("s2", "Off-market", "Réseau privé d'acquéreurs internationaux qualifiés."),
      svc("s3", "Conciergerie", "Visite, négociation, notaire — accompagnement complet."),
    ],
    badges: [bdg("b1", "FNAIM"), bdg("b2", "Top 1% Paris"), bdg("b3", "Prestige")],
    pravatarId: 12, withListings: true,
    ctaTitle: "Vous vendez un bien d'exception ?", ctaText: "Échangeons en confidentialité sur votre projet.",
  },
  "agent-immo": {
    name: "Claire Lefèvre", title: "Agente immobilière", agency: "Agence du Centre", area: "Lyon Métropole",
    bio: "Spécialiste de l'achat et de la vente à Lyon depuis 8 ans. Conseil sincère, négociation efficace, suivi humain.",
    stats: [s("Mandats actifs", "32"), s("Satisfaction", "98%"), s("Délai moyen", "47 j")],
    services: [
      svc("s1", "Vente résidentielle", "Mise en valeur, photos pro, diffusion premium."),
      svc("s2", "Recherche acquéreur", "Sélection ciblée selon vos critères réels."),
      svc("s3", "Estimation gratuite", "Évaluation locale sous 48 h, sans engagement."),
    ],
    badges: [bdg("b1", "FNAIM"), bdg("b2", "Carte T")],
    pravatarId: 1, withListings: true,
    ctaTitle: "Une estimation gratuite ?", ctaText: "Recevez la valeur réelle de votre bien en 48 h.",
  },
  "chasseur-immo": {
    name: "Thomas Dubreuil", title: "Chasseur immobilier", agency: "Chasse & Trouve", area: "Bordeaux & Bassin",
    bio: "Je travaille uniquement pour les acquéreurs. Sourcing off-market, négociation, accompagnement jusqu'au notaire.",
    stats: [s("Biens trouvés", "180+"), s("Délai moyen", "6 sem"), s("Économie", "-7%")],
    services: [
      svc("s1", "Cahier des charges", "Définition fine de votre bien idéal."),
      svc("s2", "Sourcing off-market", "Accès aux biens avant publication."),
      svc("s3", "Négociation experte", "Je défends votre intérêt, pas une commission."),
    ],
    badges: [bdg("b1", "Carte T"), bdg("b2", "Indépendant")],
    pravatarId: 33, withListings: true,
    ctaTitle: "Trouvez le bien parfait", ctaText: "Confiez-moi votre recherche, je m'occupe de tout.",
  },
  "promoteur": {
    name: "Marc Vasseur", title: "Promoteur immobilier", agency: "Vasseur Développement", area: "Nantes & Pays de Loire",
    bio: "Conception et réalisation de programmes résidentiels neufs à taille humaine, dans le respect du patrimoine local.",
    stats: [s("Programmes livrés", "24"), s("Logements", "680"), s("Années", "18")],
    services: [
      svc("s1", "Résidences neuves", "Appartements RT 2020, prestations soignées."),
      svc("s2", "Investissement Pinel", "Programmes éligibles, accompagnement fiscal."),
      svc("s3", "VEFA", "Vente en l'état futur d'achèvement, garanties constructeur."),
    ],
    badges: [bdg("b1", "RGE"), bdg("b2", "NF Habitat"), bdg("b3", "BBC")],
    pravatarId: 51, withListings: true,
  },
  "diagnostiqueur": {
    name: "Sophie Marchal", title: "Diagnostiqueure immobilière certifiée", agency: "Diag'Expert", area: "Toulouse & 31",
    bio: "Tous diagnostics réglementaires pour vente et location. Rapports clairs, intervention sous 72 h.",
    stats: [s("Diagnostics/an", "1 200"), s("Délai", "72h"), s("Note clients", "4.9")],
    services: [
      svc("s1", "DPE", "Diagnostic de performance énergétique conforme 2024."),
      svc("s2", "Pack vente", "Amiante, plomb, électricité, gaz, termites."),
      svc("s3", "Audit énergétique", "Plan de travaux chiffré pour passoires thermiques."),
    ],
    badges: [bdg("b1", "Cofrac"), bdg("b2", "Bureau Veritas")],
    pravatarId: 5,
  },

  /* ---------- Juridique ---------- */
  "avocat": {
    name: "Maître Caroline Bénard", title: "Avocate au Barreau de Paris", agency: "Cabinet Bénard", area: "Paris 8e",
    bio: "Droit de la famille et droit pénal. Une écoute attentive, une stratégie claire, une défense engagée.",
    stats: [s("Affaires/an", "120+"), s("Années", "15"), s("Taux gain", "87%")],
    services: [
      svc("s1", "Droit de la famille", "Divorce, garde, succession, médiation."),
      svc("s2", "Droit pénal", "Défense des victimes et des mis en cause."),
      svc("s3", "Consultation", "Premier rendez-vous d'évaluation à tarif fixe."),
    ],
    badges: [bdg("b1", "Barreau de Paris"), bdg("b2", "Médiation")],
    pravatarId: 9,
  },
  "avocat-affaires": {
    name: "Maître Olivier Renaud", title: "Avocat d'affaires", agency: "Renaud & Associés", area: "Paris La Défense",
    bio: "Conseil aux PME, ETI et fonds d'investissement. M&A, corporate, contentieux commercial.",
    stats: [s("Deals conseillés", "60+"), s("Volume", "1.2 Md€"), s("Années", "20")],
    services: [
      svc("s1", "M&A", "Cessions, acquisitions, levées de fonds."),
      svc("s2", "Corporate", "Pactes, gouvernance, restructurations."),
      svc("s3", "Contentieux", "Litiges commerciaux et arbitrage."),
    ],
    badges: [bdg("b1", "Legal 500"), bdg("b2", "Chambers")],
    pravatarId: 13,
  },
  "notaire": {
    name: "Maître Hélène Faure", title: "Notaire associée", agency: "Étude Faure & Loiseau", area: "Aix-en-Provence",
    bio: "Étude familiale depuis 1982. Immobilier, famille, entreprises — l'accompagnement notarial dans toutes les étapes de la vie.",
    stats: [s("Actes/an", "1 800"), s("Notaires", "4"), s("Années étude", "42")],
    services: [
      svc("s1", "Immobilier", "Achat, vente, donations, succession."),
      svc("s2", "Famille", "Mariage, PACS, adoption, testament."),
      svc("s3", "Entreprise", "Création, cession, transmission."),
    ],
    badges: [bdg("b1", "Chambre des Notaires")],
    pravatarId: 16,
  },
  "huissier": {
    name: "Maître Patrick Géraud", title: "Commissaire de justice", agency: "Office Géraud", area: "Marseille",
    bio: "Constats, recouvrement, exécution. Une étude moderne au service des particuliers et des entreprises.",
    stats: [s("Dossiers/an", "2 400"), s("Recouvrement", "82%"), s("Délai constat", "48h")],
    services: [
      svc("s1", "Constats", "Internet, voisinage, état des lieux."),
      svc("s2", "Recouvrement amiable", "Sans frais d'avocat pour vos impayés."),
      svc("s3", "Exécution forcée", "Signification, saisies, expulsions."),
    ],
    badges: [bdg("b1", "CNCJ"), bdg("b2", "Constatech")],
    pravatarId: 25,
  },
  "expert-comptable": {
    name: "Nathalie Cordier", title: "Experte-comptable", agency: "Cordier & Co", area: "Lille Métropole",
    bio: "Comptabilité, fiscalité, conseil. Un cabinet digital qui parle votre langage, pas du jargon.",
    stats: [s("Clients", "180+"), s("Note", "4.9/5"), s("Économie moy.", "5 800 €")],
    services: [
      svc("s1", "Tenue comptable", "100 % digitale, votre comptable accessible."),
      svc("s2", "Conseil fiscal", "Optimisation et arbitrages personnalisés."),
      svc("s3", "Création", "Statuts, prévisionnel, démarches incluses."),
    ],
    badges: [bdg("b1", "OEC"), bdg("b2", "Pennylane partner")],
    pravatarId: 20,
  },
  "consultant": {
    name: "Julien Castel", title: "Consultant stratégie", agency: "Castel Consulting", area: "Paris & remote",
    bio: "J'aide les dirigeants de PME à clarifier leur stratégie et exécuter des transformations concrètes.",
    stats: [s("Missions", "60+"), s("Secteurs", "12"), s("NPS", "+78")],
    services: [
      svc("s1", "Diagnostic stratégique", "Vision, marché, organisation — en 4 semaines."),
      svc("s2", "Plan de transformation", "Roadmap chiffrée, jalons mensuels."),
      svc("s3", "Sparring CEO", "1h/semaine pour challenger vos décisions."),
    ],
    badges: [bdg("b1", "Ex-McKinsey"), bdg("b2", "HEC")],
    pravatarId: 14,
  },

  /* ---------- Finance ---------- */
  "courtier": {
    name: "Romain Tessier", title: "Courtier en prêts immobiliers", agency: "Crédit Direct", area: "Rennes & Bretagne",
    bio: "Je négocie votre crédit immobilier auprès de 25 banques partenaires. Service gratuit pour vous, sans engagement.",
    stats: [s("Dossiers/an", "320"), s("Taux moyen", "-0.4%"), s("Acceptation", "94%")],
    services: [
      svc("s1", "Prêt achat", "Résidence principale, secondaire, locatif."),
      svc("s2", "Rachat de crédit", "Réduisez vos mensualités sans changer de banque."),
      svc("s3", "Assurance emprunteur", "Délégation jusqu'à -60% sur 25 ans."),
    ],
    badges: [bdg("b1", "ORIAS"), bdg("b2", "IOBSP")],
    pravatarId: 4,
  },
  "conseiller-patrimoine": {
    name: "Isabelle Vidal", title: "Conseillère en gestion de patrimoine", agency: "Vidal Patrimoine", area: "Strasbourg",
    bio: "20 ans d'expertise pour structurer, optimiser et transmettre votre patrimoine en toute sérénité.",
    stats: [s("Encours conseillé", "180 M€"), s("Clients", "240"), s("Années", "20")],
    services: [
      svc("s1", "Bilan patrimonial", "Audit 360° gratuit de votre situation."),
      svc("s2", "Investissement", "Immobilier, financier, défiscalisation."),
      svc("s3", "Transmission", "Donations, démembrement, assurance-vie."),
    ],
    badges: [bdg("b1", "CIF"), bdg("b2", "AMF"), bdg("b3", "ORIAS")],
    pravatarId: 22,
  },
  "assureur": {
    name: "Bertrand Lemoine", title: "Agent général d'assurance", agency: "Allianz Lemoine", area: "Nice & 06",
    bio: "Particuliers et pros. Auto, habitation, santé, prévoyance — un interlocuteur unique, des contrats sur-mesure.",
    stats: [s("Sociétaires", "1 800"), s("Sinistres/72h", "100%"), s("Années", "16")],
    services: [
      svc("s1", "Particuliers", "Auto, MRH, santé, vie."),
      svc("s2", "Pros & TPE", "RC pro, multirisque, prévoyance dirigeant."),
      svc("s3", "Patrimoine", "Assurance-vie, retraite, PER."),
    ],
    badges: [bdg("b1", "Allianz"), bdg("b2", "ORIAS")],
    pravatarId: 11,
  },
  "trader": {
    name: "Antoine Garnier", title: "Analyste marchés actions", agency: "Garnier Capital", area: "Paris & remote",
    bio: "Analyse fondamentale et quantitative. Newsletter hebdo, rapports sectoriels, accompagnement particuliers avertis.",
    stats: [s("Abonnés", "8 400"), s("Perf 2025", "+18%"), s("Années", "9")],
    services: [
      svc("s1", "Newsletter", "1 idée d'investissement par semaine, argumentée."),
      svc("s2", "Rapports", "Études sectorielles approfondies."),
      svc("s3", "Coaching", "Construction de portefeuille personnalisé."),
    ],
    badges: [bdg("b1", "CFA"), bdg("b2", "AMF")],
    pravatarId: 8,
  },

  /* ---------- Tech ---------- */
  "dev": {
    name: "Léa Boucher", title: "Ingénieure logiciel senior", agency: "Indépendante", area: "Paris & remote",
    bio: "Web et mobile. React, TypeScript, Node. J'aide les startups à livrer des produits propres et scalables.",
    stats: [s("Projets", "40+"), s("Stack", "TS/React"), s("NPS", "+82")],
    services: [
      svc("s1", "MVP", "De l'idée à la prod en 6 semaines."),
      svc("s2", "Audit code", "Performance, sécurité, dette technique."),
      svc("s3", "Tech lead à mi-temps", "Accompagnement de votre équipe interne."),
    ],
    badges: [bdg("b1", "AWS Certified"), bdg("b2", "Ex-Doctolib")],
    pravatarId: 32, withListings: true,
  },
  "freelance-tech": {
    name: "Yanis Adda", title: "Freelance fullstack", agency: "Indépendant", area: "Lyon & remote",
    bio: "Je transforme vos specs floues en produits live. Next.js, Supabase, Stripe. Disponible en mission longue.",
    stats: [s("Missions", "28"), s("TJM", "650 €"), s("Dispo", "lun. 7 sept.")],
    services: [
      svc("s1", "Fullstack mission", "Intégration équipe ou mission solo."),
      svc("s2", "POC rapide", "Validation technique en 2 semaines."),
      svc("s3", "Refonte", "Modernisation d'apps legacy."),
    ],
    badges: [bdg("b1", "Next.js"), bdg("b2", "Supabase")],
    pravatarId: 60, withListings: true,
  },
  "saas-founder": {
    name: "Camille Brossard", title: "Fondatrice & CEO", agency: "FlowStack", area: "Paris & remote",
    bio: "Je construis FlowStack, l'outil de gestion de projet pour studios créatifs. Toujours preneuse de discussions produit.",
    stats: [s("Clients SaaS", "1 200"), s("ARR", "1.4 M€"), s("Équipe", "12")],
    services: [
      svc("s1", "Démo produit", "30 min pour découvrir FlowStack."),
      svc("s2", "Conseil founder", "Échange peer-to-peer avec autres founders SaaS."),
      svc("s3", "Partenariats", "Intégrations, co-marketing, revente."),
    ],
    badges: [bdg("b1", "YC alumni"), bdg("b2", "FrenchTech")],
    pravatarId: 19,
  },
  "data": {
    name: "Hugo Tabet", title: "Data scientist senior", agency: "Indépendant", area: "Toulouse & remote",
    bio: "ML appliqué, NLP, vision. J'aide les équipes data à passer du notebook à la production.",
    stats: [s("Modèles en prod", "30+"), s("Stack", "Python"), s("Années", "7")],
    services: [
      svc("s1", "Audit data", "État des lieux pipeline + modèles."),
      svc("s2", "MLOps", "Industrialisation et monitoring."),
      svc("s3", "Formation équipe", "Bonnes pratiques data en interne."),
    ],
    badges: [bdg("b1", "Kaggle Master"), bdg("b2", "PhD")],
    pravatarId: 53,
  },
  "cybersec": {
    name: "Élodie Renan", title: "Experte cybersécurité offensive", agency: "Renan Security", area: "Paris & remote",
    bio: "Pentest, red team, audit RGPD. Je trouve vos failles avant les attaquants.",
    stats: [s("Audits réalisés", "120+"), s("CVE découvertes", "14"), s("Années", "10")],
    services: [
      svc("s1", "Pentest", "Test d'intrusion web, mobile, infra."),
      svc("s2", "Red team", "Simulation d'attaque complète."),
      svc("s3", "Audit RGPD", "Conformité et plan d'action."),
    ],
    badges: [bdg("b1", "OSCP"), bdg("b2", "CISSP"), bdg("b3", "ANSSI")],
    pravatarId: 26,
  },

  /* ---------- Santé ---------- */
  "medecin": {
    name: "Dr. Anne Sorel", title: "Médecin généraliste", agency: "Cabinet du Parc", area: "Bordeaux",
    bio: "Médecine de famille, suivi global, prévention. Sur rendez-vous via Doctolib, urgences au cabinet.",
    stats: [s("Patientèle", "1 400"), s("Note", "4.9"), s("Années", "11")],
    services: [
      svc("s1", "Consultation", "Médecine générale adulte et enfant."),
      svc("s2", "Suivi chronique", "Diabète, HTA, suivi cardio."),
      svc("s3", "Vaccinations", "Calendrier vaccinal et voyages."),
    ],
    badges: [bdg("b1", "Ordre des Médecins"), bdg("b2", "Secteur 1")],
    pravatarId: 23,
  },
  "dentiste": {
    name: "Dr. Pierre Lacombe", title: "Chirurgien-dentiste", agency: "Cabinet Lacombe", area: "Montpellier",
    bio: "Soins, esthétique, implantologie. Un cabinet moderne, équipé, à votre écoute.",
    stats: [s("Patients", "2 200"), s("Note", "4.8"), s("Implants/an", "180")],
    services: [
      svc("s1", "Soins dentaires", "Caries, détartrage, dévitalisation."),
      svc("s2", "Esthétique", "Blanchiment, facettes, alignement Invisalign."),
      svc("s3", "Implantologie", "Pose et restauration implantaire."),
    ],
    badges: [bdg("b1", "ONCD"), bdg("b2", "Invisalign Provider")],
    pravatarId: 6,
  },
  "kine": {
    name: "Mathieu Perrot", title: "Kinésithérapeute D.E.", agency: "Cabinet Kiné Vauban", area: "Lyon 6e",
    bio: "Rééducation orthopédique, sportive et respiratoire. Approche manuelle et active personnalisée.",
    stats: [s("Patients/sem.", "85"), s("Note", "4.9"), s("Années", "9")],
    services: [
      svc("s1", "Rééducation post-op", "Genou, épaule, rachis."),
      svc("s2", "Sportif", "Bilan, prévention et retour au sport."),
      svc("s3", "Thérapie manuelle", "Mobilisations, étirements actifs."),
    ],
    badges: [bdg("b1", "D.E. Kiné"), bdg("b2", "Conventionné")],
    pravatarId: 30,
  },
  "osteo": {
    name: "Sarah Lévêque", title: "Ostéopathe D.O.", agency: "Cabinet Lévêque", area: "Nantes",
    bio: "Ostéopathie pour adultes, sportifs, femmes enceintes et nourrissons. Approche douce et globale.",
    stats: [s("Patients/an", "1 600"), s("Note", "5.0"), s("Années", "8")],
    services: [
      svc("s1", "Consultation adulte", "Douleurs articulaires, stress, sommeil."),
      svc("s2", "Femme enceinte", "Suivi pré et post-natal."),
      svc("s3", "Nourrisson", "Coliques, plagiocéphalie, sommeil."),
    ],
    badges: [bdg("b1", "D.O."), bdg("b2", "ROF")],
    pravatarId: 17,
  },
  "psy": {
    name: "Marie Talbot", title: "Psychologue clinicienne", agency: "Cabinet Talbot", area: "Bordeaux & visio",
    bio: "Accompagnement adultes et adolescents : anxiété, deuil, transitions de vie. TCC et thérapies intégratives.",
    stats: [s("Patients suivis", "180+"), s("Visio", "oui"), s("Années", "10")],
    services: [
      svc("s1", "Thérapie individuelle", "TCC, hypnose ericksonienne."),
      svc("s2", "Couple", "Communication, séparation, projet parental."),
      svc("s3", "Visioconsultation", "Téléconsultation sécurisée."),
    ],
    badges: [bdg("b1", "ADELI"), bdg("b2", "EFPT")],
    pravatarId: 36,
  },
  "naturopathe": {
    name: "Clémence Riboul", title: "Naturopathe certifiée", agency: "Cabinet Riboul", area: "Aix-en-Provence",
    bio: "Bilan de vitalité, alimentation, plantes, gestion du stress. Une approche globale de votre santé.",
    stats: [s("Consultations/an", "600"), s("Note", "4.9"), s("Années", "6")],
    services: [
      svc("s1", "Bilan de vitalité", "Évaluation complète sur 1 h 30."),
      svc("s2", "Suivi nutrition", "Programme personnalisé sur 3 mois."),
      svc("s3", "Gestion du stress", "Cohérence cardiaque, plantes adaptogènes."),
    ],
    badges: [bdg("b1", "FENA"), bdg("b2", "OMNES")],
    pravatarId: 44,
  },
  "sage-femme": {
    name: "Émilie Charrier", title: "Sage-femme libérale", agency: "Maison de naissance", area: "Lyon",
    bio: "Suivi de grossesse, préparation à la naissance, rééducation périnéale. Bienveillance et compétence.",
    stats: [s("Naissances suivies", "240"), s("Note", "5.0"), s("Années", "12")],
    services: [
      svc("s1", "Suivi grossesse", "Consultations prénatales mensuelles."),
      svc("s2", "Préparation naissance", "Cours individuels et en groupe."),
      svc("s3", "Rééducation périnée", "Méthode manuelle et biofeedback."),
    ],
    badges: [bdg("b1", "ONSSF"), bdg("b2", "D.E.")],
    pravatarId: 49,
  },

  /* ---------- Beauté ---------- */
  "coiffeur": {
    name: "Lucas Mendes", title: "Coiffeur-barbier", agency: "Atelier Mendes", area: "Paris 11e",
    bio: "Coupe, couleur, barbier traditionnel. Un salon intime, des produits naturels, un service sur-mesure.",
    stats: [s("Clients fidèles", "600+"), s("Note", "5.0"), s("Années", "10")],
    services: [
      svc("s1", "Coupe homme", "Shampoing, coupe, finition barbier."),
      svc("s2", "Couleur femme", "Balayage, ombré, mèches végétales."),
      svc("s3", "Rasage traditionnel", "Serviette chaude, rasoir, soin barbe."),
    ],
    badges: [bdg("b1", "L'Oréal Pro"), bdg("b2", "Bio")],
    pravatarId: 64, withListings: true,
  },
  "estheticienne": {
    name: "Inès Dautry", title: "Esthéticienne diplômée", agency: "Cocon Beauté", area: "Toulouse",
    bio: "Soins visage, épilations, beauté des mains et des pieds. Une parenthèse douce dans votre quotidien.",
    stats: [s("Clientes", "450"), s("Note", "4.9"), s("Soins/sem.", "55")],
    services: [
      svc("s1", "Soin visage", "Diagnostic personnalisé + protocole."),
      svc("s2", "Épilation", "Cire orientale, peaux sensibles."),
      svc("s3", "Manucure", "Naturelle, semi-permanent, nail art."),
    ],
    badges: [bdg("b1", "CAP Esthétique"), bdg("b2", "Sothys")],
    pravatarId: 47, withListings: true,
  },
  "maquilleuse": {
    name: "Aïcha Benkhelifa", title: "Maquilleuse professionnelle", agency: "Indépendante", area: "Paris & déplacements",
    bio: "Mariées, mode, événements. Un maquillage tenue 12 h qui sublime votre peau, pas qui la masque.",
    stats: [s("Mariées", "180+"), s("Shoots", "120"), s("Années", "9")],
    services: [
      svc("s1", "Mariée", "Essai + jour J + retouches."),
      svc("s2", "Événement", "Soirée, cocktail, gala."),
      svc("s3", "Shooting", "Mode, corporate, podcast vidéo."),
    ],
    badges: [bdg("b1", "MAC Pro"), bdg("b2", "Charlotte Tilbury")],
    pravatarId: 41, withListings: true,
  },
  "ongles": {
    name: "Jenna Costa", title: "Prothésiste ongulaire", agency: "Nail Lab", area: "Marseille",
    bio: "Gel, semi-permanent, nail art créatif. Hygiène irréprochable, produits pro, tenue 4 semaines garantie.",
    stats: [s("Clientes", "320"), s("Note", "5.0"), s("Tenue", "4 sem.")],
    services: [
      svc("s1", "Pose complète gel", "Avec décoration au choix."),
      svc("s2", "Remplissage", "Toutes les 3-4 semaines."),
      svc("s3", "Nail art", "Sur-mesure selon votre style."),
    ],
    badges: [bdg("b1", "Diplômée"), bdg("b2", "OPI Pro")],
    pravatarId: 56, withListings: true,
  },
  "spa": {
    name: "Léna Aubin", title: "Directrice de spa", agency: "Spa Aurore", area: "Annecy",
    bio: "Un cocon de 320 m² entre lac et montagne. Soins signature, hammam, jacuzzi, équipe diplômée.",
    stats: [s("Cabines", "6"), s("Note Tripadvisor", "5.0"), s("Soins/jour", "40")],
    services: [
      svc("s1", "Rituel signature", "2 h de pure détente, gommage + massage + soin visage."),
      svc("s2", "Massages", "Suédois, californien, ayurvédique."),
      svc("s3", "Spa privatif", "2 h en duo avec champagne."),
    ],
    badges: [bdg("b1", "Cinq Mondes"), bdg("b2", "Spa de France")],
    pravatarId: 21, withListings: true,
  },

  /* ---------- Coaching ---------- */
  "coach-vie": {
    name: "Sandrine Roux", title: "Coach de vie certifiée", agency: "Cabinet Roux", area: "Lyon & visio",
    bio: "Transitions de vie, confiance en soi, projet personnel. Une méthode douce et structurée, 8 séances en moyenne.",
    stats: [s("Coachés", "200+"), s("NPS", "+91"), s("Années", "7")],
    services: [
      svc("s1", "Coaching individuel", "Cycle de 8 séances de 1 h."),
      svc("s2", "Reconversion", "Bilan, exploration, plan d'action."),
      svc("s3", "Atelier groupe", "1 samedi/mois, max 8 personnes."),
    ],
    badges: [bdg("b1", "ICF ACC"), bdg("b2", "RNCP")],
    pravatarId: 35,
  },
  "coach-sportif": {
    name: "Kevin Drouhin", title: "Coach sportif diplômé", agency: "Drouhin Performance", area: "Paris & domicile",
    bio: "Préparation physique, perte de poids, prise de masse. Programme sur-mesure, suivi nutritionnel inclus.",
    stats: [s("Clients", "85"), s("Transformations", "120"), s("Années", "8")],
    services: [
      svc("s1", "Coaching individuel", "1h à domicile ou en salle."),
      svc("s2", "Programme + suivi", "Plan 12 semaines avec suivi WhatsApp."),
      svc("s3", "Petit groupe", "Bootcamp 4 personnes max."),
    ],
    badges: [bdg("b1", "BPJEPS AF"), bdg("b2", "Nutrition")],
    pravatarId: 15,
  },
  "coach-pro": {
    name: "Frédéric Ostier", title: "Coach professionnel certifié", agency: "Ostier Leadership", area: "Paris & remote",
    bio: "J'accompagne dirigeants et managers dans leur prise de fonction, leur posture et leurs transitions clés.",
    stats: [s("Dirigeants coachés", "140"), s("Heures", "3 200"), s("ICF", "PCC")],
    services: [
      svc("s1", "Coaching individuel", "10 séances sur 6 mois."),
      svc("s2", "Coaching d'équipe", "Codir, prise de fonction, conflits."),
      svc("s3", "Bilan 360°", "Restitution + plan de progression."),
    ],
    badges: [bdg("b1", "ICF PCC"), bdg("b2", "HEC Coach")],
    pravatarId: 7,
  },
  "nutritionniste": {
    name: "Charlotte Vasseur", title: "Diététicienne-nutritionniste", agency: "Cabinet Vasseur", area: "Lille & visio",
    bio: "Rééquilibrage alimentaire sans interdits ni privation. Pour adultes, sportifs et enfants.",
    stats: [s("Patients/an", "320"), s("Note", "4.9"), s("Années", "8")],
    services: [
      svc("s1", "Bilan nutritionnel", "1 h 15 d'évaluation complète."),
      svc("s2", "Rééquilibrage", "Suivi mensuel pendant 6 mois."),
      svc("s3", "Sportif", "Périodisation nutritionnelle compétition."),
    ],
    badges: [bdg("b1", "ADELI"), bdg("b2", "AFDN")],
    pravatarId: 28,
  },
  "yoga": {
    name: "Anaïs Pellerin", title: "Professeure de yoga & Pilates", agency: "Studio Pellerin", area: "Bordeaux",
    bio: "Yoga vinyasa, yin, Pilates mat. Petits groupes, cours particuliers, retraites en Dordogne.",
    stats: [s("Élèves réguliers", "120"), s("Cours/sem.", "16"), s("Années", "10")],
    services: [
      svc("s1", "Cours collectifs", "10 personnes max, studio lumineux."),
      svc("s2", "Particulier", "À domicile ou au studio."),
      svc("s3", "Retraite", "3 jours en Dordogne, 4×/an."),
    ],
    badges: [bdg("b1", "Yoga Alliance"), bdg("b2", "Pilates Method")],
    pravatarId: 38,
  },

  /* ---------- Sport ---------- */
  "preparateur": {
    name: "Maxime Aubertin", title: "Préparateur physique", agency: "Performance Lab", area: "Lyon",
    bio: "Sportifs amateurs et pros. Force, hypertrophie, prépa compétition. Méthodes validées par la science.",
    stats: [s("Athlètes", "60"), s("Records battus", "28"), s("Années", "11")],
    services: [
      svc("s1", "Bilan force", "Tests + plan 12 semaines."),
      svc("s2", "Suivi athlète", "Programmation hebdomadaire."),
      svc("s3", "Préparation compétition", "Coaching dédié + nutrition."),
    ],
    badges: [bdg("b1", "BPJEPS HM"), bdg("b2", "DEUST")],
    pravatarId: 18,
  },
  "club-sport": {
    name: "David Marin", title: "Gérant — Club Iron Fit", agency: "Iron Fit", area: "Marseille",
    bio: "1 200 m², équipements pro, cours collectifs et coaching. Ouvert 6h-23h, sans engagement.",
    stats: [s("Adhérents", "1 800"), s("Cours/sem.", "60"), s("m²", "1 200")],
    services: [
      svc("s1", "Abonnement", "Sans engagement, à partir de 39 €/mois."),
      svc("s2", "Cross-training", "20 cours/semaine, encadrés."),
      svc("s3", "Coaching", "Personnalisé, dès la 1re séance offerte."),
    ],
    badges: [bdg("b1", "Hammer Strength"), bdg("b2", "24/7")],
    pravatarId: 39, withListings: true,
  },

  /* ---------- Restauration ---------- */
  "restaurateur": {
    name: "Antonella Conti", title: "Restauratrice — Trattoria Conti", agency: "Trattoria Conti", area: "Paris 6e",
    bio: "Cuisine italienne familiale, produits frais, pâtes maison. Une table où l'on se sent comme à Naples.",
    stats: [s("Couverts/jour", "120"), s("Note Google", "4.8"), s("Années", "15")],
    services: [
      svc("s1", "Déjeuner", "Menu du marché à 22 €, 3 plats."),
      svc("s2", "Dîner à la carte", "Antipasti, pâtes maison, secondi."),
      svc("s3", "Privatisation", "Salle privée jusqu'à 30 couverts."),
    ],
    badges: [bdg("b1", "Maître Restaurateur"), bdg("b2", "Gault & Millau")],
    pravatarId: 27, withListings: true,
  },
  "chef": {
    name: "Chef Romain Vidal", title: "Chef cuisinier — étoilé Michelin", agency: "Restaurant Vidal", area: "Lyon",
    bio: "Cuisine de terroir contemporaine. 1 étoile depuis 2019. Cours de cuisine et privatisations sur demande.",
    stats: [s("Étoile Michelin", "1*"), s("Gault & Millau", "16/20"), s("Années", "20")],
    services: [
      svc("s1", "Menu dégustation", "7 services + accord mets-vins."),
      svc("s2", "Cours de cuisine", "Demi-journée en cuisine pro."),
      svc("s3", "Chef à domicile", "Pour vos événements privés."),
    ],
    badges: [bdg("b1", "Michelin"), bdg("b2", "MOF candidat")],
    pravatarId: 54, withListings: true,
  },
  "patissier": {
    name: "Camille Lapointe", title: "Pâtissière — créatrice", agency: "Atelier Lapointe", area: "Bordeaux",
    bio: "Pâtisseries fines, wedding cakes, ateliers. Une signature visuelle reconnaissable, des goûts précis.",
    stats: [s("Wedding cakes", "60/an"), s("Note Instagram", "4.9"), s("Ateliers", "200+")],
    services: [
      svc("s1", "Wedding cake", "Création sur-mesure, jusqu'à 200 parts."),
      svc("s2", "Pâtisseries", "Sur commande, 48 h à l'avance."),
      svc("s3", "Atelier", "Adulte ou enfant, 3 h, max 8 personnes."),
    ],
    badges: [bdg("b1", "CAP Pâtissier"), bdg("b2", "Ferrandi")],
    pravatarId: 45, withListings: true,
  },
  "sommelier": {
    name: "Étienne Barrère", title: "Sommelier-caviste", agency: "Cave Barrère", area: "Bordeaux",
    bio: "300 références, conseil sans condescendance. Dégustations chaque samedi, livraison en 24 h.",
    stats: [s("Références", "300+"), s("Dégustations/an", "50"), s("Années", "12")],
    services: [
      svc("s1", "Conseil caviste", "Au choix de votre budget et plat."),
      svc("s2", "Cave personnelle", "Constitution et gestion sur 10 ans."),
      svc("s3", "Atelier dégustation", "Samedi 17 h, 6 vins, 8 personnes max."),
    ],
    badges: [bdg("b1", "WSET 3"), bdg("b2", "UDSF")],
    pravatarId: 31, withListings: true,
  },
  "barista": {
    name: "Sami Brahim", title: "Barista — torréfacteur", agency: "Brûlerie Sami", area: "Marseille",
    bio: "Spécialité, micro-lots, torréfaction maison. Brunch le week-end, formations baristas pour pros.",
    stats: [s("Tasses/jour", "320"), s("Origines", "14"), s("Cuppings", "12/an")],
    services: [
      svc("s1", "Café à emporter", "Espresso, filtre, latte art."),
      svc("s2", "Vente grain", "Sachets 250 g, torréfaction de la semaine."),
      svc("s3", "Formation pro", "1 journée latte art + machine."),
    ],
    badges: [bdg("b1", "SCA Barista"), bdg("b2", "Q-Grader")],
    pravatarId: 58, withListings: true,
  },
  "traiteur": {
    name: "Hélène Saint-Marc", title: "Traiteure événementielle", agency: "Saint-Marc Traiteur", area: "Paris & IDF",
    bio: "Cocktails dînatoires, mariages, séminaires. Produits locaux, service soigné, jusqu'à 400 convives.",
    stats: [s("Événements/an", "180"), s("Convives max", "400"), s("Années", "14")],
    services: [
      svc("s1", "Cocktail dînatoire", "Pièces froides + chaudes, service inclus."),
      svc("s2", "Mariage", "Menu sur-mesure, du vin d'honneur au brunch."),
      svc("s3", "Entreprise", "Plateaux repas, séminaires, soirées."),
    ],
    badges: [bdg("b1", "Maître Restaurateur"), bdg("b2", "Bio partner")],
    pravatarId: 48, withListings: true,
  },

  /* ---------- Artisanat ---------- */
  "menuisier": {
    name: "Pierre Aubry", title: "Menuisier-ébéniste", agency: "Atelier Aubry", area: "Saint-Étienne",
    bio: "Sur-mesure, meubles, agencement, restauration. Bois massif français, finitions à l'huile.",
    stats: [s("Réalisations", "200+"), s("Années", "22"), s("Délai moyen", "6 sem.")],
    services: [
      svc("s1", "Meuble sur-mesure", "Conception 3D, devis offert."),
      svc("s2", "Agencement", "Cuisine, dressing, bibliothèque."),
      svc("s3", "Restauration", "Mobilier ancien, parquet, escaliers."),
    ],
    badges: [bdg("b1", "Compagnons du devoir"), bdg("b2", "PEFC")],
    pravatarId: 24, withListings: true,
  },
  "plombier": {
    name: "Karim Saidi", title: "Plombier-chauffagiste", agency: "Saidi Plomberie", area: "Lyon Métropole",
    bio: "Dépannage 24/7, rénovation salle de bain, chauffage. Devis gratuit, garantie décennale.",
    stats: [s("Interventions/an", "1 200"), s("Note", "4.9"), s("Délai urgence", "1 h")],
    services: [
      svc("s1", "Dépannage 24/7", "Fuite, débouchage, chauffe-eau."),
      svc("s2", "Rénovation SDB", "Conception et travaux clé en main."),
      svc("s3", "Chauffage", "Pompe à chaleur, chaudière, entretien."),
    ],
    badges: [bdg("b1", "RGE QualiPAC"), bdg("b2", "Décennale")],
    pravatarId: 42,
  },
  "electricien": {
    name: "Julien Marchand", title: "Électricien IRVE", agency: "Marchand Élec", area: "Nantes",
    bio: "Installation, mise aux normes, bornes de recharge, domotique. Travail propre, certifié RGE.",
    stats: [s("Chantiers/an", "180"), s("Note", "4.9"), s("Années", "14")],
    services: [
      svc("s1", "Mise aux normes", "Tableau, terre, prises NF C 15-100."),
      svc("s2", "Borne de recharge", "Installation IRVE, éligible aides."),
      svc("s3", "Domotique", "Volets, éclairage, Wiser, Tuya."),
    ],
    badges: [bdg("b1", "Qualifelec"), bdg("b2", "IRVE")],
    pravatarId: 52,
  },
  "macon": {
    name: "Antoine Garcia", title: "Maçon — gérant BTP", agency: "Garcia Bâtiment", area: "Toulouse",
    bio: "Gros œuvre, extension, rénovation. 18 ans d'expérience, équipe stable, chantiers propres et respectés.",
    stats: [s("Chantiers livrés", "320"), s("Équipe", "8"), s("Années", "18")],
    services: [
      svc("s1", "Extension maison", "Ossature béton ou bois, clé en main."),
      svc("s2", "Rénovation", "Murs, dalles, ouvertures, cloisons."),
      svc("s3", "Gros œuvre", "Fondations, élévations, toitures."),
    ],
    badges: [bdg("b1", "Qualibat"), bdg("b2", "Décennale")],
    pravatarId: 50, withListings: true,
  },
  "bijoutier": {
    name: "Léonie Tessier", title: "Bijoutière-joaillière", agency: "Atelier Tessier", area: "Paris 1er",
    bio: "Création, transformation, sertissage. Or 18 ct, diamants éthiques. Sur rendez-vous uniquement.",
    stats: [s("Pièces créées", "400+"), s("Années", "16"), s("Note", "5.0")],
    services: [
      svc("s1", "Bague sur-mesure", "Du dessin à la pièce finie."),
      svc("s2", "Transformation", "Bijoux de famille remis au goût du jour."),
      svc("s3", "Sertissage", "Sertis griffes, clos, pavé."),
    ],
    badges: [bdg("b1", "DMA Joaillerie"), bdg("b2", "Diamant RJC")],
    pravatarId: 46, withListings: true,
  },
  "tatoueur": {
    name: "Maël Rivière", title: "Tatoueur — Black & Grey", agency: "Studio Rivière", area: "Marseille",
    bio: "Réalisme, ornemental, fine line. Sur rendez-vous, projets longs acceptés. Hygiène ANSM.",
    stats: [s("Tattoos/an", "240"), s("Note Insta", "5.0"), s("Années", "11")],
    services: [
      svc("s1", "Pièce flash", "Sélection prête à tatouer."),
      svc("s2", "Sur-mesure", "Projet dessiné spécialement pour vous."),
      svc("s3", "Cover-up", "Recouvrement d'anciens tatouages."),
    ],
    badges: [bdg("b1", "Hygiène ANSM"), bdg("b2", "SNAT")],
    pravatarId: 57, withListings: true,
  },
  "fleuriste": {
    name: "Margaux Périer", title: "Fleuriste créatrice", agency: "Maison Périer", area: "Lyon",
    bio: "Bouquets contemporains, mariages, événements, abonnements. Fleurs françaises de saison.",
    stats: [s("Bouquets/sem.", "120"), s("Mariages/an", "40"), s("Note", "5.0")],
    services: [
      svc("s1", "Bouquet du jour", "Composé chaque matin selon le marché."),
      svc("s2", "Mariage", "Bouquet, boutonnières, décor de salle."),
      svc("s3", "Abonnement", "Hebdomadaire ou mensuel."),
    ],
    badges: [bdg("b1", "Fleurs de France"), bdg("b2", "Slow Flowers")],
    pravatarId: 43, withListings: true,
  },
  "paysagiste": {
    name: "Gaspard Lhermitte", title: "Paysagiste concepteur", agency: "Lhermitte Paysages", area: "Bordeaux",
    bio: "Création et entretien de jardins, terrasses végétalisées, piscines paysagées. Approche écologique.",
    stats: [s("Jardins créés", "85"), s("Équipe", "5"), s("Années", "12")],
    services: [
      svc("s1", "Conception", "Plans, planches végétales, devis."),
      svc("s2", "Création", "Plantation, terrasse, éclairage, arrosage."),
      svc("s3", "Entretien", "Contrat annuel, équipe dédiée."),
    ],
    badges: [bdg("b1", "UNEP"), bdg("b2", "Éco-jardin")],
    pravatarId: 55, withListings: true,
  },

  /* ---------- Mode ---------- */
  "styliste": {
    name: "Inès Dorval", title: "Créatrice de mode", agency: "Maison Dorval", area: "Paris 3e",
    bio: "Collections capsule en série limitée. Coupes nettes, tissus européens, atelier parisien.",
    stats: [s("Collections", "12"), s("Pièces/an", "1 200"), s("Années", "8")],
    services: [
      svc("s1", "Collection capsule", "Drop saisonnier, série limitée."),
      svc("s2", "Sur-mesure", "Pièces uniques sur 3 essayages."),
      svc("s3", "Direction artistique", "Pour marques émergentes."),
    ],
    badges: [bdg("b1", "ANDAM finaliste"), bdg("b2", "DEFI")],
    pravatarId: 40, withListings: true,
  },
  "mannequin": {
    name: "Tess Olivier", title: "Mannequin & comédienne", agency: "Indépendante", area: "Paris & international",
    bio: "Mode, beauté, fiction. Représentée par Elite Paris. Disponible pour campagnes, défilés et tournages.",
    stats: [s("Campagnes", "60+"), s("Couvertures", "8"), s("Années", "7")],
    services: [
      svc("s1", "Campagne", "Photo et vidéo, mode et beauté."),
      svc("s2", "Défilé", "Couture, prêt-à-porter, fashion week."),
      svc("s3", "Fiction", "Court-métrage, série, publicité."),
    ],
    badges: [bdg("b1", "Elite Paris"), bdg("b2", "ENSATT")],
    pravatarId: 29, withListings: true,
  },
  "boutique-mode": {
    name: "Léa Renard", title: "Fondatrice — Concept store", agency: "Sœurs & Frères", area: "Lille",
    bio: "Concept store dédié aux marques européennes responsables. Sélection pointue, accueil chaleureux.",
    stats: [s("Marques", "45"), s("Note Google", "4.9"), s("m²", "180")],
    services: [
      svc("s1", "Personal shopping", "1 h avec une de nos stylistes."),
      svc("s2", "Click & collect", "Réservation en ligne, essayage en boutique."),
      svc("s3", "Événements", "Vernissages et présentations de marques."),
    ],
    badges: [bdg("b1", "Éco-responsable"), bdg("b2", "Made in EU")],
    pravatarId: 37, withListings: true,
  },

  /* ---------- Créatif ---------- */
  "photographe": {
    name: "Mathilde Vasseur", title: "Photographe portraits & mariages", agency: "Studio Vasseur", area: "Lyon & déplacements",
    bio: "Lumière naturelle, direction discrète, livraison sous 3 semaines. Couples, familles, marques.",
    stats: [s("Mariages/an", "30"), s("Note Google", "5.0"), s("Années", "9")],
    services: [
      svc("s1", "Mariage", "Reportage 8 h + livraison galerie."),
      svc("s2", "Portraits", "Famille, lifestyle, professionnel."),
      svc("s3", "Marques", "Lifestyle product, packshots, contenu social."),
    ],
    badges: [bdg("b1", "Sony Alpha"), bdg("b2", "WPJA")],
    pravatarId: 59, withListings: true,
  },
  "videaste": {
    name: "Théo Marchand", title: "Vidéaste & réalisateur", agency: "Marchand Films", area: "Paris & remote",
    bio: "Films de marque, clips, documentaires courts. Cinéma narratif au service de vos histoires.",
    stats: [s("Films/an", "40"), s("Clients", "Hermès, Renault…"), s("Années", "10")],
    services: [
      svc("s1", "Film de marque", "Du brief à la livraison master."),
      svc("s2", "Clip musical", "Réalisation et post-production."),
      svc("s3", "Documentaire court", "Format 5-15 min, brand storytelling."),
    ],
    badges: [bdg("b1", "Cannes Lions"), bdg("b2", "DGA membre")],
    pravatarId: 62, withListings: true,
  },
  "graphiste": {
    name: "Solène Berthault", title: "Designer graphique", agency: "Berthault Studio", area: "Nantes & remote",
    bio: "Identités, éditorial, packaging. Une approche typographique forte, des systèmes durables.",
    stats: [s("Identités créées", "60+"), s("Pixels", "Awwwards"), s("Années", "11")],
    services: [
      svc("s1", "Identité visuelle", "Logo, charte, déclinaisons."),
      svc("s2", "Éditorial", "Magazines, rapports annuels, livres."),
      svc("s3", "Packaging", "Conception et fabrication suivie."),
    ],
    badges: [bdg("b1", "Awwwards"), bdg("b2", "Brand New")],
    pravatarId: 61, withListings: true,
  },
  "illustrateur": {
    name: "Adrien Pasquier", title: "Illustrateur & auteur BD", agency: "Indépendant", area: "Bordeaux & remote",
    bio: "Édition, presse, packaging. Style hybride entre dessin traditionnel et numérique.",
    stats: [s("Albums BD", "4"), s("Clients", "Le Monde, Bayard"), s("Années", "12")],
    services: [
      svc("s1", "Illustration commande", "Édition, presse, packaging."),
      svc("s2", "Storyboard", "Pub, animation, BD."),
      svc("s3", "Atelier", "Initiation en école et entreprise."),
    ],
    badges: [bdg("b1", "Angoulême sélection"), bdg("b2", "Ateliers Paris")],
    pravatarId: 63, withListings: true,
  },
  "musicien": {
    name: "Noah Cassan", title: "DJ & producteur", agency: "Cassan Music", area: "Paris & international",
    bio: "House mélodique, techno organique. Résidence parisienne, sets à Berlin, Ibiza, Tulum.",
    stats: [s("Sets/an", "85"), s("Tracks", "24"), s("Plays Spotify", "3.4 M")],
    services: [
      svc("s1", "Booking club", "Set 2-3 h, set list sur mesure."),
      svc("s2", "Événement privé", "Mariage, séminaire, festival."),
      svc("s3", "Production", "Edits, remixes, mastering."),
    ],
    badges: [bdg("b1", "Spotify Editorial"), bdg("b2", "Pioneer DJ")],
    pravatarId: 65, withListings: true,
  },
  "architecte": {
    name: "Camille Aubrac", title: "Architecte DPLG", agency: "Atelier Aubrac", area: "Lyon",
    bio: "Maisons individuelles contemporaines et rénovation patrimoniale. Approche bioclimatique.",
    stats: [s("Projets livrés", "55"), s("Surface", "18 000 m²"), s("Années", "14")],
    services: [
      svc("s1", "Maison neuve", "Étude, conception, suivi chantier."),
      svc("s2", "Rénovation", "Restructuration et extension."),
      svc("s3", "Étude de faisabilité", "Avant achat de bien à rénover."),
    ],
    badges: [bdg("b1", "Ordre des architectes"), bdg("b2", "HQE")],
    pravatarId: 66, withListings: true,
  },
  "decorateur": {
    name: "Camille Vermeer", title: "Architecte d'intérieur", agency: "Studio Vermeer", area: "Paris & déplacements",
    bio: "Appartements de caractère, hôtels boutique, restaurants. Approche matiériste, mobilier sur-mesure.",
    stats: [s("Projets/an", "18"), s("Surface moy.", "120 m²"), s("Années", "9")],
    services: [
      svc("s1", "Conseil déco", "Demi-journée chez vous, plan d'action."),
      svc("s2", "Aménagement complet", "De l'esquisse à la livraison."),
      svc("s3", "Décoration retail", "Restaurants, boutiques, hôtels."),
    ],
    badges: [bdg("b1", "CFAI"), bdg("b2", "Boutique Hôtel"),],
    pravatarId: 67, withListings: true,
  },

  /* ---------- Éducation ---------- */
  "prof": {
    name: "Hugo Lefevre", title: "Professeur particulier — Maths & Physique", agency: "Indépendant", area: "Toulouse & visio",
    bio: "Lycée et prépa scientifique. Méthodologie, exercices, préparation aux concours. Résultats prouvés.",
    stats: [s("Élèves suivis", "180+"), s("Mention TB", "65%"), s("Années", "8")],
    services: [
      svc("s1", "Cours hebdo", "1 h 30 par semaine, lycée."),
      svc("s2", "Stage intensif", "Vacances scolaires, 5 jours."),
      svc("s3", "Préparation concours", "MP, PC, PSI."),
    ],
    badges: [bdg("b1", "Centrale-Supélec"), bdg("b2", "CAPES")],
    pravatarId: 10,
  },
  "formateur": {
    name: "Sophie Le Gall", title: "Formatrice professionnelle", agency: "Le Gall Formation", area: "Rennes & visio",
    bio: "Soft skills, communication, management. Formations courtes, ateliers, accompagnement individuel.",
    stats: [s("Stagiaires/an", "320"), s("Note Qualiopi", "9.4/10"), s("Années", "11")],
    services: [
      svc("s1", "Inter-entreprises", "Sessions thématiques mensuelles."),
      svc("s2", "Intra-entreprise", "Sur-mesure dans vos locaux."),
      svc("s3", "Coaching", "Suivi individuel post-formation."),
    ],
    badges: [bdg("b1", "Qualiopi"), bdg("b2", "DataDock")],
    pravatarId: 34,
  },
  "nounou": {
    name: "Aïssata Diop", title: "Garde d'enfants à domicile", agency: "Indépendante", area: "Paris 12e & 20e",
    bio: "12 ans d'expérience, agréée, anglophone. Sortie d'école, devoirs, repas, activités créatives.",
    stats: [s("Familles", "8"), s("Années", "12"), s("Langues", "FR/EN")],
    services: [
      svc("s1", "Sortie d'école", "16h-19h, devoirs et goûter."),
      svc("s2", "Mercredi", "Activités, sorties, repas équilibré."),
      svc("s3", "Garde ponctuelle", "Soirées, week-ends, urgences."),
    ],
    badges: [bdg("b1", "PSC1"), bdg("b2", "CAP AEPE")],
    pravatarId: 2,
  },

  /* ---------- Voyage ---------- */
  "agent-voyage": {
    name: "Pauline Verdier", title: "Agente de voyage sur-mesure", agency: "Verdier Travel", area: "Paris & remote",
    bio: "Voyages d'exception au Japon, en Afrique de l'Est, en Patagonie. Conception et conciergerie 24/7.",
    stats: [s("Voyages/an", "120"), s("Destinations", "40"), s("Note", "5.0")],
    services: [
      svc("s1", "Voyage sur-mesure", "Conception détaillée, 2 semaines de travail."),
      svc("s2", "Voyage de noces", "Roadbook unique, surprises incluses."),
      svc("s3", "Conciergerie", "Assistance 24/7 pendant le voyage."),
    ],
    badges: [bdg("b1", "Atout France"), bdg("b2", "Virtuoso")],
    pravatarId: 68, withListings: true,
  },
  "hotelier": {
    name: "Bertrand Lassagne", title: "Hôtelier — Maison Lassagne", agency: "Maison Lassagne", area: "Avignon",
    bio: "Maison d'hôtes de charme en plein cœur de la Provence. 6 chambres, table d'hôtes, piscine.",
    stats: [s("Chambres", "6"), s("Tripadvisor", "5.0"), s("Années", "8")],
    services: [
      svc("s1", "Chambre + petit-déj", "À partir de 180 € la nuit."),
      svc("s2", "Table d'hôtes", "Menu marché, jeudi et samedi soir."),
      svc("s3", "Privatisation", "Mariages, séminaires intimistes."),
    ],
    badges: [bdg("b1", "Châteaux & Hôtels"), bdg("b2", "Logis 4 cheminées")],
    pravatarId: 69, withListings: true,
  },
  "guide": {
    name: "Caroline Vergé", title: "Guide-conférencière", agency: "Indépendante", area: "Paris & Île-de-France",
    bio: "Visites privées Paris, Versailles, Giverny. Histoire de l'art, anecdotes, hors des sentiers battus.",
    stats: [s("Visiteurs/an", "1 500"), s("Note", "5.0"), s("Langues", "FR/EN/ES")],
    services: [
      svc("s1", "Visite privée", "Demi-journée, groupe jusqu'à 8."),
      svc("s2", "Versailles complet", "Château + jardins + Trianon."),
      svc("s3", "Sortie Giverny", "Journée Monet, transport inclus."),
    ],
    badges: [bdg("b1", "Carte pro guide"), bdg("b2", "Master histoire art")],
    pravatarId: 70,
  },

  /* ---------- Événementiel ---------- */
  "wedding": {
    name: "Léa Couture", title: "Wedding planner & designer", agency: "Couture Weddings", area: "France & destination",
    bio: "Mariages haut de gamme en France et à l'étranger. Conception, prestataires, coordination jour J.",
    stats: [s("Mariages/an", "35"), s("Note Google", "5.0"), s("Années", "10")],
    services: [
      svc("s1", "Coordination jour J", "Pour mariées organisées."),
      svc("s2", "Organisation complète", "De la recherche du lieu à l'after."),
      svc("s3", "Destination wedding", "Italie, Maroc, Grèce, France."),
    ],
    badges: [bdg("b1", "UWP"), bdg("b2", "Vogue Weddings")],
    pravatarId: 3, withListings: true,
  },
  "event": {
    name: "Maxime Auber", title: "Organisateur d'événements", agency: "Auber Events", area: "Paris & national",
    bio: "Séminaires, soirées de lancement, conventions. Logistique millimétrée, créativité débridée.",
    stats: [s("Événements/an", "60"), s("Convives max", "1 200"), s("Années", "12")],
    services: [
      svc("s1", "Séminaire", "Lieu, restauration, animation."),
      svc("s2", "Soirée de marque", "Lancement produit, célébration."),
      svc("s3", "Convention", "Plénière, ateliers, soirée gala."),
    ],
    badges: [bdg("b1", "Lévénement"), bdg("b2", "Bedouk")],
    pravatarId: 62, withListings: true,
  },
  "marketing": {
    name: "Élise Boyer", title: "Consultante marketing & growth", agency: "Boyer & Co", area: "Paris & remote",
    bio: "J'aide les startups B2B à structurer leur acquisition. SEO, paid, lifecycle, branding.",
    stats: [s("Clients", "40+"), s("ARR généré", "12 M€"), s("Années", "9")],
    services: [
      svc("s1", "Audit marketing", "Diagnostic complet en 3 semaines."),
      svc("s2", "Mission growth", "3-6 mois, équipe ou solo."),
      svc("s3", "Sparring CMO", "1 h/sem pour challenger votre équipe."),
    ],
    badges: [bdg("b1", "HubSpot Partner"), bdg("b2", "Ex-Aircall")],
    pravatarId: 35,
  },
  "community": {
    name: "Maya Tessier", title: "Community manager senior", agency: "Indépendante", area: "Paris & remote",
    bio: "Stratégie social media, création de contenu, ads. Réseaux qui engagent, pas qui font joli.",
    stats: [s("Comptes gérés", "18"), s("Engagement moy.", "+38%"), s("Années", "6")],
    services: [
      svc("s1", "Stratégie social", "Audit + plan éditorial 6 mois."),
      svc("s2", "Création contenu", "Reels, carrousels, vidéos UGC."),
      svc("s3", "Paid social", "Meta, TikTok, LinkedIn ads."),
    ],
    badges: [bdg("b1", "Meta Blueprint"), bdg("b2", "TikTok Pro")],
    pravatarId: 40,
  },

  /* ---------- Médias ---------- */
  "journaliste": {
    name: "Vincent Mercier", title: "Journaliste indépendant", agency: "Indépendant", area: "Paris & terrain",
    bio: "Reportages longue forme, économie et social. Publié dans Le Monde, M, Society, XXI.",
    stats: [s("Reportages/an", "18"), s("Magazines", "12"), s("Années", "14")],
    services: [
      svc("s1", "Reportage", "Enquête longue forme, 6-12 pages."),
      svc("s2", "Interview", "Long format, retranscrit et édité."),
      svc("s3", "Conférence", "Restitution publique d'enquête."),
    ],
    badges: [bdg("b1", "Carte de presse"), bdg("b2", "Albert-Londres finaliste")],
    pravatarId: 14,
  },
  "ecrivain": {
    name: "Anouk Verhoest", title: "Écrivaine — autrice", agency: "Indépendante", area: "Bruxelles & Paris",
    bio: "Romans contemporains. 4 publications chez Actes Sud. Ateliers d'écriture en bibliothèque et école.",
    stats: [s("Romans", "4"), s("Exemplaires", "60 000"), s("Prix", "3")],
    services: [
      svc("s1", "Rencontre publique", "Bibliothèque, salon, librairie."),
      svc("s2", "Atelier d'écriture", "Adulte ou scolaire, 2-10 séances."),
      svc("s3", "Résidence", "Création en milieu scolaire ou culturel."),
    ],
    badges: [bdg("b1", "Actes Sud"), bdg("b2", "Prix Médicis sélection")],
    pravatarId: 36,
  },
  "podcasteur": {
    name: "Romain Falco", title: "Podcasteur & host", agency: "Falco Studio", area: "Paris & remote",
    bio: "Producteur du podcast 'Long format', interviews fond. Studio à Paris, location pour producteurs.",
    stats: [s("Épisodes", "180"), s("Écoutes/mois", "120K"), s("Années", "5")],
    services: [
      svc("s1", "Interview podcast", "Pour personnalités, marques."),
      svc("s2", "Production déléguée", "Concept, captation, montage."),
      svc("s3", "Location studio", "Studio podcast Paris 11e."),
    ],
    badges: [bdg("b1", "Spotify Top 50"), bdg("b2", "Paris Podcast Fest")],
    pravatarId: 8,
  },
};

/* ============================================================
   SECTION PROFILES — chaque catégorie métier a une composition
   visuelle distincte pour inspirer le visiteur (pas les mêmes
   briques pour tout le monde).
   ============================================================ */

type SectionFlags = Partial<Pick<CardData,
  | "vcardEnabled" | "statsEnabled" | "aboutEnabled" | "videoEnabled"
  | "servicesEnabled" | "listingsEnabled" | "testimonialsEnabled"
  | "calendarEnabled" | "languagesEnabled" | "ctaEnabled"
  | "contactEnabled" | "socialsEnabled"
>>;

const ALL_OFF: Required<SectionFlags> = {
  vcardEnabled: false, statsEnabled: false, aboutEnabled: false, videoEnabled: false,
  servicesEnabled: false, listingsEnabled: false, testimonialsEnabled: false,
  calendarEnabled: false, languagesEnabled: false, ctaEnabled: false,
  contactEnabled: false, socialsEnabled: false,
};

/** Active uniquement les sections listées + contact/vcard par défaut. */
function profile(...keys: (keyof SectionFlags)[]): Required<SectionFlags> {
  const f = { ...ALL_OFF, contactEnabled: true, vcardEnabled: true };
  for (const k of keys) f[k] = true;
  return f;
}

const SECTION_PROFILES: Record<string, Required<SectionFlags>> = {
  // Immobilier : vitrine de biens, chiffres, appel à l'action
  Immobilier: profile("aboutEnabled", "statsEnabled", "listingsEnabled", "ctaEnabled"),
  // Juridique : légitimité, expertise, langues parlées, témoignages
  Juridique: profile("aboutEnabled", "servicesEnabled", "languagesEnabled", "testimonialsEnabled"),
  // Finance : chiffres clés, services, rendez-vous, langues
  Finance: profile("aboutEnabled", "statsEnabled", "servicesEnabled", "calendarEnabled"),
  // Tech : portfolio de projets, stack, socials, dispo
  Tech: profile("statsEnabled", "servicesEnabled", "listingsEnabled", "socialsEnabled", "calendarEnabled"),
  // Santé : prise de RDV, services médicaux, langues
  Santé: profile("aboutEnabled", "servicesEnabled", "calendarEnabled", "languagesEnabled"),
  // Beauté : galerie réalisations, RDV, socials, services
  Beauté: profile("listingsEnabled", "servicesEnabled", "calendarEnabled", "socialsEnabled"),
  // Coaching : vidéo, témoignages, CTA fort, RDV
  Coaching: profile("aboutEnabled", "videoEnabled", "testimonialsEnabled", "ctaEnabled", "calendarEnabled"),
  // Sport : stats perf, vidéo démo, CTA, témoignages
  Sport: profile("statsEnabled", "videoEnabled", "servicesEnabled", "testimonialsEnabled", "ctaEnabled"),
  // Restauration : photos de plats, socials, contact direct
  Restauration: profile("listingsEnabled", "videoEnabled", "socialsEnabled", "aboutEnabled"),
  // Artisanat : réalisations, services, témoignages
  Artisanat: profile("listingsEnabled", "servicesEnabled", "testimonialsEnabled", "aboutEnabled"),
  // Mode : lookbook visuel, socials, vidéo
  Mode: profile("listingsEnabled", "videoEnabled", "socialsEnabled"),
  // Créatif / Photo / Vidéo : portfolio massif, vidéo, socials
  Créatif: profile("listingsEnabled", "videoEnabled", "socialsEnabled", "testimonialsEnabled"),
  // Éducation : services, RDV, témoignages parents
  Éducation: profile("aboutEnabled", "servicesEnabled", "calendarEnabled", "testimonialsEnabled"),
  // Voyage / Hôtellerie : visuel, vidéo, langues, socials
  Voyage: profile("listingsEnabled", "videoEnabled", "languagesEnabled", "socialsEnabled"),
  // Événementiel : portfolio, vidéo, témoignages
  Événementiel: profile("listingsEnabled", "videoEnabled", "testimonialsEnabled", "socialsEnabled"),
  // Média / Podcast : vidéo, socials, stats audience
  Média: profile("statsEnabled", "videoEnabled", "socialsEnabled", "aboutEnabled"),
};

const DEFAULT_PROFILE: Required<SectionFlags> = profile(
  "aboutEnabled", "servicesEnabled", "statsEnabled",
);

/** Build a complete CardData for preview using DEFAULT_CARD as the base
 *  and overlaying the profession's persona + sa composition de sections. */
export function buildPreviewCard(profession: Profession): CardData {
  const persona = PERSONAS[profession.id];
  if (!persona) {
    return { ...DEFAULT_CARD, accent: profession.themeId as CardData["accent"], profession: profession.id };
  }

  const photo = `https://i.pravatar.cc/400?img=${persona.pravatarId}`;
  const sections = SECTION_PROFILES[profession.category] ?? DEFAULT_PROFILE;

  // Listings : on n'affiche que si le profil métier active la brique ET que la persona a un visuel pertinent
  const listingsActive = !!(sections.listingsEnabled && persona.withListings);
  const listings: Listing[] = listingsActive
    ? [
        { id: "l1", img: `https://picsum.photos/seed/${profession.id}-1/800/600`, title: "Réalisation 1", meta: "Aperçu", price: "" },
        { id: "l2", img: `https://picsum.photos/seed/${profession.id}-2/800/600`, title: "Réalisation 2", meta: "Aperçu", price: "" },
        { id: "l3", img: `https://picsum.photos/seed/${profession.id}-3/800/600`, title: "Réalisation 3", meta: "Aperçu", price: "" },
      ]
    : [];

  const ctaEnabled = sections.ctaEnabled && !!(persona.ctaTitle && persona.ctaText);

  return {
    ...DEFAULT_CARD,
    ...sections,
    listingsEnabled: listingsActive,
    ctaEnabled,
    accent: profession.themeId as CardData["accent"],
    profession: profession.id,
    name: persona.name,
    title: persona.title,
    agency: persona.agency,
    area: persona.area,
    bio: persona.bio,
    stats: persona.stats,
    services: persona.services,
    badges: persona.badges,
    photo,
    listings,
    ctaTitle: persona.ctaTitle ?? DEFAULT_CARD.ctaTitle,
    ctaText: persona.ctaText ?? DEFAULT_CARD.ctaText,
    email: persona.email ?? DEFAULT_CARD.email,
    website: persona.website ?? DEFAULT_CARD.website,
    phone: persona.phone ?? DEFAULT_CARD.phone,
    phoneDisplay: persona.phoneDisplay ?? DEFAULT_CARD.phoneDisplay,
  };
}

/** Fallback when no profession picked yet: use default + theme. */
export function buildPreviewFromTheme(themeId: string): CardData {
  return { ...DEFAULT_CARD, accent: themeId as CardData["accent"], profession: undefined };
}

/** Sanity export so callers can list personas without importing PROFESSIONS twice. */
export const PROFESSIONS_WITH_PERSONA = PROFESSIONS.filter((p) => PERSONAS[p.id]);
