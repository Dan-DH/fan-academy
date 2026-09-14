import pluginJs from "@eslint/js";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ["dist/", "node_modules/"] },
  { plugins: { '@stylistic/ts': stylisticTs } },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": ["off"],
      // '@typescript-eslint/no-unused-vars': ['warning', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-unused-vars': ["off"],
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "padded-blocks": ["error", {
        "blocks": "never",
        "classes": "never",
        "switches": "never"
      }],
      '@stylistic/ts/semi': ['error', 'always', {
        "omitLastInOneLineBlock": false,
        "omitLastInOneLineClassBody": false
      }],
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/comma-dangle': ['error', {
        "arrays": "never",
        "objects": "never",
        "imports": "never",
        "exports": "never",
        "functions": "never"
      }],
      '@stylistic/ts/comma-spacing': ['error', {
        "before": false,
        "after": true
      }],
      '@stylistic/ts/key-spacing': ['error'],
      '@stylistic/ts/object-curly-newline': ['error', { 'multiline': true }],
      '@stylistic/ts/no-extra-parens': ['error', 'all'],
      '@stylistic/ts/object-curly-spacing': ['error', 'always'],
      '@stylistic/ts/object-property-newline': ['error'],
      '@stylistic/ts/type-annotation-spacing': ['error'],
      '@stylistic/ts/space-infix-ops': ['error', { int32Hint: false }]
    }
  }
];