import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript strict — tuned for InfernoJS patterns
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-empty-object-type': ['error', { allowObjectTypes: 'always' }],
      '@typescript-eslint/no-invalid-void-type': 'off',

      // Safety
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'off',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'warn',

      // Style consistency
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['warn', 'multi-line'],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.build-tmp/**', '*.config.*', 'build.ts'],
  },
);
