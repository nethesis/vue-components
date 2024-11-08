import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import storybook from 'eslint-plugin-storybook'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/storybook-static/**']
  },
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      'vue/component-name-in-template-casing': ['error']
    }
  },
  ...vueTsEslintConfig(),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': ['warn']
    }
  },
  ...storybook.configs['flat/recommended'],
  skipFormatting
]
