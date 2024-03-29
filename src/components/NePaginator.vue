<!--
  Copyright (C) 2023 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed } from 'vue'
import { range } from 'lodash-es'
import { faChevronLeft as fasChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight as fasChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export type NePaginatorProps = {
  currentPage: number
  totalPages: number
  previousLabel: string
  nextLabel: string
}

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  previousLabel: {
    type: String,
    required: true
  },
  nextLabel: {
    type: String,
    required: true
  }
})
const emit = defineEmits<{
  selectPage: [page: number]
}>()

const firstPages = computed(() => props.currentPage <= 4)
const lastPages = computed(() => props.currentPage > props.totalPages - 4)

const cellClass =
  'flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white'
const cellHoverClasses = 'hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700'

const currentPageCellClass =
  'z-10 flex items-center justify-center px-4 h-10 leading-tight text-primary-700 border border-primary-300 bg-primary-50 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
const currentPageHoverCellClasses = 'hover:bg-primary-100 hover:text-primary-800'

function getCellClass(page: number, disableHoverClasses?: boolean) {
  return props.currentPage === page
    ? [currentPageCellClass, !disableHoverClasses ? currentPageHoverCellClasses : 'cursor-default']
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
  <nav>
    <ul class="flex h-10 items-center -space-x-px text-base">
      <li>
        <button
          :disabled="currentPage === 1"
          class="ms-0 flex h-10 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          @click="navigateToPage(currentPage - 1)"
        >
          <span class="sr-only">{{ previousLabel }}</span>
          <font-awesome-icon :icon="fasChevronLeft" class="h-3 w-3 shrink-0" aria-hidden="true" />
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
              getAriaCurrent(firstPages ? 4 + i : lastPages ? totalPages - 3 + i : currentPage + i)
            "
            :class="
              getCellClass(firstPages ? 4 + i : lastPages ? totalPages - 3 + i : currentPage + i)
            "
            @click="
              navigateToPage(firstPages ? 4 + i : lastPages ? totalPages - 3 + i : currentPage + i)
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
          class="flex h-10 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          @click="navigateToPage(currentPage + 1)"
        >
          <span class="sr-only">{{ nextLabel }}</span>
          <font-awesome-icon :icon="fasChevronRight" class="h-3 w-3 shrink-0" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </nav>
</template>
