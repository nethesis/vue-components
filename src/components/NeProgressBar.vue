<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { computed, type PropType } from 'vue'

export type ProgressBarSize = 'sm' | 'md' | 'lg' | 'xl'
export type ProgressBarColor =
  | 'primary'
  | 'gray'
  | 'blue'
  | 'red'
  | 'green'
  | 'yellow'
  | 'indigo'
  | 'rose'
  | 'amber'
  | 'custom'

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    validator(value: number) {
      return value >= 0 && value <= 100
    }
  },
  label: {
    type: String,
    default: ''
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  size: {
    type: String as PropType<ProgressBarSize>,
    default: 'md'
  },
  color: {
    type: String as PropType<ProgressBarColor>,
    default: 'primary'
  },
  customColorClasses: {
    type: String,
    default: ''
  },
  indeterminate: {
    type: Boolean,
    default: false
  }
})

const sizeClasses: Record<ProgressBarSize, string> = {
  sm: 'h-1.5 leading-none',
  md: 'h-2.5 leading-none',
  lg: 'h-4 leading-none',
  xl: 'h-6 leading-tight'
}

const colorClasses: Record<ProgressBarColor, string> = {
  primary: 'bg-primary-600 dark:bg-primary-500',
  gray: 'bg-gray-600 dark:bg-gray-300',
  blue: 'bg-blue-600 dark:bg-blue-500',
  red: 'bg-red-600 dark:bg-red-500',
  green: 'bg-green-600 dark:bg-green-500',
  yellow: 'bg-yellow-500 dark:bg-yellow-400',
  indigo: 'bg-indigo-600 dark:bg-indigo-400',
  rose: 'bg-rose-600 dark:bg-rose-500',
  amber: 'bg-amber-600 dark:bg-amber-500',
  custom: `${props.customColorClasses}`
}

const boundedProgress = computed(() => {
  if (props.progress < 0) {
    return 0
  } else if (props.progress > 100) {
    return 100
  } else {
    return props.progress
  }
})
</script>

<template>
  <div class="text-sm">
    <template v-if="label || showProgress">
      <div class="mb-1 flex justify-between font-medium text-gray-700 dark:text-gray-200">
        <span>{{ label }}</span>
        <span v-if="showProgress">{{ boundedProgress }}%</span>
      </div>
    </template>
    <div
      :class="`w-full overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600 ${sizeClasses[size]}`"
    >
      <div
        v-if="indeterminate"
        :class="`animate-indeterminate-progress-bar h-full w-full origin-[0%_50%] rounded-full ${sizeClasses[size]} ${colorClasses[color]}`"
      ></div>
      <div
        v-else
        :class="`${sizeClasses[size]} ${colorClasses[color]}`"
        :style="{ width: boundedProgress + '%' }"
        class="text-primary-100 rounded-full p-0.5 text-center font-medium duration-300 ease-out"
      ></div>
    </div>
  </div>
</template>
