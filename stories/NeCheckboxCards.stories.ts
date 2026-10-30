//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import { NeCheckboxCards, NeTooltip } from '../src/main'
import {
  faEarthAmericas,
  faLocationDot,
  faShield,
  faUserGroup
} from '@fortawesome/free-solid-svg-icons'
import mailLogo from '../src/assets/mail.svg'
import mattermostLogo from '../src/assets/mattermost.svg'
import nethvoiceLogo from '../src/assets/nethvoice.svg'
import nextcloudLogo from '../src/assets/nextcloud.svg'

const meta: Meta<typeof NeCheckboxCards> = {
  title: 'Components/NeCheckboxCards',
  // generic components don't match Storybook's component type, cast to it
  component: NeCheckboxCards as Meta<typeof NeCheckboxCards>['component'],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A group of checkboxes shown as cards, each with a label and an optional description, icon or image, to choose several among a few options, all visible. For many options, use `NeMultiselectCombobox`; to choose only one, `NeRadioSelection` with `card`. Its label, helper text and validation messages follow [Forms](https://nethesis.github.io/design-system/?page=writing-guidelines#forms) in the writing guidelines.'
      }
    }
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'lg', 'xl'] }
  },
  args: {
    label: 'Label',
    options: [
      { id: '1', label: 'Option 1' },
      { id: '2', label: 'Option 2' },
      { id: '3', label: 'Option 3' },
      { id: '4', label: 'Option 4', disabled: true },
      { id: '5', label: 'Option 5' }
    ],
    modelValue: ['1', '3'],
    gridStyle: 'grid-cols-3 gap-3',
    disabled: false,
    size: 'md',
    invalidMessage: ''
  }
}

export default meta
type Story = StoryObj<typeof NeCheckboxCards>

const template = '<NeCheckboxCards v-bind="args" v-model="selection" />'

const render: Story['render'] = (args) => ({
  components: { NeCheckboxCards },
  setup() {
    const selection = ref(args.modelValue)
    return { args, selection }
  },
  template
})

export const Default: Story = {
  render
}

export const Disabled: Story = {
  render,
  args: {
    disabled: true
  }
}

export const WithIcons: Story = {
  render,
  args: {
    options: [
      { id: '1', label: 'LAN', description: 'green', icon: faLocationDot },
      { id: '2', label: 'WAN', description: 'red', icon: faEarthAmericas },
      { id: '3', label: 'Guests', description: 'blue', icon: faUserGroup },
      { id: '4', label: 'DMZ', description: 'orange', icon: faShield, disabled: true },
      { id: '5', label: 'Custom Role', icon: faLocationDot }
    ]
  }
}

export const WithImages: Story = {
  render,
  args: {
    label: 'Choose applications',
    options: [
      { id: '1', label: 'NethVoice', description: 'PBX', image: nethvoiceLogo },
      { id: '2', label: 'Mattermost', description: 'Chat', image: mattermostLogo },
      { id: '3', label: 'Nextcloud', description: 'Files', image: nextcloudLogo },
      { id: '4', label: 'Mail', description: 'Email', image: mailLogo }
    ]
  }
}

export const WithTooltip: Story = {
  render: (args) => ({
    components: { NeCheckboxCards, NeTooltip },
    setup() {
      const selection = ref(args.modelValue)
      return { args, selection }
    },
    template: `
      <NeCheckboxCards v-bind="args" v-model="selection">
        <template #tooltip>
          <NeTooltip>
            <template #content>Tooltip</template>
          </NeTooltip>
        </template>
      </NeCheckboxCards>
    `
  })
}

export const WithSlot: Story = {
  render: (args) => ({
    components: { NeCheckboxCards },
    setup() {
      const selection = ref(args.modelValue)
      return { args, selection }
    },
    template: `
      <NeCheckboxCards v-bind="args" v-model="selection">
        <template #option="{ option, checked }">
          <div class="flex flex-col">
            <div class="font-medium">{{ option.label }}</div>
            <div>(ID: {{ option.id }}, {{ checked ? 'checked' : 'unchecked' }})</div>
          </div>
        </template>
      </NeCheckboxCards>
    `
  })
}

export const LabelSlot: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use the `label` slot instead of the `label` prop to render custom label content.'
      }
    }
  },
  render: (args) => ({
    components: { NeCheckboxCards },
    setup() {
      const selection = ref(args.modelValue)
      return { args, selection }
    },
    template: `
      <NeCheckboxCards v-bind="args" v-model="selection">
        <template #label>
          Applications <span class="font-normal text-gray-500 dark:text-gray-400">(optional)</span>
        </template>
      </NeCheckboxCards>
    `
  }),
  args: {
    label: ''
  }
}

export const InvalidMessage: Story = {
  render,
  args: {
    modelValue: [],
    invalidMessage: 'Select at least one option'
  }
}
