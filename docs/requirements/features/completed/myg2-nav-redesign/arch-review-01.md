# Architecture Review 01

> Feature: MyG2 Navigation & IA Redesign
> Date: 2026-03-20
> Status: addressed

**Verdict**: CHANGES NEEDED

---

## Technical Overview Updates

The `docs/requirements/technical-overview/` directory does not yet exist. This is the first completed feature in the project and introduces several architectural decisions that belong in long-term architecture docs. Each item below should be added to a newly created technical-overview section.

---

### 1. Navigation Architecture Pattern

- **Target doc**: `docs/requirements/technical-overview/navigation/README.md`
- **Proposed addition**: Document the three-layer hub/app-space navigation model as the canonical MyG2 navigation pattern: Layer 1 is a triggered icon rail overlay (hidden by default, slide-in on activation), Layer 2 is a Home dashboard of section cards, and Layer 3 is a section view with top-tab sub-feature navigation. This pattern replaces the previous accordion sidebar.
- **Reason**: This is a structural architectural decision that governs how all current and future sections are surfaced to users. Any engineer adding a section or building a new navigation variant needs to understand this model.

---

### 2. Section and Tier Data Layer Convention

- **Target doc**: `docs/requirements/technical-overview/data-model/README.md`
- **Proposed addition**: The canonical section and tier data lives in `src/data/sections.ts` and `src/data/tiers.ts` (prototype) and maps to `app/view_models/vendor_admin/navigation/` list classes (production). The section data shape is `{ id, label, icon, description, primaryCta, subFeatures[] }`. The tier data shape is `{ id, label, accessibleSectionIds[] }` plus helper functions (`getAccessibleSectionIds`, `getLockedSectionIds`, `isSectionAccessible`, `getMinimumTierForSection`). No section lists or access rules are inlined in components — the data layer is the single source of truth. The production source of truth for access gating is `app/models/access_licenses/`.
- **Reason**: Establishes the canonical data shape and single-source-of-truth principle for section access. Future engineers adding sections or modifying tier access rules need to know where to make changes and what contract components expect.

---

### 3. Advertisements / Unified Ads Consolidation

- **Target doc**: `docs/requirements/technical-overview/data-model/README.md`
- **Proposed addition**: The navigation layer presents Advertisements and Unified Ads as a single "Advertise" section. The legacy Ads / Unified Ads distinction is an implementation detail resolved at the data layer and does not surface as two separate nav entries. This means the navigation data model contains 13 sections, not 14, despite the product having 14 underlying section concepts.
- **Reason**: This is a deliberate architectural decision with a non-obvious count discrepancy (13 vs 14). Any engineer working on either the nav data model or the underlying Ads product features needs to know this consolidation exists and is intentional.

---

### 4. Feature Flag Rollout Pattern

- **Target doc**: `docs/requirements/technical-overview/dev-standards/README.md`
- **Proposed addition**: New navigation variants must be wrapped in a feature flag to enable rollout control and allow the previous accordion nav to remain active during the transition. The feature flag gates which nav model renders; when the flag is off, the existing nav renders unchanged.
- **Reason**: The requirements explicitly call this out as a rollout mechanism. This is an architectural constraint that applies to this nav change and should be the documented standard for any future nav or large-scale UI migration in this codebase.

---

### 5. React Context Pattern for Global UI State

- **Target doc**: `docs/requirements/technical-overview/dev-standards/README.md`
- **Proposed addition**: Global UI state that needs to be shared across multiple components (e.g., the active package tier, section access lists) is managed via React Context with a Provider/hook pattern (`TierContext` / `useTier`). Context values that are derived from state are memoized with `useMemo` and `useCallback` to prevent unnecessary re-renders. The Provider accepts an `initialValue` prop to facilitate testing without requiring store/router setup.
- **Reason**: Establishes the React Context pattern as the approved mechanism for cross-component state in this codebase, including the testability convention of accepting `initialValue` props.

---

### 6. WCAG 2.1 AA Accessibility Baseline

- **Target doc**: `docs/requirements/technical-overview/dev-standards/README.md`
- **Proposed addition**: All interactive navigation components must meet WCAG 2.1 AA. Required patterns include: `role="tablist"` / `role="tab"` / `role="tabpanel"` with `aria-selected`, `aria-controls`, and `aria-labelledby` linkage for tab navigation; accessible labels on icon-only buttons; `aria-hidden="true"` on decorative/interaction-only overlay elements (e.g., dismissal backdrops); and keyboard navigation support (Escape to dismiss overlays, ArrowUp/ArrowDown for list navigation with wrapping, auto-focus when overlays open). Tab semantics (`role`, `aria-controls`, `aria-labelledby`) must be omitted or conditional when there is only one item and no tablist is rendered.
- **Reason**: The requirements state WCAG 2.1 AA as a non-functional requirement. Documenting the specific patterns that fulfill this requirement prevents future regressions and gives engineers a concrete checklist.

---

### 7. CSS Animation and Reduced Motion

- **Target doc**: `docs/requirements/technical-overview/dev-standards/README.md`
- **Proposed addition**: Slide-in and transition animations must respect the OS-level `prefers-reduced-motion` setting. Animations should be wrapped in `@media (prefers-reduced-motion: no-preference)` so that users who have configured reduced motion do not experience motion-based transitions. Custom keyframe animations are defined in `src/index.css`.
- **Reason**: This is an accessibility requirement (related to WCAG 2.3) and a cross-cutting concern for all animated UI components. It is currently called out in SUMMARY.md as a "Suggested Next Step" but has not been implemented; documenting it in technical-overview establishes it as a standing standard rather than a per-feature suggestion.

---

### 8. In-Memory View State vs. Client-Side Routing

- **Target doc**: `docs/requirements/technical-overview/dev-standards/README.md`
- **Proposed addition**: The prototype uses a discriminated-union in-memory view state (not React Router) for navigation between home, section, and upgrade views. This is acceptable for prototype/validation environments only. The production UE implementation requires URL-based routing (`/section/:id`, `/upgrade/:id`) to satisfy the acceptance criterion that existing section deep links continue to work. The prototype's in-memory approach must not be carried forward into the Rails/React production app.
- **Reason**: The in-memory approach is explicitly called out as a prototype trade-off in SUMMARY.md. Documenting this in technical-overview ensures the constraint is visible during the UE integration phase, not just buried in the feature's SUMMARY.md.

---

## Open Questions to Register

`docs/requirements/OPEN-QUESTIONS.md` does not yet exist. Both open questions from the feature README are unregistered and should be added when that file is created.

- **Question**: What is the mobile navigation behavior — is the icon rail collapsed to a bottom tab bar, or a hamburger menu?
- **Category**: Product/Business
- **Blocking**: No
- **Context**: The prototype is desktop-first; the mobile interaction model is undefined and deferred. Must be resolved before production UE implementation ships.

---

- **Question**: What is the rollout strategy — full cutover, per-tier rollout, or per-cohort rollout?
- **Category**: Product/Business
- **Blocking**: No
- **Context**: The requirements state the new nav should be gated by a feature flag, but the rollout sequencing (which tiers/cohorts get it first) has not been decided.

---

## Conflicts (Blocking)

None.

---

## Notes

**task-06-section-view.md discrepancy**: The task file at `task-06-section-view.md` contains the note "Single sub-feature sections still render the tab bar for consistency." This contradicts the final implemented behavior (the tablist is conditionally hidden for single sub-feature sections, which is the correct behavior per the requirements edge case table and was confirmed fixed in review-01). The task file was not updated after the Critical #1 fix. This is a documentation staleness issue, not a code conflict, but whoever owns task documentation cleanup should update the note in that file.

**No `technical-overview/` directory exists**: This is the first feature in the project. All Technical Overview Updates above are net-new additions to a directory that needs to be created. This is the primary driver of the CHANGES NEEDED verdict — there are no conflicts because there is no existing technical-overview content to conflict with.

**No `OPEN-QUESTIONS.md` exists**: The file needs to be created before the two open questions above can be registered.

**review-02.md Important #1 (dangling `aria-labelledby`)**: The code review approved the branch with this known accessibility nit unresolved. From an architecture standpoint, it reinforces the WCAG pattern documented in Technical Overview Update #6 above — tab semantics must be omitted when no tablist is rendered. This is not a blocking architecture conflict, but the pattern documented in `technical-overview/` should reflect the correct behavior so future components are implemented correctly from the start.

**Sub-feature IDs are not globally unique** (raised in review-02 as suggestion #2): This is a data model concern. Currently benign since only one section view renders at a time, but worth noting here for the data model section of the technical overview. If the architecture ever introduces multi-pane or comparison views, sub-feature ID namespacing (`{sectionId}-{subFeatureId}`) would be required to avoid DOM id collisions.

---

## Response

> Date: 2026-03-20

All items addressed. The following files were created:

| Arch Review Item | File Created |
|------------------|-------------|
| #1 Navigation Architecture Pattern | `docs/requirements/technical-overview/navigation/README.md` |
| #2 Section and Tier Data Layer Convention | `docs/requirements/technical-overview/data-model/README.md` |
| #3 Ads/Unified Ads Consolidation | `docs/requirements/technical-overview/data-model/README.md` (section within) |
| #4 Feature Flag Rollout Pattern | `docs/requirements/technical-overview/dev-standards/README.md` |
| #5 React Context Pattern | `docs/requirements/technical-overview/dev-standards/README.md` |
| #6 WCAG 2.1 AA Accessibility Baseline | `docs/requirements/technical-overview/dev-standards/README.md` |
| #7 CSS Animation and Reduced Motion | `docs/requirements/technical-overview/dev-standards/README.md` |
| #8 In-Memory View State vs. Routing | `docs/requirements/technical-overview/dev-standards/README.md` |
| Open Questions (mobile, rollout) | `docs/requirements/OPEN-QUESTIONS.md` |

Additional files:

- `docs/requirements/technical-overview/README.md` -- top-level index linking to all sub-docs.
- `docs/requirements/README.md` -- updated to link to technical-overview and open questions.

Notes on specific items:

- **#3 (Ads consolidation)** was incorporated into the data-model doc as a dedicated section rather than a separate file, since it is directly related to the section data shape and count.
- **#6 (WCAG)** includes the dangling `aria-labelledby` pattern noted in the review's Notes section, documenting that tab semantics must be omitted when no tablist is rendered.
- **Sub-feature ID uniqueness** was documented in the data-model doc per the review's note about future multi-pane concerns.
- **task-06 documentation staleness** is noted but not addressed here as it is outside the scope of the technical-overview documentation task.
