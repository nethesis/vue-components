//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, onMounted } from 'vue'
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
    modelValue: [baseOptions[0], baseOptions[1]]
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
    modelValue: manyOptions.slice(0, 14),
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

interface WikipediaSearchResult {
  pageid: number
  title: string
  snippet: string
}

async function searchWikipedia(query: string): Promise<NeMultiselectComboboxOption[]> {
  const searchQuery = query.trim() || 'a'
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&srlimit=50&format=json&origin=*`
  )
  const data = await res.json()
  const results: WikipediaSearchResult[] = data.query?.search || []
  return results.map((r) => ({
    id: r.pageid.toString(),
    label: r.title,
    description: r.snippet.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 60) + '...'
  }))
}

export const ExternalFilter: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      const options = ref<NeMultiselectComboboxOption[]>([])
      const modelValue = ref<NeMultiselectComboboxOption[]>([])
      const loadingOptions = ref(false)

      async function onFilter(query: string) {
        loadingOptions.value = true
        try {
          options.value = await searchWikipedia(query)
        } finally {
          loadingOptions.value = false
        }
      }

      onMounted(() => onFilter(''))

      return { args, options, modelValue, loadingOptions, onFilter }
    },
    template:
      '<NeMultiselectCombobox v-bind="args" :options="options" v-model="modelValue" :loading-options="loadingOptions" @filter="onFilter" class="max-w-md" />'
  }),
  args: {
    externalFilter: true,
    label: 'Wikipedia articles',
    placeholder: 'Type to search Wikipedia...'
  }
}

export const ExternalFilterWithUserInput: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      const options = ref<NeMultiselectComboboxOption[]>([])
      const modelValue = ref<NeMultiselectComboboxOption[]>([])
      const loadingOptions = ref(false)

      async function onFilter(query: string) {
        loadingOptions.value = true
        try {
          options.value = await searchWikipedia(query)
        } finally {
          loadingOptions.value = false
        }
      }

      onMounted(() => onFilter(''))

      return { args, options, modelValue, loadingOptions, onFilter }
    },
    template:
      '<NeMultiselectCombobox v-bind="args" :options="options" v-model="modelValue" :loading-options="loadingOptions" @filter="onFilter" class="max-w-md" />'
  }),
  args: {
    externalFilter: true,
    acceptUserInput: true,
    label: 'Wikipedia articles (+ custom)',
    placeholder: 'Type to search or add custom value...',
    userInputLabel: 'Custom value'
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
    modelValue: baseOptions.slice(0, 3),
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
    modelValue: baseOptions.slice(0, 3),
    badgeKind: 'custom',
    badgeCustomKindClasses: 'text-white bg-linear-to-br from-fuchsia-500 to-blue-500',
    label: 'Custom badge classes'
  }
}

// Custom type extending NeMultiselectComboboxOption with additional attribute
interface EmployeeOption extends NeMultiselectComboboxOption {
  department: string
  email: string
}

const employeeOptions: EmployeeOption[] = [
  { id: '1', label: 'Alice Johnson', department: 'Engineering', email: 'alice@example.com' },
  { id: '2', label: 'Bob Smith', department: 'Sales', email: 'bob@example.com' },
  { id: '3', label: 'Carol Davis', department: 'Engineering', email: 'carol@example.com' },
  { id: '4', label: 'David Brown', department: 'HR', email: 'david@example.com' },
  { id: '5', label: 'Eve Wilson', department: 'Marketing', email: 'eve@example.com' }
]

export const CustomTypeExtension: Story = {
  render: (args) => ({
    components: { NeMultiselectCombobox },
    setup() {
      const modelValue = ref<EmployeeOption[]>([])

      return { args, modelValue }
    },
    template: `
      <div class="space-y-4">
        <NeMultiselectCombobox 
          v-bind="args" 
          :options="modelValue.length ? args.options : args.options" 
          v-model="modelValue" 
          class="max-w-md" 
        />
        <div v-if="modelValue.length" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
          <p class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Selected employees (v-model):</p>
          <pre class="text-xs overflow-auto text-gray-600 dark:text-gray-400">{{ JSON.stringify(modelValue, null, 2) }}</pre>
        </div>
      </div>
    `
  }),
  args: {
    label: 'Select employees',
    placeholder: 'Choose employees...',
    helperText: 'Select team members from different departments',
    options: employeeOptions
  }
}
