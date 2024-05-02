<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Breakpoint } from './NeTable.vue'

defineProps({
  dataLabel: {
    // This attribute replaces table header in mobile viewport
    type: String,
    required: true
  },
  cardBreakpoint: {
    type: String as PropType<Breakpoint>,
    default: 'md'
  }
})

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
  <td :data-label="dataLabel" :class="[`grid grid-cols-2 px-6 py-4`, tdCardStyle[cardBreakpoint]]">
    <span
      :class="[`font-medium text-gray-900 dark:text-gray-50`, dataLabelCardStyle[cardBreakpoint]]"
    >
      {{ dataLabel }}
    </span>
    <slot />
  </td>
</template>
