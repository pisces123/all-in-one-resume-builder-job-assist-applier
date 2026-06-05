import { z } from "zod";
import {
  createDocxBuffer,
  createSimplePdfBuffer,
  renderCoverLetterText,
  renderResumeText
} from "@/lib/documents";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const exportSchema = z.object({
  kind: z.enum(["resume", "cover-letter"]),
  format: z.enum(["pdf", "docx"]),
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
  job: z
    .object({
      title: z.string(),
      company: z.string()
    })
    .optional(),
  coverLetter: z
    .object({
      mode: z.enum(["ai", "demo"]),
      subject: z.string(),
      body: z.string()
    })
    .optional()
});

export async function POST(request: Request) {
  const payload = exportSchema.parse(await request.json());
  const title =
    payload.kind === "cover-letter"
      ? `${payload.profile.fullName || "Cover Letter"} - Cover Letter`
      : payload.profile.fullName || "Resume";
  const text =
    payload.kind === "cover-letter" && payload.coverLetter && payload.job
      ? renderCoverLetterText(payload.coverLetter, payload.profile, payload.job)
      : renderResumeText(payload.profile, payload.job);
  const safeName = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (payload.format === "docx") {
    const buffer = await createDocxBuffer(title, text);
    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName || "document"}.docx"`
      }
    });
  }

  const buffer = createSimplePdfBuffer(title, text);
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName || "document"}.pdf"`
    }
  });
}
