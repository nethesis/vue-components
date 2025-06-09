<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { computed, type PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  topLabel: {
    type: String,
    default: ''
  },
  size: {
    type: String as PropType<ToggleSize>,
    default: 'md'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  invalidMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

type ToggleSize = 'sm' | 'md' | 'lg' | 'xl'

const defaultLabelClasses = 'w-fit relative flex items-start'

const defaultToggleBackgroundClasses =
  'shrink-0 bg-gray-400 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary-500 dark:peer-focus:ring-primary-300 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500 peer-focus:ring-offset-white dark:peer-focus:ring-offset-primary-950'

const defaultToggleBallClasses = 'ml-3 text-sm font-medium text-gray-700 dark:text-gray-200'

const toggleSizeClasses: Record<ToggleSize, string> = {
  xl: 'w-14 h-7 after:top-0.5 after:left-[4px] after:h-6 after:w-6',
  lg: 'w-11 h-6 after:top-[2px] after:left-[2px] after:h-5 after:w-5',
  md: 'w-9 h-5 after:top-[2px] after:left-[2px] after:h-4 after:w-4',
  sm: 'w-8 h-4 after:top-px after:left-[2px] after:h-3.5 after:w-3.5'
}

const labelClasses = computed(() => {
  return (
    defaultLabelClasses +
    ' ' +
    (props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')
  )
})

const toggleClasses = computed(() => {
  return defaultToggleBackgroundClasses
})

const toggleSize = computed(() => {
  return toggleSizeClasses[props.size]
})

const toggleBallClasses = computed(() => {
  return defaultToggleBallClasses
})
</script>

<template>
  <div class="text-sm">
    <label
      v-if="topLabel"
      class="mb-2 flex items-end justify-between leading-6 font-medium text-gray-700 dark:text-gray-200"
    >
      <span>
        {{ topLabel }}
        <span v-if="$slots.topTooltip" class="ml-1">
          <slot name="topTooltip"></slot>
        </span>
      </span>
    </label>
    <div class="flex">
      <label :class="labelClasses">
        <input v-model="model" :disabled="disabled" type="checkbox" class="peer sr-only shrink-0" />
        <span :class="[toggleClasses, toggleSize]"></span>
        <span :class="toggleBallClasses">
          {{ label }}
        </span>
      </label>
      <span v-if="$slots.tooltip" class="ml-2">
        <slot name="tooltip"></slot>
      </span>
    </div>
    <!-- invalid message -->
    <p v-if="invalidMessage" class="mt-2 text-sm text-rose-700 dark:text-rose-400">
      {{ invalidMessage }}
    </p>
  </div>
</template>
