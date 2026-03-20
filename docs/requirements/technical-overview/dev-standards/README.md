# Development Standards

> Established by: [MyG2 Navigation & IA Redesign](../../features/ready-to-implement/myg2-nav-redesign/README.md)

This document captures architectural standards and conventions that apply across the MyG2 codebase. Each standard is linked to the feature that established it.

---

## Feature Flag Requirement for Navigation Variants

New navigation variants must be wrapped in a feature flag to enable rollout control. The feature flag gates which navigation model renders; when the flag is off, the existing navigation renders unchanged.

This applies to the current accordion-to-hub migration and should be the standard for any future navigation or large-scale UI migration in this codebase.

**Rationale**: The requirements explicitly call for a feature-flagged rollout mechanism. This allows the previous accordion nav to remain active during the transition and enables per-tier or per-cohort rollout strategies.

---

## React Context Pattern for Global UI State

Global UI state that needs to be shared across multiple components (e.g., the active package tier, section access lists) is managed via React Context with a Provider/hook pattern.

### Pattern

```tsx
// Provider wraps the component tree
<TierProvider>
  <App />
</TierProvider>

// Consumer uses a custom hook
const { activeTier, isSectionAccessible } = useTier();
```

### Conventions

- Context values derived from state are memoized with `useMemo` and `useCallback` to prevent unnecessary re-renders.
- **Testability**: The Provider accepts an `initialValue` prop so that tests can supply known state without requiring store or router setup. This is a required pattern for all new Context providers.

**Example** (from `TierContext`):
```tsx
<TierProvider initialValue={{ activeTierId: 'starter' }}>
  <ComponentUnderTest />
</TierProvider>
```

---

## WCAG 2.1 AA Accessibility Baseline

All interactive navigation components must meet WCAG 2.1 AA. The following patterns are required:

### Tab Navigation

- Use `role="tablist"` / `role="tab"` / `role="tabpanel"` with `aria-selected`, `aria-controls`, and `aria-labelledby` linkage.
- Tab semantics (`role`, `aria-controls`, `aria-labelledby`) must be omitted or conditional when there is only one item and no tablist is rendered. Rendering a tablist with a single tab is semantically incorrect.

### Icon-Only Buttons

- Accessible labels are required on all icon-only buttons (via `aria-label` or visually hidden text).

### Overlays

- Decorative or interaction-only overlay elements (e.g., dismissal backdrops) must have `aria-hidden="true"` to be excluded from assistive technology.
- Overlays must dismiss on Escape key.
- Focus must be moved into the overlay when it opens (auto-focus).

### Keyboard Navigation

- Icon rail: ArrowUp/ArrowDown to navigate between items with wrapping.
- Escape to dismiss overlays.
- Tab key for standard focus management.

### Dangling ARIA References

Tab semantics (`aria-controls`, `aria-labelledby`, etc.) must only reference DOM element IDs that actually exist in the rendered output. When a tablist is conditionally hidden (e.g., single sub-feature sections), the associated `aria-labelledby` on the tabpanel must also be omitted to avoid a dangling reference.

---

## CSS Animation and Reduced Motion

Slide-in and transition animations must respect the OS-level `prefers-reduced-motion` setting.

### Required Pattern

Animations must be wrapped in a `prefers-reduced-motion` media query so that users who have configured reduced motion do not experience motion-based transitions:

```css
@media (prefers-reduced-motion: no-preference) {
  .animated-element {
    animation: slide-in-left 0.2s ease-out;
  }
}
```

Custom keyframe animations are defined in `src/index.css`.

**Rationale**: This is an accessibility requirement related to WCAG 2.3. It is a cross-cutting concern that applies to all animated UI components, not just navigation.

---

## In-Memory View State vs. Client-Side Routing

The prototype uses a discriminated-union in-memory view state (not React Router) for navigation between home, section, and upgrade views. **This is acceptable for prototype/validation environments only.**

### Production Requirement

The production UE implementation requires URL-based routing (`/section/:id`, `/upgrade/:id`) to satisfy the acceptance criterion that existing section deep links continue to work.

The prototype's in-memory approach must not be carried forward into the Rails/React production app.

### Why This Matters

- Deep links to specific sections must continue to work after the navigation redesign ships.
- Browser back/forward behavior depends on URL-based routing.
- Analytics and monitoring tools rely on URL changes to track page views.

This constraint must be visible during the UE integration phase, not only in the feature's SUMMARY.md.
