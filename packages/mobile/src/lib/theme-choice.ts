export const THEME_CHOICES = ['system', 'light', 'dark'] as const
export type ThemeChoice = (typeof THEME_CHOICES)[number]
export type ResolvedTheme = 'light' | 'dark'

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return typeof value === 'string' && (THEME_CHOICES as readonly string[]).includes(value)
}

/** The colours to paint for a choice: System follows the phone's appearance. */
export function resolveTheme(choice: ThemeChoice, systemIsDark: boolean): ResolvedTheme {
  if (choice === 'system') return systemIsDark ? 'dark' : 'light'
  return choice
}
