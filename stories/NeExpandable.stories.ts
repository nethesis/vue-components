//  Copyright (C) 2023 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'
import { NeExpandable } from '../src/main'

const meta = {
  title: 'Utils/NeExpandable',
  component: NeExpandable,
  tags: ['autodocs'],
  // default values
  args: {
    title: 'Show more',
    expanded: false
  }
} satisfies Meta<typeof NeExpandable>

export default meta
type Story = StoryObj<typeof meta>

const template =
  '<NeExpandable v-bind="args">\
    <div class="px-2 py-1">\
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\
    </div>\
  </NeExpandable>'

export const Collapsed: Story = {
  render: (args) => ({
    components: { NeExpandable },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

export const Expanded: Story = {
  render: (args) => ({
    components: { NeExpandable },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { expanded: true }
}
