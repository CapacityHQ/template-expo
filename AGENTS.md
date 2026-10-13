# Working in this repository

This is a pnpm workspace. Packages live under `packages/`; the only one today is
`packages/mobile`, the phone app: Expo SDK 55 (React Native 0.83, React 19.2), Expo Router with
native tabs, NativeWind 4 (Tailwind CSS 3 classes on React Native components), zustand for
state, `expo-sqlite/kv-store` for the settings.

## Expo moves fast: read the docs for this SDK, not your memory

Expo ships breaking changes every SDK release; APIs you remember may be renamed, moved or gone.
Before writing code that touches an Expo, EAS or React Native API, read the major version of
`expo` in `packages/mobile/package.json` and use the matching docs,
`https://docs.expo.dev/versions/v<major>.0.0/` (55 today). `https://docs.expo.dev/llms.txt`
indexes every page. Expo's own `AGENTS.md` for this template version says the same.

## Commands

Run everything from the repository root with pnpm (never npm, yarn or bun; the lockfile is
`pnpm-lock.yaml`):

- `pnpm install` installs every package
- `pnpm dev` starts Metro with Expo Go as the target (`expo start --go --port 8081` in
  `packages/mobile`); `pnpm --filter ./packages/mobile ios` or `android` also opens the app in
  the iOS Simulator or the Android emulator
- `pnpm typecheck`, `pnpm lint`, `pnpm test` run in every package (`tsc --noEmit`, `expo lint`,
  Vitest over `packages/mobile/test/`)
- `pnpm --filter ./packages/mobile exec expo install <package>` adds a dependency at the
  version this SDK supports. Always this, never a bare `pnpm add`, for anything Expo or
  React Native. `expo install --fix` repairs versions, `npx expo-doctor` diagnoses the project.

Inside Capacity the app is already running (`pnpm --silent dev` in `packages/mobile`,
supervised by Capacity, Metro on port 8081): never start a second `pnpm dev` or `expo start`.
Every saved file reaches the running app through Fast Refresh; a change to `app.json`,
`babel.config.js`, `metro.config.js` or `tailwind.config.js` needs a restart from Capacity
(Metro caches them). Metro's output and the app's `console` calls appear in Capacity's
Application Logs panel. Run lint and typecheck before declaring a task done.

## Mobile conventions

- Routes live in `packages/mobile/src/app/`: every file there is a screen, `_layout.tsx` is
  the navigator (native tabs, `expo-router/unstable-native-tabs`: the real iOS tab bar and the
  Material one on Android). Keep components, hooks, stores and lib outside `src/app/`. `@/`
  maps to `src/`, `@/assets/` to `assets/`.
- A new tab is a route file plus a `NativeTabs.Trigger` in `_layout.tsx` (Android allows five
  tabs at most; tabs cannot be added or removed at run time). Icons come from SF Symbols on
  iOS (`sf`) and Material Symbols on Android (`md`); give both. A screen pushed from a tab, a
  detail page or a modal, needs a stack inside that tab: turn the tab's route into a folder
  with its own `_layout.tsx` rendering `<Stack />` and an `index.tsx`, then add the pushed
  screens to the folder, as the Expo Router docs for this SDK show.
- Style with NativeWind classes (`className`) on React Native's own components; `dark:`
  variants follow the app's theme. A third-party component takes `style`, or is registered
  once with `cssInterop` from `nativewind`. Prefer a class to an inline style object. Tailwind 3
  syntax, not 4 (NativeWind 4 compiles Tailwind 3).
- Theme: the settings store (`src/stores/settings.ts`) holds `theme` (system, light, dark) and
  `haptics`; `src/lib/theme.ts` applies the choice before the first render through NativeWind's
  `colorScheme.set`, which sets React Native's Appearance override, so `dark:` classes,
  `useColorScheme()`, the navigation theme and the status bar all follow the one choice. Change
  the theme through `setTheme` only. `app.json` keeps `userInterfaceStyle: "automatic"`.
- Settings persist through `expo-sqlite/kv-store` (SQLite, synchronous reads, so the store is
  ready before the first render). Add a setting as `src/stores/create-settings-store.ts` says.
  Secrets go to `expo-secure-store`, large data to a proper `expo-sqlite` database.
- Haptics: `selectionHaptic()` from `src/lib/haptics.ts` honours the setting; call it on taps
  that change something.
- Images: `expo-image`'s `Image`. Static files, including Capacity's generated assets, live in
  `packages/mobile/assets/images/` and are referenced as `require('@/assets/images/<file>')`.
- Expo Go runs the app during development and bundles a fixed set of native modules: the
  Expo SDK's. A library with its own native code (anything outside the Expo SDK that ships an
  `ios/` or `android/` folder) will not load there. Prefer Expo's modules; a library that needs
  native code needs a development build (`eas build --profile development`), which Capacity
  does not provide yet.
- No `ios/` or `android/` folders exist (continuous native generation, `expo prebuild` at build
  time). Never create or edit them; configure native behaviour in `app.json` and config plugins.
- Identity, in `app.json`: Capacity set `name`, `slug`, `scheme`, `ios.bundleIdentifier` and
  `android.package` when it created the project. Do not change any of them on your own. The last
  three can never change once the app has been installed anywhere: stores, TestFlight, phones
  and links into the app key on them. `name` and `slug` change only when the user asks.

## Adding a package

1. Create `packages/<name>/package.json` with a unique `name` and `dev`, `typecheck`, `lint`
   and `test` scripts as applicable.
2. Run `pnpm install` from the root.
3. Register long-running processes in `.capacity/runtime.json` under `apps` (`cwd` relative to
   the root, one `primary: true` app, the mobile app today). Add the folder to `envRoots` when
   it has an `.env.example`.
4. Reference sibling packages with `"<name>": "workspace:*"`.
