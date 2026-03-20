# CLAUDE.md

## Project Overview
myg2-noun — a standalone prototyping environment for redesigning MyG2's navigation, information architecture, and page model.

Components built here are intended to integrate into **UE** (the MyG2 Rails + React monolith at `~/Developer/ue`) with minimal friction.

## Stack
- **React + TypeScript** — matches UE's frontend component conventions
- **Vite** — dev server and build (replaces Webpack for this standalone context)
- **Tailwind CSS** — same utility classes as UE
- **Jest + React Testing Library** — matches UE's JS test setup
- **Font Awesome** — matches UE's icon library
- **Storybook** — for rendering nav states and account/package scenarios in isolation

## Key Conventions (mirror UE where possible)
- Component files: `src/components/ComponentName/ComponentName.tsx` + `index.ts` barrel
- Tests alongside components: `ComponentName.test.tsx`
- Stories alongside components: `ComponentName.stories.tsx`
- Path alias `@/` maps to `src/`

## Integration Target
- UE lives at `~/Developer/ue`
- UE uses Webpack + Rails asset pipeline — components here should avoid Vite-specific imports
- Match UE's Tailwind config when finalised
- No Rails backend needed here — use mock data and fixtures

## Dev Standards
- Consult `docs/requirements/` before implementing any feature
- Run tests after every change: `npm test`
- All components must have at least a smoke test before being considered done
