import Storage from 'expo-sqlite/kv-store'
import { createSettingsStore } from './create-settings-store'

/**
 * The app's settings, saved in SQLite through expo-sqlite/kv-store (synchronous reads, so the
 * store is loaded before the first render) and kept across reloads, updates and Expo Go
 * restarts. Read one in a component with `useSettings((state) => state.theme)`, change it with
 * `useSettings.getState().setTheme('dark')`. create-settings-store.ts says how to add one.
 */
export const useSettings = createSettingsStore(() => ({
  getItem: (name) => Storage.getItemSync(name),
  setItem: (name, value) => Storage.setItemSync(name, value),
  removeItem: (name) => Storage.removeItemSync(name),
}))
