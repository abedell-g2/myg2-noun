import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faBuilding,
  faStar,
  faEye,
  faBullhorn,
  faFileAlt,
  faChartBar,
  faRobot,
  faCrosshairs,
  faGlobe,
  faPlug,
  faChartLine,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

export interface SubFeature {
  id: string;
  label: string;
}

export interface Section {
  id: string;
  label: string;
  icon: IconDefinition;
  description: string;
  primaryCta: string;
  subFeatures: SubFeature[];
}

// The requirements document references "14 existing sections" but counts the legacy
// "Advertisements" and "Unified Ads" as two separate entries. Per the resolved design
// decision, these are consolidated into a single "Advertise" section at the nav layer,
// bringing the total to 13 sections. See requirements: "Advertisements and Unified Ads
// presented as a single 'Advertise' entry; legacy vs Unified Ads distinction resolved
// at the data layer."
export const SECTIONS: Section[] = [
  {
    id: "home",
    label: "Home",
    icon: faHome,
    description: "Your MyG2 dashboard and overview of key metrics.",
    primaryCta: "Go to Dashboard",
    subFeatures: [
      { id: "overview", label: "Overview" },
      { id: "getting-started", label: "Getting Started" },
    ],
  },
  {
    id: "profile",
    label: "Profile",
    icon: faBuilding,
    description: "Manage your G2 product profile and listing details.",
    primaryCta: "Manage Profile",
    subFeatures: [
      { id: "overview", label: "Overview" },
      { id: "details", label: "Details" },
      { id: "media", label: "Media" },
    ],
  },
  {
    id: "review-management",
    label: "Review Management",
    icon: faStar,
    description: "Collect, respond to, and analyze product reviews.",
    primaryCta: "Manage Reviews",
    subFeatures: [
      { id: "reviews", label: "Reviews" },
      { id: "campaigns", label: "Campaigns" },
      { id: "responses", label: "Responses" },
    ],
  },
  {
    id: "buyer-activity",
    label: "Buyer Activity",
    icon: faEye,
    description: "Track buyer intent signals and engagement on your profile.",
    primaryCta: "View Activity",
    subFeatures: [
      { id: "leads", label: "Leads" },
      { id: "intent-signals", label: "Intent Signals" },
    ],
  },
  {
    id: "advertise",
    label: "Advertise",
    icon: faBullhorn,
    description: "Run ad campaigns to reach in-market buyers on G2.",
    primaryCta: "Manage Ads",
    subFeatures: [
      { id: "campaigns", label: "Campaigns" },
      { id: "performance", label: "Performance" },
    ],
  },
  {
    id: "marketing-content",
    label: "Marketing Content",
    icon: faFileAlt,
    description: "Access G2 reports, badges, and review content for marketing.",
    primaryCta: "Browse Content",
    subFeatures: [
      { id: "reports", label: "Reports" },
      { id: "badges", label: "Badges" },
      { id: "references", label: "References" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: faChartBar,
    description: "Dive into performance analytics for your G2 presence.",
    primaryCta: "View Analytics",
    subFeatures: [
      { id: "profile-analytics", label: "Profile Analytics" },
      { id: "category-analytics", label: "Category Analytics" },
    ],
  },
  {
    id: "ai-custom-research",
    label: "AI Custom Research",
    icon: faRobot,
    description: "Generate custom research reports powered by AI.",
    primaryCta: "Start Research",
    subFeatures: [
      { id: "research", label: "Research" },
    ],
  },
  {
    id: "competitive-pulse",
    label: "Competitive Pulse",
    icon: faCrosshairs,
    description: "Monitor competitor activity and market positioning.",
    primaryCta: "Track Competitors",
    subFeatures: [
      { id: "competitors", label: "Competitors" },
      { id: "comparisons", label: "Comparisons" },
    ],
  },
  {
    id: "market-intelligence",
    label: "Market Intelligence",
    icon: faGlobe,
    description: "Enterprise-level market research and strategic insights.",
    primaryCta: "Explore Intelligence",
    subFeatures: [
      { id: "market-data", label: "Market Data" },
      { id: "trends", label: "Trends" },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: faPlug,
    description: "Connect G2 data to your CRM, MAP, and other tools.",
    primaryCta: "Manage Integrations",
    subFeatures: [
      { id: "connected", label: "Connected" },
      { id: "available", label: "Available" },
    ],
  },
  {
    id: "roi",
    label: "ROI",
    icon: faChartLine,
    description: "Measure and report on the ROI of your G2 investment.",
    primaryCta: "View ROI",
    subFeatures: [
      { id: "dashboard", label: "Dashboard" },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: faCog,
    description: "Manage your account settings, users, and billing.",
    primaryCta: "Account Settings",
    subFeatures: [
      { id: "settings", label: "Settings" },
      { id: "users", label: "Users" },
      { id: "billing", label: "Billing" },
    ],
  },
];

export function getSectionById(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}
