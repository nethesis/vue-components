import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-themes',
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: {},
  core: {
    disableTelemetry: true
  }
}
export default config
