import { createFileRoute } from "@tanstack/react-router";
import { BrickList } from "@/components/builder/BrickList";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { useCardStore } from "@/lib/card-store";
import { CARD_THEMES } from "@/lib/card-themes";
import type { CardData } from "@/lib/card-types";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/style")({
  component: StylePage,
});

function StylePage() {
  const { data, setData, update, hydrated } = useCardStore();

  if (!hydrated) {
    return <div className="p-8 text-muted-foreground">Chargement…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
      <section className="space-y-10">
        {/* Theme palette */}
        <div>
          <h2 className="font-display text-2xl font-medium">Thème de la carte</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-5">
            Une palette globale s'applique à toutes les briques. Choisissez l'ambiance qui correspond à votre métier.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {CARD_THEMES.map((t) => {
              const active = data.accent === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update("accent", t.id as CardData["accent"])}
                  className={`relative text-left rounded-2xl border p-3 transition ${
                    active ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div
                    className="h-16 w-full rounded-lg mb-3 border border-border"
                    style={{ background: t.palette.gradient }}
                    aria-hidden
                  />
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
        </div>

        {/* Per-brick style variants */}
        <div>
          <h2 className="font-display text-2xl font-medium">Style par brique</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-5">
            Chaque brique propose plusieurs variantes visuelles. Déroulez une brique pour choisir son style.
          </p>
          <BrickList data={data} update={update} setData={setData} styleOnly />
        </div>
      </section>

      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <p className="text-xs uppercase tracking-[0.18em] text-primary flex items-center gap-1.5 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Aperçu live
          </p>
          <PhoneFrame><BusinessCard data={data} /></PhoneFrame>
        </div>
      </aside>
    </div>
  );
}
