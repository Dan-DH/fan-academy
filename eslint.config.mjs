import path from "node:path";
import js from "@eslint/js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore");

export default defineConfig(
  // 1. Ignored files
  includeIgnoreFile(gitignorePath),
  {
    ignores: ["dist/", "node_modules/"],
  },

  // 2. Base recommended presets
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,

  // 3. Prettier presets to disable conflicting format rules
  prettier,
  ...svelte.configs["flat/prettier"],

  // 4. Plugins & Global environment settings
  {
    plugins: {
      "@stylistic/ts": stylisticTs,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 5. Svelte parser integration
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
      },
    },
  },

  // 6. Custom application rules
  {
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "padded-blocks": [
        "error",
        {
          blocks: "never",
          classes: "never",
          switches: "never",
        },
      ],
      "@stylistic/ts/semi": [
        "error",
        "always",
        {
          omitLastInOneLineBlock: false,
          omitLastInOneLineClassBody: false,
        },
      ],
      "@stylistic/ts/indent": ["error", 2],
      "@stylistic/ts/comma-dangle": [
        "error",
        {
          arrays: "never",
          objects: "never",
          imports: "never",
          exports: "never",
          functions: "never",
        },
      ],
      "@stylistic/ts/comma-spacing": [
        "error",
        {
          before: false,
          after: true,
        },
      ],
      "@stylistic/ts/key-spacing": ["error"],
      "@stylistic/ts/object-curly-newline": ["error", { multiline: true }],
      "@stylistic/ts/no-extra-parens": ["error", "all"],
      "@stylistic/ts/object-curly-spacing": ["error", "always"],
      "@stylistic/ts/object-property-newline": ["error"],
      "@stylistic/ts/type-annotation-spacing": ["error"],
      "@stylistic/ts/space-infix-ops": ["error", { int32Hint: false }],
    },
  },
);
