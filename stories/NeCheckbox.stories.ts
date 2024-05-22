//  Copyright (C) 2023 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'
import { NeCheckbox, NeTooltip } from '../src/main'

const meta = {
  title: 'NeCheckbox',
  component: NeCheckbox,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    modelValue: true,
    disabled: false,
    disableSelectOnLabel: false,
    id: ''
  }
} satisfies Meta<typeof NeCheckbox>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeCheckbox v-bind="args" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeCheckbox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

const templateWithSlot = '<NeCheckbox v-bind="args">Label using slot instead of prop</NeCheckbox>'

export const WithLabelSlot: Story = {
  render: (args) => ({
    components: { NeCheckbox },
    setup() {
      return { args }
    },
    template: templateWithSlot
  }),
  args: { label: '' }
}

export const Disabled: Story = {
  render: (args) => ({
    components: { NeCheckbox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { disabled: true }
}

const templateWithDescription =
  '<NeCheckbox v-bind="args"><span>Label</span><template #description>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</template></NeCheckbox>'

export const WithDescription: Story = {
  render: (args) => ({
    components: { NeCheckbox },
    setup() {
      return { args }
    },
    template: templateWithDescription
  }),
  args: {}
}

const templateDisableSelectOnLabel =
  '<NeCheckbox v-bind="args">I agree to the <a class="underline cursor-pointer text-primary-700 dark:text-primary-500">Terms and conditions</a></NeCheckbox>'

export const DisableSelectOnLabel: Story = {
  render: (args) => ({
    components: { NeCheckbox },
    setup() {
      return { args }
    },
    template: templateDisableSelectOnLabel
  }),
  args: { label: '', disableSelectOnLabel: true }
}

const templateWithTooltip =
  '<NeCheckbox v-bind="args">\
      <template #tooltip>\
        <NeTooltip>\
          <template #content>Tooltip</template>\
        </NeTooltip>\
      </template>\
    </NeCheckbox>'

export const WithTooltip: Story = {
  render: (args) => ({
    components: { NeCheckbox, NeTooltip },
    setup() {
      return { args }
    },
    template: templateWithTooltip
  }),
  args: {}
}
