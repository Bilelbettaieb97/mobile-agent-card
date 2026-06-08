import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Eye, MousePointerClick, Save, Smartphone, Globe, MapPin } from "lucide-react";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Statistiques avancées — Dashboard" }] }),
  component: AnalyticsPage,
});

const DAYS = Array.from({ length: 30 }, (_, i) => ({
  d: i,
  scans: Math.floor(20 + Math.sin(i / 3) * 12 + Math.random() * 15),
  saves: Math.floor(8 + Math.sin(i / 3) * 5 + Math.random() * 6),
}));

const HOURS = Array.from({ length: 24 }, (_, h) => ({
  h,
  intensity: h < 7 ? 0.1 : h < 9 ? 0.7 : h < 12 ? 0.95 : h < 14 ? 0.4 : h < 18 ? 0.85 : h < 22 ? 0.5 : 0.15,
}));

const CITIES = [
  { city: "Paris", scans: 142, pct: 38 },
  { city: "Lyon", scans: 67, pct: 18 },
  { city: "Marseille", scans: 52, pct: 14 },
  { city: "Bordeaux", scans: 38, pct: 10 },
  { city: "Toulouse", scans: 31, pct: 8 },
  { city: "Autres", scans: 45, pct: 12 },
];

const SOURCES = [
  { s: "Tap NFC", v: 64, color: "bg-primary" },
  { s: "QR code", v: 22, color: "bg-violet-500" },
  { s: "Lien direct", v: 14, color: "bg-amber-500" },
];

export default function AnalyticsPage() {
  const maxScan = Math.max(...DAYS.map(d => d.scans));

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Vues 30j", v: "1 248", delta: "+24%", icon: Eye },
          { l: "Clics liens", v: "486", delta: "+18%", icon: MousePointerClick },
          { l: "Contacts sauvés", v: "375", delta: "+31%", icon: Save },
          { l: "Taux d'engagement", v: "84%", delta: "+6 pts", icon: TrendingUp },
        ].map(k => (
          <div key={k.l} className="rounded-2xl border border-border bg-card/40 p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-wider">
              <k.icon className="h-3.5 w-3.5" /> {k.l}
            </div>
            <div className="font-display text-2xl mt-1">{k.v}</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">{k.delta} vs période précédente</div>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="rounded-2xl border border-border bg-card/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg">Activité sur 30 jours</h3>
            <p className="text-xs text-muted-foreground">Scans & sauvegardes contact</p>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Scans</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Sauvés</span>
          </div>
        </div>
        <div className="flex items-end gap-1 h-48">
          {DAYS.map(d => (
            <div key={d.d} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full bg-primary/70 rounded-t-sm hover:bg-primary transition" style={{ height: `${(d.scans / maxScan) * 100}%` }} />
              <div className="w-full bg-emerald-500/70 rounded-t-sm" style={{ height: `${(d.saves / maxScan) * 60}%` }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
          <span>il y a 30j</span><span>il y a 15j</span><span>aujourd'hui</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Heatmap */}
        <div className="rounded-2xl border border-border bg-card/40 p-5">
          <h3 className="font-display text-lg mb-1">Heatmap horaire</h3>
          <p className="text-xs text-muted-foreground mb-4">Quand vos contacts scannent</p>
          <div className="grid grid-cols-12 gap-1">
            {HOURS.map(h => (
              <div key={h.h} className="aspect-square rounded-sm" style={{ background: `hsl(var(--primary) / ${h.intensity})` }} title={`${h.h}h`} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
            <span>00h</span><span>12h</span><span>23h</span>
          </div>
          <div className="text-xs text-muted-foreground mt-3">Pic d'activité : <span className="text-foreground font-medium">10h–12h</span></div>
        </div>

        {/* Sources */}
        <div className="rounded-2xl border border-border bg-card/40 p-5">
          <h3 className="font-display text-lg mb-1">Sources de trafic</h3>
          <p className="text-xs text-muted-foreground mb-4">Comment ils vous découvrent</p>
          <div className="space-y-4">
            {SOURCES.map(s => (
              <div key={s.s}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-2">
                    {s.s === "Tap NFC" ? <Smartphone className="h-3.5 w-3.5" /> : s.s === "QR code" ? <Eye className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
                    {s.s}
                  </span>
                  <span className="text-muted-foreground">{s.v}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${s.color}`} style={{ width: `${s.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cities */}
      <div className="rounded-2xl border border-border bg-card/40 p-5">
        <h3 className="font-display text-lg mb-1">Top villes</h3>
        <p className="text-xs text-muted-foreground mb-4">D'où viennent vos visites</p>
        <div className="space-y-3">
          {CITIES.map(c => (
            <div key={c.city} className="flex items-center gap-3">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1"><span>{c.city}</span><span className="text-muted-foreground">{c.scans} scans · {c.pct}%</span></div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary" style={{ width: `${c.pct * 2.6}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
