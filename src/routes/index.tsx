import { createFileRoute, Link } from "@tanstack/react-router";
import { BusinessCard } from "@/components/card/BusinessCard";
import { DEFAULT_CARD } from "@/lib/card-types";
import agentPortrait from "@/assets/agent-portrait.jpg";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import { Sparkles } from "lucide-react";

const DEMO = {
  ...DEFAULT_CARD,
  photo: agentPortrait,
  listings: [
    { id: "l1", img: listing1, title: "Loft Saint-Germain", price: "2 450 000 €", meta: "120 m² · 3 pièces" },
    { id: "l2", img: listing2, title: "Haussmannien Trocadéro", price: "3 890 000 €", meta: "180 m² · 5 pièces" },
    { id: "l3", img: listing3, title: "Villa Neuilly", price: "5 200 000 €", meta: "320 m² · 8 pièces" },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alexandre Moreau — Conseiller immobilier de prestige" },
      { name: "description", content: "Carte de visite digitale d'Alexandre Moreau, conseiller immobilier de prestige à Paris. Contact, biens, prise de rendez-vous." },
      { property: "og:title", content: "Alexandre Moreau — Conseiller immobilier de prestige" },
      { property: "og:description", content: "Découvrez la carte de visite digitale et les biens d'exception à Paris." },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
    ],
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
  component: Index,
});


function Index() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[440px]">
        <BusinessCard data={DEMO} />
      </div>

      {/* Floating CTA */}
      <Link
        to="/builder"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] active:scale-95 transition"
        style={{ background: "var(--gradient-gold)" }}
      >
        <Sparkles className="h-4 w-4" strokeWidth={2.4} />
        Créer la mienne
      </Link>
    </main>
  );
}
