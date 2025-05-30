//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { NeRoundedIcon } from '../src/main'

const meta = {
  title: 'NeRoundedIcon',
  component: NeRoundedIcon,
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'inline-radio', options: ['info', 'warning', 'error', 'success'] }
  },
  args: {
    kind: undefined,
    customIcon: [],
    customForegroundClasses: '',
    customBackgroundClasses: ''
  }
} satisfies Meta<typeof NeRoundedIcon>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeRoundedIcon v-bind="args"/>'

export const Kind: Story = {
  render: (args) => ({
    components: { NeRoundedIcon },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { kind: 'info' }
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
