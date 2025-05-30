//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeDropdownFilter, NeButton } from '../src/main'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const meta = {
  title: 'NeDropdownFilter',
  component: NeDropdownFilter,
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'inline-radio', options: ['radio', 'checkbox'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] }
  },
  args: {
    label: 'Filter label',
    options: [
      {
        id: 'option1',
        label: 'Option 1'
      },
      {
        id: 'option2',
        label: 'Option 2'
      },
      {
        id: 'option3',
        label: 'Option 3',
        disabled: true
      },
      {
        id: 'option4',
        label: 'Option 4'
      },
      {
        id: 'option5',
        label: 'Option 5'
      },
      {
        id: 'option6',
        label: 'Option 6'
      }
    ],
    kind: 'checkbox',
    clearFilterLabel: 'Clear selection',
    openMenuAriaLabel: 'Open filter',
    showClearFilter: true,
    showSelectionCount: true,
    noOptionsLabel: 'No options',
    showOptionsFilter: false,
    optionsFilterPlaceholder: 'Filter options',
    maxOptionsShown: 25,
    moreOptionsHiddenLabel: 'Continue typing to show more options',
    alignToRight: false,
    size: 'md',
    disabled: false,
    id: ''
  }
} satisfies Meta<typeof NeDropdownFilter>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeDropdownFilter v-bind="args" />'

export const CheckboxOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilter },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

export const RadioOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilter },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'radio'
  }
}

export const OptionsWithDescription: Story = {
  render: (args) => ({
    components: { NeDropdownFilter },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    options: [
      {
        id: 'option1',
        label: 'Option 1',
        description: 'Description for option 1',
        disabled: false
      },
      {
        id: 'option2',
        label: 'Option 2',
        description: 'Description for option 2',
        disabled: false
      },
      {
        id: 'option3',
        label: 'Option 3',
        description: 'Description for option 3',
        disabled: true
      },
      {
        id: 'option4',
        label: 'Option 4',
        description: 'Description for option 4',
        disabled: false
      }
    ]
  }
}

export const NoClearFilter: Story = {
  render: (args) => ({
    components: { NeDropdownFilter },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'checkbox',
    showClearFilter: false
  }
}

const alignToRightTemplate = `<div class="flex justify-end w-72">
  <NeDropdownFilter v-bind="args" />
</div>`

export const AlignToRight: Story = {
  render: (args) => ({
    components: { NeDropdownFilter },
    setup() {
      return { args }
    },
    template: alignToRightTemplate
  }),
  args: { alignToRight: true }
}

export const Disabled: Story = {
  render: (args) => ({
    components: { NeDropdownFilter },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    disabled: true
  }
}

const withSlotTemplate = `<NeDropdownFilter v-bind="args">
  <template #button>
    <span class="text-gray-700 dark:text-gray-100">
      Button slot
    </span>
  </template>
</NeDropdownFilter>`

export const ButtonSlot: Story = {
  render: (args) => ({
    components: { NeDropdownFilter, NeButton, FontAwesomeIcon },
    setup() {
      return { args }
    },
    template: withSlotTemplate
  }),
  args: {}
}

export const NoOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilter },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    options: []
  }
}

export const ShowOptionsFilter: Story = {
  render: (args) => ({
    components: { NeDropdownFilter },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    showOptionsFilter: true
  }
}

const manyOptions: any = []

for (let i = 0; i < 150; i++) {
  manyOptions.push({ id: i.toString(), label: `Option ${i}` })
}

export const ManyOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilter },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    options: manyOptions
  }
}
