import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "dist/**",
      "node_modules/**",
      ".agents/**",
      "mcps/**",
      "src/generated/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
