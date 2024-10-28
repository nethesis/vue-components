<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { range } from 'lodash-es'
import { faChevronLeft as fasChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight as fasChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { NeListbox } from '@/main'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalRows: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array<Number>,
    default: [10, 25, 50, 100]
  },
  previousLabel: {
    type: String,
    required: true
  },
  nextLabel: {
    type: String,
    required: true
  },
  navPaginationLabel: {
    type: String,
    required: true
  },
  rangeOfTotalLabel: {
    type: String,
    required: true
  },
  pageSizeLabel: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  selectPage: [page: number]
  selectPageSize: [pageSize: number]
}>()

const internalPageSize = ref('')

const cellClass =
  'flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400'

const cellHoverClasses =
  'hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-white'

const currentPageCellClass =
  'z-10 cursor-default flex items-center justify-center px-4 h-10 leading-tight text-gray-700 border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white'

const totalPages = computed(() => Math.ceil(props.totalRows / props.pageSize))

const firstPages = computed(() => props.currentPage <= 4)

const lastPages = computed(() => props.currentPage > totalPages.value - 4)

const firstRow = computed(() => (props.currentPage - 1) * props.pageSize + 1)

const lastRow = computed(() => Math.min(props.currentPage * props.pageSize, props.totalRows))

const pageSizeOptions = computed(() =>
  props.pageSizes.map((pageSize) => {
    return {
      id: pageSize.toString(),
      label: pageSize.toString()
    }
  })
)

onMounted(() => {
  internalPageSize.value = props.pageSize.toString()
})

watch(
  () => props.pageSize,
  () => {
    if (internalPageSize.value != props.pageSize.toString()) {
      internalPageSize.value = props.pageSize.toString()
    }
  }
)

watch(
  () => internalPageSize.value,
  () => {
    emit('selectPageSize', parseInt(internalPageSize.value))
  }
)

function getCellClass(page: number, disableHoverClasses?: boolean) {
  return props.currentPage === page
    ? [currentPageCellClass, !disableHoverClasses ? cellHoverClasses : 'cursor-default']
    : [cellClass, !disableHoverClasses ? cellHoverClasses : 'cursor-default']
}

function getAriaCurrent(page: number) {
  return props.currentPage === page ? 'page' : 'false'
}

function navigateToPage(page: number) {
  emit('selectPage', page)
}
</script>

<template>
  <div
    class="flex flex-col justify-between gap-6 border-t border-gray-300 bg-white px-6 py-3 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-100 sm:flex-row sm:items-center"
  >
    <!-- range information and page size selection -->
    <div class="flex items-center gap-6">
      <div>{{ firstRow }} - {{ lastRow }} {{ rangeOfTotalLabel }} {{ totalRows }}</div>

      <div class="flex items-center gap-2">
        <div id="page-size-label">{{ pageSizeLabel }}</div>
        <NeListbox
          v-model="internalPageSize"
          :options="pageSizeOptions"
          no-options-label=""
          optional-label=""
          aria-labelledby="page-size-label"
        />
      </div>
    </div>
    <!-- page selection -->
    <nav :aria-label="navPaginationLabel">
      <ul class="flex h-10 items-center -space-x-px text-base">
        <li>
          <button
            :disabled="currentPage === 1"
            :aria-label="previousLabel"
            class="ms-0 flex h-10 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
            @click="navigateToPage(currentPage - 1)"
          >
            <span class="sr-only">{{ previousLabel }}</span>
            <FontAwesomeIcon :icon="fasChevronLeft" class="h-3 w-3 shrink-0" aria-hidden="true" />
          </button>
        </li>
        <!-- show all page numbers if there are no more than 8 pages in total -->
        <template v-if="totalPages <= 8">
          <li v-for="i in range(1, totalPages + 1)" :key="i">
            <button
              :aria-current="getAriaCurrent(i)"
              :class="getCellClass(i)"
              @click="navigateToPage(i)"
            >
              {{ i }}
            </button>
          </li>
        </template>
        <!-- show a collapsed view of the pages, with start, ending, previous and next page -->
        <template v-else>
          <li>
            <button
              :aria-current="getAriaCurrent(1)"
              :class="getCellClass(1)"
              @click="navigateToPage(1)"
            >
              1
            </button>
          </li>
          <li>
            <button
              :aria-current="getAriaCurrent(firstPages ? 2 : -1)"
              :class="getCellClass(firstPages ? 2 : -1, !firstPages)"
              @click="firstPages ? navigateToPage(2) : undefined"
            >
              {{ firstPages ? 2 : '...' }}
            </button>
          </li>
          <li v-for="i in range(-1, 2)" :key="i">
            <button
              :aria-current="
                getAriaCurrent(
                  firstPages ? 4 + i : lastPages ? totalPages - 3 + i : currentPage + i
                )
              "
              :class="
                getCellClass(firstPages ? 4 + i : lastPages ? totalPages - 3 + i : currentPage + i)
              "
              @click="
                navigateToPage(
                  firstPages ? 4 + i : lastPages ? totalPages - 3 + i : currentPage + i
                )
              "
            >
              {{ firstPages ? 4 + i : lastPages ? totalPages - 3 + i : currentPage + i }}
            </button>
          </li>
          <li>
            <button
              :aria-current="getAriaCurrent(lastPages ? totalPages - 1 : -1)"
              :class="getCellClass(lastPages ? totalPages - 1 : -1, !lastPages)"
              @click="lastPages ? navigateToPage(totalPages - 1) : undefined"
            >
              {{ lastPages ? totalPages - 1 : '...' }}
            </button>
          </li>
          <li>
            <button
              :aria-current="getAriaCurrent(totalPages)"
              :class="getCellClass(totalPages)"
              @click="navigateToPage(totalPages)"
            >
              {{ totalPages }}
            </button>
          </li>
        </template>
        <li>
          <button
            :disabled="currentPage === totalPages"
            :aria-label="nextLabel"
            class="flex h-10 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
            @click="navigateToPage(currentPage + 1)"
          >
            <span class="sr-only">{{ nextLabel }}</span>
            <FontAwesomeIcon :icon="fasChevronRight" class="h-3 w-3 shrink-0" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
