import type { Preview, VueRenderer } from '@storybook/vue3-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import { fn } from 'storybook/test'
import { themes } from 'storybook/theming'

import '../src/main.css'
import './storybook.css'

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Patterns', ['Overview', '*'], 'Components', ['Overview', '*'], '*']
      }
    },
    // Set once at load from the system preference. Unlike the story canvas (driven
    // by addon-themes), the docs theme is not reactive to the toolbar toggle, so
    // switching themes there only takes effect after a reload.
    docs: { theme: prefersDark ? themes.dark : themes.light },
    actions: { onClick: fn() },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    withThemeByClassName<VueRenderer>({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: prefersDark ? 'dark' : 'light'
    }),
    (story) => ({
      components: { story },
      template: `<div class="bg-gray-50 text-sm p-10 text-gray-700 dark:bg-gray-900 dark:text-gray-100">
        <story />
      </div>`
    })
  ]
}

export default preview
