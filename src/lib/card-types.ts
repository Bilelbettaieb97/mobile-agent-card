export type ThemeAccent = "gold" | "emerald" | "copper";

export type BrickId =
  | "identity"
  | "actions"
  | "vcard"
  | "stats"
  | "about"
  | "video"
  | "services"
  | "listings"
  | "testimonials"
  | "calendar"
  | "languages"
  | "cta"
  | "contact"
  | "socials"
  | "theme";

export const DEFAULT_SECTION_ORDER: BrickId[] = [
  "identity",
  "actions",
  "vcard",
  "stats",
  "about",
  "video",
  "services",
  "listings",
  "testimonials",
  "calendar",
  "languages",
  "cta",
  "contact",
  "socials",
  "theme",
];

export interface Stat { label: string; value: string }
export interface Listing { id: string; img: string; title: string; meta: string; price: string }
export interface Badge { id: string; label: string }
export interface Service { id: string; title: string; description: string }
export interface Testimonial { id: string; name: string; role: string; text: string; rating: number; photo: string; link: string }
export interface Language { id: string; name: string; level: string }

export type TestimonialsStyle = "cards" | "stacked" | "compact";


export interface CardData {
  // Identity (always on)
  name: string;
  title: string;
  agency: string;
  area: string;
  photo: string;

  // Actions
  actions: { call: boolean; whatsapp: boolean; email: boolean; website: boolean };

  // vCard
  vcardEnabled: boolean;

  // Stats
  statsEnabled: boolean;
  stats: Stat[];

  // About
  aboutEnabled: boolean;
  bio: string;
  badges: Badge[];

  // Video (YouTube)
  videoEnabled: boolean;
  videoTitle: string;
  videoUrl: string;

  // Services
  servicesEnabled: boolean;
  services: Service[];

  // Listings
  listingsEnabled: boolean;
  listings: Listing[];

  // Testimonials
  testimonialsEnabled: boolean;
  testimonials: Testimonial[];
  testimonialsStyle: TestimonialsStyle;


  // Calendar / booking
  calendarEnabled: boolean;
  calendarLabel: string;
  calendarUrl: string;

  // Languages
  languagesEnabled: boolean;
  languages: Language[];

  // CTA banner
  ctaEnabled: boolean;
  ctaTitle: string;
  ctaText: string;
  ctaButtonLabel: string;
  ctaButtonUrl: string;

  // Contact
  contactEnabled: boolean;
  phone: string;
  phoneDisplay: string;
  email: string;
  website: string;
  whatsapp: string;

  // Socials
  socialsEnabled: boolean;
  linkedin: string;
  instagram: string;
  whatsappSocial: string;

  // Theme
  accent: ThemeAccent;

  // Order
  sectionOrder: BrickId[];
}

export const DEFAULT_CARD: CardData = {
  name: "Alexandre Moreau",
  title: "Conseiller immobilier de prestige",
  agency: "Maison Vendôme",
  area: "Paris & Île-de-France",
  photo: "",
  actions: { call: true, whatsapp: true, email: true, website: true },
  vcardEnabled: true,
  statsEnabled: true,
  stats: [
    { label: "Biens vendus", value: "240+" },
    { label: "Note clients", value: "4.9" },
    { label: "Années", value: "12" },
  ],
  aboutEnabled: true,
  bio: "12 ans d'expertise sur le marché parisien. Spécialiste des biens d'exception, je vous accompagne avec discrétion et exigence à chaque étape de votre projet.",
  badges: [
    { id: "b1", label: "FNAIM certifié" },
    { id: "b2", label: "Top 1% Paris" },
    { id: "b3", label: "Prestige" },
  ],
  videoEnabled: false,
  videoTitle: "Présentation en 60 secondes",
  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  servicesEnabled: true,
  services: [
    { id: "s1", title: "Estimation gratuite", description: "Évaluation précise sous 48 h, basée sur le marché local." },
    { id: "s2", title: "Accompagnement vendeur", description: "De la mise en valeur du bien à la signature chez le notaire." },
    { id: "s3", title: "Chasse immobilière", description: "Recherche sur-mesure pour acquéreurs exigeants." },
  ],
  listingsEnabled: true,
  listings: [],
  testimonialsEnabled: true,
  testimonials: [
    { id: "t1", name: "Camille D.", role: "Vendeuse — Paris 7e", text: "Discret, efficace, à l'écoute. Vente conclue 8 % au-dessus de l'estimation initiale.", rating: 5 },
    { id: "t2", name: "Julien R.", role: "Acquéreur — Neuilly", text: "Alexandre a trouvé exactement le bien que nous cherchions, en moins de 3 semaines.", rating: 5 },
  ],
  calendarEnabled: false,
  calendarLabel: "Réserver un rendez-vous",
  calendarUrl: "https://calendly.com/votre-lien",
  languagesEnabled: false,
  languages: [
    { id: "l1", name: "Français", level: "Natif" },
    { id: "l2", name: "Anglais", level: "Courant" },
  ],
  ctaEnabled: false,
  ctaTitle: "Vous vendez ou achetez ?",
  ctaText: "Échangeons 15 minutes pour cadrer votre projet, sans engagement.",
  ctaButtonLabel: "Prendre contact",
  ctaButtonUrl: "https://calendly.com/votre-lien",
  contactEnabled: true,
  phone: "+33612345678",
  phoneDisplay: "+33 6 12 34 56 78",
  email: "alexandre@maison-vendome.fr",
  website: "maison-vendome.fr",
  whatsapp: "33612345678",
  socialsEnabled: true,
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  whatsappSocial: "33612345678",
  accent: "gold",
  sectionOrder: DEFAULT_SECTION_ORDER,
};
