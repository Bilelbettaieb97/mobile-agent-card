/**
 * Vérifie qu’un visiteur anonyme reçoit 0 résultat et une réponse cohérente
 * quand le slug n’existe pas ou est mal formé (slug inexistant / vide / invalide).
 *
 * Lancer : bun run scripts/test-missing-slug.ts
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const ANON_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
  throw new Error("Variables Supabase manquantes (URL / PUBLISHABLE / SERVICE_ROLE).");
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
const anon = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });

const stamp = Date.now();
const validSlug = `test-valid-${stamp}`;
const nonExistentSlug = `test-does-not-exist-${stamp}`;
const emptySlug = "";
const weirdSlug = `test<>|?*\\`;

async function pickUserId(): Promise<string | null> {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (error) throw new Error(`listUsers: ${error.message}`);
  return data.users[0]?.id ?? null;
}

function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error(`❌ ${msg}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ ${msg}`);
  }
}

async function main() {
  const userId = await pickUserId();
  if (!userId) {
    console.warn("⚠️  Aucun utilisateur dans auth.users — créez un compte d'abord pour exécuter ce test.");
    return;
  }

  // Setup : insère 1 carte active avec un slug valide
  const { error: insErr } = await admin.from("nfc_profiles").insert([
    { user_id: userId, slug: validSlug, nom: "Valide", actif: true },
  ]);
  if (insErr) throw new Error(`insert seed: ${insErr.message}`);

  try {
    // --- 1. Slug inexistant ---
    const missingRes = await anon
      .from("nfc_profiles")
      .select("id, nom, actif")
      .eq("slug", nonExistentSlug)
      .eq("actif", true)
      .maybeSingle();

    assert(!missingRes.error, `Slug inexistant : pas d'erreur SQL (${missingRes.error?.message ?? "ok"})`);
    assert(missingRes.data === null, "Slug inexistant → 0 résultat (data === null)");

    // --- 2. Slug vide ---
    const emptyRes = await anon
      .from("nfc_profiles")
      .select("id, nom, actif")
      .eq("slug", emptySlug)
      .eq("actif", true)
      .maybeSingle();

    assert(!emptyRes.error, `Slug vide : pas d'erreur SQL (${emptyRes.error?.message ?? "ok"})`);
    assert(emptyRes.data === null, "Slug vide → 0 résultat (data === null)");

    // --- 3. Slug avec caractères spéciaux ---
    const weirdRes = await anon
      .from("nfc_profiles")
      .select("id, nom, actif")
      .eq("slug", weirdSlug)
      .eq("actif", true)
      .maybeSingle();

    assert(!weirdRes.error, `Slug mal formé : pas d'erreur SQL (${weirdRes.error?.message ?? "ok"})`);
    assert(weirdRes.data === null, "Slug mal formé → 0 résultat (data === null)");

    // --- 4. Sans filtre actif=true (RLS seule) sur slug inexistant ---
    const missingNoFilter = await anon
      .from("nfc_profiles")
      .select("id")
      .eq("slug", nonExistentSlug)
      .maybeSingle();

    assert(!missingNoFilter.error, "Slug inexistant sans filtre actif : pas d'erreur SQL");
    assert(missingNoFilter.data === null, "Slug inexistant sans filtre actif → 0 résultat (RLS + non-existence)");

    // --- 5. Vérification que la carte valide est bien visible ---
    const validRes = await anon
      .from("nfc_profiles")
      .select("id, nom, actif")
      .eq("slug", validSlug)
      .eq("actif", true)
      .maybeSingle();

    assert(!validRes.error, `Carte valide : pas d'erreur SQL (${validRes.error?.message ?? "ok"})`);
    assert(validRes.data?.nom === "Valide", "Carte valide visible par anon");

    console.log("\n🎯 Tous les tests de slug manquant / mal formé ont réussi.");
  } finally {
    // Cleanup
    await admin.from("nfc_profiles").delete().in("slug", [validSlug, nonExistentSlug, weirdSlug]);
  }
}

main().catch((e) => {
  console.error("❌ Test échoué :", e);
  process.exit(1);
});
