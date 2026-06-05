import { describe, expect, it } from "vitest";
import { createDocxBuffer, createSimplePdfBuffer, renderResumeText } from "../lib/documents";
import { defaultResumeProfile } from "../lib/demo-data";

describe("document exports", () => {
  it("renders resume text for exports", () => {
    const text = renderResumeText(defaultResumeProfile);
    expect(text).toContain("SUMMARY");
    expect(text).toContain(defaultResumeProfile.fullName);
  });

  it("creates a basic PDF buffer", () => {
    const pdf = createSimplePdfBuffer("Resume", "Taylor Morgan\nSUMMARY\nTest");
    expect(pdf.subarray(0, 8).toString()).toBe("%PDF-1.4");
  });

  it("creates a docx buffer", async () => {
    const docx = await createDocxBuffer("Resume", "Taylor Morgan");
    expect(docx.length).toBeGreaterThan(1000);
  });
});
