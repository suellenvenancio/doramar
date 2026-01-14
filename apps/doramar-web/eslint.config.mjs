import js from "@eslint/js"
import nextPlugin from "@next/eslint-plugin-next"
import prettierPlugin from "eslint-plugin-prettier"
import reactHooks from "eslint-plugin-react-hooks"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import path from "node:path"
import { fileURLToPath } from "node:url"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default tseslint.config(
  {
    ignores: [".next", "dist", "node_modules"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        window: "readonly",
        document: "readonly",
        process: "readonly",
        console: "readonly",
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      semi: "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "prettier/prettier": "error",
    },
  },
)
