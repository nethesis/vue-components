//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'

import { NeDropdown, NeButton } from '../src/main'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const meta = {
  title: 'NeDropdown',
  component: NeDropdown,
  tags: ['autodocs'],
  args: {
    items: [
      {
        id: 'edit',
        label: 'Edit',
        icon: faPenToSquare,
        action: () => {}
      },
      {
        id: 'copy',
        label: 'Copy',
        icon: faCopy,
        action: () => {}
      },
      {
        id: 'save',
        label: 'Save',
        icon: faFloppyDisk,
        action: () => {},
        disabled: true
      },
      {
        id: 'divider1'
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: faTrashCan,
        danger: true,
        action: () => {}
      }
    ],
    alignToRight: false,
    openMenuAriaLabel: 'Open menu',
    menuClasses: ''
  }
} satisfies Meta<typeof NeDropdown>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeDropdown v-bind="args" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeDropdown },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

const alignToRightTemplate = '<NeDropdown v-bind="args" class="ml-48" />'

export const AlignToRight: Story = {
  render: (args) => ({
    components: { NeDropdown },
    setup() {
      return { args }
    },
    template: alignToRightTemplate
  }),
  args: { alignToRight: true }
}

const withSlotTemplate =
  '<NeDropdown v-bind="args">\
    <template #button>\
      <NeButton>\
        <template #suffix>\
          <FontAwesomeIcon :icon="faChevronDown" class="h-4 w-4" aria-hidden="true" />\
        </template>\
        Menu\
      </NeButton>\
    </template>\
  </NeDropdown>'

export const WithSlot: Story = {
  render: (args) => ({
    components: { NeDropdown, NeButton, FontAwesomeIcon },
    setup() {
      return { args, faChevronDown }
    },
    template: withSlotTemplate
  }),
  args: {}
}

export const MenuClasses: Story = {
  render: (args) => ({
    components: { NeDropdown },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    menuClasses: 'bg-fuchsia-200! dark:bg-fuchsia-900!'
  }
}
