# Data Model

> Established by: [MyG2 Navigation & IA Redesign](../../features/ready-to-implement/myg2-nav-redesign/README.md)

## Section Data

### Source of Truth

| Environment | Location |
|-------------|----------|
| Prototype | `src/data/sections.ts` |
| Production | `app/view_models/vendor_admin/navigation/` list classes |
| Access gating (production) | `app/models/access_licenses/` |

No section lists or access rules are inlined in components. The data layer is the single source of truth.

### Section Data Shape

Each section in the data layer conforms to this shape:

```ts
{
  id: string;          // Unique identifier (e.g., "review-management")
  label: string;       // Display name (e.g., "Review Management")
  icon: IconDefinition; // Font Awesome icon reference
  description: string; // Brief description shown on Home dashboard cards
  primaryCta: string;  // CTA label for the card (e.g., "Manage Reviews")
  subFeatures: Array<{
    id: string;        // Sub-feature identifier
    label: string;     // Tab label
  }>;
}
```

Components read from this data; they do not define their own section lists.

### Section Count: 13 (Not 14)

The product has 14 underlying section concepts, but the navigation layer presents **13 sections**. This is intentional.

**Advertisements / Unified Ads Consolidation**: The legacy Advertisements and Unified Ads features are presented as a single "Advertise" section in the navigation. The Ads vs. Unified Ads distinction is an implementation detail resolved at the data layer and does not surface as two separate nav entries.

This means:
- The requirements table lists 14 rows (one per underlying section concept).
- The `sections.ts` data file contains 13 entries.
- The icon rail shows 13 icons.
- The Home dashboard shows 13 cards.

Any engineer working on either the nav data model or the underlying Ads product features needs to know this consolidation exists and is intentional. A code comment in `src/data/sections.ts` documents this decision.

### Sub-Feature ID Uniqueness

Sub-feature IDs are currently scoped per-section and are unique within their parent section, but they are not globally unique across all sections. This is benign in the current architecture because only one section view renders at a time.

If the architecture ever introduces multi-pane or comparison views, sub-feature ID namespacing (`{sectionId}-{subFeatureId}`) would be required to avoid DOM `id` collisions.

## Tier Data

### Tier Data Shape

Each tier conforms to this shape:

```ts
{
  id: string;                    // Unique identifier (e.g., "starter")
  label: string;                 // Display name (e.g., "Starter")
  accessibleSectionIds: string[]; // Section IDs accessible at this tier
}
```

### Helper Functions

The tier module exports the following helpers:

| Function | Purpose |
|----------|---------|
| `getAccessibleSectionIds(tierId)` | Returns the list of section IDs accessible at a given tier |
| `getLockedSectionIds(tierId)` | Returns the list of section IDs locked at a given tier |
| `isSectionAccessible(tierId, sectionId)` | Checks whether a specific section is accessible at a tier |
| `getMinimumTierForSection(sectionId)` | Returns the lowest tier that grants access to a section |

### Tier Hierarchy

From lowest to highest: Basic, Starter, Launchpad, Pro, Professional, Enterprise.

Key observations:
- **Basic**: 3 sections (Home, Profile, Account).
- **Starter through Professional**: Virtually the same section set (11 sections); variation is at the sub-feature level.
- **Enterprise**: All sections, including Market Intelligence (the only section hard-gated above the sub-feature level).
