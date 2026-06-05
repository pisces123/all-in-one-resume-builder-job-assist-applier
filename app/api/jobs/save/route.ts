import { z } from "zod";
import { createServiceClient, getUserIdFromRequest } from "@/lib/supabase/server";
import type { JobStage } from "@/lib/types";

export const dynamic = "force-dynamic";

const jobSchema = z.object({
  title: z.string().default("Untitled job"),
  company: z.string().default("Unknown company"),
  location: z.string().default(""),
  url: z.string().default(""),
  description: z.string().default(""),
  notes: z.string().default(""),
  stage: z
    .enum(["Saved", "Tailored", "Applied", "Interviewing", "Offer", "Rejected", "Archived"])
    .default("Saved")
});

export async function POST(request: Request) {
  const payload = jobSchema.parse(await request.json());
  const now = new Date().toISOString();
  const client = createServiceClient();
  const userId = await getUserIdFromRequest(request);

  if (!client || !userId) {
    return Response.json({
      mode: "demo",
      job: {
        id: crypto.randomUUID(),
        ...payload,
        stage: payload.stage as JobStage,
        createdAt: now,
        updatedAt: now
      }
    });
  }

  const { data, error } = await client
    .from("jobs")
    .insert({
      user_id: userId,
      title: payload.title,
      company: payload.company,
      location: payload.location,
      url: payload.url,
      description: payload.description,
      notes: payload.notes,
      stage: payload.stage
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ mode: "connected", job: data });
}
