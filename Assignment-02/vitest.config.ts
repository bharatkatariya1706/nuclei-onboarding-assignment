import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["test/setup.ts"],
    coverage: {
      reporter: ["text", "lcov"],
      exclude: ["node_modules/", "test/", "dist/", "vitest.config.ts"],
    },
    globals: true,
    environment: "node",
  },
});
