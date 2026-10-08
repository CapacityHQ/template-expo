import '@/global.css'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { StatusBar } from 'expo-status-bar'

import { startTheme, useResolvedTheme } from '@/lib/theme'

// Before the first render: the saved Appearance choice, then every change of it (src/lib/theme.ts).
startTheme()

/** The navigator: native tabs, one route file per tab. A new tab is a file in src/app/ and a Trigger here. */
export default function RootLayout() {
  const theme = useResolvedTheme()
  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="house" md="home" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="gearshape" md="settings" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  )
}
