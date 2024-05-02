<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
import { type PropType } from 'vue'
import type { Breakpoint } from './NeTable.vue'

defineProps({
  cardBreakpoint: {
    type: String as PropType<Breakpoint>,
    default: 'md'
  }
})

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
