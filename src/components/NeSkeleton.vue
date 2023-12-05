<!--
  Copyright (C) 2023 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import type { PropType } from 'vue'

type SkeletonSize = 'sm' | 'md' | 'lg'

const props = defineProps({
  size: {
    type: String as PropType<SkeletonSize>,
    default: 'md'
  },
  lines: {
    type: Number,
    default: 1
  }
})

const sizeStyle: { [index: string]: string } = {
  sm: 'h-4',
  md: 'h-5',
  lg: 'h-6'
}
</script>

<template>
  <div class="flex animate-pulse space-x-4">
    <div class="flex-1 space-y-3">
      <div
        v-for="index in props.lines"
        :key="index"
        :class="`${sizeStyle[props.size]} rounded bg-gray-300 dark:bg-gray-700`"
        :style="props.lines > 1 ? `width: ${65 + Math.round(Math.random() * 35)}%` : ''"
      ></div>
    </div>
  </div>
</template>
