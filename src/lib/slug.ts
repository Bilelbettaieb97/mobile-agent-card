import { supabase } from "./supabase";

export function toSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export async function generateUniqueSlug(name: string): Promise<string> {
  const base = toSlug(name) || "carte";
  let slug = base;
  let i = 2;
  while (true) {
    const { data } = await supabase
      .from("nfc_profiles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i++}`;
  }
}
