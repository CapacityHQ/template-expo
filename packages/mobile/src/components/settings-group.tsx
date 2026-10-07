import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

/** A titled group of rows, hairlines between the rows (the group's background shows through the 1 px gaps). */
export function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="px-1 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {title}
      </Text>
      <View className="gap-px overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">{children}</View>
    </View>
  )
}

export function SettingsRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="min-h-12 flex-row items-center justify-between gap-4 bg-neutral-100 px-4 py-2 dark:bg-neutral-900">
      <Text className="text-base text-black dark:text-white">{label}</Text>
      {children}
    </View>
  )
}
