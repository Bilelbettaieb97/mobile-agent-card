import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/integrations")({
  head: () => ({ meta: [{ title: "Intégrations — Dashboard" }] }),
  component: IntegrationsPage,
});

const INT = [
  { id: "hubspot", name: "HubSpot", desc: "Sync auto contacts vers votre CRM", logo: "🟧", connected: true, cat: "CRM" },
  { id: "salesforce", name: "Salesforce", desc: "Création de leads en temps réel", logo: "☁️", connected: false, cat: "CRM" },
  { id: "google", name: "Google Contacts", desc: "Sauvegarde directe dans vos contacts", logo: "🟦", connected: true, cat: "Productivité" },
  { id: "zapier", name: "Zapier", desc: "5000+ apps automatisables", logo: "⚡", connected: false, cat: "Automatisation" },
  { id: "mailchimp", name: "Mailchimp", desc: "Ajout auto à vos campagnes email", logo: "🐵", connected: false, cat: "Marketing" },
  { id: "calendly", name: "Calendly", desc: "Réservation de RDV intégrée", logo: "📅", connected: true, cat: "Productivité" },
  { id: "slack", name: "Slack", desc: "Notifications dans votre canal", logo: "💬", connected: false, cat: "Communication" },
  { id: "notion", name: "Notion", desc: "Base de contacts collaborative", logo: "📝", connected: false, cat: "Productivité" },
  { id: "webhook", name: "Webhooks", desc: "Branchez votre propre backend", logo: "🔗", connected: false, cat: "Développeur" },
];

export default function IntegrationsPage() {
  const cats = Array.from(new Set(INT.map(i => i.cat)));
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5">
        <h2 className="font-display text-xl mb-1">Connectez vos outils</h2>
        <p className="text-sm text-muted-foreground">Chaque scan déclenche automatiquement vos workflows. Zéro saisie manuelle.</p>
      </div>

      {cats.map(c => (
        <div key={c} className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground">{c}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {INT.filter(i => i.cat === c).map(i => (
              <div key={i.id} className="rounded-2xl border border-border bg-card/40 p-5 hover:border-primary/40 transition">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border grid place-items-center text-xl">{i.logo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{i.name}</span>
                      {i.connected && <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px]">Connecté</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{i.desc}</p>
                  </div>
                </div>
                <Button variant={i.connected ? "outline" : "default"} size="sm" className="w-full">
                  {i.connected ? "Configurer" : "Connecter"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
