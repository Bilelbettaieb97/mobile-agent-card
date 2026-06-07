import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  delta?: number;
  spark?: number[];
  hint?: string;
  accent?: string;
}

export function MetricCard({ icon: Icon, label, value, delta, spark, hint, accent = "primary" }: Props) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-card/40 p-4 transition hover:border-primary/40 hover:-translate-y-0.5">
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-${accent}/10 blur-2xl opacity-60 group-hover:opacity-100 transition`} aria-hidden />
      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`h-7 w-7 grid place-items-center rounded-md bg-${accent}/15 text-${accent}`}>
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
        {typeof delta === "number" && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${positive ? "text-emerald-400" : "text-rose-400"}`}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="relative flex items-end justify-between gap-3">
        <div>
          <div className="font-display text-3xl leading-none">{value}</div>
          {hint && <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>}
        </div>
        {spark && spark.length > 1 && <Sparkline points={spark} positive={positive} />}
      </div>
    </div>
  );
}

function Sparkline({ points, positive }: { points: number[]; positive: boolean }) {
  const w = 70, h = 28;
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - ((p - min) / range) * h}`).join(" ");
  const color = positive ? "rgb(52 211 153)" : "rgb(244 114 132)";
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#sg)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
