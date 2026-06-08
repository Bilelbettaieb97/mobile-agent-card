CREATE TABLE public.nfc_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  nom TEXT NOT NULL DEFAULT '',
  fonction TEXT DEFAULT '',
  entreprise TEXT DEFAULT '',
  telephone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  site_web TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  couleur_accent TEXT DEFAULT 'gold',
  secteur TEXT DEFAULT '',
  vcard_enabled BOOLEAN DEFAULT true,
  card_data JSONB DEFAULT '{}'::jsonb,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nfc_profiles TO authenticated;
GRANT SELECT ON public.nfc_profiles TO anon;
GRANT ALL ON public.nfc_profiles TO service_role;
ALTER TABLE public.nfc_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active cards" ON public.nfc_profiles FOR SELECT USING (actif = true);
CREATE POLICY "Owners can view their cards" ON public.nfc_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Owners can insert their cards" ON public.nfc_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update their cards" ON public.nfc_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can delete their cards" ON public.nfc_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_nfc_profiles_updated_at BEFORE UPDATE ON public.nfc_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX nfc_profiles_user_id_idx ON public.nfc_profiles(user_id);

CREATE TABLE public.nfc_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.nfc_profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.nfc_analytics TO anon, authenticated;
GRANT SELECT ON public.nfc_analytics TO authenticated;
GRANT ALL ON public.nfc_analytics TO service_role;
ALTER TABLE public.nfc_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert analytics events" ON public.nfc_analytics FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Owners can view their analytics" ON public.nfc_analytics FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.nfc_profiles p WHERE p.id = profile_id AND p.user_id = auth.uid()));
CREATE INDEX nfc_analytics_profile_id_idx ON public.nfc_analytics(profile_id);