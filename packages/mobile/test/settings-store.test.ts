import { describe, expect, it, vi } from 'vitest'
import {
  SETTINGS_STORAGE_KEY,
  createSettingsStore,
  type KeyValueStorage,
} from '../src/stores/create-settings-store'

// Stands in for expo-sqlite/kv-store, which needs a phone or a simulator.
function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (name) => data.get(name) ?? null,
    setItem: (name, value) => {
      data.set(name, value)
    },
    removeItem: (name) => {
      data.delete(name)
    },
  }
}

function saved(state: unknown, version = 1): Record<string, string> {
  return { [SETTINGS_STORAGE_KEY]: JSON.stringify({ state, version }) }
}

describe('settings store', () => {
  it('starts on System with haptics on when nothing is saved', () => {
    const state = createSettingsStore(() => memoryStorage()).getState()
    expect(state.theme).toBe('system')
    expect(state.haptics).toBe(true)
  })

  it('saves a choice, and a new store reads it back before anything renders', () => {
    const storage = memoryStorage()
    const store = createSettingsStore(() => storage)
    store.getState().setTheme('dark')
    store.getState().setHaptics(false)
    expect(JSON.parse(storage.data.get(SETTINGS_STORAGE_KEY) ?? 'null')).toEqual({
      state: { theme: 'dark', haptics: false },
      version: 1,
    })
    // No await: the store must be hydrated synchronously, since the root layout reads it before render.
    const reread = createSettingsStore(() => storage).getState()
    expect(reread.theme).toBe('dark')
    expect(reread.haptics).toBe(false)
  })

  it.each([
    ['an unknown theme', saved({ theme: 'purple', haptics: true })],
    ['a theme of the wrong type', saved({ theme: 1 })],
    ['haptics of the wrong type', saved({ theme: 'system', haptics: 'yes' })],
    ['a state without a theme', saved({})],
    ['a null state', saved(null)],
    ['a value without a state', { [SETTINGS_STORAGE_KEY]: JSON.stringify({ version: 1 }) }],
    ['text that is not JSON', { [SETTINGS_STORAGE_KEY]: 'not json' }],
    ['a JSON value that is not an object', { [SETTINGS_STORAGE_KEY]: '42' }],
  ])('falls back to the defaults for %s', (_label, initial) => {
    const store = createSettingsStore(() => memoryStorage(initial))
    expect(store.getState().theme).toBe('system')
    expect(store.getState().haptics).toBe(true)
    expect(typeof store.getState().setTheme).toBe('function')
  })

  it('keeps a valid choice saved by an older or newer version', () => {
    expect(createSettingsStore(() => memoryStorage(saved({ theme: 'light' }, 0))).getState().theme).toBe('light')
    expect(createSettingsStore(() => memoryStorage(saved({ theme: 'dark' }, 2))).getState().theme).toBe('dark')
  })

  it('does not throw when the storage itself fails to read', () => {
    const broken: KeyValueStorage = {
      getItem: () => {
        throw new Error('storage unavailable')
      },
      setItem: () => undefined,
      removeItem: () => undefined,
    }
    const store = createSettingsStore(() => broken)
    expect(store.getState().theme).toBe('system')
    // The failed read counts as nothing saved, so loading still finishes.
    expect(store.persist.hasHydrated()).toBe(true)
  })

  it('keeps a choice for this run when the storage fails to save it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      const full: KeyValueStorage = {
        getItem: () => null,
        setItem: () => {
          throw new Error('storage full')
        },
        removeItem: () => undefined,
      }
      const store = createSettingsStore(() => full)
      expect(() => store.getState().setTheme('dark')).not.toThrow()
      expect(store.getState().theme).toBe('dark')
      expect(warn).toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })
})
