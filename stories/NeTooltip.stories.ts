//  Copyright (C) 2023 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'
import { NeTooltip } from '../src/main'

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
  title: 'Visual/NeTooltip',
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

const defaultTemplate =
  '<NeTooltip v-bind="args">\
      <template #content>Tooltip</template>\
    </NeTooltip>'

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

const templateWithTrigger =
  '<NeTooltip v-bind="args">\
      <template #trigger>Trigger</template>\
      <template #content>Tooltip</template>\
    </NeTooltip>'

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

const placementsTemplate =
  '<div class="flex justify-evenly">\
      <NeTooltip v-for="placement in placementValues"\
          :key="placement" v-bind="args" :placement="placement">\
        <template #content>{{placement}}</template>\
      </NeTooltip>\
    </div>'

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
