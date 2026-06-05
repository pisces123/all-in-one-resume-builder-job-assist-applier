import { z } from "zod";
import { createServiceClient, getUserIdFromRequest } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const statusSchema = z.object({
  stage: z.enum(["Saved", "Tailored", "Applied", "Interviewing", "Offer", "Rejected", "Archived"])
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const payload = statusSchema.parse(await request.json());
  const client = createServiceClient();
  const userId = await getUserIdFromRequest(request);

  if (!client || !userId) {
    return Response.json({
      mode: "demo",
      id,
      stage: payload.stage,
      updatedAt: new Date().toISOString()
    });
  }

  const { data, error } = await client
    .from("jobs")
    .update({ stage: payload.stage, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ mode: "connected", job: data });
}
