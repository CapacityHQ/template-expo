// `expo/types` declares the CSS import in src/app/_layout.tsx, the asset modules and the typed
// routes. Expo CLI writes a generated expo-env.d.ts with the same reference on the first
// `expo start`; git ignores that one. NativeWind's className typings are in nativewind-env.d.ts,
// which NativeWind maintains itself.
/// <reference types="expo/types" />
