//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeDropdownFilterV2, NeButton, NeDropdownFilterV2Option } from '../src/main'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const defaultOptions: NeDropdownFilterV2Option[] = [
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
]

const meta = {
  title: 'NeDropdownFilterV2',
  component: NeDropdownFilterV2,
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'inline-radio', options: ['radio', 'checkbox'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] }
  },
  args: {
    label: 'Filter label',
    options: defaultOptions,
    kind: 'checkbox',
    clearFilterLabel: 'Clear selection',
    openMenuAriaLabel: 'Open filter',
    showClearFilter: true,
    showSelectionCount: true,
    showRadioSelection: false,
    noOptionsLabel: 'No options',
    showOptionsFilter: false,
    clearSearchLabel: 'Clear',
    optionsFilterPlaceholder: 'Filter options',
    maxOptionsShown: 25,
    moreOptionsHiddenLabel: 'Continue typing to show more options',
    alignToRight: false,
    size: 'md',
    disabled: false,
    id: '',
    externalFilter: false,
    loadingOptions: false,
    customActionLabel: ''
  }
} satisfies Meta<typeof NeDropdownFilterV2>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeDropdownFilterV2 v-bind="args" />'

export const CheckboxOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

export const RadioOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'radio'
  }
}

export const RadioWithSelectionShown: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    kind: 'radio',
    showRadioSelection: true
  }
}

export const OptionsWithDescription: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
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
    components: { NeDropdownFilterV2 },
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
  <NeDropdownFilterV2 v-bind="args" />
</div>`

export const AlignToRight: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      return { args }
    },
    template: alignToRightTemplate
  }),
  args: { alignToRight: true }
}

export const Disabled: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    disabled: true
  }
}

const withSlotTemplate = `<NeDropdownFilterV2 v-bind="args">
  <template #button>
    <span class="text-gray-700 dark:text-gray-100">
      Button slot
    </span>
  </template>
</NeDropdownFilterV2>`

export const ButtonSlot: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2, NeButton, FontAwesomeIcon },
    setup() {
      return { args }
    },
    template: withSlotTemplate
  }),
  args: {}
}

export const NoOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
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
    components: { NeDropdownFilterV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    showOptionsFilter: true
  }
}

const manyOptions: NeDropdownFilterV2Option[] = []

for (let i = 0; i < 150; i++) {
  manyOptions.push({ id: i.toString(), label: `Option ${i}` })
}

export const GroupedOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    showOptionsFilter: true,
    options: [
      {
        group: 'NethServer',
        options: [
          { id: 'ns8:latest', label: 'latest' },
          { id: 'ns8:3.18.0-dev.1', label: '3.18.0-dev.1' },
          { id: 'ns8:3.17.1', label: '3.17.1' },
          { id: 'ns8:3.17.0-dev.6', label: '3.17.0-dev.6' }
        ]
      },
      {
        group: 'NethSecurity',
        options: [
          { id: 'nsec:8.7.1-monitoring', label: '8.7.1-monitoring' },
          { id: 'nsec:8.7.1-dev', label: '8.7.1-dev+504e1c0eb' },
          { id: 'nsec:8.7.1', label: '8.7.1' }
        ]
      }
    ]
  }
}

export const ManyOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    options: manyOptions
  }
}

// Pre-selected options that are beyond the maxOptionsShown limit stay pinned at
// the top of the list, so the current selection is always visible.
export const PinnedSelectedOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      const model = ref<NeDropdownFilterV2Option[]>([manyOptions[40], manyOptions[60]])
      return { args, model }
    },
    template: '<NeDropdownFilterV2 v-bind="args" v-model="model" />'
  }),
  args: {
    options: manyOptions,
    maxOptionsShown: 25,
    showOptionsFilter: true
  }
}

export const ExternalFilter: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      const options = ref(defaultOptions)

      function onSearch(query: string) {
        options.value = defaultOptions.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase())
        )
      }

      return { args, options, onSearch }
    },
    template: '<NeDropdownFilterV2 v-bind="args" :options="options" @search="onSearch" />'
  }),
  args: {
    externalFilter: true,
    showOptionsFilter: true
  }
}

// With externalFilter, a selected option stays pinned at the top even after the
// parent removes it from the options list (e.g. while searching for something else).
export const ExternalFilterPinnedSelection: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      const options = ref(defaultOptions)
      const model = ref<NeDropdownFilterV2Option[]>([defaultOptions[0]])

      function onSearch(query: string) {
        options.value = defaultOptions.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase())
        )
      }

      return { args, options, model, onSearch }
    },
    template:
      '<NeDropdownFilterV2 v-bind="args" :options="options" v-model="model" @search="onSearch" />'
  }),
  args: {
    externalFilter: true,
    showOptionsFilter: true
  }
}

export const LoadingOptions: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    showOptionsFilter: true,
    externalFilter: true,
    loadingOptions: true
  }
}

export const CustomAction: Story = {
  render: (args) => ({
    components: { NeDropdownFilterV2 },
    setup() {
      function onCustomAction() {
        alert('Custom action triggered!')
      }
      return { args, onCustomAction }
    },
    template: '<NeDropdownFilterV2 v-bind="args" @custom-action="onCustomAction" />'
  }),
  args: {
    customActionLabel: 'Custom action'
  }
}
