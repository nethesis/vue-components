//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { NeListbox, NeTooltip } from '../src/main'

const meta = {
  title: 'NeListbox',
  component: NeListbox,
  tags: ['autodocs'],
  args: {
    label: 'Choose fruit',
    placeholder: 'Placeholder',
    helperText: '',
    invalidMessage: '',
    multiple: false,
    disabled: false,
    showOptionsType: true,
    optional: false,
    noOptionsLabel: 'No options available',
    optionalLabel: 'Optional',
    optionsPanelStyle: '',
    modelValue: '1',
    options: [
      { id: '1', label: 'Cherry' },
      { id: '2', label: 'Apple' },
      { id: '3', label: 'Banana' },
      { id: '4', label: 'Avocado', disabled: true },
      { id: '5', label: 'Peach' }
    ]
  } // default values
} satisfies Meta<typeof NeListbox>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeListbox v-bind="args" class="max-w-md" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeListbox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

export const Optional: Story = {
  render: (args) => ({
    components: { NeListbox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    optional: true,
    modelValue: ''
  }
}

export const HelperText: Story = {
  render: (args) => ({
    components: { NeListbox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { helperText: 'Helper text' }
}

export const Invalid: Story = {
  render: (args) => ({
    components: { NeListbox },
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
    components: { NeListbox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { disabled: true }
}

export const Multiple: Story = {
  render: (args) => ({
    components: { NeListbox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    label: 'Choose one or more options',
    multiple: true,
    modelValue: []
  }
}

export const OptionsWithDescription: Story = {
  render: (args) => ({
    components: { NeListbox },
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

export const NoOptions: Story = {
  render: (args) => ({
    components: { NeListbox },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { options: [] }
}

const templateWithTooltip =
  '<NeListbox v-bind="args" class="max-w-md">\
      <template #tooltip>\
        <NeTooltip>\
          <template #content>Tooltip</template>\
        </NeTooltip>\
      </template>\
    </NeListbox>'

export const WithTooltip: Story = {
  render: (args) => ({
    components: { NeListbox, NeTooltip },
    setup() {
      return { args }
    },
    template: templateWithTooltip
  }),
  args: {}
}

const withOptionsPanelStyleTemplate = `<NeListbox v-bind="args" class="max-w-md" />`

export const WithOptionsPanelStyle: Story = {
  render: (args) => ({
    components: { NeListbox, NeTooltip },
    setup() {
      return { args }
    },
    template: withOptionsPanelStyleTemplate
  }),
  args: {
    optionsPanelStyle: 'w-md'
  }
}
