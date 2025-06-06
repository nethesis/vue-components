import type { Preview, VueRenderer } from '@storybook/vue3-vite'
import { withThemeByClassName } from '@storybook/addon-themes'
import { fn } from 'storybook/test'

import '../src/main.css'
import './storybook.css'

const preview: Preview = {
  parameters: {
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
      defaultTheme: 'light'
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
