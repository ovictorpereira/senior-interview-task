import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    dir: "src",
    projects: [
      {
        extends: true,
        test: {
          name: "unit-tests",
          dir: "src/use-cases",
        },
      },
      {
        extends: true,
        test: {
          name: "e2e-tests",
          dir: "src/http/controllers",
        },
      },
    ],
  },
});
