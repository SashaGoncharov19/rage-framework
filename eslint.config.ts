import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

import type { Linter } from 'eslint'

export default [
    {
        ignores: ['**/.*/*', '**/dist/*', '**/node_modules/*', '*.config.*'],
    },
    pluginJs.configs.recommended,
    ...(tseslint.configs.recommended as Linter.Config[]),
    {
        name: 'global',
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/ban-types': 'off',
            'consistent-return': 'off',
            'no-empty': 'off',
        },
    },
    {
        name: 'browser/rpc',
        files: ['browser/src/*.{ts,js}', 'rpc/src/*.{ts,js}'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node, ...globals.es2022 },
        },
    },
    {
        name: 'cli',
        files: ['cli/src/*.{ts,js}'],
        languageOptions: {
            globals: { ...globals.node, ...globals.es2024 },
            ecmaVersion: 2024,
        },
    },
    {
        name: 'client/server/shared',
        files: [
            'client/**/*.{ts,js}',
            'server/**/*.{ts,js}',
            'shared/**/*.{ts,js}',
        ],
        languageOptions: {
            globals: { ...globals.node, ...globals.es2022 },
        },
    },
] satisfies Linter.Config[]
