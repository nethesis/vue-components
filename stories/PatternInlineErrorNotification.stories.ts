//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeInlineNotification } from '../src/main'

const meta = {
  title: 'Patterns/Inline error notification',
  component: NeInlineNotification,
  args: {
    kind: 'error',
    title: 'Cannot retrieve phonebook contacts',
    showCloseButton: false,
    primaryButtonLabel: '',
    secondaryButtonLabel: '',
    showDetailsLabel: 'Show details',
    closeAriaLabel: 'Dismiss'
  }
} satisfies Meta<typeof NeInlineNotification>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeInlineNotification v-bind="args" class="max-w-3xl" />'

const render: Story['render'] = (args) => ({
  components: { NeInlineNotification },
  setup() {
    return { args }
  },
  template: template
})

export const SpecificError: Story = {
  name: 'Specific error',
  render: (args) => ({
    components: { NeInlineNotification },
    setup() {
      return { args }
    },
    template: `<div class="max-w-3xl space-y-4">
      <NeInlineNotification v-bind="args" />
      <p>NOTE: avoid technical jargon or raw error messages in the description.</p>
    </div>`
  }),
  args: {
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  }
}

export const NetworkError: Story = {
  name: 'Network error',
  render,
  args: {
    description: 'Network error. Check your connection and reload the page.'
  }
}

export const GenericError: Story = {
  name: 'Generic error',
  render,
  args: {
    description: 'Something went wrong'
  }
}

export const SpecificErrorItalian: Story = {
  name: 'Specific error (Italian)',
  render: (args) => ({
    components: { NeInlineNotification },
    setup() {
      return { args }
    },
    template: `<div class="max-w-3xl space-y-4">
      <NeInlineNotification v-bind="args" />
      <p>NOTE: avoid technical jargon or raw error messages in the description.</p>
    </div>`
  }),
  args: {
    title: 'Impossibile recuperare i contatti della rubrica',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  }
}

export const NetworkErrorItalian: Story = {
  name: 'Network error (Italian)',
  render,
  args: {
    title: 'Impossibile recuperare i contatti della rubrica',
    description: 'Errore di rete. Controlla la connessione e ricarica la pagina.'
  }
}

export const GenericErrorItalian: Story = {
  name: 'Generic error (Italian)',
  render,
  args: {
    title: 'Impossibile recuperare i contatti della rubrica',
    description: 'Qualcosa è andato storto'
  }
}
