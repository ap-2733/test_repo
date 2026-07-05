# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is an npm-workspaces + Turborepo monorepo that shares one React component library across a React web app and a React Native mobile app:

- `apps/web` — Vite + React 18 web app.
- `apps/mobile` — React Native 0.86 (New Architecture) app, Android and iOS projects included.
- `packages/ui` (`@repo/ui`) — the shared component library consumed by both apps via workspace resolution (`"@repo/ui": "*"`).

**Platform-specific file resolution**: components in `packages/ui/src` that need different implementations per platform are split into a default file and a `.native` variant, e.g. `Avatar.tsx` (web/DOM) + `Avatar.native.tsx` (React Native), `ListItem.tsx` + `ListItem.native.tsx`. Both are exported from the same `index.ts` under one specifier (e.g. `./Avatar`). The correct file is picked per-consumer at build time:
  - Metro (mobile) resolves `.native.tsx` automatically.
  - TypeScript resolves it via `moduleSuffixes: [".native", ""]` in `apps/mobile/tsconfig.json`.
  - Vite/web just resolves the plain `.tsx` file since there is no `.native` suffix handling there.
  - Jest resolves per-project config in `packages/ui/jest.config.js` (see Testing below) — there is no `haste`/platform-suffix magic outside of that; the web test project only ever sees the plain file, the native project's `react-native` preset applies the platform suffix resolution.

  When adding a new cross-platform component, follow this same pattern: put shared logic (hooks, utils) in a plain file, and split only the rendering into `Component.tsx` / `Component.native.tsx`.

- Shared, non-platform-specific logic (hooks like `useAvatar`, utils like `getInitials`, `stringToColor`, `getData`) live in plain `.ts` files reused by both variants.
- `apps/web` uses `react-window` for list virtualization; `apps/mobile` uses `@shopify/flash-list`. Both feed the same `ListItem`/`Avatar` components from `@repo/ui`.

## Commands

All commands below can be run from the repo root unless noted.

- Install: `npm install` (npm workspaces; do not use yarn/pnpm).
- Build all: `npm run build` (turbo, runs each workspace's `build`).
- Type-check / lint all: `npm run type-check` or `npm run lint` — both currently just run `tsc --noEmit` per workspace (there is no separate ESLint config in this repo; "lint" == typecheck).
- Run the web app: `npm run web` (equivalent to `cd apps/web && vite`).
- Run the mobile app (Metro + Android): `npm run android` (starts Metro and `react-native run-android` concurrently via `concurrently`).
- Tests live only in `packages/ui` (the shared component library). From `packages/ui/`:
  - `npm test` — runs the full Jest suite (both `web` and `native` projects).
  - `npx jest --selectProjects web` / `npx jest --selectProjects native` — run just one platform's project.
  - `npx jest -t "<name>"` — run tests matching a name across both projects.
  - `npx jest path/to/File.web.test.tsx` — run a single file.

## Testing setup (`packages/ui`)

Jest is configured with **two projects** in `packages/ui/jest.config.js`, because the same component (e.g. `ListItem`) has a DOM version and a React Native version that must be tested under different environments:

- **`web` project**: `testEnvironment: jsdom`, matches `src/**/*.web.test.{ts,tsx}`, uses `@testing-library/react` + `@testing-library/jest-dom` (loaded via `jest.setup.web.ts`). CSS Modules (`*.module.css`) are mapped to `identity-obj-proxy`. Plain babel transform (`babel.config.js` uses `@react-native/babel-preset`, which also works fine for plain web/TS/JSX).
  - jsdom has no native `PointerEvent`; `jest.setup.web.ts` polyfills `window.PointerEvent` on top of `MouseEvent` so `fireEvent.pointerDown/Move/Up` carry `clientX`/`clientY` correctly. Without this, pointer coordinates silently come through as `undefined`.
  - Swipe-gesture tests (`ListItem.web.test.tsx`) dispatch `pointerdown` on the element and `pointermove`/`pointerup` on `window` (matching how `ListItem.tsx` attaches its listeners), and use `jest.useFakeTimers()` since the delete animation is chained via `setTimeout`.
- **`native` project**: `preset: "react-native"` (backed by `@react-native/jest-preset`, which supplies the RN environment, mocks, and `.native.tsx` platform-suffix resolution automatically), matches `src/**/*.native.test.tsx`, uses `@testing-library/react-native`.
  - `@testing-library/react-native` v14's `render()` is **async** — always `await render(...)`, and `await fireEvent(...)` too (it also returns a thenable). Not awaiting `act()`/`fireEvent` calls that trigger animations can leak pending timers into the *next* test (symptom: the next test's `render()` produces an empty tree).
  - `screen` no longer exposes `UNSAFE_getByType`/`UNSAFE_queryAllByType` in this version. To find a host element by type, use `screen.root.queryAll(node => node.type === "TypeName", { includeSelf: true })` (note `includeSelf` defaults to `false`, so pass it explicitly if the target can be the root itself).
  - Testing `PanResponder`-based gesture components (e.g. `ListItem.native.tsx`): don't try to hand-simulate raw touch/gesture math (RN's `PanResponder` computes `gestureState` internally from low-level touch history, which is impractical to fake accurately). Instead mock `react-native/Libraries/Interaction/PanResponder` (it's a default export, so the mock factory needs `{ __esModule: true, default: { create: (config) => ({ panHandlers: config, ... }) } }`) so `panHandlers` becomes the raw callback config, then `fireEvent(node, "onPanResponderRelease", evt, { dx })` invokes the component's own handler directly with a controlled `gestureState`.
  - Versions matter here: `jest@30` is incompatible with `@react-native/jest-preset@0.86.0` (mismatched `jest-mock` internals, throws `clearMocksOnScope is not a function`) — this repo pins `jest@^29` / `jest-environment-jsdom@^29` / `babel-jest@^29` in `packages/ui` for that reason. Don't bump jest in this package without checking `@react-native/jest-preset` compatibility.
