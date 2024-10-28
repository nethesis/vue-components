<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
import { computed, provide, type PropType } from 'vue'
import NeTableSkeleton from './NeTableSkeleton.vue'

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const props = defineProps({
  ariaLabel: {
    type: String,
    required: true
  },
  cardBreakpoint: {
    type: String as PropType<Breakpoint>,
    default: 'md'
  },
  loading: {
    type: Boolean,
    default: false
  },
  skeletonRows: {
    type: Number,
    default: 8
  },
  skeletonColumns: {
    type: Number,
    default: 4
  },
  sortKey: {
    type: String,
    default: ''
  },
  sortDescending: {
    type: Boolean,
    default: false
  }
})

// provide props to children components
provide(
  'cardBreakpoint',
  computed(() => props.cardBreakpoint)
)
provide(
  'sortKey',
  computed(() => props.sortKey)
)
provide(
  'sortDescending',
  computed(() => props.sortDescending)
)

const tableCardStyle: Record<Breakpoint, string> = {
  sm: 'sm:table sm:divide-y sm:divide-gray-300 sm:dark:divide-gray-600',
  md: 'md:table md:divide-y md:divide-gray-300 md:dark:divide-gray-600',
  lg: 'lg:table lg:divide-y lg:divide-gray-300 lg:dark:divide-gray-600',
  xl: 'xl:table xl:divide-y xl:divide-gray-300 xl:dark:divide-gray-600',
  '2xl': '2xl:table 2xl:divide-y 2xl:divide-gray-300 2xl:dark:divide-gray-600'
}
</script>
<template>
  <div class="overflow-x-auto rounded-lg border border-gray-300 shadow-sm dark:border-gray-600">
    <table
      role="grid"
      :aria-label="ariaLabel"
      :class="[
        `grid w-full table-auto bg-white text-left text-sm font-normal text-gray-700 dark:bg-gray-950 dark:text-gray-200`,
        tableCardStyle[cardBreakpoint]
      ]"
    >
      <template v-if="loading">
        <NeTableSkeleton
          :rows="skeletonRows"
          :columns="skeletonColumns"
          :card-breakpoint="cardBreakpoint"
        />
      </template>
      <template v-else>
        <slot />
      </template>
    </table>
    <div v-if="$slots.paginator">
      <slot name="paginator" />
    </div>
  </div>
</template>
