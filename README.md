# Capacity mobile app template

Starter for iPhone and Android apps built with Capacity: a pnpm workspace whose
`packages/mobile` package is an Expo SDK 55 app (React Native 0.83, React 19.2) with Expo
Router, native tabs, NativeWind 4 (Tailwind CSS 3 classes), a settings store saved in SQLite,
light and dark appearance and haptics. It opens as an empty app with Home and Settings, ready
to build on. Derived from Expo's `create-expo-app` default template (MIT).

`name`, `slug`, `scheme`, `ios.bundleIdentifier` and `android.package` in
`packages/mobile/app.json` are placeholders (`Mobile app`, `mobile-app`, `mobileapp`,
`com.capacity.mobileapp`). Capacity rewrites them from the project name when it creates a
project from this template; the root package takes the project's folder name.

## Requirements

- Node.js 22.13 or newer and pnpm 10.34.5, the version pinned in `package.json`
  (`corepack enable` provides it).
- To run the app: Xcode with the iOS Simulator (macOS), or the Android SDK with an emulator,
  or [Expo Go](https://expo.dev/go) on a phone on the same network. Expo CLI installs the
  Expo Go build for this SDK into a simulator or an emulator by itself; a phone needs the
  Expo Go of the same SDK from the stores, or `eas go` with an Apple Developer account when the
  stores lag behind.
- Expo Go runs the app without a native build and without Xcode compiling anything, with the
  native modules of the Expo SDK and nothing else. A library that brings its own native code
  needs a development build instead (`eas build --profile development`).

## Scripts

Every script runs from the root and delegates to the packages:

| Command | What it does |
| --- | --- |
| `pnpm dev` | `expo start --go --port 8081`: Metro, serving the app to Expo Go; press `i` or `a` in the terminal to open a simulator or an emulator, or scan the QR code with a phone |
| `pnpm --filter ./packages/mobile ios` | the same, and opens the app in the iOS Simulator |
| `pnpm --filter ./packages/mobile android` | the same, and opens the app in the Android emulator |
| `pnpm typecheck` | `tsc --noEmit` over the app and the tests |
| `pnpm lint` | `expo lint` (ESLint with Expo's config) |
| `pnpm test` | Vitest unit tests in `packages/mobile/test/` |

`pnpm-workspace.yaml` lists every dependency with a build script under `allowBuilds`: pnpm 10
silently skips an unlisted one and pnpm 12 refuses the install. `unrs-resolver` is the only one
today and stays off (its binary comes as a platform package).

## Layout

```
.capacity/runtime.json      which apps Capacity starts (the mobile app, from packages/mobile)
AGENTS.md                   conventions for coding agents (CLAUDE.md includes it)
package.json                workspace root: pnpm pin, Node floor, delegating scripts
pnpm-workspace.yaml         package globs and the build-script allowlist
packages/mobile/
  app.json                  Expo config: identity, icons, splash, plugins
  src/app/                  routes (Expo Router): _layout.tsx (native tabs), index.tsx, settings.tsx
  src/components/           screen.tsx, settings-group.tsx, segmented.tsx
  src/stores/               the settings store (zustand, saved through expo-sqlite/kv-store)
  src/lib/                  theme.ts, theme-choice.ts, haptics.ts
  src/global.css            Tailwind entry (NativeWind compiles it)
  assets/images/            app icon, Android adaptive icon, splash image
  babel.config.js           babel-preset-expo with NativeWind's JSX source, nativewind/babel
  metro.config.js           Expo's Metro config wrapped by NativeWind
  tailwind.config.js        content globs and NativeWind's preset
  test/                     Vitest unit tests
```

There are no `ios/` or `android/` folders: Expo generates them at build time (continuous
native generation) from `app.json` and the config plugins, and git ignores them.

## The app

- Tabs: `src/app/_layout.tsx` renders `NativeTabs` from `expo-router/unstable-native-tabs`,
  one `Trigger` per route file, with SF Symbols on iOS and Material Symbols on Android. A new
  tab is a route file and a trigger.
- Settings: `src/stores/settings.ts` is a zustand store saved in SQLite through
  `expo-sqlite/kv-store` and loaded before the first render; `create-settings-store.ts` says how
  to add a setting. Settings offers Appearance (System, Light, Dark) and Haptics, and shows the
  app's name, version, SDK and where it runs.
- Appearance: `src/lib/theme.ts` applies the saved choice before React renders through
  NativeWind's `colorScheme.set`, which is React Native's Appearance override: `dark:` classes,
  `useColorScheme()`, the navigation theme and the status bar follow it together. Change the
  theme through the store only.
- Styling: NativeWind classes on React Native components; third-party components take `style`.
  Tailwind 3 syntax.

## Development loop

`pnpm dev` starts Metro on port 8081 and prints a QR code and the `exp://` address; with
`--ios` or `--android` (the `ios` and `android` scripts) Expo CLI boots the simulator or the
emulator, installs the Expo Go of this SDK into it when missing (a 143 MB download the first
time), and opens the app: it prints `› Opening exp://… on <device>` as soon as it has picked the
device, and `iOS Bundled <n>ms …` once the device has fetched the bundle, which is when the app
is up. Inside Capacity the mobile app is supervised from `.capacity/runtime.json`
(`kind: "expo"`): Capacity runs `pnpm --silent dev` in `packages/mobile`, appends the target
flag for the device you chose, and treats the `Bundled` line as "the app is up". A Metro that
restarts while Expo Go still shows the app gets no request until the app reloads. Every saved file reaches the running app through Fast Refresh; changes to `app.json`,
`babel.config.js`, `metro.config.js` or `tailwind.config.js` need a restart, since Metro caches
them. Press `r` in the terminal to reload, `j` to open the debugger, `m` for the dev menu.

## Building and shipping

Nothing here builds a binary: the dev loop runs in Expo Go. Installing the app on a phone,
TestFlight and the stores go through EAS (`eas build`, `eas submit`) with your own Expo, Apple
and Google accounts; Capacity adds that flow in a later phase, which also writes `eas.json`.
