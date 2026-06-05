import { analyzeAts } from "./ats";
import type { CoverLetterDraft, JobRecord, ResumeProfile, TailoringDraft } from "./types";

export function createDemoTailoring(
  profile: ResumeProfile,
  job: Pick<JobRecord, "title" | "company" | "description">
): TailoringDraft {
  const atsReport = analyzeAts(profile, { description: job.description });
  const skillsToEmphasize = [
    ...new Set([...atsReport.matchedKeywords.slice(0, 4), ...atsReport.missingKeywords.slice(0, 4)])
  ];

  return {
    mode: "demo",
    summary: `${profile.summary} For ${job.company}'s ${job.title} role, emphasize ${skillsToEmphasize
      .slice(0, 4)
      .join(", ")} with direct evidence from recent work.`,
    bullets: profile.experience.slice(0, 4).map((bullet) => {
      const keyword = skillsToEmphasize.find((term) => !bullet.toLowerCase().includes(term));
      return keyword ? `${bullet} Connected this work to ${keyword}.` : bullet;
    }),
    skillsToEmphasize,
    atsReport
  };
}

export function createDemoCoverLetter(
  profile: ResumeProfile,
  job: Pick<JobRecord, "title" | "company" | "description">
): CoverLetterDraft {
  const report = analyzeAts(profile, { description: job.description });
  const focus = report.matchedKeywords.slice(0, 3).join(", ") || "the role requirements";
  const name = profile.fullName || "Your Name";

  return {
    mode: "demo",
    subject: `Application for ${job.title} at ${job.company}`,
    body: `Dear ${job.company} hiring team,\n\nI am excited to apply for the ${job.title} role. My background in ${focus} gives me a practical foundation for helping your team move quickly while keeping candidate, customer, and stakeholder needs clear.\n\nIn my recent work, I have ${profile.experience[0] || "built organized workflows, communicated clearly across teams, and turned ambiguous requests into useful next steps"}. I would bring that same careful execution to ${job.company}, especially where the role calls for ownership, communication, and measurable follow-through.\n\nThank you for your time and consideration. I would welcome the chance to discuss how my experience can support your team.\n\nSincerely,\n${name}`
  };
}

export function buildJobTips(job: Pick<JobRecord, "title" | "company" | "description">) {
  const lower = job.description.toLowerCase();
  const tips = [
    `Search LinkedIn for "${job.company} recruiter" and "${job.company} ${job.title}" to find likely contacts.`,
    `Look for a hiring manager post about ${job.title} before applying; mention one relevant company detail if it is real.`,
    "Prepare one story each for impact, conflict, learning speed, and cross-functional communication.",
    "Follow up 5 to 7 business days after applying if you can find a real recruiter or hiring-team email."
  ];

  if (lower.includes("sql")) {
    tips.push("Review basic SQL joins, filters, grouping, and a short troubleshooting example.");
  }
  if (lower.includes("customer") || lower.includes("support")) {
    tips.push("Prepare a concise story about calming a frustrated customer and closing the loop.");
  }
  if (lower.includes("remote")) {
    tips.push("Have an example ready for async communication, prioritization, and remote accountability.");
  }

  return tips;
}
