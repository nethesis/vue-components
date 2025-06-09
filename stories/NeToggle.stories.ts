//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { NeToggle, NeTooltip } from '../src/main'

const meta = {
  title: 'NeToggle',
  component: NeToggle,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] }
  },
  // default values
  args: {
    label: 'Label',
    topLabel: '',
    size: 'md',
    disabled: false,
    modelValue: true,
    invalidMessage: ''
  }
} satisfies Meta<typeof NeToggle>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeToggle v-bind="args" class="max-w-md" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeToggle },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

export const Disabled: Story = {
  render: (args) => ({
    components: { NeToggle },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { disabled: true }
}

const templateWithTooltip = `<NeToggle v-bind="args">
  <template #tooltip>
    <NeTooltip>
      <template #content>Tooltip</template>
    </NeTooltip>
  </template>
</NeToggle>`

export const WithTooltip: Story = {
  render: (args) => ({
    components: { NeToggle, NeTooltip },
    setup() {
      return { args }
    },
    template: templateWithTooltip
  }),
  args: {}
}

export const WithTopLabel: Story = {
  render: (args) => ({
    components: { NeToggle },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { topLabel: 'Top label' }
}

const templateWithTopTooltip = `<NeToggle v-bind="args">
  <template #topTooltip>
    <NeTooltip>
      <template #content>Top tooltip</template>
    </NeTooltip>
  </template>
</NeToggle>`

export const WithTopLabelAndTooltip: Story = {
  render: (args) => ({
    components: { NeToggle, NeTooltip },
    setup() {
      return { args }
    },
    template: templateWithTopTooltip
  }),
  args: { topLabel: 'Top label' }
}

export const InvalidMessage: Story = {
  render: (args) => ({
    components: { NeToggle },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    invalidMessage: 'Invalid selection'
  }
}
