import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
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
import { useNavigate } from "@tanstack/react-router";

type Step = "welcome" | "essentials" | "extras" | "edit";

const STEP_NUM: Record<Step, StepNum> = {
  welcome: 1, essentials: 2, extras: 3, edit: 4,
};
const NUM_STEP: Record<StepNum, Step> = {
  1: "welcome", 2: "essentials", 3: "extras", 4: "edit",
};

export const Route = createFileRoute("/_authenticated/builder")({
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
  return <SuccessStep data={data} completedThrough={completedThrough} goToStep={goToStep} onEditAgain={() => setStep("extras")} />;
}

/* -------------------------------------------------------------------------- */
/* Success / Step 4                                                            */
/* -------------------------------------------------------------------------- */

function SuccessStep({
  data, completedThrough, goToStep, onEditAgain,
}: {
  data: CardData;
  completedThrough: StepNum;
  goToStep: (n: StepNum) => void;
  onEditAgain: () => void;
}) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 2600);
    return () => clearTimeout(t);
  }, []);

  function handleActivate() {
    if (user) {
      navigate({ to: "/pricing" });
    } else {
      navigate({ to: "/inscription", search: { redirect: "/pricing" } });
    }
  }

  // Recap counters from the user's card
  const recap = useMemo(() => {
    const bricks =
      1 + // identity
      (data.actions ? 1 : 0) +
      (data.vcardEnabled ? 1 : 0) +
      (data.statsEnabled ? 1 : 0) +
      (data.aboutEnabled ? 1 : 0) +
      (data.videoEnabled ? 1 : 0) +
      (data.servicesEnabled ? 1 : 0) +
      (data.listingsEnabled ? 1 : 0) +
      (data.testimonialsEnabled ? 1 : 0) +
      (data.calendarEnabled ? 1 : 0) +
      (data.languagesEnabled ? 1 : 0) +
      (data.ctaEnabled ? 1 : 0) +
      (data.contactEnabled ? 1 : 0) +
      (data.socialsEnabled ? 1 : 0);

    const socials = [data.linkedin, data.instagram, data.whatsappSocial].filter(Boolean).length;
    return {
      bricks,
      services: data.servicesEnabled ? data.services.length : 0,
      testimonials: data.testimonialsEnabled ? data.testimonials.length : 0,
      socials,
      badges: data.aboutEnabled ? data.badges.length : 0,
    };
  }, [data]);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {showConfetti && <Confetti />}

      <StepHeader
        step={4}
        title="Félicitations, votre carte est prête !"
        subtitle="Activez-la maintenant pour obtenir votre lien public, votre QR code et l'accès à votre dashboard."
        completedThrough={completedThrough}
        onGoToStep={goToStep}
        nextHint="Dernière étape : activer votre carte."
      />

      <div className="mx-auto max-w-6xl px-5 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10 items-start">
        {/* LEFT */}
        <section className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium animate-scale-in">
            <CheckCircle2 className="h-3.5 w-3.5" /> Carte créée avec succès
          </div>

          <h2 className="font-display text-3xl sm:text-4xl leading-tight">
            Bravo {data.name?.split(" ")[0] || "!"} — votre carte est{" "}
            <span className="text-primary">prête à être activée.</span>
          </h2>

          {/* Recap of what they built */}
          <div className="rounded-xl border border-border bg-card/50 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Vous venez de créer
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <RecapStat value={recap.bricks} label="briques" />
              <RecapStat value={recap.services} label={recap.services > 1 ? "services" : "service"} />
              <RecapStat value={recap.testimonials} label="témoignages" />
              <RecapStat value={recap.socials + recap.badges} label="liens & badges" />
            </div>
          </div>

          {/* Urgency banner */}
          <div className="flex items-start gap-3 p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/[0.06]">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium">Votre carte est en attente d'activation.</span>{" "}
              <span className="text-muted-foreground">
                Les brouillons non activés sont automatiquement supprimés après 24 h pour libérer de la place.
              </span>
            </div>
          </div>

          {/* What unlocks */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
              En activant, vous débloquez
            </p>
            <ul className="space-y-2.5">
              {[
                "Votre lien public partageable (NomPrénom.cards)",
                "Votre QR code haute définition à imprimer",
                "L'accès à votre dashboard pour tout modifier",
                "Les statistiques de vues, clics et contacts",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/40">
            <div className="flex -space-x-2">
              {["A", "M", "L"].map((c, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs grid place-items-center border-2 border-background font-medium"
                >
                  {c}
                </div>
              ))}
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-1 mb-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 font-medium">4,9/5</span>
              </div>
              <div className="text-muted-foreground inline-flex items-center gap-1">
                <Users className="h-3 w-3" /> +2 400 pros ont déjà activé leur carte
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="pt-1 space-y-2">
            <div className="block">
              <Button
                size="lg"
                className="w-full text-base h-14 shadow-[var(--shadow-elegant)] group"
                onClick={handleActivate}
              >
                <Rocket className="h-5 w-5 mr-2 transition-transform group-hover:-translate-y-0.5" />
                Activer ma carte — 7 jours gratuits
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-primary" /> 0 € aujourd'hui
              </span>
              <span>·</span>
              <span>Sans engagement</span>
              <span>·</span>
              <span>Annulable en 1 clic</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditAgain}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition"
          >
            Je veux encore modifier ma carte
          </button>
        </section>

        {/* RIGHT — preview + locked QR */}
        <aside>
          <div className="sticky top-24 space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-primary text-center">
              Votre carte
            </p>
            <PhoneFrame><BusinessCard data={data} /></PhoneFrame>

            {/* Locked QR teaser */}
            <div className="relative rounded-xl border border-border bg-card p-4 overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 rounded-lg bg-muted grid place-items-center">
                  <QrCode className="h-10 w-10 text-foreground/30 blur-[2px]" />
                  <div className="absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-[2px] rounded-lg">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">QR code & lien public</div>
                  <div className="text-xs text-muted-foreground">Déverrouillés à l'activation</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function RecapStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl tabular-nums text-primary">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

/* Lightweight CSS confetti — no extra deps */
function Confetti() {
  const pieces = Array.from({ length: 60 });
  const colors = [
    "oklch(0.78 0.18 25)",
    "oklch(0.82 0.16 80)",
    "oklch(0.7 0.18 200)",
    "oklch(0.75 0.18 150)",
    "oklch(0.7 0.2 320)",
  ];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const duration = 1.6 + Math.random() * 1.4;
        const rotate = Math.random() * 360;
        const color = colors[i % colors.length];
        const size = 6 + Math.random() * 6;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "-20px",
              left: `${left}%`,
              width: size,
              height: size * 0.4,
              background: color,
              transform: `rotate(${rotate}deg)`,
              animation: `confettiFall ${duration}s ${delay}s linear forwards`,
              borderRadius: 2,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confettiFall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
