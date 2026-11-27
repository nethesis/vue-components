//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { NeTabs } from '../src/main'

const meta = {
  title: 'Components/NeTabs',
  component: NeTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tabs that switch between views of the same page or object. Each tab is a button inside a `nav`: it can be reached with Tab and selected with Enter or Space, and the selected one has `aria-current`. Below the `sm` breakpoint the tabs become a select. A tab can show a badge after its label, such as the number of rows of its view: set `badge` in the tab, and `badgeKind` for a color other than gray (the kinds of `NeBadgeV2`, except `custom`). The badge is part of the name of the tab, and in the select it follows the label in parentheses.'
      }
    }
  },
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

export const WithBadges: Story = {
  render: (args) => ({
    components: { NeTabs },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    tabs: [
      { name: 'blockedTraffic', label: 'Blocked traffic', badge: 3, badgeKind: 'indigo' },
      { name: 'connections', label: 'Connections', badge: 128 },
      { name: 'dnsQueries', label: 'DNS queries', badge: 0 }
    ],
    selected: 'blockedTraffic'
  }
}
