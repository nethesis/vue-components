//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ref } from 'vue'
import { fn } from 'storybook/test'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faAddressBook,
  faCirclePlus,
  faEye,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash
} from '@fortawesome/free-solid-svg-icons'

import {
  NeButton,
  NeDropdown,
  NeDropdownFilterV2,
  NeEmptyState,
  NeHeading,
  NePaginator,
  NeSortDropdown,
  NeTable,
  NeTableBody,
  NeTableCell,
  NeTableHead,
  NeTableHeadCell,
  NeTableRow,
  NeTextInput
} from '../src/main'
import type { NeDropdownFilterV2Option, NeDropdownItem, SortEvent } from '../src/main'

type Contact = {
  name: string
  phone: string
  company: string
}

// Names, phone numbers and company names are the same in every language, so both the
// English and the Italian stories share this list.
const contacts: Contact[] = [
  { name: 'Jane Doe', phone: '+39 0123 456789', company: 'Acme Solutions' },
  { name: 'Alice Fox', phone: '+39 0123 456712', company: 'Acme Solutions' },
  { name: 'Marco Rossi', phone: '+39 045 9988776', company: 'Blue Ridge Systems' },
  { name: 'Emily Carter', phone: '+44 20 7946 0102', company: 'Blue Ridge Systems' },
  { name: 'Luca Bianchi', phone: '+39 0436 112233', company: 'Cortina Networks' },
  { name: 'Sofia Neumann', phone: '+49 30 5557788', company: 'Delta Office IT' }
]

// The company filter options come from the data, so the two lists can't drift apart.
const companies = [...new Set(contacts.map((contact) => contact.company))]

// Every user-visible string is a prop, so a pattern is localized by passing a
// different label set to the same render function.
type Labels = {
  title: string
  pageDescription: string
  createItem: string
  filterItems: string
  name: string
  phoneNumber: string
  company: string
  actions: string
  details: string
  edit: string
  deleteItem: string
  resetFilters: string
  openMenu: string
  // empty states
  noItemsConfigured: string
  noItemsFound: string
  tryChangingFilters: string
  // sort dropdown
  sort: string
  sortBy: string
  sortDirection: string
  ascending: string
  descending: string
  // filter dropdown
  clearFilter: string
  openFilter: string
  noOptions: string
  moreOptionsHidden: string
  clearSearch: string
  optionsFilterPlaceholder: string
  // paginator
  previousPage: string
  nextPage: string
  pagination: string
  rangeOfTotal: string
  pageSize: string
}

const enLabels: Labels = {
  title: 'Phonebook contacts',
  pageDescription: 'List of phonebook contacts, including phone number and company.',
  createItem: 'Create contact',
  filterItems: 'Filter contacts',
  name: 'Name',
  phoneNumber: 'Phone number',
  company: 'Company',
  actions: 'Actions',
  details: 'Details',
  edit: 'Edit',
  deleteItem: 'Delete',
  resetFilters: 'Reset filters',
  openMenu: 'Open menu',
  noItemsConfigured: 'No contacts configured',
  noItemsFound: 'No contacts found',
  tryChangingFilters: 'Try changing your search filters',
  sort: 'Sort',
  sortBy: 'Sort by',
  sortDirection: 'Sort direction',
  ascending: 'Ascending',
  descending: 'Descending',
  clearFilter: 'Clear selection',
  openFilter: 'Open filter',
  noOptions: 'No options',
  moreOptionsHidden: 'Continue typing to show more options',
  clearSearch: 'Clear',
  optionsFilterPlaceholder: 'Filter options',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  pagination: 'Pagination',
  rangeOfTotal: 'of',
  pageSize: 'Show'
}

const itLabels: Labels = {
  title: 'Contatti della rubrica',
  pageDescription: 'Elenco dei contatti della rubrica, con numero di telefono e azienda.',
  createItem: 'Crea contatto',
  filterItems: 'Filtra contatti',
  name: 'Nome',
  phoneNumber: 'Numero di telefono',
  company: 'Azienda',
  actions: 'Azioni',
  details: 'Dettagli',
  edit: 'Modifica',
  deleteItem: 'Elimina',
  resetFilters: 'Reimposta filtri',
  openMenu: 'Apri menu',
  noItemsConfigured: 'Nessun contatto configurato',
  noItemsFound: 'Nessun contatto trovato',
  tryChangingFilters: 'Prova a modificare i filtri di ricerca',
  sort: 'Ordina',
  sortBy: 'Ordina per',
  sortDirection: 'Direzione',
  ascending: 'Crescente',
  descending: 'Decrescente',
  clearFilter: 'Azzera selezione',
  openFilter: 'Apri filtro',
  noOptions: 'Nessuna opzione',
  moreOptionsHidden: 'Continua a digitare per mostrare altre opzioni',
  clearSearch: 'Cancella',
  optionsFilterPlaceholder: 'Filtra opzioni',
  previousPage: 'Vai alla pagina precedente',
  nextPage: 'Vai alla pagina successiva',
  pagination: 'Paginazione',
  rangeOfTotal: 'di',
  pageSize: 'Mostra'
}

const meta = {
  title: 'Patterns/Table page',
  component: NeTable,
  argTypes: {
    cardBreakpoint: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', '2xl'] }
  },
  args: {
    cardBreakpoint: 'lg',
    loading: false,
    skeletonRows: 7,
    skeletonColumns: 4
  }
} satisfies Meta<typeof NeTable>

export default meta
type Story = StoryObj<typeof meta>

// What sits below the toolbar is the only difference between the page states, so a
// single template branches on the variant, like the real page does.
type Variant = 'table' | 'noItemsConfigured' | 'noItemsFound'

// The whole page is a composition of components and slot content, which can't be
// args, so the stories use a render function. Only the table props stay editable
// as controls; every label comes from the label set passed to renderTablePage().
const tablePageTemplate = `<div>
  <!-- page header: title and description on the left, primary action on the right -->
  <NeHeading tag="h3">{{ labels.title }}</NeHeading>
  <div class="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
    <p class="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
      {{ labels.pageDescription }}
    </p>
    <NeButton kind="primary" size="lg" class="shrink-0" @click="noop">
      <template #prefix>
        <FontAwesomeIcon :icon="faCirclePlus" aria-hidden="true" />
      </template>
      {{ labels.createItem }}
    </NeButton>
  </div>
  <!-- table toolbar -->
  <div class="mb-6 flex flex-wrap items-center gap-4">
    <!-- text filter -->
    <NeTextInput
      v-model="textFilter"
      is-search
      :placeholder="labels.filterItems"
      :clear-search-label="labels.clearSearch"
      class="max-w-48 sm:max-w-sm"
    />
    <!-- company filter -->
    <NeDropdownFilterV2
      v-model="companyFilter"
      kind="checkbox"
      :label="labels.company"
      :options="companyFilterOptions"
      :clear-filter-label="labels.clearFilter"
      :open-menu-aria-label="labels.openFilter"
      :no-options-label="labels.noOptions"
      :more-options-hidden-label="labels.moreOptionsHidden"
      :clear-search-label="labels.clearSearch"
      :options-filter-placeholder="labels.optionsFilterPlaceholder"
    />
    <!-- sort dropdown -->
    <NeSortDropdown
      v-model:sort-key="sortKey"
      v-model:sort-descending="sortDescending"
      :label="labels.sort"
      :options="sortOptions"
      :open-menu-aria-label="labels.openMenu"
      :sort-by-label="labels.sortBy"
      :sort-direction-label="labels.sortDirection"
      :ascending-label="labels.ascending"
      :descending-label="labels.descending"
    />
    <NeButton kind="tertiary" @click="resetFilters">{{ labels.resetFilters }}</NeButton>
  </div>
  <!-- no contact configured yet -->
  <NeEmptyState
    v-if="variant === 'noItemsConfigured'"
    :icon="faAddressBook"
    :title="labels.noItemsConfigured"
    class="bg-white dark:bg-gray-950"
  >
    <NeButton kind="primary" size="lg" @click="noop">
      <template #prefix>
        <FontAwesomeIcon :icon="faCirclePlus" aria-hidden="true" />
      </template>
      {{ labels.createItem }}
    </NeButton>
  </NeEmptyState>
  <!-- no contact matching the filters -->
  <NeEmptyState
    v-else-if="variant === 'noItemsFound'"
    :icon="faMagnifyingGlass"
    :title="labels.noItemsFound"
    :description="labels.tryChangingFilters"
    class="bg-white dark:bg-gray-950"
  >
    <NeButton kind="tertiary" size="lg" @click="resetFilters">{{ labels.resetFilters }}</NeButton>
  </NeEmptyState>
  <NeTable v-else v-bind="args" :sort-key="sortKey" :sort-descending="sortDescending">
    <NeTableHead>
      <NeTableHeadCell sortable column-key="name" @sort="onSort">
        {{ labels.name }}
      </NeTableHeadCell>
      <NeTableHeadCell>{{ labels.phoneNumber }}</NeTableHeadCell>
      <NeTableHeadCell sortable column-key="company" @sort="onSort">
        {{ labels.company }}
      </NeTableHeadCell>
      <NeTableHeadCell>
        <!-- no header for actions -->
      </NeTableHeadCell>
    </NeTableHead>
    <NeTableBody>
      <NeTableRow v-for="(contact, index) in contacts" :key="index">
        <NeTableCell :data-label="labels.name">
          <!-- justify-self-start and text-left keep the button aligned with the other
               cell values in card layout, where the cell is a two-column grid -->
          <button
            type="button"
            class="cursor-pointer justify-self-start text-left font-medium hover:underline"
            @click="noop"
          >
            {{ contact.name }}
          </button>
        </NeTableCell>
        <NeTableCell :data-label="labels.phoneNumber">{{ contact.phone }}</NeTableCell>
        <NeTableCell :data-label="labels.company">{{ contact.company }}</NeTableCell>
        <NeTableCell :data-label="labels.actions">
          <div class="-ml-2.5 flex gap-2 lg:ml-0 lg:justify-end">
            <NeButton kind="tertiary" @click="noop">
              <template #prefix>
                <FontAwesomeIcon :icon="faEye" class="h-4 w-4" aria-hidden="true" />
              </template>
              {{ labels.details }}
            </NeButton>
            <!-- kebab menu -->
            <NeDropdown
              :items="kebabMenuItems"
              align-to-right
              :open-menu-aria-label="labels.openMenu"
            />
          </div>
        </NeTableCell>
      </NeTableRow>
    </NeTableBody>
    <template #paginator>
      <NePaginator
        :current-page="1"
        :total-rows="contacts.length"
        :page-size="10"
        :page-sizes="[5, 10, 25, 50, 100]"
        :previous-label="labels.previousPage"
        :next-label="labels.nextPage"
        :nav-pagination-label="labels.pagination"
        :range-of-total-label="labels.rangeOfTotal"
        :page-size-label="labels.pageSize"
      />
    </template>
  </NeTable>
</div>`

function renderTablePage(labels: Labels, variant: Variant = 'table'): Story['render'] {
  return (args) => ({
    components: {
      NeButton,
      NeDropdown,
      NeDropdownFilterV2,
      NeEmptyState,
      NeHeading,
      NePaginator,
      NeSortDropdown,
      NeTable,
      NeTableBody,
      NeTableCell,
      NeTableHead,
      NeTableHeadCell,
      NeTableRow,
      NeTextInput,
      FontAwesomeIcon
    },
    setup() {
      const companyFilterOptions: NeDropdownFilterV2Option[] = companies.map((company) => ({
        id: company,
        label: company
      }))

      const textFilter = ref('')
      const companyFilter = ref<NeDropdownFilterV2Option[]>([])
      const sortKey = ref('name')
      const sortDescending = ref(false)

      // The pattern has no logic: filters and kebab actions don't touch the rows,
      // and sorting only moves the indicator.
      const noop = fn()

      function resetFilters() {
        textFilter.value = ''
        companyFilter.value = []
      }

      function onSort(payload: SortEvent) {
        sortKey.value = payload.key
        sortDescending.value = payload.descending
      }

      const kebabMenuItems: NeDropdownItem[] = [
        { id: 'edit', label: labels.edit, icon: faPenToSquare, action: noop },
        { id: 'delete', label: labels.deleteItem, icon: faTrash, danger: true, action: noop }
      ]

      return {
        args,
        labels,
        variant,
        contacts,
        companyFilterOptions,
        textFilter,
        companyFilter,
        sortKey,
        sortDescending,
        sortOptions: [
          { id: 'name', label: labels.name },
          { id: 'company', label: labels.company }
        ],
        kebabMenuItems,
        resetFilters,
        onSort,
        noop,
        faAddressBook,
        faCirclePlus,
        faEye,
        faMagnifyingGlass
      }
    },
    template: tablePageTemplate
  })
}

export const Standard: Story = {
  args: { ariaLabel: 'Phonebook contacts' },
  render: renderTablePage(enLabels)
}

export const Loading: Story = {
  args: { ariaLabel: 'Phonebook contacts', loading: true },
  render: renderTablePage(enLabels)
}

export const NoItemsConfigured: Story = {
  name: 'No items configured',
  args: { ariaLabel: 'Phonebook contacts' },
  render: renderTablePage(enLabels, 'noItemsConfigured')
}

export const NoItemsFound: Story = {
  name: 'No items found',
  args: { ariaLabel: 'Phonebook contacts' },
  render: renderTablePage(enLabels, 'noItemsFound')
}

export const StandardItalian: Story = {
  name: 'Standard (Italian)',
  args: { ariaLabel: 'Contatti della rubrica' },
  render: renderTablePage(itLabels)
}

export const LoadingItalian: Story = {
  name: 'Loading (Italian)',
  args: { ariaLabel: 'Contatti della rubrica', loading: true },
  render: renderTablePage(itLabels)
}

export const NoItemsConfiguredItalian: Story = {
  name: 'No items configured (Italian)',
  args: { ariaLabel: 'Contatti della rubrica' },
  render: renderTablePage(itLabels, 'noItemsConfigured')
}

export const NoItemsFoundItalian: Story = {
  name: 'No items found (Italian)',
  args: { ariaLabel: 'Contatti della rubrica' },
  render: renderTablePage(itLabels, 'noItemsFound')
}
