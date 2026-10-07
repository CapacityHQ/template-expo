import { create } from 'zustand'
import { persist, type PersistStorage, type StorageValue } from 'zustand/middleware'
import { isThemeChoice, type ThemeChoice } from '../lib/theme-choice'

/**
 * The app's settings, saved as JSON under SETTINGS_STORAGE_KEY.
 *
 * To add a setting: add the field to `Settings` and `DEFAULT_SETTINGS`, validate it in
 * `sanitizeSettings` (a saved value can be anything), add a setter to `SettingsState` and to
 * the store below, and show it in src/app/settings.tsx. Raise SETTINGS_VERSION only when an
 * old saved value needs converting: `migrate` receives it. A build that reads a value saved at
 * another version saves it back at its own version after `migrate`, so running an older build
 * drops the fields a newer build added. Secrets do not belong here (expo-secure-store does
 * that), nor large data (a proper expo-sqlite database does).
 */
export const SETTINGS_STORAGE_KEY = 'app-settings'
export const SETTINGS_VERSION = 1

export interface Settings {
  theme: ThemeChoice
  haptics: boolean
}

export interface SettingsState extends Settings {
  setTheme: (theme: ThemeChoice) => void
  setHaptics: (haptics: boolean) => void
}

export const DEFAULT_SETTINGS: Settings = { theme: 'system', haptics: true }

/** A synchronous key-value storage: expo-sqlite/kv-store's Sync methods in the app, a Map in tests. */
export interface KeyValueStorage {
  getItem: (name: string) => string | null
  setItem: (name: string, value: string) => void
  removeItem: (name: string) => void
}

/** Keeps the valid fields of a saved value; a missing or unknown field gets its default. */
export function sanitizeSettings(saved: unknown): Settings {
  const record = typeof saved === 'object' && saved !== null ? (saved as Record<string, unknown>) : {}
  return {
    theme: isThemeChoice(record.theme) ? record.theme : DEFAULT_SETTINGS.theme,
    haptics: typeof record.haptics === 'boolean' ? record.haptics : DEFAULT_SETTINGS.haptics,
  }
}

// JSON over a synchronous storage, so the store is loaded before the first render. A storage
// that fails to read, or a value that does not parse, reads as nothing saved. A failed save is
// logged, and the new choice still holds until the app is closed.
function jsonStorage(getStorage: () => KeyValueStorage): PersistStorage<Settings> {
  return {
    getItem: (name) => {
      try {
        const raw = getStorage().getItem(name)
        return raw === null ? null : (JSON.parse(raw) as StorageValue<Settings>)
      } catch {
        return null
      }
    },
    setItem: (name, value) => {
      try {
        getStorage().setItem(name, JSON.stringify(value))
      } catch (error) {
        console.warn('Settings could not be saved', error)
      }
    },
    removeItem: (name) => getStorage().removeItem(name),
  }
}

export function createSettingsStore(getStorage: () => KeyValueStorage) {
  return create<SettingsState>()(
    persist(
      (set) => ({
        ...DEFAULT_SETTINGS,
        setTheme: (theme) => set({ theme }),
        setHaptics: (haptics) => set({ haptics }),
      }),
      {
        name: SETTINGS_STORAGE_KEY,
        version: SETTINGS_VERSION,
        storage: jsonStorage(getStorage),
        partialize: (state): Settings => ({ theme: state.theme, haptics: state.haptics }),
        migrate: (saved) => sanitizeSettings(saved),
        merge: (saved, current) => ({ ...current, ...sanitizeSettings(saved) }),
      },
    ),
  )
}
