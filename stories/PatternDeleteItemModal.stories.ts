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
    kind: 'warning',
    size: 'md',
    secondaryLabel: '',
    primaryLabel: 'Delete',
    cancelLabel: 'Cancel',
    closeAriaLabel: 'Close',
    primaryButtonKind: 'danger',
    primaryButtonDisabled: false,
    primaryButtonLoading: false,
    secondaryButtonKind: 'secondary',
    secondaryButtonDisabled: false,
    secondaryButtonLoading: false
  }
} satisfies Meta<typeof NeModal>

export default meta
type Story = StoryObj<typeof meta>

// The modal body (and the confirmation input) is default-slot content, which
// can't be an arg, so these stories use a render function. Title and button
// labels still come from args; only the slot text is passed via setup.
const standardTemplate = `<NeModal v-bind="args">
  <p>{{ body }}</p>
</NeModal>`

const typeToConfirmTemplate = `<NeModal v-bind="args">
  <p class="mb-5">{{ body }}</p>
  <NeTextInput v-model="confirmText" :label="inputLabel" />
</NeModal>`

export const Standard: Story = {
  args: { title: 'Delete phonebook contact' },
  render: (args) => ({
    components: { NeModal },
    setup: () => ({ args, body: 'Phonebook contact Jane Doe will be deleted.' }),
    template: standardTemplate
  })
}

export const TypeToConfirm: Story = {
  name: 'Type to confirm',
  args: { title: 'Delete user' },
  render: (args) => ({
    components: { NeModal, NeTextInput },
    setup: () => ({
      args,
      confirmText: ref(''),
      body: 'User Alice Fox will be permanently deleted. Their personal files will be deleted too.',
      inputLabel: "Type 'Alice Fox' to confirm"
    }),
    template: typeToConfirmTemplate
  })
}

export const StandardItalian: Story = {
  name: 'Standard (Italian)',
  args: {
    title: 'Elimina contatto della rubrica',
    primaryLabel: 'Elimina',
    cancelLabel: 'Annulla',
    closeAriaLabel: 'Chiudi'
  },
  render: (args) => ({
    components: { NeModal },
    setup: () => ({ args, body: 'Il contatto della rubrica Jane Doe verrà eliminato.' }),
    template: standardTemplate
  })
}

export const TypeToConfirmItalian: Story = {
  name: 'Type to confirm (Italian)',
  args: {
    title: 'Elimina utente',
    primaryLabel: 'Elimina',
    cancelLabel: 'Annulla',
    closeAriaLabel: 'Chiudi'
  },
  render: (args) => ({
    components: { NeModal, NeTextInput },
    setup: () => ({
      args,
      confirmText: ref(''),
      body: "L'utente Alice Fox verrà eliminato definitivamente. Anche i suoi file personali verranno eliminati.",
      inputLabel: "Digita 'Alice Fox' per confermare"
    }),
    template: typeToConfirmTemplate
  })
}
