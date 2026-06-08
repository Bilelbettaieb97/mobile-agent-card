import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle2, FileText, Repeat } from "lucide-react";

export const Route = createFileRoute("/dashboard/orders")({
  head: () => ({ meta: [{ title: "Commandes — Dashboard" }] }),
  component: OrdersPage,
});

type Order = { id: string; date: string; model: string; qty: number; total: number; status: "preparing" | "shipped" | "delivered"; tracking?: string };

const ORDERS: Order[] = [
  { id: "MC-2026-0421", date: "5 juin 2026", model: "Aurum", qty: 1, total: 59, status: "shipped", tracking: "FR8847123456" },
  { id: "MC-2026-0398", date: "12 mai 2026", model: "Onyx", qty: 3, total: 75, status: "delivered" },
  { id: "MC-2026-0341", date: "8 avril 2026", model: "Carbone", qty: 1, total: 79, status: "delivered" },
  { id: "MC-2026-0298", date: "20 mars 2026", model: "Aurum", qty: 5, total: 250, status: "delivered" },
];

const STATUS = {
  preparing: { l: "En préparation", color: "border-amber-500/40 bg-amber-500/10 text-amber-400", icon: Package },
  shipped: { l: "Expédié", color: "border-blue-500/40 bg-blue-500/10 text-blue-400", icon: Truck },
  delivered: { l: "Livré", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400", icon: CheckCircle2 },
};

export default function OrdersPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: "Commandes totales", v: ORDERS.length },
          { l: "Cartes possédées", v: ORDERS.reduce((s, o) => s + o.qty, 0) },
          { l: "Dépensé à vie", v: `${ORDERS.reduce((s, o) => s + o.total, 0)} €` },
        ].map(s => (
          <div key={s.l} className="rounded-2xl border border-border bg-card/40 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="font-display text-2xl mt-1">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex justify-between items-center">
          <h3 className="font-display">Historique</h3>
          <Button size="sm"><Repeat className="h-3.5 w-3.5 mr-2" /> Re-commander</Button>
        </div>
        {ORDERS.map(o => {
          const st = STATUS[o.status];
          return (
            <div key={o.id} className="px-5 py-4 border-b border-border/50 last:border-b-0">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="text-sm font-medium">{o.id}</div>
                  <div className="text-xs text-muted-foreground">{o.date} · {o.qty} × {o.model}</div>
                </div>
                <div className="font-display text-lg">{o.total} €</div>
                <Badge variant="outline" className={`${st.color} text-[10px] gap-1`}>
                  <st.icon className="h-3 w-3" /> {st.l}
                </Badge>
                <div className="flex gap-2">
                  {o.tracking && <Button variant="outline" size="sm"><Truck className="h-3.5 w-3.5 mr-1.5" /> Suivi</Button>}
                  <Button variant="ghost" size="sm"><FileText className="h-3.5 w-3.5 mr-1.5" /> Facture</Button>
                </div>
              </div>
              {o.status === "shipped" && o.tracking && (
                <div className="mt-3 text-xs text-muted-foreground">Colissimo · n° {o.tracking} · Livraison estimée demain</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
