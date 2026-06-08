import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Euro, Target } from "lucide-react";

export const Route = createFileRoute("/dashboard/leads")({
  head: () => ({ meta: [{ title: "Pipeline & Leads — Dashboard" }] }),
  component: LeadsPage,
});

type Lead = { id: string; name: string; company: string; value: number; col: "new" | "contacted" | "qualified" | "won"; ago: string };

const INITIAL: Lead[] = [
  { id: "a", name: "Inès Dupont", company: "Notion", value: 4500, col: "new", ago: "2 min" },
  { id: "b", name: "Marc Rousseau", company: "Freelance", value: 1200, col: "new", ago: "1 h" },
  { id: "c", name: "Sarah Chen", company: "Stripe", value: 12000, col: "contacted", ago: "3 h" },
  { id: "d", name: "Karim Bensalem", company: "Stealth Co", value: 8000, col: "contacted", ago: "5 j" },
  { id: "e", name: "Laura Martinez", company: "Partech", value: 25000, col: "qualified", ago: "1 j" },
  { id: "f", name: "Thomas Bernard", company: "Algolia", value: 6500, col: "won", ago: "1 sem" },
  { id: "g", name: "Yann Le Guen", company: "Aircall", value: 3200, col: "won", ago: "2 sem" },
];

const COLS = [
  { id: "new", label: "Nouveau", color: "text-blue-400 border-blue-500/30" },
  { id: "contacted", label: "Contacté", color: "text-amber-400 border-amber-500/30" },
  { id: "qualified", label: "Qualifié", color: "text-violet-400 border-violet-500/30" },
  { id: "won", label: "Client", color: "text-emerald-400 border-emerald-500/30" },
] as const;

export default function LeadsPage() {
  const [leads, setLeads] = useState(INITIAL);
  const [dragId, setDragId] = useState<string | null>(null);

  const moveTo = (id: string, col: Lead["col"]) => setLeads(prev => prev.map(l => l.id === id ? { ...l, col } : l));

  const total = leads.reduce((s, l) => s + l.value, 0);
  const won = leads.filter(l => l.col === "won").reduce((s, l) => s + l.value, 0);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { l: "Pipeline total", v: `${(total / 1000).toFixed(1)}k €`, icon: TrendingUp },
          { l: "Gagné", v: `${(won / 1000).toFixed(1)}k €`, icon: Euro },
          { l: "Leads actifs", v: leads.filter(l => l.col !== "won").length, icon: Target },
          { l: "Taux de conv.", v: "32%", icon: TrendingUp },
        ].map(s => (
          <div key={s.l} className="rounded-2xl border border-border bg-card/40 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><s.icon className="h-5 w-5" /></div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className="font-display text-xl">{s.v}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">Pipeline commercial</h2>
        <Button><Plus className="h-4 w-4 mr-2" /> Nouveau lead</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLS.map(col => {
          const items = leads.filter(l => l.col === col.id);
          const colTotal = items.reduce((s, l) => s + l.value, 0);
          return (
            <div
              key={col.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragId) { moveTo(dragId, col.id); setDragId(null); } }}
              className={`rounded-2xl border ${col.color} bg-card/30 p-3 min-h-[400px]`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className={`text-xs uppercase tracking-wider font-medium ${col.color.split(" ")[0]}`}>{col.label} · {items.length}</div>
                <div className="text-[10px] text-muted-foreground">{(colTotal / 1000).toFixed(1)}k €</div>
              </div>
              <div className="space-y-2">
                {items.map(l => (
                  <div
                    key={l.id}
                    draggable
                    onDragStart={() => setDragId(l.id)}
                    className="rounded-xl border border-border bg-background p-3 cursor-grab active:cursor-grabbing hover:border-primary/40 transition"
                  >
                    <div className="text-sm font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.company}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-semibold text-primary">{l.value.toLocaleString("fr-FR")} €</span>
                      <span className="text-[10px] text-muted-foreground">{l.ago}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="text-[11px] text-muted-foreground text-center py-8 border border-dashed border-border rounded-xl">Glissez ici</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
