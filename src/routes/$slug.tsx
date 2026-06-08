import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BusinessCard } from "@/components/card/BusinessCard";
import { supabase } from "@/lib/supabase";
import type { CardData } from "@/lib/card-types";

export const Route = createFileRoute("/$slug")({
  head: () => ({
    meta: [
      { title: "Carte de visite digitale" },
      { name: "description", content: "Carte de visite digitale — contact, services, réseaux." },
    ],
  }),
  component: PublicCardPage,
});

function PublicCardPage() {
  const { slug } = Route.useParams();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .rpc("get_public_card_by_slug", { _slug: slug })
      .then(({ data, error }) => {
        const row = Array.isArray(data) ? data[0] : data;
        if (error || !row?.card_data) {
          setNotFound(true);
        } else {
          setCardData(row.card_data as unknown as CardData);

          // Log view event — fire & forget
          supabase
            .from("nfc_analytics")
            .insert({
              profile_id: row.id,
              event_type: "view",
              event_data: { slug },
            })
            .then(() => {});
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid place-items-center">
        <div className="animate-pulse text-muted-foreground text-sm">Chargement de la carte…</div>
      </div>
    );
  }

  if (notFound || !cardData) {
    return (
      <div className="min-h-screen bg-background grid place-items-center text-center px-4">
        <div className="space-y-3">
          <p className="text-4xl">🔍</p>
          <p className="font-display text-xl text-foreground">Carte introuvable</p>
          <p className="text-sm text-muted-foreground">
            Cette carte n'existe pas ou n'est plus active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[440px]">
        <BusinessCard data={cardData} />
      </div>
    </main>
  );
}
