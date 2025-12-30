import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'prettier'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'convex/_generated/**',
    ],
  },
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
  // TypeScript strict type checking
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Warn on `as any` and explicit `any` types
      // Use 'warn' to surface issues without blocking CI
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default eslintConfig;
