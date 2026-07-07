//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeEmptyState, NeButton } from '../src/main'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserGroup, faCirclePlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const meta = {
  title: 'Patterns/Empty state',
  component: NeEmptyState
} satisfies Meta<typeof NeEmptyState>

export default meta
type Story = StoryObj<typeof meta>

// The action button is default-slot content, which can't be an arg, so these
// stories use a render function. Title, description and icon still come from args
// (and stay editable as controls); only the button label is passed via setup.
const configuredTemplate = `<NeEmptyState v-bind="args" class="bg-white dark:bg-gray-950">
  <NeButton kind="primary" size="lg">
    <template #prefix>
      <FontAwesomeIcon :icon="faCirclePlus" aria-hidden="true" />
    </template>
    {{ buttonLabel }}
  </NeButton>
</NeEmptyState>`

const foundTemplate = `<NeEmptyState v-bind="args" class="bg-white dark:bg-gray-950">
  <NeButton kind="tertiary" size="lg">{{ buttonLabel }}</NeButton>
</NeEmptyState>`

export const NoItemsConfigured: Story = {
  name: 'No items configured',
  args: { icon: faUserGroup, title: 'No users configured' },
  render: (args) => ({
    components: { NeEmptyState, NeButton, FontAwesomeIcon },
    setup: () => ({ args, faCirclePlus, buttonLabel: 'Create user' }),
    template: configuredTemplate
  })
}

export const NoItemsFound: Story = {
  name: 'No items found',
  args: {
    icon: faMagnifyingGlass,
    title: 'No users found',
    description: 'Try changing your search filters'
  },
  render: (args) => ({
    components: { NeEmptyState, NeButton, FontAwesomeIcon },
    setup: () => ({ args, buttonLabel: 'Reset filters' }),
    template: foundTemplate
  })
}

export const NoItemsConfiguredItalian: Story = {
  name: 'No items configured (Italian)',
  args: { icon: faUserGroup, title: 'Nessun utente configurato' },
  render: (args) => ({
    components: { NeEmptyState, NeButton, FontAwesomeIcon },
    setup: () => ({ args, faCirclePlus, buttonLabel: 'Crea utente' }),
    template: configuredTemplate
  })
}

export const NoItemsFoundItalian: Story = {
  name: 'No items found (Italian)',
  args: {
    icon: faMagnifyingGlass,
    title: 'Nessun utente trovato',
    description: 'Prova a modificare i filtri di ricerca'
  },
  render: (args) => ({
    components: { NeEmptyState, NeButton, FontAwesomeIcon },
    setup: () => ({ args, buttonLabel: 'Reimposta filtri' }),
    template: foundTemplate
  })
}
