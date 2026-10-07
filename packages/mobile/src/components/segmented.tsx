import { Pressable, Text, View } from 'react-native'
import { selectionHaptic } from '@/lib/haptics'

interface SegmentedProps<T extends string> {
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
  accessibilityLabel?: string
}

/** A row of choices, one selected: the control Settings uses for the theme. */
export function Segmented<T extends string>({ value, options, onChange, accessibilityLabel }: SegmentedProps<T>) {
  return (
    <View
      className="flex-row rounded-lg bg-neutral-200 p-0.5 dark:bg-neutral-800"
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            onPress={() => {
              if (selected) return
              selectionHaptic()
              onChange(option.value)
            }}
            className={`rounded-md px-3 py-1.5 ${selected ? 'bg-white dark:bg-neutral-600' : ''}`}
          >
            <Text
              className={`text-sm font-medium ${selected ? 'text-black dark:text-white' : 'text-neutral-600 dark:text-neutral-300'}`}
            >
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
