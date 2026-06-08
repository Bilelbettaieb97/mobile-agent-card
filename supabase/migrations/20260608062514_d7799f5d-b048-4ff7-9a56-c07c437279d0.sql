
CREATE POLICY "Users can view own photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
