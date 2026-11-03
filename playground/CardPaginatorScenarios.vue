<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<!--
  Regression scenarios for NeCard and NePaginator in narrow containers: a
  card must never grow past its column, and a paginator must stay readable
  and inside the table that holds it. Every scenario is rendered at several
  fixed widths, and carries data-scenario / data-width so the overflow can
  be measured from the browser console:

    [...document.querySelectorAll('[data-scenario]')].filter(
      (el) => el.scrollWidth > el.clientWidth + 1
    )
-->

<script lang="ts" setup>
import { ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faServer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import NeCard from '../src/components/NeCard.vue'
import NePaginator from '../src/components/NePaginator.vue'
import NeTable from '../src/components/NeTable.vue'
import NeTableHead from '../src/components/NeTableHead.vue'
import NeTableHeadCell from '../src/components/NeTableHeadCell.vue'
import NeTableBody from '../src/components/NeTableBody.vue'
import NeTableRow from '../src/components/NeTableRow.vue'
import NeTableCell from '../src/components/NeTableCell.vue'

// NeCard takes its icon as a [prefix, name] pair from the library
library.add(faServer)

const widths = [320, 480, 560, 640, 800, 1100]

const paginatorCases = [
  { name: 'one page', totalRows: 4, currentPage: 1 },
  { name: 'three pages', totalRows: 15, currentPage: 2 },
  { name: 'eight pages', totalRows: 40, currentPage: 8 },
  { name: 'nine pages', totalRows: 45, currentPage: 5 },
  { name: 'many pages, first', totalRows: 105, currentPage: 1 },
  { name: 'many pages, middle', totalRows: 105, currentPage: 11 },
  { name: 'many pages, last', totalRows: 105, currentPage: 21 },
  { name: 'thousands of rows', totalRows: 12345, currentPage: 1234 },
  { name: 'no rows', totalRows: 0, currentPage: 1 }
]

const labels = {
  en: { of: 'of', show: 'Show', previous: 'Go to previous page', next: 'Go to next page' },
  it: {
    of: 'di',
    show: 'Mostra',
    previous: 'Vai alla pagina precedente',
    next: 'Vai alla pagina successiva'
  }
}

const rows = [
  { system: 'GW', organization: 'Selle Italia', tier: '61 - 120 device', usage: '137/120' },
  {
    system: 'cloud3-ovh.sinc.com.mx',
    organization: 'Sinc',
    tier: '16 - 30 device',
    usage: '58/30'
  },
  { system: 'Gw.rodo.lan', organization: 'Rodo Firenze Spa', tier: '1-15 device', usage: '23/15' },
  { system: 'Nethsecurity JEF', organization: 'JEF', tier: '1-15 device', usage: '42/15' },
  { system: 'Novavetro_Firewall2', organization: 'Novavetro', tier: '1-15 device', usage: '16/15' }
]

const interactivePage = ref(1)
const interactivePageSize = ref(5)

const menuItems = [
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete', danger: true }
]
</script>

<template>
  <div class="space-y-12">
    <section>
      <h2 class="mb-2 text-lg font-medium">1. Over-tier report card (the bug)</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        A table with long, unbreakable names and 21 pages, in a card as wide as half a report row at
        125% zoom (about 570 px). The card must keep its padding and border, the table must scroll
        inside it, the range must not wrap word by word.
      </p>
      <div class="flex flex-wrap items-start gap-6">
        <div
          v-for="width in widths"
          :key="width"
          data-scenario="report-card"
          :data-width="width"
          :style="{ width: `${width}px` }"
        >
          <div class="mb-1 text-xs text-gray-500">{{ width }} px</div>
          <NeCard title="Oltre la fascia" uppercase-title>
            <NeTable aria-label="Oltre la fascia" card-breakpoint="sm">
              <NeTableHead>
                <NeTableHeadCell>Sistema</NeTableHeadCell>
                <NeTableHeadCell>Add-on</NeTableHeadCell>
                <NeTableHeadCell>Fascia</NeTableHeadCell>
                <NeTableHeadCell>Utilizzo</NeTableHeadCell>
              </NeTableHead>
              <NeTableBody>
                <NeTableRow v-for="row in rows" :key="row.system">
                  <NeTableCell data-label="Sistema">
                    <div class="font-medium">{{ row.system }}</div>
                    <div class="text-gray-500 dark:text-gray-400">{{ row.organization }}</div>
                  </NeTableCell>
                  <NeTableCell data-label="Add-on">Threat Shield</NeTableCell>
                  <NeTableCell data-label="Fascia">{{ row.tier }}</NeTableCell>
                  <NeTableCell data-label="Utilizzo">
                    <span class="whitespace-nowrap">{{ row.usage }}</span>
                  </NeTableCell>
                </NeTableRow>
              </NeTableBody>
              <template #paginator>
                <NePaginator
                  :current-page="1"
                  :total-rows="105"
                  :page-size="5"
                  :page-sizes="[5, 10, 25, 50]"
                  nav-pagination-label="Paginazione tabella"
                  :previous-label="labels.it.previous"
                  :next-label="labels.it.next"
                  :range-of-total-label="labels.it.of"
                  :page-size-label="labels.it.show"
                />
              </template>
            </NeTable>
          </NeCard>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-lg font-medium">2. Report grid</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        Two cards side by side in a grid, as in My Nethesis Add-ons > Report: the card with the wide
        table must not push the grid past its container or squeeze its neighbour.
      </p>
      <div
        v-for="width in [1100, 1240]"
        :key="width"
        data-scenario="report-grid"
        :data-width="width"
        class="mb-6 grid grid-cols-2 gap-6"
        :style="{ width: `${width}px` }"
      >
        <NeCard title="Per fascia" uppercase-title>
          <NeTable aria-label="Per fascia" card-breakpoint="sm">
            <NeTableHead>
              <NeTableHeadCell>Add-on</NeTableHeadCell>
              <NeTableHeadCell>Fascia</NeTableHeadCell>
              <NeTableHeadCell>Quantità</NeTableHeadCell>
            </NeTableHead>
            <NeTableBody>
              <NeTableRow v-for="row in rows" :key="row.system">
                <NeTableCell data-label="Add-on">Threat Shield</NeTableCell>
                <NeTableCell data-label="Fascia">{{ row.tier }}</NeTableCell>
                <NeTableCell data-label="Quantità">12</NeTableCell>
              </NeTableRow>
            </NeTableBody>
            <template #paginator>
              <NePaginator
                :total-rows="6"
                :page-size="5"
                :page-sizes="[5, 10]"
                nav-pagination-label="Paginazione tabella"
                :previous-label="labels.it.previous"
                :next-label="labels.it.next"
                :range-of-total-label="labels.it.of"
                :page-size-label="labels.it.show"
              />
            </template>
          </NeTable>
        </NeCard>
        <NeCard title="Oltre la fascia" uppercase-title>
          <NeTable aria-label="Oltre la fascia" card-breakpoint="sm">
            <NeTableHead>
              <NeTableHeadCell>Sistema</NeTableHeadCell>
              <NeTableHeadCell>Add-on</NeTableHeadCell>
              <NeTableHeadCell>Fascia</NeTableHeadCell>
              <NeTableHeadCell>Utilizzo</NeTableHeadCell>
            </NeTableHead>
            <NeTableBody>
              <NeTableRow v-for="row in rows" :key="row.system">
                <NeTableCell data-label="Sistema">{{ row.system }}</NeTableCell>
                <NeTableCell data-label="Add-on">Threat Shield</NeTableCell>
                <NeTableCell data-label="Fascia">{{ row.tier }}</NeTableCell>
                <NeTableCell data-label="Utilizzo">{{ row.usage }}</NeTableCell>
              </NeTableRow>
            </NeTableBody>
            <template #paginator>
              <NePaginator
                :current-page="11"
                :total-rows="105"
                :page-size="5"
                :page-sizes="[5, 10]"
                nav-pagination-label="Paginazione tabella"
                :previous-label="labels.it.previous"
                :next-label="labels.it.next"
                :range-of-total-label="labels.it.of"
                :page-size-label="labels.it.show"
              />
            </template>
          </NeTable>
        </NeCard>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-lg font-medium">3. Paginator alone</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        Every page count, in English and Italian, at every width. On a wide container the range, the
        page size and the pages stay on one row, as before.
      </p>
      <div v-for="lang in ['en', 'it'] as const" :key="lang" class="mb-8">
        <h3 class="mb-2 font-medium">{{ lang }}</h3>
        <div v-for="paginatorCase in paginatorCases" :key="paginatorCase.name" class="mb-4">
          <div class="mb-1 text-xs text-gray-500">{{ paginatorCase.name }}</div>
          <div class="flex flex-wrap items-start gap-4">
            <div
              v-for="width in widths"
              :key="width"
              data-scenario="paginator"
              :data-width="width"
              class="overflow-x-auto border border-dashed border-gray-300 dark:border-gray-600"
              :style="{ width: `${width}px` }"
            >
              <NePaginator
                :current-page="paginatorCase.currentPage"
                :total-rows="paginatorCase.totalRows"
                :page-size="5"
                :page-sizes="[5, 10, 25, 50]"
                nav-pagination-label="Pagination"
                :previous-label="labels[lang].previous"
                :next-label="labels[lang].next"
                :range-of-total-label="labels[lang].of"
                :page-size-label="labels[lang].show"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-lg font-medium">4. Interactive paginator</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        Drag the bottom right corner to resize the container, change page and page size: the layout
        must reflow without jumps.
      </p>
      <div
        data-scenario="paginator-resizable"
        class="resize-x overflow-auto border border-dashed border-gray-300 dark:border-gray-600"
        style="width: 560px; min-width: 240px"
      >
        <NePaginator
          :current-page="interactivePage"
          :total-rows="243"
          :page-size="interactivePageSize"
          :page-sizes="[5, 10, 25, 50]"
          nav-pagination-label="Pagination"
          :previous-label="labels.en.previous"
          :next-label="labels.en.next"
          :range-of-total-label="labels.en.of"
          :page-size-label="labels.en.show"
          @select-page="(page: number) => (interactivePage = page)"
          @select-page-size="(size: number) => (interactivePageSize = size)"
        />
      </div>
      <div class="mt-2 text-xs text-gray-500">
        page {{ interactivePage }}, page size {{ interactivePageSize }}
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-lg font-medium">5. Card variants</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        Header, icon, menu, description, loading, error and alternate background must look as
        before; content that cannot shrink stays clipped by the card, never outside it.
      </p>
      <div class="flex flex-wrap items-start gap-6">
        <div
          v-for="width in [320, 480, 800]"
          :key="width"
          class="space-y-4"
          :style="{ width: `${width}px` }"
        >
          <div class="text-xs text-gray-500">{{ width }} px</div>
          <NeCard
            data-scenario="card-full-header"
            :data-width="width"
            title="Systems"
            description="Systems registered in the last 30 days"
            :icon="['fas', 'server']"
            :menu-items="menuItems"
          >
            <div class="text-3xl font-medium">128</div>
          </NeCard>
          <NeCard data-scenario="card-icon-object" :data-width="width" title="Icon as object">
            <div class="flex items-center gap-2">
              <FontAwesomeIcon :icon="faServer" class="size-4" aria-hidden="true" />
              Content with an icon
            </div>
          </NeCard>
          <NeCard data-scenario="card-loading" :data-width="width" title="Loading" loading />
          <NeCard
            data-scenario="card-error"
            :data-width="width"
            title="Error"
            error-title="Cannot retrieve systems"
            error-description="The server did not answer in time. Try again in a few minutes."
          />
          <NeCard
            data-scenario="card-alternate"
            :data-width="width"
            title="Alternate background"
            alternate-background
          >
            Body text that wraps normally across several lines when the card is narrow, as any
            paragraph does.
          </NeCard>
          <NeCard data-scenario="card-unbreakable" :data-width="width" title="Unbreakable text">
            https://my.nethesis.it/systems/7b63e111-9943-4830-ba29-04bc0b588beb?tab=addons&amp;filter=over_limit
          </NeCard>
          <NeCard data-scenario="card-flex-row" :data-width="width" title="Flex row content">
            <div class="flex items-center justify-between gap-4">
              <span>Left aligned</span>
              <span>Right aligned</span>
            </div>
          </NeCard>
          <NeCard data-scenario="card-fixed-width" :data-width="width" title="Fixed-width child">
            <div class="bg-primary-100 dark:bg-primary-900 h-8 w-[600px] rounded">600 px child</div>
          </NeCard>
          <NeCard data-scenario="card-no-header" :data-width="width">
            A card without a header.
          </NeCard>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-lg font-medium">6. Card in a flex row</h2>
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        Cards as flex items must share the row as before.
      </p>
      <div data-scenario="card-flex-parent" class="flex w-[900px] gap-6">
        <NeCard title="Short" class="flex-1">One line</NeCard>
        <NeCard title="Long" class="flex-1">
          A longer body that takes more space than the card beside it, and wraps.
        </NeCard>
        <NeCard title="Fixed" class="w-48 shrink-0">Fixed width</NeCard>
      </div>
    </section>
  </div>
</template>
