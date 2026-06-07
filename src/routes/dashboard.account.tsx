import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Mail, LogOut } from "lucide-react";

export const Route = createFileRoute("/dashboard/account")({
  component: AccountPage,
});

const PLANS = [
  {
    id: "essentielle",
    label: "Essentielle",
    price: "Gratuit",
    description: "Les briques indispensables pour être joignable.",
    features: ["Identité, contact, vCard", "Boutons d'action", "Bio & badges"],
    current: true,
  },
  {
    id: "vitrine",
    label: "Vitrine",
    price: "9 €/mois",
    description: "Toutes les briques pour vendre votre savoir-faire.",
    features: [
      "Tout le plan Essentielle",
      "Services, témoignages, réalisations",
      "Vidéo, RDV, réseaux sociaux, stats",
    ],
    highlight: true,
  },
] as const;

function AccountPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 space-y-10">
      {/* Plans */}
      <section>
        <h2 className="font-display text-2xl font-medium">Plan</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-5">
          Vous pouvez changer de plan à tout moment, sans engagement.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLANS.map((p) => (
            <Card
              key={p.id}
              className={`p-5 relative ${p.highlight ? "border-primary/60 shadow-[var(--shadow-elegant)]" : ""}`}
            >
              {p.highlight && (
                <span className="absolute -top-2 right-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  <Crown className="h-3 w-3" /> Recommandé
                </span>
              )}
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h3 className="font-display text-xl">{p.label}</h3>
                <span className="text-sm text-muted-foreground">{p.price}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
              <ul className="space-y-2 mb-5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {p.current ? (
                <Button variant="outline" disabled className="w-full">Plan actuel</Button>
              ) : (
                <Button className="w-full" disabled>
                  Passer à {p.label}
                </Button>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Account */}
      <section>
        <h2 className="font-display text-2xl font-medium">Compte</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-5">
          Les réglages compte seront actifs après la mise en place de la connexion utilisateur.
        </p>
        <Card className="divide-y divide-border">
          <div className="p-4 flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Adresse email</div>
              <div className="text-xs text-muted-foreground">non connectée</div>
            </div>
            <Button size="sm" variant="outline" disabled>Modifier</Button>
          </div>
          <div className="p-4 flex items-center gap-3">
            <LogOut className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Se déconnecter</div>
              <div className="text-xs text-muted-foreground">Disponible après la création de compte</div>
            </div>
            <Button size="sm" variant="outline" disabled>Déconnexion</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
