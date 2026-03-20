# Task 02: TierContext for Active Tier Management

> Status: done

## Goal
Create a React context that holds the active tier and provides memoized helper functions for checking section access.

## Acceptance Criteria
- [x] TierProvider wraps children and provides tier state
- [x] useTier hook exposes activeTierId, setActiveTierId, isSectionAccessible, accessibleSections, lockedSections
- [x] Default tier is "starter"
- [x] Accepts initialTierId prop for testing/demo
- [x] 6 passing tests

## Notes
- useMemo and useCallback used to prevent unnecessary re-renders.
- Throws error if useTier is called outside TierProvider.
