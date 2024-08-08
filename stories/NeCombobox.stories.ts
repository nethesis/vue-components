//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'

import { NeCombobox, NeTooltip } from '../src/main'
import { faStar, faBell, faEarthAmericas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

const meta = {
  title: 'NeCombobox',
  component: NeCombobox,
  tags: ['autodocs'],
  args: {
    label: 'Choose fruit',
    placeholder: 'Placeholder',
    helperText: '',
    invalidMessage: '',
    maxOptionsShown: 50,
    multiple: false,
    disabled: false,
    showOptionsType: true,
    optional: false,
    selectedLabel: 'Selected',
    showSelectedLabel: true,
    noResultsLabel: 'No results',
    limitedOptionsLabel: 'Continue typing to show more options',
    noOptionsLabel: 'No options available',
    acceptUserInput: false,
    userInputLabel: 'User input',
    optionalLabel: 'Optional',
    modelValue: '',
    options: [
      { id: '1', label: 'Cherry' },
      { id: '2', label: 'Apple' },
      { id: '3', label: 'Banana' },
      { id: '4', label: 'Avocado', disabled: true },
      { id: '5', label: 'Peach' }
    ]
  } // default values
} satisfies Meta<typeof NeCombobox>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeCombobox v-bind="args" class="max-w-md" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

export const Optional: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    optional: true
  }
}

const manyOptions: any = []

for (let i = 0; i < 150; i++) {
  manyOptions.push({ id: i.toString(), label: `Option ${i}` })
}

export const ManyOptions: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    options: manyOptions,
    label: 'Choose'
  }
}

export const HelperText: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { helperText: 'Helper text' }
}

export const Invalid: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    invalidMessage: 'Invalid value'
  }
}

export const Disabled: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { disabled: true }
}

export const Multiple: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    label: 'Choose one or more options',
    multiple: true
  }
}

export const MultipleWithManyOptions: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    options: manyOptions,
    label: 'Choose one or more options',
    multiple: true
  }
}

export const OptionsWithDescription: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    label: 'Choose',
    options: [
      { id: '1', label: 'Wade Cooper', description: '@wadecooper' },
      { id: '2', label: 'Arlene Mccoy', description: '@arlenemccoy' },
      { id: '3', label: 'Devon Webb', description: '@devonwebb' },
      { id: '4', label: 'Tom Cook', description: '@tomcook' },
      { id: '5', label: 'Tanya Fox', description: '@tanyafox' },
      { id: '6', label: 'Hellen Schmidt', description: '@hellenschmidt' },
      { id: '7', label: 'Caroline Schultz', description: '@carolineschultz' },
      { id: '8', label: 'Mason Heaney', description: '@masonheaney' },
      { id: '9', label: 'Claudie Smitham', description: '@claudiesmitham' },
      { id: '10', label: 'Emil Schaefer', description: '@emilschaefer' }
    ]
  }
}

library.add(faStar)
library.add(faBell)
library.add(faEarthAmericas)

export const OptionsWithIcon: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
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
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { options: [] }
}

const templateWithTooltip =
  '<NeCombobox v-bind="args" class="max-w-md">\
      <template #tooltip>\
        <NeTooltip>\
          <template #content>Tooltip</template>\
        </NeTooltip>\
      </template>\
    </NeCombobox>'

export const WithTooltip: Story = {
  render: (args) => ({
    components: { NeCombobox, NeTooltip },
    setup() {
      return { args }
    },
    template: templateWithTooltip
  }),
  args: {}
}

export const AcceptUserInput: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { acceptUserInput: true, placeholder: 'Choose or type any fruit' }
}

export const AcceptUserInputMultiple: Story = {
  render: (args) => ({
    components: { NeCombobox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { acceptUserInput: true, multiple: true, placeholder: 'Choose or type any fruit' }
}
