//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ref } from 'vue'

import { NeModal, NeTextInput } from '../src/main'

const meta = {
  title: 'Patterns/Delete item modal',
  component: NeModal,
  argTypes: {
    kind: { control: 'inline-radio', options: ['neutral', 'info', 'warning', 'error', 'success'] },
    size: { control: 'inline-radio', options: ['md', 'lg', 'xl', 'xxl'] },
    primaryButtonKind: { control: 'inline-radio', options: ['primary', 'danger'] },
    secondaryButtonKind: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'tertiary', 'danger']
    }
  },
  args: {
    visible: true,
    title: 'Delete item',
    kind: 'warning',
    size: 'md',
    primaryLabel: 'Delete',
    secondaryLabel: '',
    cancelLabel: 'Cancel',
    primaryButtonKind: 'danger',
    primaryButtonDisabled: false,
    primaryButtonLoading: false,
    secondaryButtonKind: 'secondary',
    secondaryButtonDisabled: false,
    secondaryButtonLoading: false,
    closeAriaLabel: 'Close'
  }
} satisfies Meta<typeof NeModal>

export default meta
type Story = StoryObj<typeof meta>

const standardTemplate = `<NeModal v-bind="args">
  <p>
    Phonebook contact Jane Doe will be deleted.
  </p>
</NeModal>`

export const Standard: Story = {
  render: (args) => ({
    components: { NeModal },
    setup() {
      return { args }
    },
    template: standardTemplate
  }),
  args: {
    title: 'Delete phonebook contact'
  }
}

const typeToConfirmTemplate = `<NeModal v-bind="args">
  <p class="mb-5">
    User Alice Fox will be permanently deleted. Their personal files will be deleted too.
  </p>
  <NeTextInput v-model="confirmText" label="Type 'Alice Fox' to confirm" />
</NeModal>`

export const TypeToConfirm: Story = {
  render: (args) => ({
    components: { NeModal, NeTextInput },
    setup() {
      const confirmText = ref('')
      return { args, confirmText }
    },
    template: typeToConfirmTemplate
  }),
  args: {
    title: 'Delete user'
  }
}

const standardItalianTemplate = `<NeModal v-bind="args">
  <p>
    Il contatto della rubrica Jane Doe verrà eliminato.
  </p>
</NeModal>`

export const StandardItalian: Story = {
  name: 'Standard (Italian)',
  render: (args) => ({
    components: { NeModal },
    setup() {
      return { args }
    },
    template: standardItalianTemplate
  }),
  args: {
    title: 'Elimina contatto della rubrica',
    primaryLabel: 'Elimina',
    cancelLabel: 'Annulla',
    closeAriaLabel: 'Chiudi'
  }
}

const typeToConfirmItalianTemplate = `<NeModal v-bind="args">
  <p class="mb-5">
    L'utente Alice Fox verrà eliminato definitivamente. Anche i suoi file personali verranno eliminati.
  </p>
  <NeTextInput v-model="confirmText" label="Digita 'Alice Fox' per confermare" />
</NeModal>`

export const TypeToConfirmItalian: Story = {
  name: 'Type to confirm (Italian)',
  render: (args) => ({
    components: { NeModal, NeTextInput },
    setup() {
      const confirmText = ref('')
      return { args, confirmText }
    },
    template: typeToConfirmItalianTemplate
  }),
  args: {
    title: 'Elimina utente',
    primaryLabel: 'Elimina',
    cancelLabel: 'Annulla',
    closeAriaLabel: 'Chiudi'
  }
}
