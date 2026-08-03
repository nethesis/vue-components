//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeInlineNotification } from '../src/main'

const meta = {
  title: 'Patterns/Inline error notification',
  component: NeInlineNotification,
  args: {
    kind: 'error',
    showCloseButton: false,
    primaryButtonLabel: '',
    secondaryButtonLabel: '',
    showDetailsLabel: 'Show details',
    closeAriaLabel: 'Dismiss'
  },
  // Keep the notification from stretching the full canvas width.
  decorators: [
    (story) => ({ components: { story }, template: '<div class="max-w-3xl"><story /></div>' })
  ]
} satisfies Meta<typeof NeInlineNotification>

export default meta
type Story = StoryObj<typeof meta>

export const NetworkError: Story = {
  name: 'Network error',
  args: {
    title: 'Cannot save phonebook contact',
    description: 'Network error. Check your connection and reload the page.'
  }
}

export const GenericError: Story = {
  name: 'Generic error',
  args: { title: 'Cannot save phonebook contact', description: 'Something went wrong' }
}

export const NetworkErrorItalian: Story = {
  name: 'Network error (Italian)',
  args: {
    title: 'Impossibile salvare il contatto della rubrica',
    description: 'Errore di rete. Controlla la connessione e ricarica la pagina.'
  }
}

export const GenericErrorItalian: Story = {
  name: 'Generic error (Italian)',
  args: {
    title: 'Impossibile salvare il contatto della rubrica',
    description: 'Qualcosa è andato storto'
  }
}
