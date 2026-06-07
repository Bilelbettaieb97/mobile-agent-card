import { useEffect, useState, useCallback } from "react";
import { DEFAULT_CARD, DEFAULT_SECTION_ORDER, type CardData, type BrickId } from "./card-types";
import { THEMES_BY_ID, PROFESSIONS } from "./card-themes";

const KEY = "lovable.card.v1";

function normalizeOrder(order: unknown): BrickId[] {
  const valid = new Set<BrickId>(DEFAULT_SECTION_ORDER);
  const arr = Array.isArray(order) ? (order.filter((x) => valid.has(x as BrickId)) as BrickId[]) : [];
  for (const id of DEFAULT_SECTION_ORDER) if (!arr.includes(id)) arr.push(id);
  return arr;
}

function normalizeAccent(accent: unknown): CardData["accent"] {
  if (typeof accent === "string" && THEMES_BY_ID[accent]) {
    return accent as CardData["accent"];
  }
  return DEFAULT_CARD.accent;
}

function normalizeProfession(profession: unknown): string | undefined {
  if (typeof profession !== "string") return undefined;
  return PROFESSIONS.some((p) => p.id === profession) ? profession : undefined;
}

export function loadCard(): CardData {
  if (typeof window === "undefined") return DEFAULT_CARD;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CARD;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CARD,
      ...parsed,
      accent: normalizeAccent(parsed.accent),
      profession: normalizeProfession(parsed.profession),
      sectionOrder: normalizeOrder(parsed.sectionOrder),
      variants: { ...DEFAULT_CARD.variants, ...(parsed.variants ?? {}) },
    };
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
