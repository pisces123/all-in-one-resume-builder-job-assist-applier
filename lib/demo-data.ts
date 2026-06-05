import type { JobRecord, ResumeProfile } from "./types";

export const defaultResumeProfile: ResumeProfile = {
  fullName: "Taylor Morgan",
  headline: "Customer-focused operations coordinator moving into product support",
  email: "taylor@example.com",
  phone: "(555) 555-0199",
  location: "Toronto, ON",
  links: ["linkedin.com/in/taylormorgan", "github.com/taylormorgan"],
  summary:
    "Organized operator with experience coordinating customer requests, improving team workflows, and translating messy requirements into clear next steps.",
  skills: [
    "Customer support",
    "Workflow improvement",
    "CRM",
    "Documentation",
    "SQL basics",
    "Stakeholder communication"
  ],
  experience: [
    "Coordinated 70+ weekly support requests across sales, operations, and customer success while maintaining a 95% on-time follow-up rate.",
    "Created internal documentation that reduced repeat questions from new hires and shortened onboarding by one week.",
    "Analyzed recurring ticket themes and partnered with product to prioritize fixes for the highest-impact customer pain points."
  ],
  education: ["Certificate in Business Technology, 2025"],
  projects: [
    "Built a lightweight job tracker in Notion to organize applications, follow-ups, contacts, and interview notes."
  ]
};

export const defaultJobs: JobRecord[] = [
  {
    id: "demo-product-support",
    title: "Product Support Specialist",
    company: "Northstar Software",
    location: "Remote Canada",
    url: "https://example.com/jobs/product-support-specialist",
    description:
      "We are looking for a Product Support Specialist with strong customer communication, troubleshooting, CRM, documentation, SaaS support, and cross-functional collaboration experience. SQL basics and process improvement are a plus.",
    stage: "Saved",
    notes: "Good fit for support + operations background.",
    createdAt: new Date("2026-06-05T09:00:00.000Z").toISOString(),
    updatedAt: new Date("2026-06-05T09:00:00.000Z").toISOString()
  }
];

export const stages = [
  "Saved",
  "Tailored",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Archived"
] as const;
