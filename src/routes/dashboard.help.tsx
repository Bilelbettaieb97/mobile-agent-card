import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, MessageCircle, Play, Search, CheckCircle2, Circle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/help")({
  head: () => ({ meta: [{ title: "Aide & Onboarding — Dashboard" }] }),
  component: HelpPage,
});

const STEPS = [
  { done: true, label: "Créer votre compte", desc: "Bienvenue chez Ma carte" },
  { done: true, label: "Compléter votre profil", desc: "Nom, photo, bio, liens" },
  { done: true, label: "Choisir un thème", desc: "Personnalisez l'apparence" },
  { done: false, label: "Commander votre carte NFC", desc: "À partir de 29 €", to: "/carte-nfc" },
  { done: false, label: "Activer le tap NFC", desc: "Test sur smartphone" },
  { done: false, label: "Partager votre carte", desc: "Premier contact sauvegardé" },
];

const ARTICLES = [
  { t: "Comment fonctionne la carte NFC ?", c: "Démarrage", time: "3 min" },
  { t: "Personnaliser le design de mon profil", c: "Design", time: "5 min" },
  { t: "Comprendre mes statistiques", c: "Analytics", time: "4 min" },
  { t: "Synchroniser avec HubSpot", c: "Intégrations", time: "6 min" },
  { t: "Inviter mon équipe", c: "Équipe", time: "2 min" },
  { t: "Modifier mes infos sans recommander", c: "Carte NFC", time: "1 min" },
];

export default function HelpPage() {
  const progress = STEPS.filter(s => s.done).length;
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Onboarding */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-display text-xl mb-1">Activez votre carte</h2>
            <p className="text-sm text-muted-foreground">{progress} / {STEPS.length} étapes complétées</p>
          </div>
          <div className="font-display text-3xl text-primary">{Math.round((progress / STEPS.length) * 100)}%</div>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mb-5">
          <div className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all" style={{ width: `${(progress / STEPS.length) * 100}%` }} />
        </div>
        <div className="space-y-2">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${s.done ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-background/40"}`}>
              {s.done ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${s.done ? "line-through text-muted-foreground" : "font-medium"}`}>{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              {!s.done && s.to && (
                <Link to={s.to}><Button size="sm" variant="ghost">Faire <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button></Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search articles */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher dans l'aide..." className="pl-10 h-12" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-display text-lg flex items-center gap-2"><BookOpen className="h-4 w-4" /> Articles populaires</h3>
          {ARTICLES.map(a => (
            <div key={a.t} className="rounded-xl border border-border bg-card/40 p-4 hover:border-primary/40 transition cursor-pointer">
              <div className="text-sm font-medium">{a.t}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{a.c} · {a.time} de lecture</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <Play className="h-8 w-8 text-primary mb-3" />
            <h4 className="font-display text-lg mb-1">Tutoriels vidéo</h4>
            <p className="text-xs text-muted-foreground mb-4">12 vidéos pour maîtriser Ma carte en 30 min</p>
            <Button variant="outline" size="sm" className="w-full">Voir les vidéos</Button>
          </div>
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <MessageCircle className="h-8 w-8 text-primary mb-3" />
            <h4 className="font-display text-lg mb-1">Contacter le support</h4>
            <p className="text-xs text-muted-foreground mb-4">Réponse en moins de 2 h ouvrées</p>
            <Button size="sm" className="w-full">Ouvrir un ticket</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
