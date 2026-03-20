# Review 01

> Status: addressed
> Date: 2026-03-19
> Reviewer: Code Review Agent
> Verdict: REQUEST CHANGES

## Previous Review Status

No previous reviews.

## New Findings

### Critical (Must Fix)

1. **[/Users/abedell/Developer/myg2-noun/src/components/SectionView.tsx:43] Single sub-feature sections should hide the tab bar per requirements.**

   The requirements explicitly state in the Edge Cases table: "Section has only 1 sub-feature (no tabs needed) -- Section view renders without tab bar." However, the current `SectionView` component always renders the tab bar regardless of the sub-feature count. The test at `/Users/abedell/Developer/myg2-noun/src/components/SectionView.test.tsx:75` ("renders section with single sub-feature without hiding tabs") explicitly tests that the tab IS shown for a single sub-feature, which contradicts the requirement.

   **Suggested fix**: Conditionally render the `tablist` div only when `section.subFeatures.length > 1`. Update the corresponding test to assert the tab bar is NOT present when there is a single sub-feature.

   ```tsx
   {section.subFeatures.length > 1 && (
     <div role="tablist" className="mb-6 flex gap-1 border-b border-gray-200">
       ...
     </div>
   )}
   ```

2. **[/Users/abedell/Developer/myg2-noun/src/components/SectionView.tsx:13-14] `activeTabId` state does not reset when `sectionId` prop changes.**

   The `useState` initializer only runs on mount. If a user navigates from one section to another (e.g., via the icon rail without returning to home), the `activeTabId` will be stale from the previous section, potentially leading to "Unknown" content or an invisible tab selection. This is a correctness bug.

   **Suggested fix**: Add a `useEffect` or use a key-based remounting strategy:

   Option A -- `useEffect`:
   ```tsx
   useEffect(() => {
     setActiveTabId(section?.subFeatures[0]?.id ?? "");
   }, [sectionId]);
   ```

   Option B -- Key on the parent in `App.tsx`:
   ```tsx
   <SectionView key={currentView.sectionId} sectionId={currentView.sectionId} onBackClick={navigateHome} />
   ```

   Add a test that verifies tab state resets when navigating between sections.

3. **No Playwright e2e tests exist for this feature.**

   The reviewer guidelines state: "Every new user-facing feature must have Playwright e2e tests in `e2e/`. Missing e2e coverage for a new feature is a Critical finding." There is no `e2e/` directory or Playwright configuration in the project. While this is a prototype, the project's own standards require e2e coverage.

   **Suggested fix**: Set up Playwright and add e2e tests covering at minimum:
   - Home dashboard renders all section cards
   - Icon rail opens/closes via waffle icon
   - Clicking an accessible section card navigates to the section view with tabs
   - Clicking a locked section shows the upgrade page
   - Tier switcher changes what sections are accessible/locked
   - Back navigation from section view and upgrade page

### Important (Should Fix)

4. **[/Users/abedell/Developer/myg2-noun/src/data/sections.ts] Requirements say "14 existing sections" but data layer has 13 -- clarification needed in code comments.**

   The requirements README says "Existing Sections (14 total, as-is -- no changes proposed)" and lists 13 rows in the table (Home through Account). The 14th is the separation of Advertisements vs. Unified Ads, which the requirements then say should be unified as a single "Advertise" entry. The data layer correctly implements 13 sections, but nowhere in the code is this discrepancy documented. A reader of the requirements versus the code would be confused.

   **Suggested fix**: Add a code comment near `SECTIONS` explaining why there are 13 sections instead of the 14 mentioned in the requirements, referencing the Ads/Unified Ads consolidation.

5. **[/Users/abedell/Developer/myg2-noun/src/components/SectionView.tsx:43-61] Tab elements are missing `tabpanel` and `id`/`aria-controls` linkage.**

   The tabs use `role="tab"` and `aria-selected` correctly, but WCAG 2.1 AA requires tabs to be linked to their corresponding `tabpanel` via `aria-controls` and `id` attributes. Currently there is no `role="tabpanel"` on the content area, and no `aria-controls` on the tab buttons.

   **Suggested fix**:
   ```tsx
   <button
     key={sf.id}
     role="tab"
     id={`tab-${sf.id}`}
     aria-selected={isActive}
     aria-controls={`tabpanel-${sf.id}`}
     ...
   >

   <div
     role="tabpanel"
     id={`tabpanel-${activeTabId}`}
     aria-labelledby={`tab-${activeTabId}`}
     className="rounded-xl border border-gray-200 bg-white p-8"
   >
   ```

6. **[/Users/abedell/Developer/myg2-noun/src/components/IconRail.tsx:27-88] Icon rail lacks keyboard navigation support.**

   The requirements list "Keyboard navigation support for the icon rail and top tabs" as a P1 Should Have. The icon rail does not handle arrow key navigation between items, nor does it handle `Escape` to dismiss the rail. The Escape key dismissal is especially important since the rail is an overlay.

   **Suggested fix**: Add an `onKeyDown` handler to the rail `<nav>` that:
   - Closes the rail on `Escape`
   - Moves focus between icon buttons on `ArrowUp`/`ArrowDown`

   Also add `tabIndex={0}` on the rail or use `useRef` with `focus()` so the rail can receive keyboard input when opened.

7. **[/Users/abedell/Developer/myg2-noun/src/components/IconRail.tsx:29-33] Backdrop overlay should have `aria-hidden="true"` or otherwise be excluded from the accessibility tree.**

   Screen readers will encounter the transparent backdrop as a clickable div with no label. It serves a purely visual/interaction purpose and should be hidden from assistive technology.

   **Suggested fix**: Add `aria-hidden="true"` to the backdrop div.

8. **[/Users/abedell/Developer/myg2-noun/src/App.tsx:47-50] `activeSectionId` defaults to "home" when on the home view, but "home" is not visually distinguished as the active section in the Home Dashboard.**

   When the user is on the home dashboard, `activeSectionId` is set to `"home"`, which highlights the Home icon in the rail. This is correct behavior for the rail, but it means navigating to the Home dashboard from a section view via the rail would highlight "Home" in the rail. This is fine. However, the initial load state also sets "home" as active before the rail is even opened, which is minor but worth noting as intentional.

   No change needed -- just flagging that this is deliberate.

### Suggestions (Consider)

9. **[/Users/abedell/Developer/myg2-noun/src/App.tsx:9-12] Consider using a proper router or URL-based state.**

   The current `View` union type with `useState` works for a prototype but means the browser's back button, deep linking, and URL sharing do not work. The acceptance criteria state: "No existing section URLs break (deep links continue to work)." While this prototype does not need to implement real URL routing, it would be worth noting in the prototype handoff that URL integration will be needed for the production implementation.

   **Suggested**: Add a comment or note in the SUMMARY.md that URL routing/deep linking will need to be wired up during the UE integration phase.

10. **[/Users/abedell/Developer/myg2-noun/src/components/HomeDashboard.tsx:24] Consider adding `role="list"` and `role="listitem"` or using semantic HTML for the card grid.**

    The grid of section cards is rendered as plain `div` elements. For screen readers, marking these up as a list or using `<ul>/<li>` would improve navigation.

11. **[/Users/abedell/Developer/myg2-noun/src/index.css:3-14] Consider using `prefers-reduced-motion` media query for the slide-in animation.**

    Users who have configured their OS to reduce motion should not see the rail slide animation. Wrap the keyframe usage:
    ```css
    @media (prefers-reduced-motion: no-preference) {
      .animate-slide-in {
        animation: slide-in-left 0.2s ease-out;
      }
    }
    ```

12. **[/Users/abedell/Developer/myg2-noun/src/App.test.tsx:64] The "navigates to upgrade page when locked section CTA is clicked" test relies on there being exactly one "Upgrade to Unlock" button.**

    At line 64, `screen.getByText("Upgrade to Unlock")` is used, but the default tier is Starter which has exactly one locked section (Market Intelligence). If the tier data changes, this test breaks. Consider querying more specifically, e.g., by finding the card for market-intelligence first and then clicking its button.

### Praise

- **Clean data model separation**: The `sections.ts` and `tiers.ts` data files are well-structured, with clear interfaces and helper functions. This mirrors the requirements' intent that "no inline hardcoding of section lists or access rules in components."

- **TierContext is well-designed**: The context provides both the raw data (`accessibleSections`, `lockedSections`) and convenience functions (`isSectionAccessible`), all memoized properly with `useMemo` and `useCallback`. The `initialTierId` prop makes testing trivial.

- **Thorough unit test coverage**: 81 tests across 9 suites covering data layer, context, and all 5 UI components. Tests are well-structured with consistent patterns (wrapper render functions, FontAwesome mocking). Coverage includes tier boundary conditions (Basic, Starter, Enterprise), user interactions, and error states (unknown section IDs).

- **Good component decomposition**: The 5 components (TopNav, IconRail, HomeDashboard, SectionView, UpgradePage) map cleanly to the 3-layer navigation model described in the requirements. Prop drilling is minimal thanks to the context, and callback prop naming is descriptive (`onSectionClick`, `onUpgradeClick`, `onBackClick`).

- **Correct locked section behavior**: The implementation correctly shows locked sections in both the rail and the home dashboard (never hidden), and routes locked clicks through the upgrade page -- matching the resolved design decision in the requirements.

- **Account pinned to rail bottom**: The `IconRail` correctly separates Account from the main section list and renders it in a `mt-auto` container with a top border, fulfilling the "Account/Settings pinned at the bottom" requirement.

- **Good TypeScript usage**: The discriminated union type for `View` in `App.tsx` ensures exhaustive view handling. The `Section` and `Tier` interfaces enforce shape consistency.

## Acceptance Criteria Trace

| Criterion | Status | Notes |
|-----------|--------|-------|
| All 6 tier types render correct sections in icon rail -- unlocked active, locked dimmed | PASS | Verified via `IconRail.test.tsx` tests for basic (10 locked), starter (1 locked), enterprise (0 locked) |
| Home dashboard displays one card per section: active for accessible, locked for inaccessible -- no sections hidden | PASS | `HomeDashboard.test.tsx` asserts 13 cards total, correct upgrade CTA counts per tier |
| Clicking a section card navigates to that section view with top tabs | PASS | `App.test.tsx` line 45-51: clicks "Manage Reviews", asserts section title + tab rendered |
| No existing section URLs break (deep links continue to work) | N/A | Prototype uses in-memory state, not URL routing. Acceptable for prototype phase. |
| Existing access license gating logic is sole source of truth | PASS | Components read from `TierContext` which reads from `tiers.ts` data. No inline gating. |
| Prototype built in myg2-noun validates interaction model | PASS | Full interactive prototype with tier switching. |
| Section with 1 sub-feature renders without tab bar | FAIL | SectionView always renders the tab bar. See Critical #1. |

## Summary

- **Overall assessment**: REQUEST CHANGES
- **Key concerns**:
  1. **SectionView violates the single-sub-feature tab bar requirement** -- the edge case table explicitly says "Section view renders without tab bar" but the implementation always shows tabs. This is a direct requirement miss.
  2. **Stale tab state bug** -- navigating between sections without returning to home will leave `activeTabId` pointing at the previous section's tab. This is a correctness issue.
  3. **No e2e test coverage** -- per project review standards, this is a critical gap for any user-facing feature.
- **Estimated effort to address feedback**:
  - Critical #1 (single sub-feature tabs): ~15 minutes
  - Critical #2 (stale tab state): ~10 minutes
  - Critical #3 (e2e tests): ~2-3 hours (includes Playwright setup)
  - Important items (a11y, keyboard nav, comments): ~1-2 hours
  - Total: ~3-5 hours

---

## Developer Response

All Critical and Important items have been addressed. Here is a summary of what changed:

### Critical #1: Single sub-feature tab bar
- **Fixed**: `SectionView.tsx` now conditionally renders the `tablist` only when `section.subFeatures.length > 1`.
- **Test updated**: The test previously asserting tabs WERE shown for single sub-feature sections now asserts they are NOT shown.

### Critical #2: Stale activeTabId state
- **Fixed**: Added `key={currentView.sectionId}` to `SectionView` in `App.tsx` so the component remounts (and resets all state) when navigating between sections.
- **Test added**: New test in `App.test.tsx` verifies that switching tabs in one section, then navigating to another section via the icon rail, resets the active tab to the first tab.

### Critical #3: Playwright e2e tests
- **Set up**: Installed `@playwright/test`, created `playwright.config.ts`, added `test:e2e` and `test:all` npm scripts.
- **12 e2e tests written** in `e2e/navigation.spec.ts` covering:
  - Home dashboard renders all 13 section cards
  - Icon rail opens via waffle icon and closes via Escape key
  - Icon rail closes when waffle icon is toggled again
  - Clicking an accessible section card navigates to section view with tabs
  - Clicking a locked section card shows upgrade page
  - Back navigation from section view and upgrade page
  - Tier switcher changes accessible/locked sections (Basic, Starter, Enterprise)
  - Navigating to a section via the icon rail
  - Icon rail shows locked sections with upgrade tooltip
  - Clicking a locked section in the rail navigates to upgrade page
  - Single sub-feature section renders without tab bar

### Important #4: 13 sections comment
- **Added**: Detailed code comment above the `SECTIONS` array in `sections.ts` explaining why there are 13 sections instead of 14, referencing the Ads/Unified Ads consolidation.

### Important #5: Tab accessibility
- **Added**: `id`, `aria-controls` on tab buttons and `role="tabpanel"`, `id`, `aria-labelledby` on the content panel in `SectionView.tsx`.
- **Tests added**: Two new tests verifying ARIA linkage between tabs and tabpanel.

### Important #6: Icon rail keyboard navigation
- **Added**: `Escape` key closes the rail, `ArrowUp`/`ArrowDown` moves focus between icon buttons with wrapping. First button auto-focuses when rail opens.
- **Tests added**: Three new unit tests for Escape, arrow key navigation with wrapping, and auto-focus on open.

### Important #7: Backdrop aria-hidden
- **Added**: `aria-hidden="true"` on the backdrop div in `IconRail.tsx`.
- **Test added**: Verifies the backdrop has `aria-hidden="true"`.

### Suggestions (not explicitly requested but addressed)
- #8: No change needed (acknowledged as intentional).
- #9: Already noted in SUMMARY.md that URL routing/deep linking will need to be wired up during UE integration.
- #10, #11, #12: Not addressed in this round -- these are lower-priority suggestions for future consideration.

### Test totals after changes
- **88 unit tests** across 9 suites (all passing)
- **12 Playwright e2e tests** (all passing)
