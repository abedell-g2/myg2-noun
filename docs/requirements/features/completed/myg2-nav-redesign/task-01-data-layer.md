# Task 01: Data Layer (sections.ts and tiers.ts)

> Status: done

## Goal
Define all 13 nav sections and 6 package tiers as structured TypeScript data with type-safe exports and helper functions.

## Acceptance Criteria
- [x] sections.ts exports 13 sections with id, label, icon, description, primaryCta, subFeatures
- [x] tiers.ts exports 6 tiers with accessibleSectionIds matching the requirements table
- [x] Helper functions: getAccessibleSectionIds, getLockedSectionIds, isSectionAccessible, getMinimumTierForSection
- [x] 23 passing tests covering structure, correctness, and edge cases

## Notes
- Home is first, Account is last in the sections array to match the rail ordering requirement.
- Market Intelligence is the only section gated to Enterprise-only.
- STARTER_AND_ABOVE_SECTIONS constant prevents repetition across starter through professional tiers.
