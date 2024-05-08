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
  sm: 'sm:table-row-group',
  md: 'md:table-row-group',
  lg: 'lg:table-row-group',
  xl: 'xl:table-row-group',
  '2xl': '2xl:table-row-group'
}
</script>
<template>
  <tbody
    :class="[`block divide-y divide-gray-300 dark:divide-gray-600`, tbodyCardStyle[cardBreakpoint]]"
  >
    <slot />
  </tbody>
</template>
