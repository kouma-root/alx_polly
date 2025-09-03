import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    mockReset: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
    },
  },
})


