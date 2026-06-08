import { createFileRoute, Link } from "@tanstack/react-router";
import { BusinessCard } from "@/components/card/BusinessCard";
import { DEFAULT_CARD } from "@/lib/card-types";
import agentPortrait from "@/assets/agent-portrait.jpg";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import { Sparkles, ArrowLeft } from "lucide-react";

const DEMO = {
  ...DEFAULT_CARD,
  photo: agentPortrait,
  listings: [
    { id: "l1", img: listing1, title: "Loft Saint-Germain", price: "2 450 000 €", meta: "120 m² · 3 pièces" },
    { id: "l2", img: listing2, title: "Haussmannien Trocadéro", price: "3 890 000 €", meta: "180 m² · 5 pièces" },
    { id: "l3", img: listing3, title: "Villa Neuilly", price: "5 200 000 €", meta: "320 m² · 8 pièces" },
  ],
};

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Démo — Carte de visite digitale" },
      { name: "description", content: "Exemple de carte de visite digitale interactive pour un conseiller immobilier de prestige." },
      { property: "og:title", content: "Démo — Carte de visite digitale" },
      { property: "og:description", content: "Découvrez un exemple de carte de visite digitale interactive." },
    ],
    links: [{ rel: "canonical", href: "/demo" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: DEMO.name,
          jobTitle: DEMO.title,
          worksFor: { "@type": "Organization", name: DEMO.agency },
          areaServed: DEMO.area,
          telephone: DEMO.phone,
          email: DEMO.email,
          url: DEMO.website ? `https://${DEMO.website}` : undefined,
          sameAs: [DEMO.linkedin, DEMO.instagram].filter(Boolean),
        }),
      },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 px-5 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="h-4 w-4" /> Accueil
        </Link>
        <Link
          to="/builder"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] active:scale-95 transition"
          style={{ background: "var(--gradient-gold)" }}
        >
          <Sparkles className="h-4 w-4" strokeWidth={2.4} />
          Créer la mienne
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[440px] pt-6 pb-24">
        <BusinessCard data={DEMO} />
      </div>
    </main>
  );
}
