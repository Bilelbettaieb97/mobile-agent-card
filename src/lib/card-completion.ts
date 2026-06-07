import type { CardData } from "./card-types";

export interface CompletionItem {
  id: string;
  label: string;
  done: boolean;
  weight: number;
  hint?: string;
}

export function getCompletion(data: CardData): { score: number; items: CompletionItem[]; missing: CompletionItem[] } {
  const items: CompletionItem[] = [
    { id: "name",   label: "Nom complet",       done: !!data.name?.trim(),  weight: 10 },
    { id: "title",  label: "Titre / poste",     done: !!data.title?.trim(), weight: 8 },
    { id: "photo",  label: "Photo de profil",   done: !!data.photo,         weight: 12, hint: "Une photo augmente la confiance de +63%" },
    { id: "agency", label: "Agence / société",  done: !!data.agency?.trim(),weight: 6 },
    { id: "area",   label: "Zone d'activité",   done: !!data.area?.trim(),  weight: 6 },
    { id: "phone",  label: "Téléphone",         done: !!data.phone,         weight: 8 },
    { id: "email",  label: "Email",             done: !!data.email,         weight: 8 },
    { id: "actions",label: "Boutons d'action",  done: !!(data.actions.call || data.actions.whatsapp || data.actions.email || data.actions.website), weight: 10 },
    { id: "vcard",  label: "Bouton vCard",      done: data.vcardEnabled,    weight: 6 },
    { id: "about",  label: "Bio / À propos",    done: data.aboutEnabled && !!data.bio?.trim(), weight: 8, hint: "Racontez votre approche en 2 phrases" },
    { id: "services", label: "Services proposés", done: data.servicesEnabled && data.services.length > 0, weight: 8 },
    { id: "testimonials", label: "Témoignages clients", done: data.testimonialsEnabled && data.testimonials.length > 0, weight: 6, hint: "+34% de conversion avec 3 avis minimum" },
    { id: "video",  label: "Vidéo de présentation", done: data.videoEnabled, weight: 4, hint: "Une vidéo retient l'attention 5x plus longtemps" },
  ];

  const total = items.reduce((s, i) => s + i.weight, 0);
  const got = items.reduce((s, i) => s + (i.done ? i.weight : 0), 0);
  const score = Math.round((got / total) * 100);
  const missing = items.filter((i) => !i.done);
  return { score, items, missing };
}
