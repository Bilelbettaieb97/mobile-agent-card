import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrickList } from "@/components/builder/BrickList";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { ShareGrid, QrCard, PublicLinkBar } from "@/components/dashboard/ShareGrid";
import { useCardStore } from "@/lib/card-store";
import { CARD_THEMES } from "@/lib/card-themes";
import type { CardData } from "@/lib/card-types";
import { Sparkles, Check, ArrowRight, Layers, Palette, Share2, Smartphone } from "lucide-react";
import { updateCard } from "@/lib/card-actions";
import { getProfileMeta } from "@/lib/profile-store";

export const Route = createFileRoute("/dashboard/card")({
  component: MyCardPage,
});

function MyCardPage() {
  const { data, setData, update, hydrated } = useCardStore();
  const profile = getProfileMeta();
  const origin = typeof window !== "undefined" ? window.location.origin : "https://macarte.app";
  const publicUrl = profile ? `${origin}/${profile.slug}` : `${origin}/`;

  // Auto-save to Supabase after card changes (debounced 1.5s)
  useEffect(() => {
    if (!hydrated || !profile) return;
    const timer = setTimeout(() => {
      updateCard(profile.id, data).catch(console.error);
    }, 1500);
    return () => clearTimeout(timer);
  }, [data, hydrated]);

  if (!hydrated) {
    return <div className="p-8 text-muted-foreground">Chargement…</div>;
  }

  return (
    <div className="mx-auto max-w-[1500px] px-5 sm:px-8 py-8 grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
      {/* LEFT — sticky preview + QR + share */}
      <aside className="space-y-4">
        <div className="xl:sticky xl:top-20 space-y-4">
          {/* Preview */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-[0.16em] text-primary flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Aperçu live
              </p>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Smartphone className="h-3 w-3" /> Mobile
              </span>
            </div>
            <div className="flex justify-center">
              <PhoneFrame><BusinessCard data={data} /></PhoneFrame>
            </div>
          </div>

          {/* Public link */}
          <div className="rounded-2xl border border-border bg-card/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Lien public</span>
              <Link to="/dashboard/account" className="text-[11px] text-primary hover:underline">Personnaliser →</Link>
            </div>
            <PublicLinkBar url={publicUrl} />
          </div>

          {/* QR + Share */}
          <div id="qr">
            <QrCard url={publicUrl} name={data.name} />
          </div>

          <div className="rounded-2xl border border-border bg-card/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-medium">Partager ma carte</span>
            </div>
            <ShareGrid data={data} url={publicUrl} />
          </div>
        </div>
      </aside>

      {/* RIGHT — Tabs Contenu / Apparence / Style */}
      <section>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="bg-muted/30 border border-border h-11 p-1 mb-5">
            <TabsTrigger value="content" className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
              <Layers className="h-3.5 w-3.5" /> Contenu
            </TabsTrigger>
            <TabsTrigger value="theme" className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
              <Palette className="h-3.5 w-3.5" /> Apparence
            </TabsTrigger>
            <TabsTrigger value="style" className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-0 space-y-4">
            <Header
              title="Briques de la carte"
              subtitle="Activez, modifiez ou réordonnez chaque section. L'aperçu se met à jour en direct."
            />
            <BrickList data={data} update={update} setData={setData} />
          </TabsContent>

          <TabsContent value="theme" className="mt-0 space-y-4">
            <Header
              title="Thème global"
              subtitle="Une palette s'applique à toute la carte. Choisissez l'ambiance qui correspond à votre métier."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CARD_THEMES.map((t) => {
                const active = data.accent === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => update("accent", t.id as CardData["accent"])}
                    className={`group relative text-left rounded-2xl border p-3 transition hover:-translate-y-0.5 ${
                      active ? "border-primary ring-2 ring-primary/40 shadow-[var(--shadow-glow)]" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div
                      className="h-20 w-full rounded-lg mb-3 border border-border/60 overflow-hidden relative"
                      style={{ background: t.palette.gradient }}
                      aria-hidden
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{t.label}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{t.sector}</div>
                      </div>
                      {active && (
                        <span className="h-5 w-5 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="style" className="mt-0 space-y-4">
            <Header
              title="Style par brique"
              subtitle="Chaque brique propose plusieurs variantes visuelles. Déroulez une brique pour choisir son style."
            />
            <BrickList data={data} update={update} setData={setData} styleOnly />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-medium">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <Link to="/builder" className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition">
        Ouvrir le builder <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
