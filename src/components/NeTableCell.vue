<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
import { inject } from 'vue'
import type { Breakpoint } from './NeTable.vue'

defineProps({
  dataLabel: {
    // this attribute replaces table header in mobile viewport and should always have a value. The only exception is when the cell contains the empty state of the table
    type: String,
    default: ''
  }
})

// inject cardBreakpoint from NeTable.vue
const cardBreakpoint = inject('cardBreakpoint', 'md')

const tdCardStyle: Record<Breakpoint, string> = {
  sm: 'sm:table-cell',
  md: 'md:table-cell',
  lg: 'lg:table-cell',
  xl: 'xl:table-cell',
  '2xl': '2xl:table-cell'
}

const dataLabelCardStyle: Record<Breakpoint, string> = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
  xl: 'xl:hidden',
  '2xl': '2xl:hidden'
}
</script>
<template>
  <td
    :data-label="dataLabel"
    :class="[`grid px-6 py-4`, tdCardStyle[cardBreakpoint], { 'grid-cols-2': dataLabel }]"
  >
    <span
      v-if="dataLabel"
      :class="[`font-medium text-gray-900 dark:text-gray-50`, dataLabelCardStyle[cardBreakpoint]]"
    >
      {{ dataLabel }}
    </span>
    <slot />
  </td>
</template>
