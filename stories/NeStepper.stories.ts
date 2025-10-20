//  Copyright (C) 2025 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeStepper } from '../src/main'

const meta = {
  title: 'NeStepper',
  component: NeStepper,
  tags: ['autodocs'],
  args: {
    totalSteps: 4,
    currentStep: 1,
    stepLabel: 'Step'
  } // default values
} satisfies Meta<typeof NeStepper>

export default meta
type Story = StoryObj<typeof meta>

const defaultTemplate = `<NeStepper v-bind="args" />`

export const Default: Story = {
  render: (args) => ({
    components: { NeStepper },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: {}
}
