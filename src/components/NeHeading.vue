<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import type { PropType } from 'vue'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

defineProps({
  tag: {
    type: String as PropType<HeadingTag>,
    default: 'h1'
  }
})

const baseStyle = 'text-gray-900 dark:text-gray-100'

const textSizes: Record<string, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-semibold',
  h3: 'text-2xl font-medium',
  h4: 'text-xl font-medium',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium'
}
</script>

<template>
  <component :is="tag" v-bind="$attrs" :class="[baseStyle, textSizes[tag]]">
    <slot />
  </component>
</template>
