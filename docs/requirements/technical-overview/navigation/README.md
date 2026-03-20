# Navigation Architecture

> Established by: [MyG2 Navigation & IA Redesign](../../features/ready-to-implement/myg2-nav-redesign/README.md)

## Three-Layer Hub/App-Space Navigation Model

The canonical MyG2 navigation pattern is a three-layer hub/app-space model. This pattern replaces the previous accordion sidebar and governs how all current and future sections are surfaced to users.

### Layer 1 -- Icon Rail (Triggered Overlay)

- Hidden by default within section views; does not consume horizontal space while the user is working.
- Triggered by an app-space icon (grid/waffle) anchored in the top navigation bar.
- On activation, the rail slides in as an overlay -- the user stays on their current page.
- Shows one icon per section: unlocked sections are active; locked sections appear dimmed with a lock indicator.
- Tooltip on hover shows the section name (and "Upgrade to unlock" for locked entries).
- Account/Settings is pinned at the bottom of the rail, always accessible.
- Clicking an unlocked section navigates there; clicking a locked section navigates to that section's upgrade page.
- Dismisses on outside click, Escape key, or section selection.

### Layer 2 -- Home Dashboard (Section Cards)

- The Home section is a dashboard of section cards -- the primary orientation screen.
- Each card shows: icon, section name, brief description, and primary CTA.
- Unlocked sections render normally; locked sections appear visually distinct (dimmed, lock icon, "Upgrade to Unlock" CTA) -- they are always visible, never hidden.
- Clicking a locked card navigates to that section's upgrade page (features it unlocks, tier required, pricing).

### Layer 3 -- Section View (Top-Tab Sub-Feature Navigation)

- Clicking a section card (or rail icon) navigates to the section.
- Within a section, sub-features are surfaced as top tabs (horizontal tab bar).
- Sections with only one sub-feature do not render the tab bar.
- The top nav app-space icon remains accessible at all times for quick rail access without navigating away.

## Design Rationale

- The hub model scales with section count. Adding a new section requires adding a rail icon and a card -- no structural nav changes.
- Locked sections are always visible, supporting upgrade discoverability. Users are more likely to upgrade when they can see what they are missing.
- The overlay rail avoids stealing horizontal space from the working area, which was a drawback of the always-visible accordion sidebar.

## Implications for New Sections

Any engineer adding a new section must:

1. Add the section entry to the data layer (`src/data/sections.ts` in prototype; `app/view_models/vendor_admin/navigation/` list classes in production).
2. Add a rail icon and Home dashboard card -- both render automatically from the data layer.
3. Define sub-features for the section (these become top tabs in Layer 3).
4. Add the section to the appropriate tier access lists (`src/data/tiers.ts` in prototype; `app/models/access_licenses/` in production).
