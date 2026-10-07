import * as Haptics from 'expo-haptics'
import { useSettings } from '../stores/settings'

/**
 * A light tick for a tap that changes something, when the Haptics setting is on. Never throws:
 * the Simulator and phones without a haptic engine just stay silent.
 */
export function selectionHaptic(): void {
  if (!useSettings.getState().haptics) return
  Haptics.selectionAsync().catch(() => undefined)
}
