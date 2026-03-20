# Task 08: Wire up App with Navigation State

> Status: done

## Goal
Integrate all components in App.tsx with view state management and navigation between home, section, and upgrade views.

## Acceptance Criteria
- [x] App renders TopNav, HomeDashboard by default
- [x] Waffle icon opens/closes IconRail
- [x] Section card CTA navigates to SectionView
- [x] Locked section CTA navigates to UpgradePage
- [x] Back buttons return to Home
- [x] Rail icon clicks navigate to section (or upgrade for locked)
- [x] Rail closes after section selection
- [x] Tier switcher is accessible
- [x] 10 passing tests

## Notes
- View state managed as a discriminated union (home | section | upgrade).
- TierProvider wraps the entire app for global tier access.
- isSectionAccessible used to route locked sections to upgrade page.
