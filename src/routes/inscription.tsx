import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/inscription")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [{ title: "Créer mon compte — Carte digitale" }],
  }),
  component: InscriptionPage,
});

function InscriptionPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("Cet email est déjà utilisé. Connectez-vous plutôt.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    // After sign up → go to redirect destination or builder
    navigate({ to: (redirect as "/" | "/pricing" | "/builder") || "/builder" });
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo / header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-primary font-display text-xl font-medium">
            <Sparkles className="h-5 w-5" />
            Carte digitale
          </div>
          <p className="text-xs text-muted-foreground">Activez votre carte en 30 secondes</p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-display">Créer mon compte</CardTitle>
            <CardDescription className="text-sm">
              Gratuit — aucune carte bancaire requise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="8 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Création en cours…</>
                ) : (
                  "Créer mon compte →"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link to="/connexion" className="text-primary hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
