//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { NeTextArea, NeTooltip } from '../src/main'

const meta = {
  title: 'NeTextArea',
  component: NeTextArea,
  tags: ['autodocs'],
  // default values
  args: {
    label: 'Label',
    rows: 4,
    modelValue: '',
    placeholder: 'Placeholder',
    helperText: '',
    invalidMessage: '',
    optional: false,
    disabled: false,
    id: '',
    optionalLabel: 'Optional',
    readonly: false
  }
} satisfies Meta<typeof NeTextArea>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeTextArea v-bind="args" class="max-w-md" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeTextArea },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

export const HelperText: Story = {
  render: (args) => ({
    components: { NeTextArea },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { helperText: 'Helper text' }
}

export const Invalid: Story = {
  render: (args) => ({
    components: { NeTextArea },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    invalidMessage: 'Invalid input value'
  }
}

export const Optional: Story = {
  render: (args) => ({
    components: { NeTextArea },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    optional: true
  }
}

export const Disabled: Story = {
  render: (args) => ({
    components: { NeTextArea },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { disabled: true }
}

const templateWithTooltip =
  '<NeTextArea v-bind="args" class="max-w-md">\
      <template #tooltip>\
        <NeTooltip>\
          <template #content>Tooltip</template>\
        </NeTooltip>\
      </template>\
    </NeTextArea>'

export const WithTooltip: Story = {
  render: (args) => ({
    components: { NeTextArea, NeTooltip },
    setup() {
      return { args }
    },
    template: templateWithTooltip
  }),
  args: {}
}

export const Readonly: Story = {
  render: (args) => ({
    components: { NeTextArea },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { readonly: true }
}
