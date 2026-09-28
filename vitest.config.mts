import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// alias ต้องตรงกับ paths ใน tsconfig.json
export default defineConfig({
  resolve: {
    alias: {
      '@content': fileURLToPath(new URL('./content', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
  },
})
