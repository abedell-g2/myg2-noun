# Open Questions

This file tracks unresolved product, business, and technical questions across all features. Questions are non-blocking unless explicitly marked otherwise.

---

## OQ-001: Mobile Navigation Behavior

> Source: [MyG2 Navigation & IA Redesign](./features/ready-to-implement/myg2-nav-redesign/README.md)
> Category: Product/Business
> Blocking: No
> Status: Open

**Question**: What is the mobile navigation behavior -- is the icon rail collapsed to a bottom tab bar, or a hamburger menu?

**Context**: The prototype is desktop-first; the mobile interaction model is undefined and deferred. This must be resolved before the production UE implementation ships. The current prototype uses a responsive grid layout on the Home dashboard but does not define mobile-specific navigation interactions.

---

## OQ-002: Navigation Rollout Strategy

> Source: [MyG2 Navigation & IA Redesign](./features/ready-to-implement/myg2-nav-redesign/README.md)
> Category: Product/Business
> Blocking: No
> Status: Open

**Question**: What is the rollout strategy -- full cutover, per-tier rollout, or per-cohort rollout?

**Context**: The requirements state the new nav should be gated by a feature flag, but the rollout sequencing (which tiers/cohorts get it first) has not been decided. The feature flag infrastructure is documented as a [dev standard](./technical-overview/dev-standards/README.md#feature-flag-requirement-for-navigation-variants), but the specific rollout plan is a product decision.
