import Constants, { ExecutionEnvironment } from 'expo-constants'
import { Platform, ScrollView, Switch, Text } from 'react-native'

import { Screen } from '@/components/screen'
import { Segmented } from '@/components/segmented'
import { SettingsGroup, SettingsRow } from '@/components/settings-group'
import { selectionHaptic } from '@/lib/haptics'
import { THEME_CHOICES, type ThemeChoice } from '@/lib/theme-choice'
import { useSettings } from '@/stores/settings'

const THEME_LABELS: Record<ThemeChoice, string> = { system: 'System', light: 'Light', dark: 'Dark' }
const THEME_OPTIONS = THEME_CHOICES.map((value) => ({ value, label: THEME_LABELS[value] }))

const ABOUT_ROWS: [label: string, value: string][] = [
  ['Name', Constants.expoConfig?.name ?? ''],
  ['Version', Constants.expoConfig?.version ?? ''],
  ['Expo SDK', Constants.expoConfig?.sdkVersion ?? ''],
  ['Runs in', Constants.executionEnvironment === ExecutionEnvironment.StoreClient ? 'Expo Go' : 'its own build'],
  ['Platform', `${Platform.OS} ${Platform.Version}`],
]

export default function SettingsScreen() {
  const theme = useSettings((state) => state.theme)
  const setTheme = useSettings((state) => state.setTheme)
  const haptics = useSettings((state) => state.haptics)
  const setHaptics = useSettings((state) => state.setHaptics)
  return (
    <Screen>
      <ScrollView contentContainerClassName="gap-6 p-4 pb-24">
        <Text className="px-1 text-3xl font-bold tracking-tight text-black dark:text-white">Settings</Text>
        <SettingsGroup title="Appearance">
          <SettingsRow label="Theme">
            <Segmented value={theme} options={THEME_OPTIONS} onChange={setTheme} accessibilityLabel="Theme" />
          </SettingsRow>
        </SettingsGroup>
        <SettingsGroup title="Feedback">
          <SettingsRow label="Haptics">
            <Switch
              value={haptics}
              onValueChange={(value) => {
                setHaptics(value)
                if (value) selectionHaptic()
              }}
              accessibilityLabel="Haptics"
            />
          </SettingsRow>
        </SettingsGroup>
        <SettingsGroup title="About">
          {ABOUT_ROWS.map(([label, value]) => (
            <SettingsRow key={label} label={label}>
              <Text className="text-base text-neutral-500 dark:text-neutral-400">{value}</Text>
            </SettingsRow>
          ))}
        </SettingsGroup>
      </ScrollView>
    </Screen>
  )
}
