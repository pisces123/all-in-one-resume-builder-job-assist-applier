import { z } from "zod";
import { currentAiProvider, hasAiEnv } from "./env";
import { createDemoCoverLetter, createDemoTailoring } from "./generation";
import type { CoverLetterDraft, JobRecord, ResumeProfile, TailoringDraft } from "./types";

const tailoringSchema = z.object({
  summary: z.string().min(20),
  bullets: z.array(z.string().min(10)).min(1),
  skillsToEmphasize: z.array(z.string().min(2)).min(1)
});

const coverLetterSchema = z.object({
  subject: z.string().min(5),
  body: z.string().min(100)
});

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

async function callDeepSeekJson<T>(
  messages: ChatMessage[],
  schema: z.ZodType<T>
): Promise<T | null> {
  if (!hasAiEnv() || currentAiProvider() !== "deepseek") {
    return null;
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: "deepseek-v4-flash",
      messages,
      thinking: { type: "disabled" },
      response_format: { type: "json_object" },
      stream: false
    })
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return null;
  }

  try {
    return schema.parse(JSON.parse(content));
  } catch {
    return null;
  }
}

export async function generateTailoringDraft(
  profile: ResumeProfile,
  job: Pick<JobRecord, "title" | "company" | "description">
): Promise<TailoringDraft> {
  const demo = createDemoTailoring(profile, job);
  const aiDraft = await callDeepSeekJson(
    [
      {
        role: "system",
        content:
          "Return strict JSON only. You help job seekers truthfully tailor resumes. Do not invent experience, credentials, employers, schools, certifications, or metrics."
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Create a truthful resume tailoring draft.",
          outputShape: {
            summary: "one targeted resume summary",
            bullets: ["4 rewritten bullets based only on source bullets"],
            skillsToEmphasize: ["priority skills or keywords"]
          },
          resume: profile,
          job
        })
      }
    ],
    tailoringSchema
  );

  if (!aiDraft) {
    return demo;
  }

  return {
    mode: "ai",
    atsReport: demo.atsReport,
    ...aiDraft
  };
}

export async function generateCoverLetterDraft(
  profile: ResumeProfile,
  job: Pick<JobRecord, "title" | "company" | "description">
): Promise<CoverLetterDraft> {
  const demo = createDemoCoverLetter(profile, job);
  const aiDraft = await callDeepSeekJson(
    [
      {
        role: "system",
        content:
          "Return strict JSON only. You write concise, truthful cover letters. Do not invent private contacts, false achievements, or unavailable qualifications."
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Write a targeted cover letter.",
          outputShape: {
            subject: "email subject",
            body: "cover letter body"
          },
          resume: profile,
          job
        })
      }
    ],
    coverLetterSchema
  );

  if (!aiDraft) {
    return demo;
  }

  return {
    mode: "ai",
    ...aiDraft
  };
}
