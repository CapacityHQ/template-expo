import type { ReactNode } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/**
 * The container of every screen: the app background in both themes, and the status bar's inset
 * at the top. The native tab bar keeps its own space at the bottom.
 */
export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  const insets = useSafeAreaInsets()
  return (
    <View className={`flex-1 bg-white dark:bg-black ${className}`} style={{ paddingTop: insets.top }}>
      {children}
    </View>
  )
}
