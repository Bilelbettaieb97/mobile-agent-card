import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  RotateCcw, Eye, X, ExternalLink, Sparkles, GripVertical, Grid3x3, Palette, Rocket,
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import { ShareDialog } from "@/components/card/ShareDialog";
import { useCardStore } from "@/lib/card-store";
import type { CardData, BrickId } from "@/lib/card-types";
import { BuilderWelcome } from "@/components/builder/BuilderWelcome";
import { BuilderCompare } from "@/components/builder/BuilderCompare";
import { BuilderSections } from "@/components/builder/BuilderSections";
import { StepHeader, type StepNum } from "@/components/builder/StepHeader";
import { StepFooter } from "@/components/builder/StepFooter";
import {
  BRICK_META,
  VariantPicker,
  renderBrickBody,
  type BrickProps,
} from "@/components/builder/bricks";
import { buildPreviewFromTheme, type VariantId } from "@/lib/profession-personas";
import { PROFESSIONS } from "@/lib/card-themes";

type Step = "welcome" | "compare" | "essentials" | "extras" | "edit";

const STEP_NUM: Record<Step, StepNum> = {
  welcome: 1, compare: 2, essentials: 3, extras: 4, edit: 5,
};
const NUM_STEP: Record<StepNum, Step> = {
  1: "welcome", 2: "compare", 3: "essentials", 4: "extras", 5: "edit",
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
          advanceTo("compare");
        }}
        onChooseTheme={(themeId) => {
          setData(buildPreviewFromTheme(themeId));
          advanceTo("essentials");
        }}
      />
    );
  }

  if (step === "compare") {
    const profession =
      (data.profession && PROFESSIONS.find((p) => p.id === data.profession)) || undefined;
    if (!profession) {
      setStep("welcome");
      return null;
    }
    return (
      <BuilderCompare
        profession={profession}
        completedThrough={completedThrough}
        onGoToStep={goToStep}
        onBack={() => setStep("welcome")}
        onChoose={(variant, next) => {
          setData(next);
          setPlan(variant);
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
        onBack={() => setStep(data.profession ? "compare" : "welcome")}
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

  // Step 5 — edit
  return (
    <main className="min-h-screen bg-background text-foreground">
      <StepHeader
        step={5}
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
          <Link to="/">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1.5" /> Voir démo
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
        step={5}
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

/* ---------- Brick list (DnD + accordion) ---------- */

function BrickList({ data, update, setData }: {
  data: CardData;
  update: BrickProps["update"];
  setData: (d: CardData) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = data.sectionOrder.indexOf(active.id as BrickId);
    const newIdx = data.sectionOrder.indexOf(over.id as BrickId);
    if (oldIdx < 0 || newIdx < 0) return;
    setData({ ...data, sectionOrder: arrayMove(data.sectionOrder, oldIdx, newIdx) });
  };

  const wrap = (id: BrickId, body: ReactNode): ReactNode => (
    <div className="space-y-4">
      <VariantPicker brick={id} data={data} update={update} />
      {body}
    </div>
  );

  const renderBody = (id: BrickId): ReactNode => {
    const body = renderBrickBody(id, { data, update });
    if (id === "testimonials" || id === "theme") return body;
    return wrap(id, body);
  };

  const enabledOf = (id: BrickId): boolean | undefined => {
    switch (id) {
      case "actions":      return Object.values(data.actions).some(Boolean);
      case "vcard":        return data.vcardEnabled;
      case "stats":        return data.statsEnabled;
      case "about":        return data.aboutEnabled;
      case "video":        return data.videoEnabled;
      case "services":     return data.servicesEnabled;
      case "listings":     return data.listingsEnabled;
      case "testimonials": return data.testimonialsEnabled;
      case "calendar":     return data.calendarEnabled;
      case "languages":    return data.languagesEnabled;
      case "cta":          return data.ctaEnabled;
      case "contact":      return data.contactEnabled;
      case "socials":      return data.socialsEnabled;
      default:             return undefined;
    }
  };

  const toggleOf = (id: BrickId) => (v: boolean) => {
    switch (id) {
      case "actions":      update("actions", { call: v, whatsapp: v, email: v, website: v }); break;
      case "vcard":        update("vcardEnabled", v); break;
      case "stats":        update("statsEnabled", v); break;
      case "about":        update("aboutEnabled", v); break;
      case "video":        update("videoEnabled", v); break;
      case "services":     update("servicesEnabled", v); break;
      case "listings":     update("listingsEnabled", v); break;
      case "testimonials": update("testimonialsEnabled", v); break;
      case "calendar":     update("calendarEnabled", v); break;
      case "languages":    update("languagesEnabled", v); break;
      case "cta":          update("ctaEnabled", v); break;
      case "contact":      update("contactEnabled", v); break;
      case "socials":      update("socialsEnabled", v); break;
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={data.sectionOrder} strategy={verticalListSortingStrategy}>
        <Accordion type="single" collapsible defaultValue={data.sectionOrder[0]} className="space-y-3">
          {data.sectionOrder.map((id) => {
            const meta = BRICK_META[id];
            const alwaysOn = id === "identity" || id === "theme";
            return (
              <SortableBrick
                key={id}
                id={id}
                title={meta.title}
                subtitle={meta.subtitle}
                alwaysOn={alwaysOn}
                enabled={alwaysOn ? undefined : enabledOf(id)}
                onToggle={alwaysOn ? undefined : toggleOf(id)}
              >
                {renderBody(id)}
              </SortableBrick>
            );
          })}
        </Accordion>
      </SortableContext>
    </DndContext>
  );
}

function SortableBrick({
  id, title, subtitle, children, enabled, onToggle, alwaysOn,
}: {
  id: BrickId; title: string; subtitle?: string; children: ReactNode;
  enabled?: boolean; onToggle?: (v: boolean) => void; alwaysOn?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 30 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem value={id} className="border border-border rounded-2xl bg-card overflow-hidden data-[state=open]:shadow-[var(--shadow-elegant)]">
        <div className="flex items-center pr-4">
          <button
            type="button"
            aria-label="Réordonner la brique"
            className="px-2 py-4 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <AccordionTrigger className="flex-1 px-1 py-4 hover:no-underline">
            <div className="text-left">
              <div className="font-medium">{title}</div>
              {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
            </div>
          </AccordionTrigger>
          {alwaysOn ? (
            <span className="text-[10px] uppercase tracking-wider text-primary ml-2">Toujours actif</span>
          ) : (
            <Switch checked={!!enabled} onCheckedChange={onToggle} onClick={(e) => e.stopPropagation()} />
          )}
        </div>
        <AccordionContent className="px-4 pb-5 pt-1">{children}</AccordionContent>
      </AccordionItem>
    </div>
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
