import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "playwright-report/**", "test-results/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/app/api/**/*.ts", "src/lib/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/generated/**",
        "src/app/**/page.tsx",
        "src/app/**/layout.tsx",
        "src/components/**",
      ],
      thresholds: {
        lines: 50,
        functions: 65,
        branches: 35,
        statements: 50,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
