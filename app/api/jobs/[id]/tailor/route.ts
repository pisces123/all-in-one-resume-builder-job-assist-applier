import { z } from "zod";
import { generateTailoringDraft } from "@/lib/ai";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  profile: z.object({
    fullName: z.string(),
    headline: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    links: z.array(z.string()),
    summary: z.string(),
    skills: z.array(z.string()),
    experience: z.array(z.string()),
    education: z.array(z.string()),
    projects: z.array(z.string())
  }),
  job: z.object({
    title: z.string(),
    company: z.string(),
    description: z.string()
  })
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const payload = requestSchema.parse(await request.json());
  const draft = await generateTailoringDraft(payload.profile, payload.job);

  return Response.json({
    id,
    draft
  });
}
