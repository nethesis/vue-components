//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { onMounted, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'

import {
  NeButton,
  NeInlineNotification,
  NeSideDrawer,
  NeTextInput,
  focusElement
} from '../src/main'

type Labels = {
  createItem: string
  editItem: string
  edit: string
  closeDrawer: string
  name: string
  enterName: string
  phoneNumber: string
  phoneNumberPlaceholder: string
  enterValidPhoneNumber: string
  company: string
  optional: string
  cannotCreateItem: string
  networkError: string
  cancel: string
  save: string
}

const enLabels: Labels = {
  createItem: 'Create contact',
  editItem: 'Edit contact',
  edit: 'Edit',
  closeDrawer: 'Close side drawer',
  name: 'Name',
  enterName: 'Enter a name',
  phoneNumber: 'Phone number',
  phoneNumberPlaceholder: 'e.g. +39 0123 456789',
  enterValidPhoneNumber: 'Enter a valid phone number',
  company: 'Company',
  optional: 'Optional',
  cannotCreateItem: 'Cannot create contact',
  networkError: 'Network error. Check your connection and reload the page.',
  cancel: 'Cancel',
  save: 'Save'
}

const itLabels: Labels = {
  createItem: 'Crea contatto',
  editItem: 'Modifica contatto',
  edit: 'Modifica',
  closeDrawer: 'Chiudi pannello laterale',
  name: 'Nome',
  enterName: 'Inserisci un nome',
  phoneNumber: 'Numero di telefono',
  phoneNumberPlaceholder: 'es. +39 0123 456789',
  enterValidPhoneNumber: 'Inserisci un numero di telefono valido',
  company: 'Azienda',
  optional: 'Opzionale',
  cannotCreateItem: 'Impossibile creare il contatto',
  networkError: 'Errore di rete. Controlla la connessione e ricarica la pagina.',
  cancel: 'Annulla',
  save: 'Salva'
}

const contact = { name: 'Jane Doe', phoneNumber: '+39 0123 456789', company: 'Acme Solutions' }

const meta = {
  title: 'Patterns/Create item drawer',
  component: NeSideDrawer,
  parameters: {
    docs: {
      description: {
        component:
          'The form to create an object, in an `NeSideDrawer` opened by the create button of the page: the fields, an `NeInlineNotification` when the save fails, and the footer with Cancel and the button that saves. The same drawer edits an object: then its title is Edit <object> and the button is Save. The first field gets the focus when the drawer opens, and Enter in a field saves. After saving, the drawer closes and the product shows the Success toast notification pattern. Its texts follow [Forms](https://nethesis.github.io/design-system/?page=writing-guidelines#forms) and [Error messages](https://nethesis.github.io/design-system/?page=writing-guidelines#error-messages) in the writing guidelines.'
      }
    }
  }
} satisfies Meta<typeof NeSideDrawer>

export default meta
type Story = StoryObj<typeof meta>

// What the form shows is the only difference between the stories, so a single
// template branches on the state.
type State = 'create' | 'invalid' | 'saving' | 'saveError' | 'edit'

// The drawer content is slot content, which can't be args, so the stories use a
// render function; every label comes from the label set passed to renderDrawer().
const drawerTemplate = `<div>
  <!-- the create button of the page, or the Edit action of a row, opens the drawer -->
  <NeButton v-if="editing" kind="tertiary" @click="isShown = true">{{ labels.edit }}</NeButton>
  <NeButton v-else kind="primary" size="lg" @click="isShown = true">
    <template #prefix>
      <FontAwesomeIcon :icon="faCirclePlus" aria-hidden="true" />
    </template>
    {{ labels.createItem }}
  </NeButton>
  <NeSideDrawer
    :is-shown="isShown"
    :title="editing ? labels.editItem : labels.createItem"
    :close-aria-label="labels.closeDrawer"
    @show="onShow"
    @close="isShown = false"
  >
    <!-- Enter in a field submits the form -->
    <form @submit.prevent="save">
      <div class="space-y-6">
        <NeTextInput
          ref="nameRef"
          v-model="name"
          :label="labels.name"
          :invalid-message="state === 'invalid' ? labels.enterName : ''"
          :disabled="saving"
        />
        <NeTextInput
          v-model="phoneNumber"
          :label="labels.phoneNumber"
          :placeholder="labels.phoneNumberPlaceholder"
          :invalid-message="state === 'invalid' ? labels.enterValidPhoneNumber : ''"
          :disabled="saving"
        />
        <NeTextInput
          v-model="company"
          :label="labels.company"
          optional
          :optional-label="labels.optional"
          :disabled="saving"
        />
        <!-- an error that is not about one field, such as a failed save -->
        <NeInlineNotification
          v-if="state === 'saveError'"
          kind="error"
          :title="labels.cannotCreateItem"
          :description="labels.networkError"
        />
      </div>
      <!-- footer -->
      <hr class="my-8 border-gray-200 dark:border-gray-700" />
      <div class="flex justify-end gap-3">
        <NeButton kind="tertiary" size="lg" :disabled="saving" @click="isShown = false">
          {{ labels.cancel }}
        </NeButton>
        <NeButton type="submit" kind="primary" size="lg" :disabled="saving" :loading="saving">
          {{ editing ? labels.save : labels.createItem }}
        </NeButton>
      </div>
    </form>
  </NeSideDrawer>
</div>`

function renderDrawer(labels: Labels, state: State = 'create'): Story['render'] {
  return () => ({
    components: { NeButton, NeInlineNotification, NeSideDrawer, NeTextInput, FontAwesomeIcon },
    setup() {
      const filled = state !== 'create'
      const isShown = ref(false)
      const nameRef = ref()
      const name = ref(filled && state !== 'invalid' ? contact.name : '')
      const phoneNumber = ref(state === 'invalid' ? '0123' : filled ? contact.phoneNumber : '')
      const company = ref(filled ? contact.company : '')

      // NeSideDrawer emits show when it opens: open it once the story is mounted, so the
      // first field gets the focus as in the product.
      onMounted(() => (isShown.value = true))

      function onShow() {
        focusElement(nameRef)
      }

      // The product validates the fields, focuses the first invalid one and saves; then
      // it closes the drawer and shows the success toast about 500 ms later, when the
      // drawer has closed.
      const save = fn()

      return {
        labels,
        state,
        editing: state === 'edit',
        saving: state === 'saving',
        isShown,
        nameRef,
        name,
        phoneNumber,
        company,
        onShow,
        save,
        faCirclePlus
      }
    },
    template: drawerTemplate
  })
}

export const Standard: Story = {
  render: renderDrawer(enLabels)
}

export const ValidationErrors: Story = {
  name: 'Validation errors',
  render: renderDrawer(enLabels, 'invalid')
}

export const Saving: Story = {
  render: renderDrawer(enLabels, 'saving')
}

export const SaveError: Story = {
  name: 'Save error',
  render: renderDrawer(enLabels, 'saveError')
}

export const EditItem: Story = {
  name: 'Edit item',
  render: renderDrawer(enLabels, 'edit')
}

export const StandardItalian: Story = {
  name: 'Standard (Italian)',
  render: renderDrawer(itLabels)
}

export const ValidationErrorsItalian: Story = {
  name: 'Validation errors (Italian)',
  render: renderDrawer(itLabels, 'invalid')
}

export const SavingItalian: Story = {
  name: 'Saving (Italian)',
  render: renderDrawer(itLabels, 'saving')
}

export const SaveErrorItalian: Story = {
  name: 'Save error (Italian)',
  render: renderDrawer(itLabels, 'saveError')
}

export const EditItemItalian: Story = {
  name: 'Edit item (Italian)',
  render: renderDrawer(itLabels, 'edit')
}
