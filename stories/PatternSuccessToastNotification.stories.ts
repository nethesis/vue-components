//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { NeToastNotificationV2 } from '../src/main'
import type { NeNotificationV2 } from '../src/main'

const baseNotification: NeNotificationV2 = {
  id: '1',
  kind: 'success',
  title: '',
  description: '',
  timestamp: new Date(),
  payload: undefined,
  isShown: true
}

const meta = {
  title: 'Patterns/Success toast notification',
  component: NeToastNotificationV2,
  argTypes: {
    // The notification is set per story as a whole object; an object control adds noise.
    notification: { table: { disable: true } }
  },
  args: {
    firstActionOnRight: false,
    showCloseButton: false,
    showTimestamp: true,
    fullWidth: false,
    srCloseLabel: 'Close',
    onAction: fn(),
    onClose: fn()
  }
} satisfies Meta<typeof NeToastNotificationV2>

export default meta
type Story = StoryObj<typeof meta>

export const ItemCreated: Story = {
  name: 'Item created',
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
  args: {
    notification: {
      ...baseNotification,
      title: 'User updated',
      description: 'User Alice Fox has been updated'
    }
  }
}

export const ItemDeleted: Story = {
  name: 'Item deleted',
  args: {
    notification: {
      ...baseNotification,
      title: 'User deleted',
      description: 'User Alice Fox has been deleted'
    }
  }
}

export const ItemCreatedItalian: Story = {
  name: 'Item created (Italian)',
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
  args: {
    srCloseLabel: 'Chiudi',
    notification: {
      ...baseNotification,
      title: 'Utente aggiornato',
      description: "L'utente Alice Fox è stato aggiornato"
    }
  }
}

export const ItemDeletedItalian: Story = {
  name: 'Item deleted (Italian)',
  args: {
    srCloseLabel: 'Chiudi',
    notification: {
      ...baseNotification,
      title: 'Utente eliminato',
      description: "L'utente Alice Fox è stato eliminato"
    }
  }
}
