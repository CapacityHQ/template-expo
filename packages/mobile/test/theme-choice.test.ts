import { describe, expect, it } from 'vitest'
import { THEME_CHOICES, isThemeChoice, resolveTheme } from '../src/lib/theme-choice'

describe('theme choice', () => {
  it('accepts the three choices and nothing else', () => {
    for (const choice of THEME_CHOICES) expect(isThemeChoice(choice)).toBe(true)
    expect(isThemeChoice('purple')).toBe(false)
    expect(isThemeChoice(1)).toBe(false)
    expect(isThemeChoice(undefined)).toBe(false)
  })

  it('resolves System from the phone, and a fixed choice as itself', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})
