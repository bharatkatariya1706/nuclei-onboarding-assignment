import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "lcov"],
      exclude: ["node_modules/", "tests/", "dist/", "vitest.config.ts"],
    },
    globals: true,
    environment: "node",
  },
});
