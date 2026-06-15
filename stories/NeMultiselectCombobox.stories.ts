//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { NeMultiselectCombobox, NeTooltip } from '../src/main'
import type { NeMultiselectComboboxOption } from '../src/main'
import { faBell, faEarthAmericas, faStar } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

const baseOptions = [
  { id: '1', label: 'Cherry' },
  { id: '2', label: 'Apple' },
  { id: '3', label: 'Banana' },
  { id: '4', label: 'Avocado', disabled: true },
  { id: '5', label: 'Peach' }
]

const meta = {
  title: 'NeMultiselectCombobox',
  component: NeMultiselectCombobox,
  tags: ['autodocs'],
  args: {
    label: 'Choose fruit',
    placeholder: 'Placeholder',
    helperText: '',
    invalidMessage: '',
    disabled: false,
    showOptionsType: true,
    optional: false,
    noResultsLabel: 'No results',
    noOptionsLabel: 'No options available',
    acceptUserInput: false,
    userInputLabel: 'User input',
    optionalLabel: 'Optional',
    customOptionsWidth: '',
    maxHeight: '8.5rem',
    maxOptionsShown: 50,
    limitedOptionsLabel: 'Continue typing to show more options',
    externalFilter: false,
    loadingOptions: false,
    badgeKind: 'gray',
    badgeCustomKindClasses: '',
    modelValue: [],
    options: baseOptions
  }
} satisfies Meta<typeof NeMultiselectCombobox>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeMultiselectCombobox v-bind="args" class="max-w-md" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {}
}

export const WithSelectedOptions: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    modelValue: ['1', '2']
  }
}

export const Optional: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    optional: true
  }
}

const manyOptions: NeMultiselectComboboxOption[] = []

for (let i = 0; i < 150; i++) {
  manyOptions.push({ id: i.toString(), label: `Option ${i}` })
}

export const ManyOptions: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    options: manyOptions,
    label: 'Choose options'
  }
}

export const GrowingInput: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    options: manyOptions,
    modelValue: manyOptions.slice(0, 14).map((opt) => opt.id),
    maxHeight: '8rem',
    label: 'Choose many options'
  }
}

export const HelperText: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: { helperText: 'Helper text' }
}

export const Invalid: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    invalidMessage: 'Invalid value'
  }
}

export const Disabled: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: { disabled: true }
}

export const OptionsWithDescription: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    label: 'Choose people',
    options: [
      { id: '1', label: 'Wade Cooper', description: '@wadecooper' },
      { id: '2', label: 'Arlene Mccoy', description: '@arlenemccoy' },
      { id: '3', label: 'Devon Webb', description: '@devonwebb' },
      { id: '4', label: 'Tom Cook', description: '@tomcook' },
      { id: '5', label: 'Tanya Fox', description: '@tanyafox' }
    ]
  }
}

library.add(faStar)
library.add(faBell)
library.add(faEarthAmericas)

export const OptionsWithIcon: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    label: 'Choose',
    options: [
      { id: '1', label: 'First option', description: 'Description', icon: faStar },
      { id: '2', label: 'Second option', icon: faBell },
      { id: '3', label: 'Third option', icon: faEarthAmericas }
    ]
  }
}

export const NoOptions: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: { options: [] }
}

const templateWithTooltip =
  '<NeMultiselectCombobox v-bind="args" class="max-w-md">\
      <template #tooltip>\
        <NeTooltip>\
          <template #content>Tooltip</template>\
        </NeTooltip>\
      </template>\
    </NeMultiselectCombobox>'

export const WithTooltip: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox, NeTooltip },
    setup() {
      return { args }
    },
    template: templateWithTooltip
  }),
  args: {}
}

export const AcceptUserInput: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: { acceptUserInput: true, placeholder: 'Choose or type any fruit' }
}

export const CustomOptionsWidth: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    label: 'Choose',
    customOptionsWidth: '42rem',
    options: [
      {
        id: '1',
        label: 'This is a very long option text that would normally overflow the combobox width',
        description: 'Description that is also quite long'
      },
      {
        id: '2',
        label: 'Another lengthy option with extensive information',
        description: 'More details about this option'
      }
    ]
  }
}

export const ExternalFilter: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      const options = ref([...baseOptions])
      const modelValue = ref([])
      function onFilter(query: string) {
        options.value = baseOptions.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase())
        )
      }
      return { args, options, modelValue, onFilter }
    },
    template:
      '<NeMultiselectCombobox v-bind="args" :options="options" v-model="modelValue" @filter="onFilter" class="max-w-md" />'
  }),
  args: {
    externalFilter: true,
    label: 'Choose fruit (external filter)',
    placeholder: 'Type to filter...'
  }
}

export const ExternalFilterWithUserInput: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      const options = ref([...baseOptions])
      const modelValue = ref([])
      function onFilter(query: string) {
        options.value = baseOptions.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase())
        )
      }
      return { args, options, modelValue, onFilter }
    },
    template:
      '<NeMultiselectCombobox v-bind="args" :options="options" v-model="modelValue" @filter="onFilter" class="max-w-md" />'
  }),
  args: {
    externalFilter: true,
    acceptUserInput: true,
    label: 'Choose fruit (external filter + user input)',
    placeholder: 'Type to filter or create custom value...',
    userInputLabel: 'custom value'
  }
}

export const LoadingOptions: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    externalFilter: true,
    loadingOptions: true,
    label: 'Choose fruit (external filter)',
    placeholder: 'Type to filter...'
  }
}

export const BadgeKindPrimary: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    modelValue: ['1', '2', '3'],
    badgeKind: 'primary',
    label: 'Primary badges'
  }
}

export const BadgeKindCustom: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      return { args }
    },
    template
  }),
  args: {
    modelValue: ['1', '2', '3'],
    badgeKind: 'custom',
    badgeCustomKindClasses: 'text-white bg-linear-to-br from-fuchsia-500 to-blue-500',
    label: 'Custom badge classes'
  }
}
