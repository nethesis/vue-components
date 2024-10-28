<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
import { computed, inject, toValue } from 'vue'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  columnKey: {
    type: String,
    default: ''
  },
  sortable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  sort: [{ key: string; descending: boolean }]
}>()

// inject from NeTable.vue
const sortKey = inject('sortKey', '')
const sortDescending = inject('sortDescending', false)

const ariaSort = computed(() => {
  const sortKeyValue = toValue(sortKey)
  const sortDescendingValue = toValue(sortDescending)

  if (props.sortable && props.columnKey === sortKeyValue) {
    return sortDescendingValue ? 'descending' : 'ascending'
  }
  return 'none'
})

const sort = () => {
  const sortKeyValue = toValue(sortKey)
  const sortDescendingValue = toValue(sortDescending)

  if (props.columnKey === sortKeyValue) {
    emit('sort', { key: props.columnKey, descending: !sortDescendingValue })
  } else {
    emit('sort', { key: props.columnKey, descending: false })
  }
}
</script>
<template>
  <th scope="col" class="px-6 py-3 font-medium" :aria-sort="ariaSort">
    <!-- sortable column header -->
    <button v-if="sortable" class="group flex items-center gap-2" @click="sort">
      <slot></slot>
      <template v-if="props.columnKey === sortKey">
        <FontAwesomeIcon
          :icon="sortDescending ? faSortDown : faSortUp"
          class="h-4 w-4 text-gray-600 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-50"
          aria-hidden="true"
        />
      </template>
      <FontAwesomeIcon
        v-else
        :icon="faSort"
        class="h-4 w-4 text-gray-600 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-50"
        aria-hidden="true"
      />
    </button>
    <!-- non-sortable column header -->
    <slot v-else></slot>
  </th>
</template>
