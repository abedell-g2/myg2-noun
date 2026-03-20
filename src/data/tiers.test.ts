import { TIERS, TIER_ORDER, type Tier, getAccessibleSectionIds, getLockedSectionIds, isSectionAccessible } from "./tiers";
import { SECTIONS } from "./sections";

describe("tiers data", () => {
  it("defines exactly 6 tiers", () => {
    expect(Object.keys(TIERS)).toHaveLength(6);
  });

  it("TIER_ORDER lists tiers from lowest to highest", () => {
    expect(TIER_ORDER).toEqual([
      "basic",
      "starter",
      "launchpad",
      "pro",
      "professional",
      "enterprise",
    ]);
  });

  it("every tier has a label and accessibleSectionIds array", () => {
    for (const tier of Object.values(TIERS)) {
      expect(tier.label).toBeTruthy();
      expect(Array.isArray(tier.accessibleSectionIds)).toBe(true);
    }
  });

  describe("Basic tier", () => {
    it("has access to exactly Home, Profile, and Account", () => {
      expect(TIERS.basic.accessibleSectionIds).toEqual(
        expect.arrayContaining(["home", "profile", "account"])
      );
      expect(TIERS.basic.accessibleSectionIds).toHaveLength(3);
    });
  });

  describe("Starter tier", () => {
    it("has access to 12 sections (all except Market Intelligence)", () => {
      expect(TIERS.starter.accessibleSectionIds).toHaveLength(12);
      expect(TIERS.starter.accessibleSectionIds).not.toContain(
        "market-intelligence"
      );
    });
  });

  describe("Enterprise tier", () => {
    it("has access to all 13 sections", () => {
      const allSectionIds = SECTIONS.map((s) => s.id);
      expect(TIERS.enterprise.accessibleSectionIds).toHaveLength(13);
      for (const id of allSectionIds) {
        expect(TIERS.enterprise.accessibleSectionIds).toContain(id);
      }
    });
  });

  describe("Market Intelligence", () => {
    it("is only accessible at Enterprise tier", () => {
      for (const tierId of TIER_ORDER) {
        if (tierId === "enterprise") {
          expect(TIERS[tierId].accessibleSectionIds).toContain(
            "market-intelligence"
          );
        } else {
          expect(TIERS[tierId].accessibleSectionIds).not.toContain(
            "market-intelligence"
          );
        }
      }
    });
  });
});

describe("tier helper functions", () => {
  describe("getAccessibleSectionIds", () => {
    it("returns correct section IDs for basic tier", () => {
      const ids = getAccessibleSectionIds("basic");
      expect(ids).toEqual(["home", "profile", "account"]);
    });

    it("returns all sections for enterprise tier", () => {
      const ids = getAccessibleSectionIds("enterprise");
      expect(ids).toHaveLength(13);
    });
  });

  describe("getLockedSectionIds", () => {
    it("returns 10 locked sections for basic tier", () => {
      const locked = getLockedSectionIds("basic");
      expect(locked).toHaveLength(10);
      expect(locked).toContain("review-management");
      expect(locked).toContain("market-intelligence");
      expect(locked).not.toContain("home");
    });

    it("returns 1 locked section for starter tier (market-intelligence)", () => {
      const locked = getLockedSectionIds("starter");
      expect(locked).toEqual(["market-intelligence"]);
    });

    it("returns no locked sections for enterprise tier", () => {
      const locked = getLockedSectionIds("enterprise");
      expect(locked).toHaveLength(0);
    });
  });

  describe("isSectionAccessible", () => {
    it("returns true for home on basic tier", () => {
      expect(isSectionAccessible("home", "basic")).toBe(true);
    });

    it("returns false for review-management on basic tier", () => {
      expect(isSectionAccessible("review-management", "basic")).toBe(false);
    });

    it("returns true for market-intelligence on enterprise tier", () => {
      expect(isSectionAccessible("market-intelligence", "enterprise")).toBe(
        true
      );
    });

    it("returns false for market-intelligence on professional tier", () => {
      expect(isSectionAccessible("market-intelligence", "professional")).toBe(
        false
      );
    });
  });
});
