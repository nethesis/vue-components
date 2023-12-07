//  Copyright (C) 2023 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'
import NeSpinner from '../src/components/NeSpinner.vue'

const meta = {
  title: 'Utils/NeSpinner',
  component: NeSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: [
        '0',
        'px',
        '0.5',
        '1',
        '1.5',
        '2',
        '2.5',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12'
      ]
    },
    color: {
      control: 'inline-radio',
      options: ['primary', 'blue', 'gray', 'green', 'red', 'yellow', 'pink', 'purple', 'white']
    }
  },
  args: { size: '4', color: 'primary' } // default values
} satisfies Meta<typeof NeSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
