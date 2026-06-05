import { currentAiProvider, hasAiEnv, hasSupabasePublicEnv, hasSupabaseServerEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    app: "All in One Resume Builder and Job Assist Applier",
    mode: hasSupabaseServerEnv() ? "connected" : "demo",
    supabasePublicConfigured: hasSupabasePublicEnv(),
    supabaseServerConfigured: hasSupabaseServerEnv(),
    aiConfigured: hasAiEnv(),
    aiProvider: currentAiProvider()
  });
}
