export type ThemeAccent = "gold" | "emerald" | "copper";

export type BrickId =
  | "identity"
  | "actions"
  | "vcard"
  | "stats"
  | "about"
  | "listings"
  | "contact"
  | "socials"
  | "theme";

export const DEFAULT_SECTION_ORDER: BrickId[] = [
  "identity",
  "actions",
  "vcard",
  "stats",
  "about",
  "listings",
  "contact",
  "socials",
  "theme",
];

export interface Stat { label: string; value: string }
export interface Listing { id: string; img: string; title: string; meta: string; price: string }
export interface Badge { id: string; label: string }

export interface CardData {
  // Identity (always on)
  name: string;
  title: string;
  agency: string;
  area: string;
  photo: string; // url or base64

  // Actions
  actions: { call: boolean; whatsapp: boolean; email: boolean; website: boolean };

  // vCard button
  vcardEnabled: boolean;

  // Stats
  statsEnabled: boolean;
  stats: Stat[];

  // About
  aboutEnabled: boolean;
  bio: string;
  badges: Badge[];

  // Listings
  listingsEnabled: boolean;
  listings: Listing[];

  // Contact details
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

  // Order of bricks (editor + preview)
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
  listingsEnabled: true,
  listings: [],
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

