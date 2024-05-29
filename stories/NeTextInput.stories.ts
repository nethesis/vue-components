//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'

import { NeTextInput, NeTooltip } from '../src/main'

const meta = {
  title: 'NeTextInput',
  component: NeTextInput,
  // default values
  args: {
    label: 'Label',
    modelValue: '',
    placeholder: 'Placeholder',
    helperText: '',
    invalidMessage: '',
    optional: false,
    disabled: false,
    id: '',
    isPassword: false,
    showPasswordLabel: 'Show password',
    hidePasswordLabel: 'Hide password',
    optionalLabel: 'Optional'
  }
} satisfies Meta<typeof NeTextInput>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeTextInput v-bind="args" class="max-w-md" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeTextInput },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

export const HelperText: Story = {
  render: (args) => ({
    components: { NeTextInput },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { helperText: 'Helper text' }
}

export const Invalid: Story = {
  render: (args) => ({
    components: { NeTextInput },
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
    components: { NeTextInput },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { optional: true }
}

export const Disabled: Story = {
  render: (args) => ({
    components: { NeTextInput },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { disabled: true }
}

export const Password: Story = {
  render: (args) => ({
    components: { NeTextInput },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { isPassword: true, label: 'Enter password', placeholder: '' }
}

const typeNumberTemplate = '<NeTextInput v-bind="args" type="number" class="max-w-md" />'

export const TypeNumber: Story = {
  render: (args) => ({
    components: { NeTextInput },
    setup() {
      return { args }
    },
    template: typeNumberTemplate
  }),
  args: {}
}

const templateWithTooltip =
  '<NeTextInput v-bind="args" class="max-w-md">\
      <template #tooltip>\
        <NeTooltip>\
          <template #content>Tooltip</template>\
        </NeTooltip>\
      </template>\
    </NeTextInput>'

export const WithTooltip: Story = {
  render: (args) => ({
    components: { NeTextInput, NeTooltip },
    setup() {
      return { args }
    },
    template: templateWithTooltip
  }),
  args: {}
}
