import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'packages/**/*.test.ts', 'functions/**/*.test.ts'],
    alias: {
      '@carecircle/shared': path.resolve(__dirname, './packages/shared/src'),
    },
  },
})
