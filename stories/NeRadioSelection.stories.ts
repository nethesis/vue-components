//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { Meta, StoryObj } from '@storybook/vue3'

import { NeRadioSelection, NeTooltip } from '../src/main'
import {
  faEarthAmericas,
  faLocationDot,
  faShield,
  faUserGroup
} from '@fortawesome/free-solid-svg-icons'

const meta: Meta<typeof NeRadioSelection> = {
  title: 'NeRadioSelection',
  component: NeRadioSelection,
  tags: ['autodocs'],
  argTypes: {
    cardSize: { control: 'inline-radio', options: ['md', 'lg', 'xl'] }
  },
  args: {
    label: 'Label',
    options: [
      {
        id: '1',
        label: 'Choose 1'
      },
      {
        id: '2',
        label: 'Choose 2'
      },
      {
        id: '3',
        label: 'Choose 3',
        disabled: true
      },
      {
        id: '4',
        label: 'Choose 4'
      }
    ],
    modelValue: '1',
    disabled: false,
    cardSize: 'md',
    cardSelectionMark: true,
    invalidMessage: ''
  }
}

export default meta
export const Default: StoryObj<typeof NeRadioSelection> = {
  render: (args) => ({
    components: { NeRadioSelection },
    setup() {
      return { args }
    },
    template: `
      <NeRadioSelection v-bind="args" />
    `
  })
}

export const WithDescription: StoryObj<typeof NeRadioSelection> = {
  render: (args) => ({
    components: { NeRadioSelection },
    setup() {
      return { args }
    },
    template: `
      <NeRadioSelection v-bind="args" />
    `
  }),
  args: {
    description: 'Description'
  }
}

export const CardPicker: StoryObj<typeof NeRadioSelection> = {
  render: (args) => ({
    components: { NeRadioSelection },
    setup() {
      return { args }
    },
    template: `
      <NeRadioSelection v-bind="args" />
    `
  }),
  args: {
    card: true,
    gridStyle: 'grid-cols-3 gap-3',
    options: [
      {
        id: '1',
        label: 'LAN',
        description: 'green',
        icon: faLocationDot
      },
      {
        id: '2',
        label: 'WAN',
        description: 'red',
        icon: faEarthAmericas
      },
      {
        id: '3',
        label: 'Guests',
        description: 'blue',
        icon: faUserGroup
      },
      {
        id: '4',
        label: 'DMZ',
        description: 'orange',
        icon: faShield,
        disabled: true
      },
      {
        id: '5',
        label: 'Custom Role',
        icon: faLocationDot
      }
    ]
  }
}

export const Disabled: StoryObj<typeof NeRadioSelection> = {
  render: (args) => ({
    components: { NeRadioSelection },
    setup() {
      return { args }
    },
    template: `
      <NeRadioSelection v-bind="args" />
    `
  }),
  args: {
    disabled: true
  }
}

export const WithTooltip: StoryObj<typeof NeRadioSelection> = {
  render: (args) => ({
    components: { NeRadioSelection, NeTooltip },
    setup() {
      return { args }
    },
    template: `
      <NeRadioSelection v-bind="args">\
        <template #tooltip>\
          <NeTooltip>\
            <template #content>Tooltip</template>\
          </NeTooltip>\
        </template>\
      </NeRadioSelection>
    `
  }),
  args: {}
}

export const WithSlot: StoryObj<typeof NeRadioSelection> = {
  render: (args) => ({
    components: { NeRadioSelection },
    setup() {
      return { args }
    },
    template: `
      <NeRadioSelection v-model="args.modelValue" :card="args.card" :grid-style="args.gridStyle"
      :label="args.label" :options="args.options">
        <template #option="{ option }">
          <div class="flex flex-col text-left">
            <div>{{ option.label }}</div>
            <div>(ID: {{ option.id }})</div>
          </div>
        </template>
      </NeRadioSelection>
    `
  }),
  args: {
    card: true,
    gridStyle: 'grid-cols-3 gap-3'
  }
}

const template = '<NeRadioSelection v-bind="args" />'

export const OptionsWithDescription: StoryObj<typeof NeRadioSelection> = {
  render: (args) => ({
    components: { NeRadioSelection },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    options: [
      {
        id: '1',
        label: 'Choose 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisci elit'
      },
      {
        id: '2',
        label: 'Choose 2',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt'
      },
      {
        id: '3',
        label: 'Choose 3',
        disabled: true,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua'
      }
    ]
  }
}

export const LabelSlot: StoryObj<typeof NeRadioSelection> = {
  render: (args) => ({
    components: { NeRadioSelection },
    setup() {
      return { args }
    },
    template: `
      <NeRadioSelection v-bind="args">
        <template #label>
          Label slot
        </template>
      </NeRadioSelection>
    `
  }),
  args: {
    label: ''
  }
}

export const InvalidMessage: StoryObj<typeof NeRadioSelection> = {
  render: (args) => ({
    components: { NeRadioSelection },
    setup() {
      return { args }
    },
    template: `
      <NeRadioSelection v-bind="args" />
    `
  }),
  args: {
    invalidMessage: 'Invalid selection'
  }
}
