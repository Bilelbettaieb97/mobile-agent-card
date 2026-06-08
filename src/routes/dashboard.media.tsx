import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, ImageIcon, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/media")({
  head: () => ({ meta: [{ title: "Médias — Dashboard" }] }),
  component: MediaPage,
});

type Photo = { name: string; path: string; url: string; size: number };

const BUCKET = "user-photos";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function MediaPage() {
  const { user } = useAuthStore();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list(user.id, {
      sortBy: { column: "created_at", order: "desc" },
      limit: 100,
    });
    if (error) {
      toast.error("Impossible de charger les photos");
      setLoading(false);
      return;
    }
    const files = (data || []).filter((f) => f.name && !f.name.startsWith("."));
    const items: Photo[] = await Promise.all(
      files.map(async (f) => {
        const path = `${user.id}/${f.name}`;
        const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
        return {
          name: f.name,
          path,
          url: signed?.signedUrl || "",
          size: (f.metadata as any)?.size ?? 0,
        };
      })
    );
    setPhotos(items);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !user) return;
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} dépasse 5 Mo`);
        continue;
      }
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) toast.error(`Échec : ${file.name}`);
      else ok++;
    }
    setUploading(false);
    if (ok > 0) toast.success(`${ok} photo(s) uploadée(s)`);
    if (inputRef.current) inputRef.current.value = "";
    load();
  };

  const remove = async (path: string) => {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) return toast.error("Suppression impossible");
    toast.success("Photo supprimée");
    setPhotos((p) => p.filter((x) => x.path !== path));
  };

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    toast.success("Lien copié");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition bg-card/30 p-8 text-center"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center mb-3">
          <Upload className="h-5 w-5" />
        </div>
        <h3 className="font-display text-lg">Glissez vos photos ici</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Logo, photos d'annonces, portrait… JPG/PNG/WEBP, 5 Mo max par fichier
        </p>
        <Button
          className="mt-4"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Upload en cours…</>
          ) : (
            <><Upload className="h-4 w-4 mr-2" /> Choisir des fichiers</>
          )}
        </Button>
      </div>

      {/* Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg">Ma bibliothèque ({photos.length})</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-2xl bg-card/20">
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Aucune photo pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((p) => (
              <div key={p.path} className="group relative rounded-xl overflow-hidden border border-border bg-muted/20 aspect-square">
                <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2 gap-1">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 flex-1 text-[11px]"
                      onClick={() => copy(p.url)}
                    >
                      {copied === p.url ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 px-2"
                      onClick={() => remove(p.path)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
