//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'
import { NeEmptyState } from '../src/main'
import { NeButton } from '../src/main'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faUsers)

const meta = {
  title: 'NeEmptyState',
  component: NeEmptyState,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    title: 'No user',
    description: 'There is no user configured on the system',
    icon: undefined
  } // default values
} satisfies Meta<typeof NeEmptyState>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeEmptyState v-bind="args" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeEmptyState },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

export const WithIcon: Story = {
  render: (args) => ({
    components: { NeEmptyState },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { icon: faUsers }
}

const templateWithSlot = `<NeEmptyState v-bind="args">
                            <NeButton kind="primary">Create user</NeButton>
                          </NeEmptyState>`

export const WithSlot: Story = {
  render: (args) => ({
    components: { NeEmptyState, NeButton },
    setup() {
      return { args }
    },
    template: templateWithSlot
  }),
  args: {}
}

export const WithSlotAndIcon: Story = {
  render: (args) => ({
    components: { NeEmptyState, NeButton },
    setup() {
      return { args }
    },
    template: templateWithSlot
  }),
  args: { icon: faUsers }
}
