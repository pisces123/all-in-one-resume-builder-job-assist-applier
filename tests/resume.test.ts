import { describe, expect, it } from "vitest";
import { extractKeywords, parseResumeText } from "../lib/resume";

describe("resume parsing", () => {
  it("extracts contact basics and likely skills", () => {
    const profile = parseResumeText(`
      Taylor Morgan
      Product Support Specialist
      taylor@example.com
      (555) 555-0199
      Skills
      CRM, SQL, Documentation, Customer Support
      Experience
      Improved response time by 30% while coordinating 70 weekly tickets.
    `);

    expect(profile.fullName).toBe("Taylor Morgan");
    expect(profile.email).toBe("taylor@example.com");
    expect(profile.phone).toBe("(555) 555-0199");
    expect(profile.skills).toContain("SQL");
  });

  it("ranks repeated job keywords", () => {
    expect(extractKeywords("SQL customer SQL support documentation")).toEqual([
      "sql",
      "customer",
      "documentation",
      "support"
    ]);
  });
});
