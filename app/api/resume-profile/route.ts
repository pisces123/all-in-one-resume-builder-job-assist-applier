import { z } from "zod";
import { createServiceClient, getUserIdFromRequest } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const profileSchema = z.object({
  fullName: z.string().default(""),
  headline: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  links: z.array(z.string()).default([]),
  summary: z.string().default(""),
  skills: z.array(z.string()).default([]),
  experience: z.array(z.string()).default([]),
  education: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([])
});

export async function PATCH(request: Request) {
  const payload = profileSchema.parse(await request.json());
  const client = createServiceClient();
  const userId = await getUserIdFromRequest(request);

  if (!client || !userId) {
    return Response.json({
      mode: "demo",
      profile: payload
    });
  }

  const { data, error } = await client
    .from("resume_profiles")
    .upsert({
      user_id: userId,
      full_name: payload.fullName,
      headline: payload.headline,
      email: payload.email,
      phone: payload.phone,
      location: payload.location,
      links: payload.links,
      summary: payload.summary,
      skills: payload.skills,
      experience: payload.experience,
      education: payload.education,
      projects: payload.projects,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ mode: "connected", profile: data });
}
