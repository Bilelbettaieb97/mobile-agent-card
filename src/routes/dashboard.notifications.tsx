import { createFileRoute } from "@tanstack/react-router";
import { Switch } from "@/components/ui/switch";
import { Eye, UserPlus, Star, Truck, Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Dashboard" }] }),
  component: NotificationsPage,
});

const FEED = [
  { id: "1", icon: Eye, color: "text-blue-400 bg-blue-500/10", title: "Inès Dupont a scanné votre carte", sub: "Paris · à l'instant", unread: true },
  { id: "2", icon: UserPlus, color: "text-emerald-400 bg-emerald-500/10", title: "Marc Rousseau a sauvegardé vos coordonnées", sub: "Marseille · il y a 12 min", unread: true },
  { id: "3", icon: Star, color: "text-amber-400 bg-amber-500/10", title: "Sarah Chen vient de cliquer sur Calendly", sub: "Lyon · il y a 1 h", unread: true },
  { id: "4", icon: Truck, color: "text-violet-400 bg-violet-500/10", title: "Votre commande #MC-2026-0421 est expédiée", sub: "il y a 3 h" },
  { id: "5", icon: Eye, color: "text-blue-400 bg-blue-500/10", title: "5 nouveaux scans aujourd'hui", sub: "il y a 5 h" },
  { id: "6", icon: UserPlus, color: "text-emerald-400 bg-emerald-500/10", title: "Thomas Bernard a ajouté un commentaire", sub: "hier" },
];

const PREFS = [
  { id: "scan", label: "Nouveau scan de carte", email: true, push: true },
  { id: "save", label: "Contact sauvegardé", email: true, push: true },
  { id: "click", label: "Clic sur un lien (Calendly, site...)", email: false, push: true },
  { id: "order", label: "Mise à jour commande", email: true, push: false },
  { id: "team", label: "Activité équipe", email: false, push: false },
  { id: "tips", label: "Conseils & nouveautés produit", email: true, push: false },
];

export default function NotificationsPage() {
  return (
    <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-xl flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</h2>
          <Button variant="ghost" size="sm"><CheckCheck className="h-3.5 w-3.5 mr-2" /> Tout marquer comme lu</Button>
        </div>
        <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
          {FEED.map(n => (
            <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-border/50 last:border-b-0 ${n.unread ? "bg-primary/5" : ""}`}>
              <div className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${n.color}`}><n.icon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.sub}</div>
              </div>
              {n.unread && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg">Préférences</h3>
        <div className="rounded-2xl border border-border bg-card/40 divide-y divide-border">
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Événement</span><span>Email</span><span>Push</span>
          </div>
          {PREFS.map(p => (
            <div key={p.id} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center px-4 py-3">
              <span className="text-sm">{p.label}</span>
              <Switch defaultChecked={p.email} />
              <Switch defaultChecked={p.push} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
