import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      semi: "off",
      quotes: [
        "warn",
        "single",
        {
          avoidEscape: true,
        },
      ],
      "prettier/prettier": "error",
      "block-scoped-var": "error",
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
      "eol-last": "error",
      "prefer-arrow-callback": "error",
      "no-trailing-spaces": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: [
      "@typescript-eslint",
      "prettier",
      "simple-import-sort",
      "react-hooks",
    ],
    extends: ["eslint:recommended", "prettier"],
  },
])
