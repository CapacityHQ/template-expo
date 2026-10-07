import Constants from 'expo-constants'
import { Image } from 'expo-image'
import { Text } from 'react-native'

import { Screen } from '@/components/screen'

/** The app's first screen. Replace everything inside Screen with the app itself. */
export default function HomeScreen() {
  return (
    <Screen className="items-center justify-center gap-3 px-8">
      <Image
        source={require('@/assets/images/icon.png')}
        style={{ width: 72, height: 72, borderRadius: 16 }}
        accessibilityIgnoresInvertColors
      />
      <Text className="text-center text-2xl font-semibold tracking-tight text-black dark:text-white">
        {Constants.expoConfig?.name ?? 'Mobile app'}
      </Text>
      <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
        Nothing here yet. Your app&apos;s first screen goes here.
      </Text>
    </Screen>
  )
}
