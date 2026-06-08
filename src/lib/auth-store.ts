import { useState, useEffect } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

// Module-level singleton — same pattern as card-store.ts
let cachedUser: User | null = null;
let cachedSession: Session | null = null;
let isLoading = true;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

// Initialize once on module load
supabase.auth.getSession().then(({ data }) => {
  cachedSession = data.session;
  cachedUser = data.session?.user ?? null;
  isLoading = false;
  notify();
});

supabase.auth.onAuthStateChange((_event, session) => {
  cachedSession = session;
  cachedUser = session?.user ?? null;
  isLoading = false;
  notify();
});

export function useAuthStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const rerender = () => setTick((t) => t + 1);
    listeners.add(rerender);
    return () => {
      listeners.delete(rerender);
    };
  }, []);

  return {
    user: cachedUser,
    session: cachedSession,
    loading: isLoading,
  };
}
