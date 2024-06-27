//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'
import { NeProgressBar } from '../src/main'

const meta = {
  title: 'NeProgressBar',
  component: NeProgressBar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    color: {
      control: 'inline-radio',
      options: [
        'primary',
        'gray',
        'blue',
        'red',
        'green',
        'yellow',
        'indigo',
        'rose',
        'amber',
        'custom'
      ]
    }
  },
  args: {
    progress: 0,
    label: '',
    showProgress: false,
    size: 'md',
    color: 'primary',
    customColorClasses: '',
    indeterminate: false
  } // default values
} satisfies Meta<typeof NeProgressBar>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeProgressBar v-bind="args" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeProgressBar },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { progress: 75 }
}

export const WithLabel: Story = {
  render: (args) => ({
    components: { NeProgressBar },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { progress: 75, label: 'Task progress' }
}

export const WithLabelAndProgress: Story = {
  render: (args) => ({
    components: { NeProgressBar },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { progress: 75, label: 'Task progress', showProgress: true }
}

export const Color: Story = {
  render: (args) => ({
    components: { NeProgressBar },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { progress: 75, color: 'blue' }
}

export const CustomColor: Story = {
  render: (args) => ({
    components: { NeProgressBar },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { progress: 75, color: 'custom', customColorClasses: 'bg-fuchsia-600 dark:bg-fuchsia-500' }
}

export const Indeterminate: Story = {
  render: (args) => ({
    components: { NeProgressBar },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { indeterminate: true }
}
