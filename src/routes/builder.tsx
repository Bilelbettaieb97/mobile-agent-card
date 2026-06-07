import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, Sparkles, Rocket, ArrowRight, Lock, QrCode,
  Clock, Users, Star, ShieldCheck,
} from "lucide-react";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { useCardStore } from "@/lib/card-store";
import type { CardData } from "@/lib/card-types";
import { BuilderWelcome } from "@/components/builder/BuilderWelcome";
import { BuilderSections } from "@/components/builder/BuilderSections";
import { StepHeader, type StepNum } from "@/components/builder/StepHeader";
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
  const { data, setData, update, hydrated } = useCardStore();
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

  // Step 4 — Result / Success
  return (
    <main className="min-h-screen bg-background text-foreground">
      <StepHeader
        step={4}
        title="Félicitations, votre carte est prête !"
        subtitle="Voici l'aperçu final. Activez votre carte pour la rendre accessible à vos contacts."
        completedThrough={completedThrough}
        onGoToStep={goToStep}
        nextHint="Plus qu'une étape : activer votre carte pour pouvoir la partager."
      />

      <div className="mx-auto max-w-5xl px-5 py-10 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10 items-start">
        {/* LEFT — message + CTA */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> Carte créée avec succès
          </div>

          <h2 className="font-display text-3xl sm:text-4xl leading-tight">
            Merci d'avoir construit votre carte avec nous.
          </h2>

          <p className="text-muted-foreground">
            Toutes vos informations sont enregistrées. Il ne reste plus qu'à activer votre
            carte pour obtenir votre lien public, votre QR code et l'accès à votre
            tableau de bord pour la modifier à tout moment.
          </p>

          <ul className="space-y-2.5">
            {[
              "Lien public partageable + QR code à imprimer",
              "Aperçu mobile identique à votre vraie carte",
              "Modifications illimitées depuis votre dashboard",
              "Statistiques de vues et de clics",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link to="/pricing" className="flex-1">
              <Button size="lg" className="w-full text-base h-12 shadow-[var(--shadow-elegant)]">
                <Rocket className="h-5 w-5 mr-2" />
                Activer ma carte
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="ghost"
              className="h-12"
              onClick={() => setStep("extras")}
            >
              Modifier encore
            </Button>
          </div>

          <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            Essai 7 jours gratuit sur l'offre Vitrine — sans engagement.
          </p>
        </section>

        {/* RIGHT — finalized phone preview */}
        <aside>
          <div className="sticky top-24">
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-3 text-center">
              Votre carte
            </p>
            <PhoneFrame><BusinessCard data={data} /></PhoneFrame>
          </div>
        </aside>
      </div>
    </main>
  );
}

