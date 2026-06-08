import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Plus, Mail, Phone, MapPin, Tag, Filter, Star } from "lucide-react";

export const Route = createFileRoute("/dashboard/contacts")({
  head: () => ({ meta: [{ title: "Contacts — Dashboard" }] }),
  component: ContactsPage,
});

type Contact = {
  id: string; name: string; role: string; company: string; email: string;
  phone?: string; city: string; tags: string[]; saved: string; starred?: boolean;
};

const MOCK: Contact[] = [
  { id: "1", name: "Inès Dupont", role: "Head of Sales", company: "Notion", email: "ines@notion.so", phone: "+33 6 12 34 56 78", city: "Paris", tags: ["lead", "saas"], saved: "il y a 2 min", starred: true },
  { id: "2", name: "Marc Rousseau", role: "Designer Freelance", company: "—", email: "marc.r@gmail.com", city: "Marseille", tags: ["design"], saved: "il y a 1 h" },
  { id: "3", name: "Sarah Chen", role: "Product Manager", company: "Stripe", email: "sarah@stripe.com", phone: "+33 7 88 99 00 11", city: "Lyon", tags: ["lead", "fintech", "vip"], saved: "il y a 3 h", starred: true },
  { id: "4", name: "Thomas Bernard", role: "CTO", company: "Algolia", email: "tom@algolia.com", city: "Bordeaux", tags: ["tech"], saved: "hier" },
  { id: "5", name: "Laura Martinez", role: "Investisseuse", company: "Partech", email: "laura@partech.com", phone: "+33 6 55 44 33 22", city: "Paris", tags: ["vc", "vip"], saved: "hier", starred: true },
  { id: "6", name: "Yann Le Guen", role: "Growth Lead", company: "Aircall", email: "yann@aircall.io", city: "Nantes", tags: ["lead"], saved: "il y a 2j" },
  { id: "7", name: "Amélie Dubois", role: "Recruteuse Tech", company: "Doctolib", email: "amelie@doctolib.fr", city: "Paris", tags: ["rh"], saved: "il y a 3j" },
  { id: "8", name: "Karim Bensalem", role: "Founder", company: "Stealth", email: "karim@founders.com", phone: "+33 6 11 22 33 44", city: "Toulouse", tags: ["lead", "founder"], saved: "il y a 5j", starred: true },
];

export default function ContactsPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const allTags = useMemo(() => Array.from(new Set(MOCK.flatMap(c => c.tags))), []);
  const filtered = useMemo(() => MOCK.filter(c =>
    (!tag || c.tags.includes(tag)) &&
    (q === "" || `${c.name} ${c.company} ${c.email} ${c.city}`.toLowerCase().includes(q.toLowerCase()))
  ), [q, tag]);

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Contacts totaux", v: MOCK.length, sub: "+12 cette semaine" },
          { l: "Leads chauds", v: MOCK.filter(c => c.tags.includes("lead")).length, sub: "À relancer" },
          { l: "VIP", v: MOCK.filter(c => c.starred).length, sub: "Étoilés" },
          { l: "Taux de sauvegarde", v: "84%", sub: "vs 11% papier" },
        ].map(s => (
          <div key={s.l} className="rounded-2xl border border-border bg-card/40 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="font-display text-2xl mt-1">{s.v}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher par nom, société, ville..." className="pl-10 h-11" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11"><Filter className="h-4 w-4 mr-2" /> Filtrer</Button>
          <Button variant="outline" className="h-11"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
          <Button className="h-11"><Plus className="h-4 w-4 mr-2" /> Ajouter</Button>
        </div>
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTag(null)} className={`text-xs px-3 py-1.5 rounded-full border transition ${!tag ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/30"}`}>Tous</button>
        {allTags.map(t => (
          <button key={t} onClick={() => setTag(t)} className={`text-xs px-3 py-1.5 rounded-full border transition ${tag === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/30"}`}>
            <Tag className="h-3 w-3 mr-1.5 inline" />{t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 text-[10px] uppercase tracking-wider text-muted-foreground px-5 py-3 border-b border-border">
          <div className="col-span-4">Contact</div>
          <div className="col-span-3">Société</div>
          <div className="col-span-3">Coordonnées</div>
          <div className="col-span-2 text-right">Sauvegardé</div>
        </div>
        {filtered.map(c => (
          <div key={c.id} className="grid grid-cols-12 items-center px-5 py-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition">
            <div className="col-span-12 md:col-span-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 grid place-items-center text-sm font-semibold shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm flex items-center gap-1.5">
                  {c.name}
                  {c.starred && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                </div>
                <div className="text-xs text-muted-foreground truncate">{c.role}</div>
              </div>
            </div>
            <div className="col-span-6 md:col-span-3 text-sm">
              <div>{c.company}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.city}</div>
            </div>
            <div className="col-span-6 md:col-span-3 text-xs space-y-0.5">
              <div className="flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3 w-3" /> {c.email}</div>
              {c.phone && <div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3 w-3" /> {c.phone}</div>}
            </div>
            <div className="col-span-12 md:col-span-2 flex md:justify-end gap-2 mt-2 md:mt-0">
              <span className="text-[11px] text-muted-foreground">{c.saved}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">Aucun contact ne correspond à votre recherche.</div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {filtered.flatMap(c => c.tags).slice(0, 0)}
        {Array.from(new Set(filtered.slice(0, 3).map(c => c.tags[0]))).map(t => (
          <Badge key={t} variant="secondary">{t}</Badge>
        ))}
      </div>
    </div>
  );
}
