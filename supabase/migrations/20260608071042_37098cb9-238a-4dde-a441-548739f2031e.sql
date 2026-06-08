
-- 1) Block public enumeration of nfc_profiles. Anonymous access goes through a slug-only RPC.
DROP POLICY IF EXISTS "Public can view active cards" ON public.nfc_profiles;

CREATE OR REPLACE FUNCTION public.get_public_card_by_slug(_slug text)
RETURNS TABLE (
  id uuid,
  slug text,
  nom text,
  fonction text,
  entreprise text,
  telephone text,
  email text,
  site_web text,
  bio text,
  photo_url text,
  cover_url text,
  couleur_accent text,
  secteur text,
  vcard_enabled boolean,
  card_data jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id, p.slug, p.nom, p.fonction, p.entreprise, p.telephone, p.email,
    p.site_web, p.bio, p.photo_url, p.cover_url, p.couleur_accent,
    p.secteur, p.vcard_enabled, p.card_data
  FROM public.nfc_profiles p
  WHERE p.slug = _slug
    AND p.actif = true
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_card_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_card_by_slug(text) TO anon, authenticated;

-- Anon no longer needs direct SELECT on the table
REVOKE SELECT ON public.nfc_profiles FROM anon;

-- 2) Restrict anonymous analytics inserts to existing active profiles.
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.nfc_analytics;

CREATE POLICY "Insert analytics for active profiles"
  ON public.nfc_analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.nfc_profiles p
      WHERE p.id = nfc_analytics.profile_id
        AND p.actif = true
    )
  );
