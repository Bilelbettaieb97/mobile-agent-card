import { createFileRoute } from "@tanstack/react-router";
import { BrickList } from "@/components/builder/BrickList";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { useCardStore } from "@/lib/card-store";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: MyCardPage,
});

function MyCardPage() {
  const { data, setData, update, hydrated } = useCardStore();

  if (!hydrated) {
    return <div className="p-8 text-muted-foreground">Chargement…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
      <section>
        <div className="mb-6">
          <h2 className="font-display text-2xl font-medium">Mes briques</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Glissez les poignées pour réordonner. Activez ou modifiez le contenu de chaque brique — l'aperçu se met à jour en direct.
          </p>
        </div>
        <BrickList data={data} update={update} setData={setData} />
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
