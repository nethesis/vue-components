//  Copyright (C) 2025 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeBadgeV2 } from '../src/main'

const meta: Meta<typeof NeBadgeV2> = {
  title: 'NeBadgeV2',
  component: NeBadgeV2,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md'],
      control: { type: 'inline-radio' }
    },
    kind: {
      options: ['primary', 'gray', 'indigo', 'green', 'amber', 'rose', 'blue', 'custom'],
      control: { type: 'inline-radio' }
    }
  },
  args: {
    size: 'sm',
    kind: 'indigo',
    pill: true,
    dismissable: false,
    customKindClasses: '',
    dismissAriaLabel: 'Dismiss'
  }
}

export default meta
type Story = StoryObj<typeof meta>

const defaultTemplate = `<NeBadgeV2 v-bind="args">Badge</NeBadgeV2>`

export const Default: Story = {
  render: (args) => ({
    components: { NeBadgeV2 },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: {}
}

export const Kinds: Story = {
  render: (args) => ({
    components: { NeBadgeV2 },
    setup() {
      return { args }
    },
    template: `
      <div class="flex flex-wrap gap-8">
        <NeBadgeV2 v-bind="args" kind="indigo">indigo</NeBadgeV2>
        <NeBadgeV2 v-bind="args" kind="primary">primary</NeBadgeV2>
        <NeBadgeV2 v-bind="args" kind="gray">gray</NeBadgeV2>
        <NeBadgeV2 v-bind="args" kind="green">green</NeBadgeV2>
        <NeBadgeV2 v-bind="args" kind="amber">amber</NeBadgeV2>
        <NeBadgeV2 v-bind="args" kind="rose">rose</NeBadgeV2>
        <NeBadgeV2 v-bind="args" kind="blue">blue</NeBadgeV2>
        <NeBadgeV2 v-bind="args" kind="custom" customKindClasses="bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-700 dark:text-fuchsia-50">custom</NeBadgeV2>
      </div>
    `
  }),
  args: {}
}

export const CustomKind: Story = {
  render: (args) => ({
    components: { NeBadgeV2 },
    setup() {
      return { args }
    },
    template: `<NeBadgeV2 v-bind="args">Custom badge</NeBadgeV2>`
  }),
  args: {
    kind: 'custom',
    customKindClasses: 'text-white bg-linear-to-br from-fuchsia-500 to-blue-500'
  }
}

export const Dismissable: Story = {
  render: (args) => ({
    components: { NeBadgeV2 },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: {
    dismissable: true
  }
}
