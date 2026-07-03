//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeEmptyState, NeButton } from '../src/main'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserGroup, faCirclePlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const meta = {
  title: 'Patterns/Empty state',
  component: NeEmptyState,
  args: {
    title: '',
    description: '',
    icon: undefined
  }
} satisfies Meta<typeof NeEmptyState>

export default meta
type Story = StoryObj<typeof meta>

const noItemsConfiguredTemplate = `<NeEmptyState v-bind="args" class="bg-white dark:bg-gray-950">
  <NeButton kind="primary" size="lg">
    <template #prefix>
      <FontAwesomeIcon :icon="faCirclePlus" aria-hidden="true" />
    </template>
    Create user
  </NeButton>
</NeEmptyState>`

const noItemsFoundTemplate = `<NeEmptyState v-bind="args" class="bg-white dark:bg-gray-950">
  <NeButton kind="tertiary" size="lg">Reset filters</NeButton>
</NeEmptyState>`

const noItemsConfiguredItalianTemplate = `<NeEmptyState v-bind="args" class="bg-white dark:bg-gray-950">
  <NeButton kind="primary" size="lg">
    <template #prefix>
      <FontAwesomeIcon :icon="faCirclePlus" aria-hidden="true" />
    </template>
    Crea utente
  </NeButton>
</NeEmptyState>`

const noItemsFoundItalianTemplate = `<NeEmptyState v-bind="args" class="bg-white dark:bg-gray-950">
  <NeButton kind="tertiary" size="lg">Reimposta filtri</NeButton>
</NeEmptyState>`

export const NoItemsConfigured: Story = {
  name: 'No items configured',
  render: (args) => ({
    components: { NeEmptyState, NeButton, FontAwesomeIcon },
    setup() {
      return { args, faCirclePlus }
    },
    template: noItemsConfiguredTemplate
  }),
  args: {
    title: 'No users configured',
    icon: faUserGroup
  }
}

export const NoItemsFound: Story = {
  name: 'No items found',
  render: (args) => ({
    components: { NeEmptyState, NeButton },
    setup() {
      return { args }
    },
    template: noItemsFoundTemplate
  }),
  args: {
    title: 'No users found',
    icon: faMagnifyingGlass,
    description: 'Try changing your search filters'
  }
}

export const NoItemsConfiguredItalian: Story = {
  name: 'No items configured (Italian)',
  render: (args) => ({
    components: { NeEmptyState, NeButton, FontAwesomeIcon },
    setup() {
      return { args, faCirclePlus }
    },
    template: noItemsConfiguredItalianTemplate
  }),
  args: {
    title: 'Nessun utente configurato',
    icon: faUserGroup
  }
}

export const NoItemsFoundItalian: Story = {
  name: 'No items found (Italian)',
  render: (args) => ({
    components: { NeEmptyState, NeButton },
    setup() {
      return { args }
    },
    template: noItemsFoundItalianTemplate
  }),
  args: {
    title: 'Nessun utente trovato',
    icon: faMagnifyingGlass,
    description: 'Prova a modificare i filtri di ricerca'
  }
}
