/**
 * Vérifie le code HTTP et le format du JSON renvoyé par l'API PostgREST
 * (utilisée par la route publique /[slug]) quand le slug n'existe pas
 * ou est mal formé.
 *
 * Attendu :
 *   - HTTP 200
 *   - Content-Type: application/json
 *   - Corps = tableau JSON vide `[]` (ou objet `null` avec Accept single-object)
 *
 * Lancer : bun run scripts/test-missing-slug-http.ts
 */

const SUPABASE_URL = process.env.SUPABASE_URL!;
const ANON_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;

if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error("Variables Supabase manquantes (URL / PUBLISHABLE_KEY).");
}

const endpoint = `${SUPABASE_URL}/rest/v1/nfc_profiles`;

const cases: Array<{ label: string; slug: string }> = [
  { label: "slug inexistant", slug: `does-not-exist-${Date.now()}` },
  { label: "slug vide", slug: "" },
  { label: "slug mal formé (caractères spéciaux)", slug: "<>|?*\\" },
  { label: "slug très long", slug: "a".repeat(500) },
  { label: "slug avec espaces", slug: "   " },
];

function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error(`❌ ${msg}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ ${msg}`);
  }
}

async function queryAsArray(slug: string) {
  const url = `${endpoint}?select=id,nom,actif&slug=eq.${encodeURIComponent(slug)}&actif=eq.true`;
  return fetch(url, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      Accept: "application/json",
    },
  });
}

async function queryAsSingle(slug: string) {
  const url = `${endpoint}?select=id,nom,actif&slug=eq.${encodeURIComponent(slug)}&actif=eq.true`;
  return fetch(url, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      // PostgREST renvoie un objet seul (ou null) avec ce header
      Accept: "application/vnd.pgrst.object+json",
    },
  });
}

async function run() {
  for (const { label, slug } of cases) {
    console.log(`\n— ${label} —`);

    // 1) Réponse en tableau (mode par défaut utilisé par supabase-js .select())
    const arrRes = await queryAsArray(slug);
    const arrCT = arrRes.headers.get("content-type") ?? "";
    const arrText = await arrRes.text();

    assert(arrRes.status === 200, `[array] HTTP 200 (reçu ${arrRes.status})`);
    assert(arrCT.includes("application/json"), `[array] Content-Type JSON (reçu "${arrCT}")`);

    let arrJson: unknown = undefined;
    try {
      arrJson = JSON.parse(arrText);
    } catch {
      assert(false, `[array] Corps JSON valide (reçu : ${arrText.slice(0, 120)})`);
      continue;
    }
    assert(Array.isArray(arrJson), "[array] Corps = tableau JSON");
    assert(Array.isArray(arrJson) && arrJson.length === 0, "[array] Tableau vide (0 résultat)");

    // 2) Réponse en objet unique (équivalent .maybeSingle() / .single())
    const singleRes = await queryAsSingle(slug);
    const singleCT = singleRes.headers.get("content-type") ?? "";
    const singleText = await singleRes.text();

    // PostgREST : 406 quand 0 résultat avec vnd.pgrst.object+json, corps = { code, message, ... }
    assert(
      singleRes.status === 406 || singleRes.status === 200,
      `[single] HTTP 406 (0 résultat) ou 200 (reçu ${singleRes.status})`,
    );
    assert(singleCT.includes("json"), `[single] Content-Type JSON (reçu "${singleCT}")`);

    try {
      const singleJson = JSON.parse(singleText) as Record<string, unknown>;
      if (singleRes.status === 406) {
        assert(
          typeof singleJson.code === "string" && typeof singleJson.message === "string",
          "[single] Erreur PostgREST structurée { code, message }",
        );
      }
    } catch {
      assert(false, `[single] Corps JSON valide (reçu : ${singleText.slice(0, 120)})`);
    }
  }

  if (process.exitCode) {
    console.log("\n❌ Certains tests ont échoué.");
  } else {
    console.log("\n🎯 Tous les tests HTTP/JSON de slug manquant ou mal formé ont réussi.");
  }
}

run().catch((e) => {
  console.error("❌ Test échoué :", e);
  process.exit(1);
});
