import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: [
      'src/**/*.{js,mjs,cjs,ts}',
      'test/**/*.{js,mjs,cjs,ts}',
      'jest/**/*.{js,mjs,cjs,ts}',
      'bun/**/*.{js,mjs,cjs,ts}',
      'vitest/**/*.{js,mjs,cjs,ts}',
    ],
  },
  { ignores: ['dist', 'coverage'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
]
