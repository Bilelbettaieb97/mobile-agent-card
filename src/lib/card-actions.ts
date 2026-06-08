import { supabase } from "./supabase";
import { generateUniqueSlug } from "./slug";
import type { CardData } from "./card-types";
import { setProfileMeta } from "./profile-store";

export async function createCard(cardData: CardData): Promise<{ slug: string; id: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté");

  const slug = await generateUniqueSlug(cardData.name || "carte");

  const { data, error } = await supabase
    .from("nfc_profiles")
    .insert({
      user_id: user.id,
      slug,
      nom: cardData.name || "",
      fonction: cardData.title || "",
      entreprise: cardData.agency || "",
      telephone: cardData.phone || "",
      email: cardData.email || "",
      site_web: cardData.website || "",
      bio: cardData.bio || "",
      photo_url: cardData.photo || "",
      cover_url: cardData.coverPhoto || "",
      couleur_accent: cardData.accent || "gold",
      secteur: cardData.profession || cardData.area || "",
      vcard_enabled: cardData.vcardEnabled,
      card_data: cardData as unknown as Record<string, unknown>,
      actif: true,
    })
    .select("id, slug")
    .single();

  if (error) throw new Error(error.message);

  const meta = { id: data.id, slug: data.slug, plan: "free", actif: true };
  setProfileMeta(meta);

  return { slug: data.slug, id: data.id };
}

export async function updateCard(profileId: string, cardData: CardData): Promise<void> {
  const { error } = await supabase
    .from("nfc_profiles")
    .update({
      nom: cardData.name || "",
      fonction: cardData.title || "",
      entreprise: cardData.agency || "",
      telephone: cardData.phone || "",
      email: cardData.email || "",
      site_web: cardData.website || "",
      bio: cardData.bio || "",
      photo_url: cardData.photo || "",
      card_data: cardData as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
}

export async function loadMyCard() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("nfc_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data;
}
