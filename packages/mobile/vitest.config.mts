import { defineConfig } from 'vitest/config'

// Unit tests for the plain TypeScript of the app (stores, lib). Components are checked in the
// Simulator or the emulator, not here.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
})
