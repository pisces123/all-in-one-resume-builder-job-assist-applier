import { extractKeywords } from "./resume";
import type { AtsReport, JobRecord, ResumeProfile } from "./types";

function profileText(profile: ResumeProfile) {
  return [
    profile.fullName,
    profile.headline,
    profile.summary,
    profile.skills.join(" "),
    profile.experience.join(" "),
    profile.education.join(" "),
    profile.projects.join(" ")
  ]
    .join(" ")
    .toLowerCase();
}

function scoreFromRatio(ratio: number) {
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}

export function analyzeAts(profile: ResumeProfile, job: Pick<JobRecord, "description">): AtsReport {
  const resumeText = profileText(profile);
  const jobKeywords = extractKeywords(job.description).slice(0, 18);
  const matchedKeywords = jobKeywords.filter((keyword) =>
    resumeText.includes(keyword.toLowerCase())
  );
  const missingKeywords = jobKeywords.filter(
    (keyword) => !matchedKeywords.includes(keyword)
  );

  const keywordScore = scoreFromRatio(
    jobKeywords.length ? matchedKeywords.length / jobKeywords.length : 0.5
  );
  const measurableBullets = profile.experience.filter((bullet) =>
    /\d|%|reduced|increased|improved|saved|grew|launched|shipped/i.test(bullet)
  ).length;
  const bulletScore = scoreFromRatio(
    profile.experience.length
      ? measurableBullets / Math.max(profile.experience.length, 1)
      : 0
  );
  const structureScore = scoreFromRatio(
    [
      profile.fullName,
      profile.email,
      profile.summary,
      profile.skills.length > 3 ? "skills" : "",
      profile.experience.length > 1 ? "experience" : "",
      profile.education.length ? "education" : ""
    ].filter(Boolean).length / 6
  );
  const formattingScore = scoreFromRatio(
    profile.experience.every((bullet) => bullet.length < 260) ? 0.9 : 0.65
  );
  const finalScore = Math.round(
    keywordScore * 0.4 +
      bulletScore * 0.2 +
      structureScore * 0.25 +
      formattingScore * 0.15
  );

  const actions = [
    missingKeywords.length
      ? `Work in these missing terms where they are truthful: ${missingKeywords
          .slice(0, 5)
          .join(", ")}.`
      : "Keyword coverage is strong for this job description.",
    bulletScore < 75
      ? "Add measurable outcomes to more bullets, such as volume, speed, quality, cost, or customer impact."
      : "Experience bullets show measurable impact.",
    structureScore < 85
      ? "Fill in missing contact, summary, skills, experience, and education sections."
      : "Core resume sections are complete."
  ];

  return {
    score: finalScore,
    matchedKeywords,
    missingKeywords,
    categories: [
      {
        label: "Keyword match",
        score: keywordScore,
        detail: `${matchedKeywords.length} of ${jobKeywords.length} priority terms found.`
      },
      {
        label: "Impact bullets",
        score: bulletScore,
        detail: `${measurableBullets} bullets include measurable outcomes.`
      },
      {
        label: "Resume structure",
        score: structureScore,
        detail: "Checks contact info, summary, skills, experience, and education."
      },
      {
        label: "ATS formatting",
        score: formattingScore,
        detail: "Prefers direct section labels and concise bullet lengths."
      }
    ],
    actions
  };
}
