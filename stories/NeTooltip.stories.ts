//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeLink, NeTooltip } from '../src/main'

const placementValues = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'auto',
  'auto-start',
  'auto-end'
]

const triggerEventValues = ['click', 'mouseenter focus', 'focusin', 'mouseenter click', 'manual']

const meta = {
  title: 'NeTooltip',
  component: NeTooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: placementValues
    },
    triggerEvent: {
      control: 'inline-radio',
      options: triggerEventValues
    }
  },
  args: { placement: 'top', triggerEvent: 'click', interactive: true } // default values
} satisfies Meta<typeof NeTooltip>

export default meta
type Story = StoryObj<typeof meta>

const defaultTemplate = `<div class="mt-8 ml-16">
    <NeTooltip v-bind="args">
      <template #content>Tooltip</template>
    </NeTooltip>
  </div>`

export const Default: Story = {
  render: (args) => ({
    components: { NeTooltip },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: {}
}

const templateWithTrigger = `<div class="mt-8 ml-16">
    <NeTooltip v-bind="args">
      <template #trigger>
        <span class="text-gray-900 dark:text-gray-50">Trigger</span>
      </template>
      <template #content>Tooltip</template>
    </NeTooltip>
  </div>`

export const WithTriggerSlot: Story = {
  render: (args) => ({
    components: { NeTooltip },
    setup() {
      return { args }
    },
    template: templateWithTrigger
  }),
  args: {}
}

export const ShowOnMouseEnter: Story = {
  render: (args) => ({
    components: { NeTooltip },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: { triggerEvent: 'mouseenter focus' }
}

const placementsTemplate = `<div class="flex justify-evenly mt-8">
    <NeTooltip v-for="placement in placementValues"
        :key="placement" v-bind="args" :placement="placement">
      <template #content>{{placement}}</template>
    </NeTooltip>
  </div>`

export const Placement: Story = {
  render: (args) => ({
    components: { NeTooltip },
    setup() {
      return { args, placementValues }
    },
    template: placementsTemplate
  }),
  args: { triggerEvent: 'mouseenter focus' }
}

const containsLinkTemplate = `<div class="mt-8 ml-16">
    <NeTooltip v-bind="args">
      <template #content>
        <p class="mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <NeLink invertedTheme href="https://www.wikipedia.org/" target="_blank">Go to Wikipedia</NeLink>
      </template>
    </NeTooltip>
  </div>`

export const ContainsLink: Story = {
  render: (args) => ({
    components: { NeTooltip, NeLink },
    setup() {
      return { args }
    },
    template: containsLinkTemplate
  }),
  args: { placement: 'right' }
}
