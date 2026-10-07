import { colorScheme } from 'nativewind'
import { useColorScheme } from 'react-native'
import { useSettings } from '../stores/settings'
import type { ResolvedTheme, ThemeChoice } from './theme-choice'

/**
 * Hands the choice to NativeWind, which sets React Native's Appearance override (none for
 * System). From there `dark:` classes, `useColorScheme()`, the navigation theme and the status
 * bar all follow the one choice.
 */
function applyTheme(choice: ThemeChoice) {
  colorScheme.set(choice)
}

/**
 * Call once, from the root layout's module scope, before React renders: applies the saved
 * choice, then follows the store. Change the theme only through the store (`setTheme`), never
 * through Appearance or NativeWind directly.
 */
export function startTheme(): () => void {
  applyTheme(useSettings.getState().theme)
  return useSettings.subscribe((state, previous) => {
    if (state.theme !== previous.theme) applyTheme(state.theme)
  })
}

/** The theme the app is painted with, for code that needs it (the navigation theme). */
export function useResolvedTheme(): ResolvedTheme {
  return useColorScheme() === 'dark' ? 'dark' : 'light'
}
