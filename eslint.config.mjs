
// @ts-check

import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import prettierPlugin from 'eslint-plugin-prettier'
import globals from "globals"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,

})

export default [
  { ignores: [ 'dist/**/*.{js,ts}' ] },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ),
  {
    files: [ '**/*.{js,ts}' ], ignores: [ 'dist/**/*.{js,ts}' ],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier: prettierPlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node,
      },

      parser: tsParser,
    },
    rules: {
      indent: "off",
      "func-names": "off",
      eqeqeq: [ "warn", "always" ],
      "no-case-declarations": "off",
      "no-compare-neg-zero": "error",
      "no-console": "warn",
      "no-dupe-args": "error",
      "no-dupe-keys": "error",
      "no-duplicate-imports": "error",
      "no-empty": [ "warn", { allowEmptyCatch: false } ],
      "no-extra-boolean-cast": "off",
      "no-fallthrough": "error",
      "no-inner-declarations": "off",
      "no-octal": "error",
      "no-prototype-builtins": "warn",
      "no-path-concat": "off",
      "no-process-env": "off",
      "no-process-exit": "off",
      "no-sync": "warn",
      "no-undef": "error",
      "no-unneeded-ternary": "error",
      "no-unreachable": "error",
      "no-useless-escape": "off",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-rest-params": "warn",
      "prefer-spread": "warn",
      "quote-props": [ "error", "as-needed" ],
      radix: "error",
      "require-yield": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unused-vars": [ "error", { vars: "all", args: "none" } ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      // "mocha/no-setup-in-describe": "off"
    }
  }

]


