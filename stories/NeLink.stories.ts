//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeLink } from '../src/main'

const meta: Meta<typeof NeLink> = {
  title: 'Components/NeLink',
  component: NeLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A text link, to another page or to an external site, or for a minor action inside text. `invertedTheme` is for a background of the opposite theme, such as inside a tooltip.'
      }
    }
  },
  args: {
    invertedTheme: false
  }
}
export default meta
type Story = StoryObj<typeof meta>

const template =
  '<NeLink v-bind="args" href="https://www.wikipedia.org/" target="_blank" class="text-sm">Go to Wikipedia</NeLink>'

export const Default: Story = {
  render: (args) => ({
    components: { NeLink },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

const invertedThemeTemplate = `<div class="text-sm p-4 bg-gray-800 dark:bg-gray-300">
  <p class="mb-2 text-gray-300 dark:text-gray-800">
    Inverted theme is useful on inverted backgrounds (e.g. inside a tooltip)
  </p>
  <NeLink v-bind="args" href="https://www.wikipedia.org/" target="_blank">
    Go to Wikipedia
  </NeLink>
</div>`

export const InvertedTheme: Story = {
  render: (args) => ({
    components: { NeLink },
    setup() {
      return { args }
    },
    template: invertedThemeTemplate
  }),
  args: { invertedTheme: true }
}
