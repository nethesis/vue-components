//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeSortDropdown, NeButton } from '../src/main'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const meta = {
  title: 'NeSortDropdown',
  component: NeSortDropdown,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] }
  },
  args: {
    label: 'Sort',
    options: [
      {
        id: 'name',
        label: 'Name'
      },
      {
        id: 'age',
        label: 'Age'
      },
      {
        id: 'address',
        label: 'Address'
      },
      {
        id: 'jobTitle',
        label: 'Job title'
      }
    ],
    openMenuAriaLabel: 'Open menu',
    sortByLabel: 'Sort by',
    sortDirectionLabel: 'Sort direction',
    ascendingLabel: 'Ascending',
    descendingLabel: 'Descending',
    alignToRight: false,
    size: 'md',
    disabled: false,
    id: ''
  }
} satisfies Meta<typeof NeSortDropdown>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeSortDropdown v-bind="args" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeSortDropdown },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

const alignToRightTemplate = `<div class="flex justify-end w-72">
  <NeSortDropdown v-bind="args" />
</div>`

export const AlignToRight: Story = {
  render: (args) => ({
    components: { NeSortDropdown },
    setup() {
      return { args }
    },
    template: alignToRightTemplate
  }),
  args: { alignToRight: true }
}

export const Disabled: Story = {
  render: (args) => ({
    components: { NeSortDropdown },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    disabled: true
  }
}

const withSlotTemplate = `<NeSortDropdown v-bind="args">
  <template #button>
    <span class="text-gray-700 dark:text-gray-100">
      Button slot
    </span>
  </template>
</NeSortDropdown>`

export const ButtonSlot: Story = {
  render: (args) => ({
    components: { NeSortDropdown, NeButton, FontAwesomeIcon },
    setup() {
      return { args }
    },
    template: withSlotTemplate
  }),
  args: {}
}

export const ManyOptions: Story = {
  render: (args) => ({
    components: { NeSortDropdown },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    options: [
      {
        id: 'name',
        label: 'Name'
      },
      {
        id: 'age',
        label: 'Age'
      },
      {
        id: 'address',
        label: 'Address'
      },
      {
        id: 'jobTitle',
        label: 'Job title'
      },
      {
        id: 'department',
        label: 'Department'
      },
      {
        id: 'hireDate',
        label: 'Hire date'
      },
      {
        id: 'salary',
        label: 'Salary'
      },
      {
        id: 'status',
        label: 'Status'
      },
      {
        id: 'manager',
        label: 'Manager'
      },
      {
        id: 'team',
        label: 'Team'
      }
    ]
  }
}
