//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'

import { NeDropdown, NeButton } from '../src/main'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPenToSquare as fasPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faFloppyDisk as fasFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan as fasTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faCopy as fasCopy } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown as fasChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fasPenToSquare)
library.add(fasFloppyDisk)
library.add(fasTrashCan)
library.add(fasCopy)
library.add(fasChevronDown)

const meta = {
  title: 'NeDropdown',
  component: NeDropdown,
  tags: ['autodocs'],
  args: {
    items: [
      {
        id: 'edit',
        label: 'Edit',
        icon: 'pen-to-square',
        iconStyle: 'fas',
        action: () => {}
      },
      {
        id: 'copy',
        label: 'Copy',
        icon: 'copy',
        iconStyle: 'fas',
        action: () => {}
      },
      {
        id: 'save',
        label: 'Save',
        icon: 'floppy-disk',
        iconStyle: 'fas',
        action: () => {},
        disabled: true
      },
      {
        id: 'divider1'
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: 'trash-can',
        iconStyle: 'fas',
        danger: true,
        action: () => {}
      }
    ],
    alignToRight: false,
    openMenuAriaLabel: 'Open menu'
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
          <FontAwesomeIcon :icon="[\'fas\', \'chevron-down\']" class="h-4 w-4" aria-hidden="true" />\
        </template>\
        Menu\
      </NeButton>\
    </template>\
  </NeDropdown>'

export const WithSlot: Story = {
  render: (args) => ({
    components: { NeDropdown, NeButton, FontAwesomeIcon },
    setup() {
      return { args }
    },
    template: withSlotTemplate
  }),
  args: {}
}
