//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'

import { NeTabs } from '../src/main'

const meta = {
  title: 'Visual/NeTabs',
  component: NeTabs,
  argTypes: {},
  args: {
    tabs: [
      { name: 'firstTab', label: 'First tab' },
      { name: 'secondTab', label: 'Second tab' },
      { name: 'thirdTab', label: 'Third tab' }
    ],
    selected: 'secondTab'
  } // default values
} satisfies Meta<typeof NeTabs>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeTabs v-bind="args" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeTabs },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}
