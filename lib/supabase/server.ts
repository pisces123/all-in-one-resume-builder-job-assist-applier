import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseServerEnv } from "../env";

export function createServiceClient(): SupabaseClient | null {
  if (!hasSupabaseServerEnv()) {
    return null;
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export async function getUserIdFromRequest(request: Request) {
  const client = createServiceClient();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!client || !token) {
    return null;
  }

  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}
