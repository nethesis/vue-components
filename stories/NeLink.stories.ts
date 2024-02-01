//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { Meta, StoryObj } from '@storybook/vue3'
import { NeLink } from '../src/main'

const meta: Meta<typeof NeLink> = {
  title: 'Visual/NeLink',
  component: NeLink,
  tags: ['autodocs'],
  args: {}
}
export default meta
type Story = StoryObj<typeof meta>

const template = '<NeLink v-bind="args" class="text-sm">Go to Wikipedia</NeLink>'

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
