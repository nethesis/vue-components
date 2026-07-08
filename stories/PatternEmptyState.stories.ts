//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeEmptyState, NeButton } from '../src/main'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faUserGroup,
  faCirclePlus,
  faMagnifyingGlass,
  faVoicemail,
  faBan,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'

const meta = {
  title: 'Patterns/Empty state',
  component: NeEmptyState
} satisfies Meta<typeof NeEmptyState>

export default meta
type Story = StoryObj<typeof meta>

const noItemsTemplate = `<NeEmptyState v-bind="args" class="bg-white dark:bg-gray-950" />`

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

const restrictedTemplate = `<NeEmptyState v-bind="args" class="bg-white dark:bg-gray-950">
  <NeButton kind="primary" size="lg">
    <template #prefix>
      <FontAwesomeIcon :icon="faArrowRight" aria-hidden="true" />
    </template>
    {{ buttonLabel }}
  </NeButton>
</NeEmptyState>`

export const NoItems: Story = {
  name: 'No items',
  args: {
    icon: faVoicemail,
    title: 'No voicemail messages',
    description: 'You currently have no voicemail messages.'
  },
  render: (args) => ({
    components: { NeEmptyState },
    setup: () => ({ args }),
    template: noItemsTemplate
  })
}

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

export const RestrictedPage: Story = {
  name: 'Restricted page',
  args: {
    icon: faBan,
    title: 'Restricted page',
    description: "It seems that you don't have the necessary permissions to view this page."
  },
  render: (args) => ({
    components: { NeEmptyState, NeButton, FontAwesomeIcon },
    setup: () => ({ args, faArrowRight, buttonLabel: 'Go to Dashboard' }),
    template: restrictedTemplate
  })
}

export const NoItemsItalian: Story = {
  name: 'No items (Italian)',
  args: {
    icon: faVoicemail,
    title: 'Nessun messaggio vocale',
    description: 'Al momento non è presente nessun messaggio vocale.'
  },
  render: (args) => ({
    components: { NeEmptyState },
    setup: () => ({ args }),
    template: noItemsTemplate
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

export const RestrictedPageItalian: Story = {
  name: 'Restricted page (Italian)',
  args: {
    icon: faBan,
    title: 'Pagina riservata',
    description: 'Sembra che tu non abbia i permessi necessari per visualizzare questa pagina.'
  },
  render: (args) => ({
    components: { NeEmptyState, NeButton, FontAwesomeIcon },
    setup: () => ({ args, faArrowRight, buttonLabel: 'Vai alla dashboard' }),
    template: restrictedTemplate
  })
}
