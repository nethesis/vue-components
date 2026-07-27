//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { faHeart, faServer } from '@fortawesome/free-solid-svg-icons'
import { NeRoundedIcon } from '../src/main'

const meta = {
  title: 'Components/NeRoundedIcon',
  component: NeRoundedIcon,
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'inline-radio', options: ['info', 'warning', 'error', 'success', 'gray'] }
  },
  args: {
    kind: undefined,
    customIcon: undefined,
    customForegroundClasses: '',
    customBackgroundClasses: ''
  }
} satisfies Meta<typeof NeRoundedIcon>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeRoundedIcon v-bind="args"/>'

export const Info: Story = {
  render: (args) => ({
    components: { NeRoundedIcon },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { kind: 'info' }
}

export const Warning: Story = {
  render: (args) => ({
    components: { NeRoundedIcon },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { kind: 'warning' }
}

export const Error: Story = {
  render: (args) => ({
    components: { NeRoundedIcon },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { kind: 'error' }
}

export const Success: Story = {
  render: (args) => ({
    components: { NeRoundedIcon },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { kind: 'success' }
}

// the 'gray' kind has no standard icon, so it is always paired with a custom one
export const Gray: Story = {
  render: (args) => ({
    components: { NeRoundedIcon },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { kind: 'gray', customIcon: faServer }
}

export const Custom: Story = {
  render: (args) => ({
    components: { NeRoundedIcon },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    customIcon: faHeart,
    customForegroundClasses: 'text-fuchsia-700 dark:text-fuchsia-50',
    customBackgroundClasses: 'bg-fuchsia-100 dark:bg-fuchsia-700'
  }
}
