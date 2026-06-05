export type JobStage =
  | "Saved"
  | "Tailored"
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected"
  | "Archived";

export type ResumeProfile = {
  id?: string;
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  links: string[];
  summary: string;
  skills: string[];
  experience: string[];
  education: string[];
  projects: string[];
};

export type JobRecord = {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  stage: JobStage;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type AtsCategory = {
  label: string;
  score: number;
  detail: string;
};

export type AtsReport = {
  score: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  categories: AtsCategory[];
  actions: string[];
};

export type TailoringDraft = {
  mode: "ai" | "demo";
  summary: string;
  bullets: string[];
  skillsToEmphasize: string[];
  atsReport: AtsReport;
};

export type CoverLetterDraft = {
  mode: "ai" | "demo";
  subject: string;
  body: string;
};

export type ExportFormat = "pdf" | "docx";
export type ExportKind = "resume" | "cover-letter";
