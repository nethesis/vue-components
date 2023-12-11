//  Copyright (C) 2023 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'
import { NeInlineNotification } from '../src/main'

const meta = {
  title: 'Visual/NeInlineNotification',
  component: NeInlineNotification,
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'inline-radio', options: ['info', 'warning', 'error', 'success'] }
  },
  args: {
    kind: 'info',
    title: 'Title',
    description: 'This is a sample description',
    showCloseButton: false,
    primaryButtonLabel: '',
    secondaryButtonLabel: '',
    showDetailsLabel: 'Show details',
    closeAriaLabel: 'Dismiss'
  } // default values
} satisfies Meta<typeof NeInlineNotification>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeInlineNotification v-bind="args" class="max-w-3xl" />'

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Info: Story = {
  render: (args) => ({
    components: { NeInlineNotification },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'info'
  }
}

export const Warning: Story = {
  render: (args) => ({
    components: { NeInlineNotification },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'warning'
  }
}

export const Error: Story = {
  render: (args) => ({
    components: { NeInlineNotification },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'error'
  }
}

export const Success: Story = {
  render: (args) => ({
    components: { NeInlineNotification },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'success'
  }
}

export const WithCloseIcon: Story = {
  render: (args) => ({
    components: { NeInlineNotification },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    showCloseButton: true
  }
}

const slotsTemplate = `
  <NeInlineNotification v-bind='args' class='max-w-3xl'>
    <template #title>
      Title using a slot
    </template>
    <template #description>
      A description using a slot
    </template>
  </NeInlineNotification>`

export const WithSlots: Story = {
  render: (args) => ({
    components: { NeInlineNotification },
    setup() {
      return { args }
    },
    template: slotsTemplate
  }),
  args: {
    title: '',
    description: ''
  }
}

export const Buttons: Story = {
  render: (args) => ({
    components: { NeInlineNotification },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    primaryButtonLabel: 'Primary button',
    secondaryButtonLabel: 'Secondary button'
  }
}

const detailsTemplate = `
  <NeInlineNotification v-bind='args' class='max-w-3xl'>
    <template #details>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </template>
  </NeInlineNotification>`

export const Details: Story = {
  render: (args) => ({
    components: { NeInlineNotification },
    setup() {
      return { args }
    },
    template: detailsTemplate
  }),
  args: {}
}
