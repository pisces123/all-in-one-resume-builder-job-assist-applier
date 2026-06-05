import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun
} from "docx";
import type { CoverLetterDraft, JobRecord, ResumeProfile } from "./types";

function cleanPdfText(text: string) {
  return text
    .replace(/[()\\]/g, (char) => `\\${char}`)
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

function pdfObject(id: number, body: string) {
  return `${id} 0 obj\n${body}\nendobj\n`;
}

export function renderResumeText(profile: ResumeProfile, job?: Pick<JobRecord, "title" | "company">) {
  return [
    profile.fullName,
    profile.headline,
    [profile.location, profile.email, profile.phone].filter(Boolean).join(" | "),
    profile.links.join(" | "),
    "",
    job ? `Target role: ${job.title} at ${job.company}` : "",
    "SUMMARY",
    profile.summary,
    "",
    "SKILLS",
    profile.skills.join(", "),
    "",
    "EXPERIENCE",
    ...profile.experience.map((bullet) => `- ${bullet}`),
    "",
    "PROJECTS",
    ...profile.projects.map((project) => `- ${project}`),
    "",
    "EDUCATION",
    ...profile.education.map((item) => `- ${item}`)
  ]
    .filter((line, index, lines) => line || lines[index - 1])
    .join("\n");
}

export function renderCoverLetterText(
  draft: CoverLetterDraft,
  profile: ResumeProfile,
  job: Pick<JobRecord, "title" | "company">
) {
  return [
    profile.fullName,
    [profile.location, profile.email, profile.phone].filter(Boolean).join(" | "),
    "",
    draft.subject || `Application for ${job.title} at ${job.company}`,
    "",
    draft.body
  ].join("\n");
}

export function createSimplePdfBuffer(title: string, text: string) {
  const lines = [title, "", ...text.split("\n")].slice(0, 64);
  const contentLines = ["BT", "/F1 11 Tf", "72 760 Td"];
  lines.forEach((line, index) => {
    if (index > 0) {
      contentLines.push("0 -15 Td");
    }
    contentLines.push(`(${cleanPdfText(line).slice(0, 95)}) Tj`);
  });
  contentLines.push("ET");
  const stream = contentLines.join("\n");

  const objects = [
    pdfObject(1, "<< /Type /Catalog /Pages 2 0 R >>"),
    pdfObject(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    pdfObject(
      3,
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>"
    ),
    pdfObject(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
    pdfObject(5, `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`)
  ];

  let output = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(output));
    output += object;
  }

  const xrefOffset = Buffer.byteLength(output);
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    output += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(output, "utf8");
}

function paragraphsFromText(text: string) {
  return text.split("\n").map((line) => {
    if (/^[A-Z][A-Z\s]+$/.test(line) && line.length < 30) {
      return new Paragraph({
        text: line,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 80 }
      });
    }

    return new Paragraph({
      children: [new TextRun(line)],
      spacing: { after: line ? 80 : 140 }
    });
  });
}

export async function createDocxBuffer(title: string, text: string) {
  const document = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            spacing: { after: 180 }
          }),
          ...paragraphsFromText(text)
        ]
      }
    ]
  });

  return Buffer.from(await Packer.toBuffer(document));
}
