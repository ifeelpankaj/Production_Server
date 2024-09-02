import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config({
    languageOptions: {
        parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname
        }
    },

    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, eslintConfigPrettier],
    rules: {
        '@typescript-eslint/no-unsafe-argument': 'error',
        '@typescript-eslint/no-unsafe-argument': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-unsafe-call': 'error',
        '@typescript-eslint/no-unsafe-member-access': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
        'no-console': 'error',
        'no-useless-catch': 0,
        quotes: ['error', 'single', { allowTemplateLiterals: true }]
    }
})
