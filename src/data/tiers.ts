import { SECTIONS } from "./sections";

export type TierId =
  | "basic"
  | "starter"
  | "launchpad"
  | "pro"
  | "professional"
  | "enterprise";

export interface Tier {
  id: TierId;
  label: string;
  accessibleSectionIds: string[];
}

export const TIER_ORDER: TierId[] = [
  "basic",
  "starter",
  "launchpad",
  "pro",
  "professional",
  "enterprise",
];

const STARTER_AND_ABOVE_SECTIONS = [
  "home",
  "profile",
  "review-management",
  "buyer-activity",
  "advertise",
  "marketing-content",
  "analytics",
  "ai-custom-research",
  "competitive-pulse",
  "integrations",
  "roi",
  "account",
];

const ALL_SECTION_IDS = SECTIONS.map((s) => s.id);

export const TIERS: Record<TierId, Tier> = {
  basic: {
    id: "basic",
    label: "Basic",
    accessibleSectionIds: ["home", "profile", "account"],
  },
  starter: {
    id: "starter",
    label: "Starter",
    accessibleSectionIds: [...STARTER_AND_ABOVE_SECTIONS],
  },
  launchpad: {
    id: "launchpad",
    label: "Launchpad",
    accessibleSectionIds: [...STARTER_AND_ABOVE_SECTIONS],
  },
  pro: {
    id: "pro",
    label: "Pro",
    accessibleSectionIds: [...STARTER_AND_ABOVE_SECTIONS],
  },
  professional: {
    id: "professional",
    label: "Professional",
    accessibleSectionIds: [...STARTER_AND_ABOVE_SECTIONS],
  },
  enterprise: {
    id: "enterprise",
    label: "Enterprise",
    accessibleSectionIds: [...ALL_SECTION_IDS],
  },
};

export function getAccessibleSectionIds(tierId: TierId): string[] {
  return TIERS[tierId].accessibleSectionIds;
}

export function getLockedSectionIds(tierId: TierId): string[] {
  const accessible = new Set(TIERS[tierId].accessibleSectionIds);
  return ALL_SECTION_IDS.filter((id) => !accessible.has(id));
}

export function isSectionAccessible(
  sectionId: string,
  tierId: TierId
): boolean {
  return TIERS[tierId].accessibleSectionIds.includes(sectionId);
}

export function getMinimumTierForSection(sectionId: string): TierId {
  for (const tierId of TIER_ORDER) {
    if (TIERS[tierId].accessibleSectionIds.includes(sectionId)) {
      return tierId;
    }
  }
  return "enterprise";
}
