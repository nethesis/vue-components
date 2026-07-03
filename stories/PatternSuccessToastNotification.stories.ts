//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { NeToastNotificationV2 } from '../src/main'
import type { NeNotificationV2 } from '../src/main'

const meta = {
  title: 'Patterns/Success toast notification',
  component: NeToastNotificationV2,
  args: {
    srCloseLabel: 'Close',
    firstActionOnRight: false,
    showCloseButton: false,
    showTimestamp: true,
    fullWidth: false,
    notification: undefined,
    onAction: fn(),
    onClose: fn()
  }
} satisfies Meta<typeof NeToastNotificationV2>

export default meta
type Story = StoryObj<typeof meta>

const baseNotification: NeNotificationV2 = {
  id: '1',
  kind: 'success',
  title: '',
  description: '',
  timestamp: new Date(),
  payload: undefined,
  isShown: true
}

const template = '<NeToastNotificationV2 v-bind="args"/>'

const render: Story['render'] = (args) => ({
  components: { NeToastNotificationV2 },
  setup() {
    return { args }
  },
  template: template
})

export const ItemCreated: Story = {
  name: 'Item created',
  render,
  args: {
    notification: {
      ...baseNotification,
      title: 'User created',
      description: 'User Alice Fox has been created'
    }
  }
}

export const ItemUpdated: Story = {
  name: 'Item updated',
  render,
  args: {
    notification: {
      ...baseNotification,
      title: 'User updated',
      description: 'User Alice Fox has been updated'
    }
  }
}

export const ItemCreatedItalian: Story = {
  name: 'Item created (Italian)',
  render,
  args: {
    srCloseLabel: 'Chiudi',
    notification: {
      ...baseNotification,
      title: 'Utente creato',
      description: "L'utente Alice Fox è stato creato"
    }
  }
}

export const ItemUpdatedItalian: Story = {
  name: 'Item updated (Italian)',
  render,
  args: {
    srCloseLabel: 'Chiudi',
    notification: {
      ...baseNotification,
      title: 'Utente aggiornato',
      description: "L'utente Alice Fox è stato aggiornato"
    }
  }
}
