//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'
import { NeFormItemLabel } from '../src/main'

const meta = {
  title: 'NeFormItemLabel',
  component: NeFormItemLabel,
  tags: ['autodocs']
} satisfies Meta<typeof NeFormItemLabel>

export default meta
type Story = StoryObj<typeof meta>

const template =
  '<NeFormItemLabel v-bind="args">Label</NeFormItemLabel><div class="text-sm text-gray-500 dark:text-gray-500">Put here any form item that needs a label</div>'

export const Default: Story = {
  render: (args) => ({
    components: { NeFormItemLabel },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}
