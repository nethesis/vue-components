<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
import { inject } from 'vue'
import type { Breakpoint } from './NeTable.vue'

// inject cardBreakpoint from NeTable.vue
const cardBreakpoint = inject('cardBreakpoint', 'md')

const trCardStyle: Record<Breakpoint, string> = {
  sm: 'sm:table-row',
  md: 'md:table-row',
  lg: 'lg:table-row',
  xl: 'xl:table-row',
  '2xl': '2xl:table-row'
}
</script>
<template>
  <tr :class="[`grid`, trCardStyle[cardBreakpoint]]">
    <slot />
  </tr>
</template>
