import { describe, expect, it } from "vitest";
import { analyzeAts } from "../lib/ats";
import { defaultResumeProfile } from "../lib/demo-data";

describe("ATS readiness scoring", () => {
  it("returns a bounded score with matched and missing keywords", () => {
    const report = analyzeAts(defaultResumeProfile, {
      description:
        "Customer support role requiring CRM, documentation, SQL, troubleshooting, SaaS, and stakeholder communication."
    });

    expect(report.score).toBeGreaterThanOrEqual(0);
    expect(report.score).toBeLessThanOrEqual(100);
    expect(report.matchedKeywords).toContain("crm");
    expect(report.categories).toHaveLength(4);
  });
});
