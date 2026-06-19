<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
import { inject, ref, toValue } from 'vue'
import type { Breakpoint } from './NeTable.vue'

// inject props from NeTable.vue
const cardBreakpoint = inject('cardBreakpoint', 'md')
const highlightRowOnClick = inject('highlightRowOnClick', ref(true))
const highlightedRow = inject<ReturnType<typeof ref<HTMLElement | null>>>('highlightedRow')
const highlightRow = inject<(el: HTMLElement | null) => void>('highlightRow')

const rowEl = ref<HTMLElement | null>(null)

function handleClick() {
  if (toValue(highlightRowOnClick) && highlightRow) {
    highlightRow(rowEl.value)
  }
}

const trCardStyle: Record<Breakpoint, string> = {
  sm: 'sm:table-row',
  md: 'md:table-row',
  lg: 'lg:table-row',
  xl: 'xl:table-row',
  '2xl': '2xl:table-row'
}
</script>
<template>
  <tr
    ref="rowEl"
    :class="[
      `grid`,
      `transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800`,
      trCardStyle[cardBreakpoint],
      {
        'bg-gray-100 dark:bg-gray-800': highlightedRow === rowEl
      }
    ]"
    @click="handleClick"
  >
    <slot />
  </tr>
</template>
