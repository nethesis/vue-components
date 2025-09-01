//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeButton } from '../src/main'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const meta = {
  title: 'NeButton',
  component: NeButton,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    kind: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    loadingPosition: { control: 'inline-radio', options: ['prefix', 'suffix'] }
  },
  args: {
    kind: 'secondary',
    size: 'md',
    disabled: false,
    loading: false,
    loadingPosition: 'prefix'
  } // default values
} satisfies Meta<typeof NeButton>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeButton v-bind="args">Button</NeButton>'
export const Secondary: Story = {
  render: (args) => ({
    components: { NeButton },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'secondary'
  }
}

export const Primary: Story = {
  render: (args) => ({
    components: { NeButton },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'primary'
  }
}

export const Tertiary: Story = {
  render: (args) => ({
    components: { NeButton },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'tertiary'
  }
}

export const Danger: Story = {
  render: (args) => ({
    components: { NeButton },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'danger'
  }
}

export const Loading: Story = {
  render: (args) => ({
    components: { NeButton },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    loading: true
  }
}

const templateWithPrefix =
  '<NeButton v-bind="args">\
    <template #prefix>\
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">\
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>\
      </svg>\
    </template>\
    Button\
  </NeButton>'

export const WithPrefix: Story = {
  render: (args) => ({
    components: { NeButton },
    setup() {
      return { args }
    },
    template: templateWithPrefix
  }),
  args: {}
}

const templateWithSuffix =
  '<NeButton v-bind="args">\
    <template #suffix>\
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">\
        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>\
      </svg>\
    </template>\
    Button\
  </NeButton>'

export const WithSuffix: Story = {
  render: (args) => ({
    components: { NeButton },
    setup() {
      return { args }
    },
    template: templateWithSuffix
  }),
  args: { loadingPosition: 'suffix' }
}

const templateIconOnly = `<div>
  <NeButton v-bind="args">
    <FontAwesomeIcon :icon="faCopy" class="h-6 w-4" aria-hidden="true" />
  </NeButton>
  <div class="mt-4">It is recommended to show a tooltip when the cursor hovers over the button.</div>
</div>`

export const IconOnly: Story = {
  render: (args) => ({
    components: { NeButton, FontAwesomeIcon },
    setup() {
      return { args, faCopy }
    },
    template: templateIconOnly
  }),
  args: {}
}

export const Disabled: Story = {
  render: (args) => ({
    components: { NeButton },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    disabled: true
  }
}
