import jslint from "@eslint/js";
import tslint from "typescript-eslint";

export default tslint.config([
  jslint.configs.recommended,
  tslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      // Part of eslint
      "array-callback-return": "warn",
      "no-throw-literal": "warn",
      "no-unneeded-ternary": "warn",
      "no-useless-computed-key": "warn",
      "no-useless-constructor": "warn",
      "no-useless-rename": "warn",
      "no-useless-return": "warn",
      "prefer-exponentiation-operator": "warn",
      "prefer-numeric-literals": "warn",
      "prefer-object-has-own": "warn",
      "prefer-promise-reject-errors": "warn",
      "prefer-regex-literals": "warn",
      "require-atomic-updates": "warn",
      "require-unicode-regexp": "warn",

      // Part of eslint-plugin-simple-import-sort
      // "import/order": [
      //   "warn",
      //   {
      //     alphabetize: {
      //       order: "asc",
      //       caseInsensitive: true,
      //     },
      //   },
      // ],

      // Part of typescript-eslint
      "@typescript-eslint/no-duplicate-enum-values": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-misused-new": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "(__.+)|(^_$)", argsIgnorePattern: "__.+" },
      ],
    },
  },
]);

// Export default defineConfig([{
//   Files: ["**/*.ts"],
//   Plugins: { js }
//   Extends: [
//     eslint.configs.recommended,
//     ...tseslint.configs.recommended,
//     // eslintPluginPrettierRecommended,
//   ],

// }]);
