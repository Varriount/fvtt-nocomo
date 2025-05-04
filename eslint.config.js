import js from "@eslint/js";
import ts from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  ts.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-misused-new": "off",
      "@typescript-eslint/no-duplicate-enum-values": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "__.+", "argsIgnorePattern": "__.+", }]
    },
  },
]);

// export default defineConfig([{
//   files: ["**/*.ts"],
//   plugins: { js }
//   extends: [
//     eslint.configs.recommended,
//     ...tseslint.configs.recommended,
//     // eslintPluginPrettierRecommended,
//   ],

// }]);
