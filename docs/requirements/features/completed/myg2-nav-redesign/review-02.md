# Review 02

> Status: addressed
> Date: 2026-03-20
> Reviewer: Code Review Agent
> Verdict: APPROVE

## Previous Review Status

All 7 Critical and Important items from review-01 have been addressed:

- [x] Critical #1: SectionView single sub-feature tab bar -- FIXED. `SectionView.tsx:43` now conditionally renders the tablist only when `section.subFeatures.length > 1`. Test updated at `SectionView.test.tsx:75-79` to assert the tab bar is NOT present.
- [x] Critical #2: Stale activeTabId state -- FIXED. `App.tsx:77` uses `key={currentView.sectionId}` on SectionView to force remounting. New integration test at `App.test.tsx:89-105` verifies tab state resets across section navigation.
- [x] Critical #3: No Playwright e2e tests -- FIXED. 12 e2e tests in `e2e/navigation.spec.ts`, Playwright configured in `playwright.config.ts`, `@playwright/test` added to devDependencies.
- [x] Important #4: 13 sections comment -- FIXED. Detailed comment at `sections.ts:32-37` explaining the Ads/Unified Ads consolidation.
- [x] Important #5: Tab accessibility (aria-controls/tabpanel) -- FIXED. `SectionView.tsx:51-53` adds `id` and `aria-controls` to tab buttons; lines 69-71 add `role="tabpanel"`, `id`, `aria-labelledby` to the content panel. Two new tests at `SectionView.test.tsx:82-98` verify ARIA linkage.
- [x] Important #6: Icon rail keyboard navigation -- FIXED. Full keyboard handler at `IconRail.tsx:32-59` with Escape, ArrowUp/ArrowDown with wrapping. Auto-focus on open at lines 61-69. Three new tests at `IconRail.test.tsx:107-149`.
- [x] Important #7: Backdrop aria-hidden -- FIXED. `IconRail.tsx:80` has `aria-hidden="true"`. Test at `IconRail.test.tsx:101-105`.

## New Findings

### Critical (Must Fix)

None.

### Important (Should Fix)

1. **[/Users/abedell/Developer/myg2-noun/src/components/SectionView.tsx:71] `aria-labelledby` references non-existent element for single sub-feature sections.**

   When a section has only one sub-feature (e.g., AI Custom Research), the tablist is correctly hidden. However, the `tabpanel` still renders with `aria-labelledby="tab-research"`, which points to an element (`id="tab-research"`) that does not exist in the DOM since the tablist was not rendered. This is a minor WCAG violation -- `aria-labelledby` should reference an existing element, or be omitted when the referenced element is absent.

   The test at `SectionView.test.tsx:93-98` actually validates this broken reference (asserting `aria-labelledby="tab-research"` exists on the tabpanel when there is no corresponding tab element).

   **Suggested fix**: When there is only a single sub-feature, either:
   - Omit `aria-labelledby` and `role="tabpanel"` on the content area (since it is not functioning as a tabpanel without a tablist), or
   - Add a visually hidden heading and reference that instead.

   Option A (simplest -- remove tab semantics for single sub-feature):
   ```tsx
   <div
     role={section.subFeatures.length > 1 ? "tabpanel" : undefined}
     id={section.subFeatures.length > 1 ? `tabpanel-${activeTabId}` : undefined}
     aria-labelledby={section.subFeatures.length > 1 ? `tab-${activeTabId}` : undefined}
     className="rounded-xl border border-gray-200 bg-white p-8"
   >
   ```

### Suggestions (Consider)

2. **[/Users/abedell/Developer/myg2-noun/src/data/sections.ts] Sub-feature IDs are not globally unique.**

   Multiple sections share sub-feature IDs (e.g., `"overview"` in both Home and Profile, `"campaigns"` in both Review Management and Advertise, `"dashboard"` in both Home's "Getting Started" and ROI). Since only one section view renders at a time, this causes no DOM collision today. However, if the architecture ever changes to render multiple section views simultaneously (e.g., a comparison view or split-pane), these IDs would collide. Consider namespacing sub-feature IDs as `{sectionId}-{subFeatureId}` (e.g., `"home-overview"`, `"profile-overview"`).

3. **[/Users/abedell/Developer/myg2-noun/src/components/TopNav.tsx:22] The waffle icon button `aria-label` does not reflect open/close state.**

   The button always reads "Open navigation" even when the rail is open and clicking it would close the rail. Consider toggling the label based on the `isRailOpen` prop:
   ```tsx
   aria-label={isRailOpen ? "Close navigation" : "Open navigation"}
   ```
   This provides more accurate screen reader feedback about the button's current action.

4. **[/Users/abedell/Developer/myg2-noun/e2e/navigation.spec.ts:214] The e2e test for single sub-feature uses `not.toBeVisible()` on a tablist that is not in the DOM at all.**

   Line 214: `await expect(page.getByRole("tablist")).not.toBeVisible()`. When the tablist is conditionally not rendered (via `{condition && <div role="tablist">...}`), the element does not exist in the DOM. `not.toBeVisible()` may behave differently than `not.toBeAttached()` or `toHaveCount(0)` in this scenario. Playwright's `not.toBeVisible()` should handle non-existent elements correctly (passing the assertion), but `toHaveCount(0)` would be a more semantically precise assertion:
   ```ts
   await expect(page.getByRole("tablist")).toHaveCount(0);
   ```

5. **[/Users/abedell/Developer/myg2-noun/src/components/IconRail.tsx:88] The icon rail `<nav>` element has a long chain of Tailwind classes that could benefit from extraction.**

   The `className` string at line 88 is 130+ characters. While this is a prototype, extracting it to a variable or using `clsx` would improve readability.

### Praise

- **Thorough response to review-01**: Every Critical and Important item was addressed with both code changes and corresponding test updates. The developer response section in review-01 is a model of clear communication.

- **Key-based remounting is the right pattern**: Using `key={currentView.sectionId}` on `SectionView` (App.tsx:77) is cleaner and more robust than a `useEffect`-based reset. It guarantees all component state resets, not just the tracked pieces, and is idiomatic React.

- **Keyboard navigation is well-implemented**: The ArrowUp/ArrowDown wrapping logic in `IconRail.tsx:32-59` is correct and handles all edge cases (first-to-last, last-to-first). Auto-focus on open is a nice touch that benefits both keyboard and screen reader users.

- **E2e test coverage is comprehensive**: The 12 Playwright tests cover all major user flows -- home rendering, rail open/close (waffle toggle, Escape key), accessible section navigation, locked section upgrade flow, back navigation, tier switching across 3 tiers, rail-based navigation, locked rail sections, and the single sub-feature edge case.

- **SUMMARY.md is excellent documentation**: The implementation summary is clear, well-structured, and includes a "Suggested Next Steps" section that captures the unaddressed review-01 suggestions (semantic HTML, reduced motion, URL routing) alongside other production considerations.

- **88 unit tests with no failures**: The test suite is comprehensive and all tests pass cleanly in 2.1 seconds. Test patterns are consistent across all 9 suites (render helpers, FontAwesome mocking, proper use of `userEvent.setup()`).

## Acceptance Criteria Trace

| Criterion | Status | Notes |
|-----------|--------|-------|
| All 6 tier types render correct sections in icon rail -- unlocked active, locked dimmed | PASS | Verified via `IconRail.test.tsx` for basic (10 locked), starter (1 locked), enterprise (0 locked). E2e test covers tier switching. |
| Home dashboard displays one card per section: active for accessible, locked for inaccessible -- no sections hidden | PASS | `HomeDashboard.test.tsx` asserts 13 cards, correct upgrade CTA counts. E2e test verifies 13 cards. |
| Clicking a section card navigates to that section's view with top tabs | PASS | `App.test.tsx:45-51` and e2e test verify full flow. |
| No existing section URLs break (deep links continue to work) | N/A | Prototype uses in-memory state. Documented in SUMMARY.md as a production follow-up. |
| Existing access license gating logic is sole source of truth | PASS | Components read from TierContext; no inline gating logic. |
| Prototype built in myg2-noun validates the interaction model | PASS | Full interactive prototype with tier switching, all navigation flows. |
| Section with 1 sub-feature renders without tab bar | PASS | `SectionView.tsx:43` conditionally renders tablist. Unit test and e2e test both verify. |

## Summary

- **Overall assessment**: APPROVE
- **Key observations**: All 7 Critical and Important items from review-01 have been thoroughly addressed with both code changes and test coverage. The implementation is clean, well-tested, and faithfully implements the requirements. The one new Important finding (dangling `aria-labelledby` for single sub-feature sections) is a minor accessibility nit that does not block the prototype from serving its purpose. The suggestions are all optional improvements.
- **Estimated effort for remaining items**: The Important #1 (aria-labelledby fix) would take approximately 10 minutes. The suggestions are optional and could be addressed in a future pass.
- **Recommendation**: This branch is ready to merge. The prototype successfully validates the hub/app-space navigation model across all 6 tiers with comprehensive unit and e2e test coverage.
