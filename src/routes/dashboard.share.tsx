import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link2, QrCode, Eye, MousePointerClick, Smartphone, Download, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/share")({
  component: SharePage,
});

const STATS = [
  { icon: Eye, label: "Vues 30 j.", value: "—", hint: "Disponible après publication" },
  { icon: MousePointerClick, label: "Clics 30 j.", value: "—", hint: "Sur les boutons d'action" },
  { icon: Smartphone, label: "Ajouts vCard", value: "—", hint: "Téléphones où vous êtes enregistré" },
  { icon: QrCode, label: "Scans QR", value: "—", hint: "Détection des scans physiques" },
];

function SharePage() {
  const [publicUrl] = useState("https://macarte.app/u/preview");

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 space-y-8">
      {/* Public link */}
      <section>
        <h2 className="font-display text-2xl font-medium">Lien public</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          C'est l'adresse à partager. Vous pourrez la personnaliser une fois la carte publiée.
        </p>
        <Card className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
            <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm truncate">{publicUrl}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(publicUrl);
                toast.success("Lien copié");
              }}
            >
              <Copy className="h-4 w-4 mr-1.5" /> Copier
            </Button>
            <Button variant="outline" disabled>
              <QrCode className="h-4 w-4 mr-1.5" /> QR code
            </Button>
            <Button disabled>
              <Download className="h-4 w-4 mr-1.5" /> Télécharger
            </Button>
          </div>
        </Card>
      </section>

      {/* Stats placeholder */}
      <section>
        <h2 className="font-display text-2xl font-medium">Statistiques</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Les indicateurs s'activent automatiquement dès la publication de votre carte.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map(({ icon: Icon, label, value, hint }) => (
            <Card key={label} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-display font-medium">{value}</div>
              <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
