import type { Preview, VueRenderer } from '@storybook/vue3'
import '../src/main.css'

import { withThemeByClassName, withThemeByDataAttribute } from '@storybook/addon-themes'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
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
    })
  ]
}

export default preview
