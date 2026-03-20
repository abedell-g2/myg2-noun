# MyG2 Navigation & IA Redesign Requirements

## Overview

MyG2's current navigation is a nested accordion sidebar that has grown alongside the product. It now contains 14 sections and doesn't scale well — particularly for lower-tier customers (Starter/Launchpad) who see 11 sections simultaneously, which is overwhelming for an entry-level experience. Higher-tier customers face similar complexity as new sections are added.

This effort redesigns the **presentation and navigation layer only**. No sections are renamed, removed, merged, or moved between packages. No access license components change. The underlying product and its feature gating remain exactly as-is.

---

## Goals

- Replace the accordion sidebar with a scalable hub/app-space navigation model
- Make the experience feel appropriately simple at lower tiers and progressively richer at higher tiers — without changing what customers actually have access to
- Create a navigation system that can accommodate future section growth without requiring structural redesign
- Establish clear upgrade paths that surface higher-tier capabilities in context

---

## Current State

### Package Tiers (lowest → highest)
Basic → Starter → Launchpad → Pro → Professional → Enterprise

### Existing Sections (14 total, as-is — no changes proposed)

| Section | Basic | Starter | Launchpad | Pro | Professional | Enterprise |
|---------|:-----:|:-------:|:---------:|:---:|:------------:|:----------:|
| Home | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Profile | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Review Management | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Buyer Activity | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Advertise | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Marketing Content | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Analytics | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AI Custom Research | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Competitive Pulse | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Market Intelligence | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Integrations | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ROI | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Account | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Key tier observations:**
- **Basic**: Only 3 sections (Home, Profile, Account) — already very limited
- **Starter**: 11 sections — same as Launchpad; Advertisements/Unified Ads distinction is abstracted as a single "Advertise" section in the new nav
- **Starter → Professional**: Virtually the same section set; variation is at sub-feature level (e.g., delayed leads, AI Visibility are Professional+)
- **Market Intelligence**: Enterprise-only — the only section hard-gated above the sub-feature level

### Existing Nav List Classes (Rails view models)
The current system has 4 active list classes in `app/view_models/vendor_admin/navigation/`:

| Class | Used For | Sections | Status |
|-------|----------|----------|--------|
| `List` | Full navigation (Standard+) | 14 sections | Keep |
| `LaunchpadList` | Launchpad tier | 11 sections | Keep (Ads/Unified Ads abstracted at nav layer) |
| `LaunchpadEligibleList` | Launchpad-eligible | 11 sections | Keep |
| `PanelList` | Simplified navigation | 7 panels | **Retire** — replaced by new icon rail model |

---

## Proposed Navigation Model (V4 Hub/App-Space)

Based on the g2-nav-explorations V4 prototype, the new pattern is a **three-layer navigation**:

```
Layer 1 (always visible): Icon left rail — one icon per section
Layer 2 (on select):      Home dashboard — section cards/tiles
Layer 3 (on drill-in):    Section view — full section with top tab navigation
```

### Layer 1 — Icon Rail (triggered, not persistent)
- Hidden by default within section views; does not consume horizontal space while working
- Triggered by an app-space icon anchored in the top navigation bar (grid/waffle icon)
- On click, the rail slides in as an overlay — user stays on their current page
- Rail shows one icon per section: unlocked sections are active; locked sections appear dimmed with a lock indicator
- Tooltip on hover shows the section name (and "Upgrade to unlock" for locked entries)
- Account/Settings pinned at the bottom of the rail
- Clicking any unlocked section navigates there; clicking a locked section navigates to that section's upgrade page
- Dismisses on outside click or selecting a section

### Layer 2 — Home Dashboard
- The Home section is a dashboard of section cards — the primary orientation screen
- Each card: icon, section name, brief description, primary CTA
- Unlocked sections show their card normally
- Locked sections appear as visually distinct locked cards (dimmed, lock icon, "Upgrade to unlock" CTA) — they are always visible, never hidden
- Clicking a locked card navigates to that section's upgrade page (features it unlocks, tier required, pricing)

### Layer 3 — Section View with Top Tabs
- Clicking a section card (or rail icon) navigates to the section
- Within a section, sub-features are surfaced as top tabs (horizontal tab bar)
- Replaces the current nested accordion within each section
- The top nav app-space icon remains accessible at all times for quick rail access without navigating away

---

## User Stories

As a **Starter customer**, I want the navigation to show me what I have access to without being overwhelmed by sections and sub-features that feel out of reach.

As a **Professional customer**, I want fast, direct access to any section without scrolling through an accordion, and I want to understand at a glance what my tier includes.

As an **Enterprise customer**, I want the full power of MyG2's 14 sections to be navigable without cognitive overhead.

As a **G2 product team member**, I want a navigation system that can absorb new sections and sub-features without requiring structural redesign.

As a **sales/CS team member**, I want the upgrade path to be visible in-product so customers can self-discover higher-tier features.

---

## Functional Requirements

### Must Have (P0)

- [ ] App-space icon (grid/waffle) in the top nav triggers a slide-in icon rail overlay; rail is hidden by default within section views
- [ ] Rail shows one icon per section for all tiers; locked sections appear dimmed with a lock indicator — never hidden
- [ ] Clicking a locked rail entry navigates to that section's upgrade page
- [ ] Advertisements and Unified Ads presented as a single "Advertise" entry; legacy vs Unified Ads distinction resolved at the data layer
- [ ] Home dashboard showing section cards for all sections — unlocked cards active, locked cards visually distinct with upgrade CTA
- [ ] Clicking a locked Home card navigates to that section's upgrade page (features, tier, pricing)
- [ ] Section views with top-tab navigation for sub-features within each section
- [ ] Navigation behavior determined by existing access license components — no new gating logic
- [ ] All 14 existing sections remain intact; no sections renamed, merged, or removed
- [ ] PanelList retired — no longer rendered for any tier
- [ ] Account / Settings pinned at the bottom of the rail, always accessible
- [ ] Active section and active tab states clearly indicated
- [ ] Works across all 6 package tiers

### Should Have (P1)

- [ ] Keyboard navigation support for the icon rail and top tabs
- [ ] Responsive behavior (the prototype is desktop-first; define mobile behavior)
- [ ] Smooth transition animations between layers
- [ ] Section card descriptions that are tier-appropriate (Starter card copy may differ from Enterprise)
- [ ] Breadcrumb or back navigation from section view to Home dashboard

### Nice to Have (P2)

- [ ] Command palette (Cmd+K) — floating search modal for jumping to any section, sub-feature, or action by name; complements the rail for power users
- [ ] Recents or favorites pinning in the rail
- [ ] Onboarding overlay for first-time users of the new nav

---

## Non-Functional Requirements

- **Performance**: Rail and Home dashboard must load without additional API calls beyond what the current nav requires
- **Consistency**: Design tokens and component patterns must align with existing MyG2 design system (Tailwind-based, UE conventions)
- **Maintainability**: Adding a new section should require adding a rail icon + card, not restructuring the nav
- **Accessibility**: WCAG 2.1 AA — icon rail requires accessible labels, tab navigation requires keyboard support

---

## Out of Scope

- Renaming, merging, or removing any existing sections
- Changing which sections are included in any package tier
- Modifying access license components or permission logic
- Changing sub-feature availability within sections
- Mobile app navigation (this covers the MyG2 web product only)
- The g2.com buyer-side navigation

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| User has only Home, Profile, Account (Basic) | Rail shows 3 unlocked + remaining sections as locked; Home shows 3 active cards + locked cards for all inaccessible sections |
| Starter user (11 sections) | Rail shows 11 unlocked + Market Intelligence locked; Home shows same |
| Enterprise user (all 14 sections) | Rail shows 14 unlocked icons; no locked states |
| User navigates directly to a URL for a section they don't have access to | Existing 403/redirect behavior unchanged |
| Feature flag for new nav is off | Existing accordion nav renders as-is (rollout via feature flag) |
| Section has only 1 sub-feature (no tabs needed) | Section view renders without tab bar |

---

## Data Model

The prototype uses local mock data files — no live connection to UE. Files live in `src/data/` and are structured to mirror UE's access license model closely enough for a clean handoff.

- `src/data/sections.ts` — defines all 13 nav sections (id, label, icon, description, primary CTA)
- `src/data/tiers.ts` — defines the 6 package tiers and which section IDs are accessible per tier
- Components read from these files; switching the active tier (for testing/demo) requires changing one value
- No inline hardcoding of section lists or access rules in components

---

## Dependencies

- UE Rails + React + Webpack + Tailwind stack (production target)
- Existing `app/view_models/vendor_admin/navigation/` list classes (source of truth for section visibility rules)
- Existing access license component system (`app/models/access_licenses/`)
- g2-nav-explorations V4 prototype (design reference)
- myg2-noun (this project) — React prototype environment

---

## Open Questions

- [ ] **Mobile behavior**: Is the icon rail collapsed to a bottom tab bar on mobile, or a hamburger menu? *(non-blocking for prototype)*
- [ ] **Rollout strategy**: Is this a full cutover or a per-tier or per-cohort rollout? *(non-blocking for prototype)*

### Resolved
- **Rail visibility**: Hidden by default within section views; triggered by app-space icon in top nav as a slide-in overlay (Option C). User stays on current page.
- **Locked section treatment**: Locked sections are always visible — in both the rail and Home dashboard — in a locked/dimmed state. Clicking a locked entry navigates to that section's upgrade page. Research confirms users are more likely to upgrade when they can see what they're missing.
- **Ads vs Unified Ads**: Single "Advertise" section in the nav. The underlying legacy Ads / Unified Ads distinction is an implementation detail resolved at the data layer.
- **PanelList fate**: Retired for this effort.

---

## Acceptance Criteria

- All 6 tier types render the correct sections in the icon rail — unlocked sections active, locked sections dimmed (matching the existing visibility table)
- Home dashboard displays one card per section: active for accessible, locked state for inaccessible — no sections hidden
- Clicking a section card navigates to that section's view with top tabs
- No existing section URLs break (deep links continue to work)
- The existing access license gating logic is the sole source of truth for what appears in the nav
- A prototype built in myg2-noun validates the interaction model before UE implementation begins
