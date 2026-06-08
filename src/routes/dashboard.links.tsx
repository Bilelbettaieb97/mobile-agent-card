import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Linkedin, Instagram, Globe, Calendar, MessageCircle, Mail, Github, Youtube, Twitter, Plus, GripVertical, Trash2, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/dashboard/links")({
  head: () => ({ meta: [{ title: "Liens & Réseaux — Dashboard" }] }),
  component: LinksPage,
});

type LinkItem = { id: string; type: string; label: string; url: string; icon: typeof Globe; on: boolean; clicks: number };

const INITIAL: LinkItem[] = [
  { id: "1", type: "LinkedIn", label: "Mon profil pro", url: "linkedin.com/in/vous", icon: Linkedin, on: true, clicks: 142 },
  { id: "2", type: "Calendly", label: "Réserver un call", url: "calendly.com/vous/30min", icon: Calendar, on: true, clicks: 67 },
  { id: "3", type: "Site web", label: "Mon portfolio", url: "vous.com", icon: Globe, on: true, clicks: 89 },
  { id: "4", type: "WhatsApp", label: "Message direct", url: "wa.me/33612345678", icon: MessageCircle, on: true, clicks: 34 },
  { id: "5", type: "Instagram", label: "Mon Insta perso", url: "instagram.com/vous", icon: Instagram, on: false, clicks: 12 },
  { id: "6", type: "Email", label: "Me contacter", url: "vous@mail.com", icon: Mail, on: true, clicks: 56 },
];

const TYPES = [
  { t: "LinkedIn", icon: Linkedin }, { t: "Instagram", icon: Instagram }, { t: "Twitter/X", icon: Twitter },
  { t: "Calendly", icon: Calendar }, { t: "WhatsApp", icon: MessageCircle }, { t: "Site web", icon: Globe },
  { t: "GitHub", icon: Github }, { t: "YouTube", icon: Youtube }, { t: "Email", icon: Mail },
];

export default function LinksPage() {
  const [links, setLinks] = useState(INITIAL);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const toggle = (id: string) => setLinks(prev => prev.map(l => l.id === id ? { ...l, on: !l.on } : l));
  const remove = (id: string) => setLinks(prev => prev.filter(l => l.id !== id));

  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const next = [...links];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setLinks(next);
    setDragIdx(i);
  };

  return (
    <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-display text-xl">Mes liens</h2>
            <p className="text-xs text-muted-foreground">Glissez pour réordonner · Toggle pour activer/désactiver</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> Ajouter</Button>
        </div>
        <div className="space-y-2">
          {links.map((l, i) => (
            <div
              key={l.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              className={`flex items-center gap-3 p-3 rounded-xl border border-border bg-card/40 ${l.on ? "" : "opacity-50"}`}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><l.icon className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{l.type} · {l.label}</div>
                <div className="text-xs text-muted-foreground truncate">{l.url}</div>
              </div>
              <div className="text-xs text-muted-foreground hidden md:block">{l.clicks} clics</div>
              <Switch checked={l.on} onCheckedChange={() => toggle(l.id)} />
              <Button variant="ghost" size="icon" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-lg">Ajouter rapidement</h3>
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map(t => (
            <button key={t.t} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition text-xs">
              <t.icon className="h-5 w-5 text-primary" />
              <span>{t.t}</span>
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="text-xs uppercase tracking-wider text-primary mb-1">Aperçu live</div>
          <p className="text-xs text-muted-foreground">Modifications visibles instantanément sur votre carte publique.</p>
          <Button variant="outline" size="sm" className="mt-3 w-full"><ExternalLink className="h-3.5 w-3.5 mr-2" /> Voir ma carte</Button>
        </div>
      </div>
    </div>
  );
}
