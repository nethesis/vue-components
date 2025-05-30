<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import NeSpinner, { type SpinnerColor, type SpinnerSize } from './NeSpinner.vue'

export type ButtonKind = 'primary' | 'secondary' | 'tertiary' | 'danger'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = defineProps({
  kind: {
    type: String as PropType<ButtonKind>,
    default: 'secondary'
  },
  size: {
    type: String as PropType<ButtonSize>,
    default: 'md'
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingPosition: {
    type: String as PropType<'prefix' | 'suffix'>,
    default: 'prefix'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const sizeStyle: { [index: string]: string } = {
  xs: 'rounded px-2 py-1 text-xs',
  sm: 'rounded px-2 py-1 text-sm',
  md: 'rounded-md px-2.5 py-1.5 text-sm',
  lg: 'rounded-md px-3 py-2 text-sm',
  xl: 'rounded-md px-3.5 py-2.5 text-sm'
}
const kindStyle: { [index: string]: string } = {
  primary:
    'shadow-sm bg-primary-700 text-white hover:bg-primary-800 focus:ring-offset-white dark:bg-primary-500 dark:text-gray-950 dark:hover:bg-primary-300 dark:focus:ring-offset-primary-950',
  secondary:
    'shadow-sm ring-1 text-primary-700 ring-gray-300 hover:bg-gray-200/70 hover:text-primary-800 focus:ring-offset-white dark:text-primary-500 dark:ring-gray-500 dark:hover:bg-gray-600/30 dark:hover:text-primary-400 dark:focus:ring-offset-primary-950',
  tertiary:
    'text-primary-700 hover:text-primary-800 hover:bg-gray-200/70 focus:ring-offset-white dark:text-primary-500 dark:hover:text-primary-400 dark:hover:bg-gray-600/30 dark:focus:ring-offset-primary-950',
  danger:
    'shadow-sm bg-rose-700 text-white hover:bg-rose-800 focus:ring-offset-white dark:bg-rose-600 dark:text-white dark:hover:bg-rose-500 dark:focus:ring-offset-primary-950'
}

const spinnerColorStyle: { [index: string]: SpinnerColor } = {
  primary: 'white',
  secondary: 'primary',
  tertiary: 'primary',
  danger: 'white'
}

const spinnerSizeStyle: { [index: string]: SpinnerSize } = {
  xs: '2.5',
  sm: '3',
  md: '4',
  lg: '4',
  xl: '5'
}

const loadingPrefix = computed(() => props.loading && props.loadingPosition === 'prefix')
const loadingSuffix = computed(() => props.loading && props.loadingPosition === 'suffix')
</script>

<template>
  <button
    class="focus:ring-primary-500 dark:focus:ring-primary-300 font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
    :class="[kindStyle[props.kind], sizeStyle[props.size]]"
    :disabled="disabled"
    type="button"
  >
    <div class="flex items-center justify-center">
      <!-- prefix -->
      <div v-if="$slots.prefix || loadingPrefix" class="mr-2">
        <NeSpinner
          v-if="loadingPrefix"
          :color="spinnerColorStyle[kind]"
          :size="spinnerSizeStyle[size]"
        />
        <slot v-else name="prefix" />
      </div>
      <slot />
      <!-- suffix -->
      <div v-if="$slots.suffix || loadingSuffix" class="ml-2">
        <NeSpinner
          v-if="loadingSuffix"
          :color="spinnerColorStyle[kind]"
          :size="spinnerSizeStyle[size]"
        />
        <slot v-else name="suffix" />
      </div>
    </div>
  </button>
</template>
