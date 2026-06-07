import { useEffect, useMemo, useState } from "react";
import { Search, Check, Sparkles, SkipForward } from "lucide-react";
import { StepHeader, type StepNum } from "@/components/builder/StepHeader";
import { StepFooter } from "@/components/builder/StepFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/card/BusinessCard";
import { PhoneFrame } from "@/components/card/PhoneFrame";
import {
  CARD_THEMES,
  PROFESSIONS,
  PROFESSION_CATEGORIES,
  PROFESSIONS_BY_THEME,
  THEMES_BY_ID,
  type Profession,
} from "@/lib/card-themes";
import { buildPreviewCard, buildPreviewFromTheme } from "@/lib/profession-personas";
import type { CardData } from "@/lib/card-types";

interface Props {
  initialProfessionId?: string;
  initialAccent?: CardData["accent"];
  completedThrough: StepNum;
  onGoToStep: (n: StepNum) => void;
  /** Profession sélectionnée → étape "compare" (vue 3 mises en page). */
  onChooseProfession: (profession: Profession) => void;
  /** Thème seul (sans persona) ou "Passer" → étape "essentials" directe. */
  onChooseTheme: (themeId: string) => void;
}

export function BuilderWelcome({
  initialProfessionId,
  initialAccent,
  completedThrough,
  onGoToStep,
  onChooseProfession,
  onChooseTheme,
}: Props) {
  const [tab, setTab] = useState<"profession" | "theme">("profession");
  const [query, setQuery] = useState("");
  const [selectedProfession, setSelectedProfession] = useState<Profession | undefined>(
    () => PROFESSIONS.find((p) => p.id === initialProfessionId),
  );
  const [selectedThemeId, setSelectedThemeId] = useState<string>(
    () =>
      (initialProfessionId
        ? (PROFESSIONS.find((p) => p.id === initialProfessionId)?.themeId ?? initialAccent)
        : initialAccent) ?? "gold",
  );

  const activeTheme = THEMES_BY_ID[selectedThemeId] ?? THEMES_BY_ID.gold;

  const previewData = useMemo<CardData>(() => {
    if (selectedProfession) return buildPreviewCard(selectedProfession, "vitrine");
    return buildPreviewFromTheme(selectedThemeId);
  }, [selectedProfession, selectedThemeId]);

  useEffect(() => {
    if (!selectedProfession) return;
    const img = new Image();
    img.src = previewData.photo;
  }, [selectedProfession, previewData.photo]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? PROFESSIONS.filter((p) => p.label.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    : PROFESSIONS;
  const grouped = PROFESSION_CATEGORIES.map((cat) => ({
    cat,
    items: filtered.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  const handleChoose = () => {
    if (selectedProfession) onChooseProfession(selectedProfession);
    else onChooseTheme(selectedThemeId);
  };

  const handleSkip = () => onChooseTheme(selectedThemeId);

  const nextLabel = selectedProfession ? `Choisir « ${selectedProfession.label} »` : `Continuer avec ${activeTheme.label}`;
  const centerInfo = selectedProfession ? selectedProfession.label : `Thème ${activeTheme.label}`;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <StepHeader
        step={1}
        title="Choisissez votre métier"
        subtitle="Votre carte sera pré-remplie avec un modèle adapté. Vous pourrez tout modifier juste après."
        completedThrough={completedThrough}
        onGoToStep={onGoToStep}
        nextHint="Après cette étape : choisir un modèle de mise en page."
      />

      <div className="mx-auto w-full max-w-7xl px-5 pb-8 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 flex-1 min-h-0">
        {/* LEFT — picker */}
        <section className="flex flex-col min-h-0">


          {/* Tabs */}
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs mb-4 self-start">
            <button
              type="button"
              onClick={() => setTab("profession")}
              className={`px-4 py-2 rounded-md transition ${tab === "profession" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              Par métier
            </button>
            <button
              type="button"
              onClick={() => setTab("theme")}
              className={`px-4 py-2 rounded-md transition ${tab === "theme" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"}`}
            >
              Par thème
            </button>
          </div>


          {tab === "profession" ? (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un métier…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-5">
                {grouped.map(({ cat, items }) => (
                  <div key={cat}>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{cat}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {items.map((p) => {
                        const theme = THEMES_BY_ID[p.themeId];
                        const active = selectedProfession?.id === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedProfession(p);
                              setSelectedThemeId(p.themeId);
                            }}
                            className={`relative flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition ${
                              active
                                ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2 ring-offset-background"
                                : "border-border hover:border-foreground/30"
                            }`}
                          >
                            <span
                              className="h-8 w-8 rounded-md shrink-0 border relative overflow-hidden"
                              style={{ background: theme.palette.bg, borderColor: theme.palette.border }}
                              aria-hidden
                            >
                              <span className="absolute inset-1 rounded-sm" style={{ background: theme.palette.surface }} />
                              <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full" style={{ background: theme.palette.gradient }} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium truncate">{p.label}</span>
                              <span className="block text-[10px] text-muted-foreground truncate">Thème {theme.label}</span>
                            </span>
                            {active && <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {grouped.length === 0 && (
                  <div className="text-sm text-muted-foreground py-8 text-center">Aucun métier ne correspond.</div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2">
                {CARD_THEMES.map((t) => {
                  const active = selectedThemeId === t.id && !selectedProfession;
                  const p = t.palette;
                  const suggested = PROFESSIONS_BY_THEME[t.id] ?? [];
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedProfession(undefined);
                        setSelectedThemeId(t.id);
                      }}
                      className={`relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                        active
                          ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <span
                        className="h-10 w-10 rounded-lg shrink-0 border overflow-hidden relative"
                        style={{ background: p.bg, borderColor: p.border }}
                        aria-hidden
                      >
                        <span className="absolute inset-1.5 rounded-md" style={{ background: p.surface }} />
                        <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full" style={{ background: p.gradient }} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium truncate">{t.label}</span>
                        <span className="block text-[10px] text-muted-foreground truncate">
                          {suggested.slice(0, 2).map((s) => s.label).join(", ") || t.sector}
                        </span>
                      </span>
                      {active && <Check className="h-4 w-4 text-primary shrink-0" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom CTA — pleine largeur, très visible */}
          <div className="mt-6 pt-4 border-t border-border space-y-3">
            <Button
              size="lg"
              onClick={handleChoose}
              className="w-full h-12 text-base shadow-[var(--shadow-glow)]"
            >
              {selectedProfession ? `Choisir « ${selectedProfession.label} »` : `Continuer avec ${activeTheme.label}`}
              <ArrowRight className="h-5 w-5 ml-1.5" />
            </Button>
            <button
              type="button"
              onClick={handleSkip}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition flex items-center justify-center gap-1.5"
            >
              <SkipForward className="h-3.5 w-3.5" /> Passer cette étape
            </button>
          </div>

        </section>

        {/* RIGHT — live preview */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 self-start flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-[0.18em] text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Aperçu live
              </p>
              <span className="text-[10px] text-muted-foreground">
                {selectedProfession ? "Variante Vitrine — tout le potentiel" : "Met à jour à chaque sélection"}
              </span>
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-40 transition-all duration-500"
                style={{ background: activeTheme.palette.gradient }}
                aria-hidden
              />
              <div className="transition-opacity duration-300">
                <PhoneFrame>
                  <BusinessCard data={previewData} />
                </PhoneFrame>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
