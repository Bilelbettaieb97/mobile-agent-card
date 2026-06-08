/**
 * Vérifie que les visiteurs anonymes ne voient via /[slug] (table public.nfc_profiles)
 * QUE les cartes où actif = true. Une carte inactive ne doit renvoyer aucun résultat.
 *
 * Lancer : bun run scripts/test-public-card-visibility.ts
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
const activeSlug = `test-actif-${stamp}`;
const inactiveSlug = `test-inactif-${stamp}`;

// On a besoin d'un user_id valide (FK vers auth.users). On prend n'importe quel user existant ;
// sinon on saute le test proprement.
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

  // Setup : insère 1 carte active + 1 inactive
  const { error: insErr } = await admin.from("nfc_profiles").insert([
    { user_id: userId, slug: activeSlug, nom: "Actif", actif: true },
    { user_id: userId, slug: inactiveSlug, nom: "Inactif", actif: false },
  ]);
  if (insErr) throw new Error(`insert seed: ${insErr.message}`);

  try {
    // Lecture anon — exactement comme /[slug]
    const activeRes = await anon
      .from("nfc_profiles")
      .select("id, nom, actif")
      .eq("slug", activeSlug)
      .eq("actif", true)
      .maybeSingle();

    const inactiveRes = await anon
      .from("nfc_profiles")
      .select("id, nom, actif")
      .eq("slug", inactiveSlug)
      .eq("actif", true)
      .maybeSingle();

    // Et même sans filtre actif=true côté client, RLS doit déjà bloquer
    const inactiveNoFilter = await anon
      .from("nfc_profiles")
      .select("id")
      .eq("slug", inactiveSlug)
      .maybeSingle();

    assert(!activeRes.error, `Lecture carte active sans erreur (${activeRes.error?.message ?? "ok"})`);
    assert(activeRes.data?.nom === "Actif", "Carte active visible par anon");

    assert(!inactiveRes.error, "Lecture carte inactive sans erreur SQL");
    assert(inactiveRes.data === null, "Carte inactive → 0 résultat (avec filtre actif=true)");

    assert(inactiveNoFilter.data === null, "Carte inactive → 0 résultat (RLS bloque même sans filtre)");
  } finally {
    // Cleanup
    await admin.from("nfc_profiles").delete().in("slug", [activeSlug, inactiveSlug]);
  }
}

main().catch((e) => {
  console.error("❌ Test échoué :", e);
  process.exit(1);
});
