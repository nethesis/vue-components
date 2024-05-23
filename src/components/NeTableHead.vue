<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
import { inject } from 'vue'
import type { Breakpoint } from './NeTable.vue'

// inject cardBreakpoint from NeTable.vue
const cardBreakpoint = inject('cardBreakpoint', 'md')

const tbodyCardStyle: Record<Breakpoint, string> = {
  sm: 'sm:table-header-group',
  md: 'md:table-header-group',
  lg: 'lg:table-header-group',
  xl: 'xl:table-header-group',
  '2xl': '2xl:table-header-group'
}
</script>
<template>
  <thead
    :class="[
      `hidden bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50`,
      tbodyCardStyle[cardBreakpoint]
    ]"
  >
    <tr>
      <slot></slot>
    </tr>
  </thead>
</template>
