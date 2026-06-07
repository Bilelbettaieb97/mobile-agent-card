import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RotateCcw, Eye, X, ExternalLink, Grid3x3, Palette, LayoutDashboard,
} from "lucide-react";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { ShareDialog } from "@/components/card/ShareDialog";
import { useCardStore } from "@/lib/card-store";
import type { CardData } from "@/lib/card-types";
import { BuilderWelcome } from "@/components/builder/BuilderWelcome";
import { BuilderSections } from "@/components/builder/BuilderSections";
import { StepHeader, type StepNum } from "@/components/builder/StepHeader";
import { StepFooter } from "@/components/builder/StepFooter";
import { BrickList } from "@/components/builder/BrickList";
import { buildPreviewCard, buildPreviewFromTheme, type VariantId } from "@/lib/profession-personas";

import { buildPreviewCard, buildPreviewFromTheme, type VariantId } from "@/lib/profession-personas";


type Step = "welcome" | "essentials" | "extras" | "edit";

const STEP_NUM: Record<Step, StepNum> = {
  welcome: 1, essentials: 2, extras: 3, edit: 4,
};
const NUM_STEP: Record<StepNum, Step> = {
  1: "welcome", 2: "essentials", 3: "extras", 4: "edit",
};

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Builder — Carte de visite digitale" },
      { name: "description", content: "Construisez votre carte de visite digitale brique par brique, avec aperçu mobile en direct." },
    ],
  }),
  component: BuilderPage,
});

function BuilderPage() {
  const { data, setData, update, reset, hydrated } = useCardStore();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [gridOn, setGridOn] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [plan, setPlan] = useState<VariantId>("vitrine");
  const [completedThrough, setCompletedThrough] = useState<StepNum>(1);

  const advanceTo = (next: Step) => {
    const n = STEP_NUM[next];
    setCompletedThrough((c) => (n > c ? n : c));
    setStep(next);
  };

  const goToStep = (n: StepNum) => {
    if (n > completedThrough) return;
    // L'étape 2 (compare) n'a de sens que si un métier a été choisi.
    if (n === 2 && !data.profession) {
      setStep("welcome");
      return;
    }
    setStep(NUM_STEP[n]);
  };

  if (!hydrated) {
    return <div className="min-h-screen bg-background grid place-items-center text-muted-foreground">Chargement…</div>;
  }

  if (step === "welcome") {
    return (
      <BuilderWelcome
        initialProfessionId={data.profession}
        initialAccent={data.accent}
        completedThrough={completedThrough}
        onGoToStep={goToStep}
        onChooseProfession={(p) => {
          update("profession", p.id);
          update("accent", p.themeId as CardData["accent"]);
          setData(buildPreviewCard(p, "essentielle"));
          setPlan("essentielle");
          advanceTo("essentials");
        }}
        onChooseTheme={(themeId) => {
          setData(buildPreviewFromTheme(themeId));
          advanceTo("essentials");
        }}
      />
    );
  }


  if (step === "essentials") {
    return (
      <BuilderSections
        step="essentials"
        data={data}
        setData={setData}
        update={update}
        plan={plan}
        setPlan={setPlan}
        completedThrough={completedThrough}
        onGoToStep={goToStep}
        onBack={() => setStep("welcome")}
        onNext={() => advanceTo("extras")}
      />
    );
  }

  if (step === "extras") {
    return (
      <BuilderSections
        step="extras"
        data={data}
        setData={setData}
        update={update}
        plan={plan}
        setPlan={setPlan}
        completedThrough={completedThrough}
        onGoToStep={goToStep}
        onBack={() => setStep("essentials")}
        onNext={() => advanceTo("edit")}
      />
    );
  }

  // Step 4 — edit
  return (
    <main className="min-h-screen bg-background text-foreground">
      <StepHeader
        step={4}
        title="Personnalisez et activez"
        subtitle="Réorganisez vos sections, ajustez le style — l'aperçu se met à jour en direct."
        completedThrough={completedThrough}
        onGoToStep={goToStep}
        nextHint="Dernière étape — votre carte sera prête à partager."
      />

      {/* Topbar d'actions utilitaires */}
      <div className="border-b border-border bg-background/80">
        <div className="mx-auto max-w-7xl px-5 h-12 flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setStep("welcome")}>
            <Palette className="h-4 w-4 mr-1.5" /> Changer de thème
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-1.5" /> Réinitialiser
          </Button>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <LayoutDashboard className="h-4 w-4 mr-1.5" /> Mon dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4 mr-1.5" /> Démo
            </Button>
          </Link>
          <Button size="sm" className="lg:hidden" onClick={() => setPreviewOpen(true)}>
            <Eye className="h-4 w-4 mr-1.5" /> Aperçu
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
        <section>
          <BrickList data={data} update={update} setData={setData} />

          <div className="mt-8 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "carte.json"; a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Exporter JSON
            </Button>
            <ImportJsonButton onImport={setData} />
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">Aperçu live</p>
              <Button
                variant={gridOn ? "default" : "outline"}
                size="sm"
                onClick={() => setGridOn((v) => !v)}
                aria-pressed={gridOn}
              >
                <Grid3x3 className="h-4 w-4 mr-1.5" />
                Grille
              </Button>
            </div>
            <PhoneFrame gridOverlay={gridOn}><BusinessCard data={data} /></PhoneFrame>
          </div>
        </aside>
      </div>

      <StepFooter
        step={4}
        onBack={() => setStep("extras")}
        onNext={() => setShareOpen(true)}
        nextLabel="Activer ma carte"
        centerInfo="Votre carte est prête"
      />

      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col">
          <div className="flex items-center justify-between p-4">
            <Button
              variant={gridOn ? "default" : "outline"}
              size="sm"
              onClick={() => setGridOn((v) => !v)}
              aria-pressed={gridOn}
            >
              <Grid3x3 className="h-4 w-4 mr-1.5" />
              Grille
            </Button>
            <button onClick={() => setPreviewOpen(false)} className="h-10 w-10 grid place-items-center rounded-full bg-card border border-border">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pb-8">
            <PhoneFrame gridOverlay={gridOn}><BusinessCard data={data} /></PhoneFrame>
          </div>
        </div>
      )}

      <ShareDialog data={data} open={shareOpen} onOpenChange={setShareOpen} />
    </main>
  );
}

function ImportJsonButton({ onImport }: { onImport: (d: CardData) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" accept="application/json" className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]; if (!f) return;
          const reader = new FileReader();
          reader.onload = () => { try { onImport(JSON.parse(String(reader.result))); } catch { /* noop */ } };
          reader.readAsText(f);
        }} />
      <Button variant="ghost" onClick={() => ref.current?.click()}>Importer JSON</Button>
    </>
  );
}
