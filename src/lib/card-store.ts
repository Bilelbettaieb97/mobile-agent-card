import { useEffect, useState, useCallback } from "react";
import { DEFAULT_CARD, type CardData } from "./card-types";

const KEY = "lovable.card.v1";

export function loadCard(): CardData {
  if (typeof window === "undefined") return DEFAULT_CARD;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CARD;
    return { ...DEFAULT_CARD, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CARD;
  }
}

export function useCardStore() {
  const [data, setData] = useState<CardData>(DEFAULT_CARD);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadCard());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, [data, hydrated]);

  const update = useCallback(<K extends keyof CardData>(key: K, value: CardData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
  }, []);

  const reset = useCallback(() => setData(DEFAULT_CARD), []);

  return { data, setData, update, reset, hydrated };
}
