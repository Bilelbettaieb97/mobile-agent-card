import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listSignupEvents } from "@/lib/audit.functions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldAlert, UserPlus } from "lucide-react";

export const Route = createFileRoute("/dashboard/audit")({
  head: () => ({
    meta: [
      { title: "Journal d'audit — Comptes créés" },
      { name: "description", content: "Historique des comptes créés sur le projet." },
    ],
  }),
  component: AuditPage,
});

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}

function AuditPage() {
  const fetchSignups = useServerFn(listSignupEvents);
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["signup-audit"],
    queryFn: () => fetchSignups(),
    retry: false,
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-4xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Journal des inscriptions</h2>
          <p className="text-sm text-muted-foreground">
            Tous les comptes créés sur ce projet, du plus récent au plus ancien.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          Rafraîchir
        </Button>
      </div>

      {isLoading && (
        <Card className="p-6 text-sm text-muted-foreground animate-pulse">
          Chargement du journal…
        </Card>
      )}

      {error && (
        <Card className="p-6 border-destructive/40 bg-destructive/5 text-sm flex items-start gap-3">
          <ShieldAlert className="h-4 w-4 text-destructive mt-0.5" />
          <div>
            <p className="font-medium text-destructive">Accès refusé ou erreur</p>
            <p className="text-muted-foreground mt-1">{(error as Error).message}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              Seul le propriétaire du projet (premier compte créé) peut consulter ce journal.
            </p>
          </div>
        </Card>
      )}

      {data && data.length === 0 && (
        <Card className="p-6 text-sm text-muted-foreground">
          Aucun compte trouvé.
        </Card>
      )}

      {data && data.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {data.length} compte{data.length > 1 ? "s" : ""} au total
          </p>
          <Card className="divide-y divide-border overflow-hidden">
            {data.map((u) => (
              <div key={u.id} className="p-4 flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 grid place-items-center shrink-0">
                  <UserPlus className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm truncate">
                      {u.full_name ?? "— sans nom —"}
                    </p>
                    {u.provider && (
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {u.provider}
                      </Badge>
                    )}
                    {!u.email_confirmed_at && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-amber-500/40 bg-amber-500/10 text-amber-500"
                      >
                        Email non confirmé
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {u.email ?? "— pas d'email —"}
                  </p>
                  <div className="text-[11px] text-muted-foreground mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5">
                    <span>Créé : {formatDate(u.created_at)}</span>
                    <span>Dernière connexion : {formatDate(u.last_sign_in_at)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 font-mono truncate">
                    {u.id}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
