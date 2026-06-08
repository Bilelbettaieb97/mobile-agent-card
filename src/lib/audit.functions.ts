import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SignupEvent = {
  id: string;
  email: string | null;
  full_name: string | null;
  provider: string | null;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
};

/**
 * Returns the most recent account creations.
 * Access is restricted to the project "owner" = the very first
 * account ever created on this project.
 */
export const listSignupEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SignupEvent[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1) Identify the owner = oldest user
    const { data: oldest, error: oldestErr } = await supabaseAdmin
      .schema("auth" as never)
      .from("users" as never)
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1);

    if (oldestErr) throw new Error(`Owner lookup failed: ${oldestErr.message}`);

    const ownerId = (oldest as Array<{ id: string }> | null)?.[0]?.id;
    if (!ownerId || ownerId !== context.userId) {
      throw new Error("Forbidden: only the project owner can view the audit log.");
    }

    // 2) List recent users via Admin API
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });
    if (error) throw new Error(`listUsers: ${error.message}`);

    return data.users
      .slice()
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .map((u) => ({
        id: u.id,
        email: u.email ?? null,
        full_name:
          (u.user_metadata?.full_name as string | undefined) ??
          (u.user_metadata?.name as string | undefined) ??
          null,
        provider:
          (u.app_metadata?.provider as string | undefined) ??
          (Array.isArray(u.identities) && u.identities[0]?.provider) ??
          null,
        created_at: u.created_at,
        email_confirmed_at: (u.email_confirmed_at as string | null) ?? null,
        last_sign_in_at: (u.last_sign_in_at as string | null) ?? null,
      }));
  });
