import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-themes'
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
