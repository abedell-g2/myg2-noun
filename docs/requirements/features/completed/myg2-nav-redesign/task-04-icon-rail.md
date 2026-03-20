# Task 04: IconRail Slide-in Overlay

> Status: done

## Goal
Build the icon rail overlay that slides in from the left, showing one icon per section with locked/unlocked states.

## Acceptance Criteria
- [x] Shows all 13 section icons when open
- [x] Hidden when isOpen is false
- [x] Locked sections show lock indicator and "(Upgrade to unlock)" in aria-label
- [x] Account pinned at bottom of rail
- [x] Active section highlighted
- [x] Clicking backdrop closes rail
- [x] Clicking a section (locked or unlocked) fires onSectionClick
- [x] 10 passing tests

## Notes
- Slide-in animation via CSS @keyframes in index.css.
- Backdrop overlay for dismissal on outside click.
