import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, MousePointerClick, Smartphone, QrCode, ArrowRight, Sparkles, CheckCircle2, Circle, TrendingUp, Zap, CreditCard, Palette, Share2 } from "lucide-react";
import { useCardStore } from "@/lib/card-store";
import { getCompletion } from "@/lib/card-completion";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { UpsellSection } from "@/components/dashboard/UpsellSection";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { data, hydrated } = useCardStore();

  if (!hydrated) {
    return <div className="p-8"><SkeletonGrid /></div>;
  }

  const { score, items, missing } = getCompletion(data);
  const firstName = data.name?.split(" ")[0] || "vous";

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8 space-y-8">
      {/* Greeting */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-primary flex items-center gap-1.5 mb-1.5">
            <Sparkles className="h-3 w-3" /> Tableau de bord
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight">
            Bonjour, {firstName} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Voici la santé de votre carte digitale aujourd'hui.
          </p>
        </div>
        <Link to="/dashboard/card">
          <Button className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-[0_4px_20px_-4px] shadow-primary/40">
            Ouvrir ma carte <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </header>

      {/* KPIs */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard icon={Eye} label="Vues · 7 j." value="—" hint="Disponible après publication" spark={[3,5,4,7,6,9,8]} delta={12} />
          <MetricCard icon={MousePointerClick} label="Clics · 7 j." value="—" hint="Sur vos boutons d'action" spark={[2,4,3,5,4,6,7]} delta={8} />
          <MetricCard icon={Smartphone} label="vCard ajoutées" value="—" hint="Contacts enregistrés" spark={[1,2,2,3,4,3,5]} delta={24} />
          <MetricCard icon={QrCode} label="Scans QR" value="—" hint="Détection physique" spark={[0,1,3,2,4,5,4]} delta={-3} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Completion — main column */}
        <section className="lg:col-span-2 rounded-2xl border border-border bg-gradient-to-br from-card to-card/30 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="font-display text-xl">Santé de ma carte</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Plus votre carte est complète, plus elle convertit.</p>
            </div>
            <div className="text-right">
              <div className="font-display text-4xl text-primary leading-none">{score}<span className="text-xl text-muted-foreground">%</span></div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Complétion</div>
            </div>
          </div>
          <Progress value={score} className="h-2 mb-5" />
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
            {items.map((it) => (
              <li key={it.id} className="flex items-start gap-2 text-sm">
                {it.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <span className={it.done ? "text-foreground/70 line-through decoration-foreground/20" : "text-foreground"}>
                  {it.label}
                </span>
              </li>
            ))}
          </ul>
          {missing.length > 0 && missing[0].hint && (
            <div className="mt-5 p-3 rounded-xl border border-primary/30 bg-primary/5 flex items-start gap-2.5">
              <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-medium text-primary">Suggestion :</span>{" "}
                <span className="text-foreground/85">{missing[0].hint}</span>
              </div>
            </div>
          )}
        </section>

        {/* Side: quick actions */}
        <section className="space-y-3">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card/30 p-5">
            <h3 className="font-display text-lg mb-1">Actions rapides</h3>
            <p className="text-xs text-muted-foreground mb-4">Les opérations les plus courantes.</p>
            <div className="space-y-2">
              <QuickAction to="/dashboard/card" icon={CreditCard} label="Ouvrir ma carte" hint="Aperçu, QR, partage" />
              <QuickAction to="/dashboard/card" icon={Palette} label="Changer l'apparence" hint="Thème & variantes (onglet Apparence)" />
              <QuickAction to="/dashboard/share" icon={Share2} label="Voir les stats" hint="Engagement détaillé" />
              <QuickAction to="/dashboard/account" icon={TrendingUp} label="Passer à Vitrine" hint="Débloquer tout" highlight />
            </div>
          </div>

          {/* Recent activity (empty state premium) */}
          <div className="rounded-2xl border border-border bg-card/30 p-5">
            <h3 className="font-display text-sm mb-3 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Activité récente
            </h3>
            <div className="text-center py-6 text-muted-foreground">
              <div className="h-10 w-10 mx-auto rounded-full bg-muted/50 grid place-items-center mb-2">
                <Eye className="h-4 w-4 opacity-50" />
              </div>
              <p className="text-xs leading-relaxed">
                Aucune activité.<br />
                <span className="text-[11px] opacity-70">Les scans et vues apparaîtront ici.</span>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Premium upsells — compact */}
      <section className="pt-2">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h3 className="font-display text-xl">Allez plus loin</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Boostez votre carte avec ces add-ons premium.</p>
          </div>
          <Link to="/pricing" className="text-xs text-primary hover:underline">Tout voir →</Link>
        </div>
        <UpsellSection variant="compact" />
      </section>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, hint, highlight }: { to: string; icon: any; label: string; hint: string; highlight?: boolean }) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition hover:-translate-y-0.5 ${
        highlight
          ? "border-primary/40 bg-gradient-to-r from-primary/10 to-transparent hover:border-primary/60"
          : "border-border bg-card/40 hover:border-primary/40 hover:bg-card"
      }`}
    >
      <span className={`h-9 w-9 grid place-items-center rounded-lg shrink-0 ${highlight ? "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground" : "bg-muted text-foreground/80"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{label}</div>
        <div className="text-[11px] text-muted-foreground truncate">{hint}</div>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded-md bg-muted/40" />
      <div className="grid grid-cols-4 gap-3">
        {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl bg-muted/30" />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 h-80 rounded-2xl bg-muted/30" />
        <div className="h-80 rounded-2xl bg-muted/30" />
      </div>
    </div>
  );
}
