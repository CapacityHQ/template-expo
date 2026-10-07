const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

// Expo configures Metro for the pnpm workspace by itself (watch folders, node_modules paths);
// NativeWind adds the Tailwind compile step for src/global.css.
const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: './src/global.css' })
