/** @type {import('tailwindcss').Config} */
module.exports = {
  // Every file that may carry a className. Keep the globs in step with the folders under src/.
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}
