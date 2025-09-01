<!--
  Copyright (C) 2025 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const {
  size = 'sm',
  kind = 'gray',
  pill = true,
  dismissable = false,
  customKindClasses = '',
  dismissAriaLabel = 'Dismiss'
} = defineProps<{
  size?: 'xs' | 'sm'
  kind?: 'primary' | 'indigo' | 'gray' | 'green' | 'amber' | 'rose' | 'blue' | 'custom'
  pill?: boolean
  dismissable?: boolean
  customKindClasses?: string
  dismissAriaLabel?: string
}>()

const emit = defineEmits(['dismiss'])

const textClasses = computed(() => {
  switch (size) {
    case 'xs':
      return 'text-xs'
    case 'sm':
    default:
      return 'text-sm'
  }
})

const paddingClasses = computed(() => {
  switch (size) {
    case 'xs':
      return 'px-3'
    case 'sm':
    default:
      return 'px-2.5'
  }
})

const spacingClasses = computed(() => {
  return 'gap-x-1'
})

const kindClasses = computed(() => {
  switch (kind) {
    case 'primary':
      return 'bg-primary-100 text-primary-800 dark:bg-primary-700 dark:text-primary-100'
    case 'indigo':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100'
    case 'green':
      return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-50'
    case 'amber':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-amber-50'
    case 'rose':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-700 dark:text-rose-100'
    case 'blue':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
    case 'custom':
      return `${customKindClasses}`
    case 'gray':
    default:
      return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
  }
})

const dismissButtonClasses = computed(() => {
  switch (kind) {
    case 'primary':
      return 'hover:bg-primary-200 hover:dark:bg-primary-600'
    case 'indigo':
      return 'hover:bg-indigo-200 hover:dark:bg-indigo-500'
    case 'green':
      return 'hover:bg-green-200 hover:dark:bg-green-600'
    case 'amber':
      return 'hover:bg-amber-200 hover:dark:bg-amber-600'
    case 'rose':
      return 'hover:bg-rose-200 hover:dark:bg-rose-600'
    case 'blue':
      return 'hover:bg-blue-200 hover:dark:bg-blue-600'
    case 'custom':
      return 'hover:bg-white/20'
    case 'gray':
    default:
      return 'hover:bg-gray-300 hover:dark:bg-gray-500'
  }
})
</script>

<template>
  <div
    :class="[
      textClasses,
      spacingClasses,
      paddingClasses,
      kindClasses,
      pill ? 'rounded-full' : 'rounded'
    ]"
    class="inline-flex w-fit items-center py-0.5 font-medium"
  >
    <slot />
    <button
      v-if="dismissable"
      :class="`inline-flex rounded focus:ring-2 focus:ring-offset-2 focus:outline-hidden ${dismissButtonClasses}`"
      type="button"
      @click="emit('dismiss')"
    >
      <span class="sr-only">{{ dismissAriaLabel }}</span>
      <FontAwesomeIcon :icon="faXmark" class="size-4" aria-hidden="true" />
    </button>
  </div>
</template>
