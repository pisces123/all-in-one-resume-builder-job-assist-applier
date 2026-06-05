import type { ResumeProfile } from "./types";

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phonePattern =
  /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/;

function splitLines(text: string) {
  return text
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitList(value: string) {
  return value
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeListInput(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return splitList(value);
}

export function parseResumeText(text: string): ResumeProfile {
  const lines = splitLines(text);
  const email = text.match(emailPattern)?.[0] || "";
  const phone = text.match(phonePattern)?.[0] || "";
  const firstUsefulLine =
    lines.find((line) => !emailPattern.test(line) && !phonePattern.test(line)) ||
    "";

  const skillsHeaderIndex = lines.findIndex((line) =>
    /^skills|technical skills|core skills$/i.test(line)
  );
  const educationIndex = lines.findIndex((line) => /^education$/i.test(line));
  const experienceIndex = lines.findIndex((line) =>
    /^experience|work experience|professional experience$/i.test(line)
  );

  const skills =
    skillsHeaderIndex >= 0
      ? splitList(lines[skillsHeaderIndex + 1] || "")
      : extractKeywords(text).slice(0, 10);

  const experienceSource =
    experienceIndex >= 0
      ? lines.slice(experienceIndex + 1, educationIndex > experienceIndex ? educationIndex : undefined)
      : lines.slice(1, 7);

  return {
    fullName: firstUsefulLine,
    headline: lines[1] || "",
    email,
    phone,
    location: "",
    links: lines.filter((line) => /(linkedin|github|portfolio|https?:\/\/)/i.test(line)),
    summary: lines.slice(1, 4).join(" "),
    skills,
    experience: experienceSource
      .filter((line) => line.length > 30)
      .slice(0, 8),
    education:
      educationIndex >= 0
        ? lines.slice(educationIndex + 1, educationIndex + 4)
        : [],
    projects: []
  };
}

export function extractKeywords(text: string) {
  const stopWords = new Set([
    "about",
    "after",
    "also",
    "and",
    "are",
    "but",
    "can",
    "for",
    "from",
    "have",
    "into",
    "job",
    "our",
    "the",
    "this",
    "that",
    "with",
    "you",
    "your"
  ]);

  const counts = new Map<string, number>();
  for (const match of text.toLowerCase().matchAll(/[a-z][a-z+#.-]{2,}/g)) {
    const word = match[0].replace(/[.,]$/g, "");
    if (stopWords.has(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([word]) => word);
}
