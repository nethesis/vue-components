//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeHeading } from '../src/main'

const meta: Meta<typeof NeHeading> = {
  title: 'Components/NeHeading',
  component: NeHeading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A heading: `tag` sets the level, from `h1` to `h6`, and the matching text style. One `h1` per page, for its title.'
      }
    }
  },
  argTypes: {
    tag: { control: 'inline-radio', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }
  },
  args: {
    tag: 'h1'
  }
}
export default meta
type Story = StoryObj<typeof meta>

const template = '<NeHeading v-bind="args">This is a heading</NeHeading>'

export const Default: Story = {
  render: (args) => ({
    components: { NeHeading },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}
