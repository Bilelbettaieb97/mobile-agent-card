import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, MoreHorizontal, Crown, Users, Building2, CreditCard } from "lucide-react";

export const Route = createFileRoute("/dashboard/team")({
  head: () => ({ meta: [{ title: "Équipe — Dashboard" }] }),
  component: TeamPage,
});

const MEMBERS = [
  { id: "1", name: "Alex Martin (vous)", email: "alex@studio.fr", role: "Admin", cards: 1, status: "Actif" },
  { id: "2", name: "Camille Dubois", email: "camille@studio.fr", role: "Membre", cards: 1, status: "Actif" },
  { id: "3", name: "Marc Lopez", email: "marc@studio.fr", role: "Membre", cards: 1, status: "Actif" },
  { id: "4", name: "Julie Bernard", email: "julie@studio.fr", role: "Invité", cards: 0, status: "Invitation envoyée" },
];

export default function TeamPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { l: "Membres", v: MEMBERS.length, sub: "1 admin · 3 membres", icon: Users },
          { l: "Cartes synchronisées", v: MEMBERS.reduce((s, m) => s + m.cards, 0), sub: "Branding équipe", icon: CreditCard },
          { l: "Plan", v: "Business", sub: "Jusqu'à 25 membres", icon: Building2 },
        ].map(s => (
          <div key={s.l} className="rounded-2xl border border-border bg-card/40 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><s.icon className="h-5 w-5" /></div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className="font-display text-xl">{s.v}</div>
              <div className="text-[11px] text-muted-foreground">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5">
        <h3 className="font-display text-lg mb-2">Inviter un membre</h3>
        <p className="text-xs text-muted-foreground mb-4">Il recevra un email avec un lien d'inscription et sa carte sera commandée automatiquement.</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="email@société.fr" className="pl-10 h-11" />
          </div>
          <Button className="h-11">Envoyer l'invitation</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-display">Membres ({MEMBERS.length})</h3>
          <Button variant="outline" size="sm">Gérer les permissions</Button>
        </div>
        {MEMBERS.map(m => (
          <div key={m.id} className="flex items-center gap-4 px-5 py-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 grid place-items-center text-sm font-semibold">{m.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium flex items-center gap-2">{m.name}{m.role === "Admin" && <Crown className="h-3 w-3 text-amber-400" />}</div>
              <div className="text-xs text-muted-foreground">{m.email}</div>
            </div>
            <Badge variant="outline" className="text-[10px]">{m.role}</Badge>
            <div className="text-xs text-muted-foreground hidden md:block w-32">{m.status}</div>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
