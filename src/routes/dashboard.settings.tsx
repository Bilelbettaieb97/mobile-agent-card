import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Shield, Globe, Trash2, Download, Key } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Paramètres — Dashboard" }] }),
  component: SettingsPage,
});

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8 max-w-3xl space-y-6">
      <Section title="Profil" desc="Vos informations personnelles">
        <Field label="Nom complet" defaultValue="Alex Martin" />
        <Field label="Email" defaultValue="alex@studio.fr" type="email" />
        <Field label="Numéro de téléphone" defaultValue="+33 6 12 34 56 78" />
        <Button>Enregistrer</Button>
      </Section>

      <Section title="Sécurité" desc="Mot de passe et authentification">
        <Field label="Mot de passe actuel" type="password" placeholder="••••••••" />
        <Field label="Nouveau mot de passe" type="password" placeholder="••••••••" />
        <Toggle icon={Shield} label="Authentification à deux facteurs" sub="Recevez un code par SMS à chaque connexion" />
        <Toggle icon={Key} label="Sessions sur tous les appareils" sub="Déconnectez-vous partout" />
      </Section>

      <Section title="Langue & région">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Langue" defaultValue="Français" />
          <Field label="Fuseau horaire" defaultValue="Europe/Paris" />
        </div>
        <Toggle icon={Globe} label="Carte publique en anglais aussi" sub="Détection auto selon le navigateur du visiteur" />
      </Section>

      <Section title="Données & confidentialité">
        <ActionRow icon={Download} label="Exporter mes données" desc="Téléchargez toutes vos données au format JSON (RGPD)" cta="Exporter" />
        <ActionRow icon={Shield} label="Mode privé" desc="Masquer votre carte des moteurs de recherche" toggle />
        <ActionRow icon={Trash2} label="Supprimer mon compte" desc="Action définitive, irréversible" cta="Supprimer" danger />
      </Section>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6 space-y-4">
      <div>
        <h3 className="font-display text-lg">{title}</h3>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</label>
      <Input {...props} />
    </div>
  );
}

function Toggle({ icon: Icon, label, sub }: { icon: typeof Shield; label: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <Switch />
    </div>
  );
}

function ActionRow({ icon: Icon, label, desc, cta, toggle, danger }: { icon: typeof Shield; label: string; desc: string; cta?: string; toggle?: boolean; danger?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
      <Icon className={`h-4 w-4 ${danger ? "text-destructive" : "text-muted-foreground"}`} />
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${danger ? "text-destructive" : ""}`}>{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      {toggle ? <Switch /> : <Button size="sm" variant={danger ? "destructive" : "outline"}>{cta}</Button>}
    </div>
  );
}
