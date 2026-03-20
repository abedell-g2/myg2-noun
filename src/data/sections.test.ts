import { SECTIONS, type Section } from "./sections";

describe("sections data", () => {
  it("exports exactly 13 sections", () => {
    expect(SECTIONS).toHaveLength(13);
  });

  it("every section has required fields", () => {
    for (const section of SECTIONS) {
      expect(section.id).toBeTruthy();
      expect(section.label).toBeTruthy();
      expect(section.icon).toBeTruthy();
      expect(section.description).toBeTruthy();
      expect(section.primaryCta).toBeTruthy();
    }
  });

  it("every section has a unique id", () => {
    const ids = SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes all expected section IDs", () => {
    const ids = SECTIONS.map((s) => s.id);
    const expectedIds = [
      "home",
      "profile",
      "review-management",
      "buyer-activity",
      "advertise",
      "marketing-content",
      "analytics",
      "ai-custom-research",
      "competitive-pulse",
      "market-intelligence",
      "integrations",
      "roi",
      "account",
    ];
    for (const id of expectedIds) {
      expect(ids).toContain(id);
    }
  });

  it("Home section is first in order", () => {
    expect(SECTIONS[0].id).toBe("home");
  });

  it("Account section is last in order", () => {
    expect(SECTIONS[SECTIONS.length - 1].id).toBe("account");
  });

  it("sections have sub-features as an array", () => {
    for (const section of SECTIONS) {
      expect(Array.isArray(section.subFeatures)).toBe(true);
    }
  });
});
