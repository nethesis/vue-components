<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  /**
   * Size of the badge, can be 'sm' or 'xs', defaults to 'sm'.
   */
  size: {
    type: String as PropType<'sm' | 'xs'>,
    default: 'sm'
  },
  /**
   * Badge kind, defaults to 'secondary'
   */
  kind: {
    type: String as PropType<
      'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'success' | 'info' | 'custom'
    >,
    default: 'secondary'
  },
  /**
   * Should the component be rounded or not.
   */
  rounded: {
    type: Boolean,
    default: true
  },
  /**
   * Text to display inside the badge.
   */
  text: {
    type: String,
    required: true
  },
  /**
   * Label below the text.
   */
  label: {
    type: String,
    required: false,
    default: undefined
  },
  /**
   * Icon to display inside the badge.
   */
  icon: {
    type: Object,
    required: false,
    default: undefined
  },
  /**
   * Should the icon be clickable or not
   */
  iconClickable: {
    type: Boolean,
    default: false
  },
  /**
   * Position of the icon inside the badge.
   */
  iconPosition: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  },
  /**
   * Tailwind color classes to apply if kind = 'custom'. E.g.: 'bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-50'
   */
  customColorClasses: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['iconClick'])

/**
 * Returns the styling classes based off the size prop.
 */
const textClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-xs'
    default:
      return 'text-sm'
  }
})

/**
 * Returns padding classes base off size and presence of label.
 */
const paddingClasses = computed(() => {
  if (props.label) {
    // if icon is present, check where it is to decrease padding on that side
    if (props.icon) {
      if (props.iconPosition == 'left') {
        return 'pl-3 pr-4'
      } else {
        return 'pl-4 pr-3'
      }
    } else {
      return 'px-4'
    }
  } else {
    return 'px-2.5'
  }
})

/**
 * Spacing classes separating
 */
const spacingClasses = computed(() => {
  if (props.label) {
    return 'gap-x-2'
  } else {
    return 'gap-x-1'
  }
})

/**
 * Returns the styling classes based off the kind prop.
 */
const kindClasses = computed(() => {
  switch (props.kind) {
    case 'primary':
      return 'bg-primary-100 text-primary-800 dark:bg-primary-700 dark:text-primary-100'
    case 'tertiary':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100'
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-50'
    case 'warning':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-amber-50'
    case 'error':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-700 dark:text-rose-100'
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
    case 'custom':
      return `${props.customColorClasses}`
    default:
      return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
  }
})

/**
 * Styling classes for icon button.
 */
const iconButtonClasses = computed(() => {
  switch (props.kind) {
    case 'primary':
      return 'hover:bg-primary-200 hover:dark:bg-primary-600'
    case 'tertiary':
      return 'hover:bg-indigo-200 hover:dark:bg-indigo-500'
    case 'success':
      return 'hover:bg-green-200 hover:dark:bg-green-600'
    case 'warning':
      return 'hover:bg-amber-200 hover:dark:bg-amber-600'
    case 'error':
      return 'hover:bg-rose-200 hover:dark:bg-rose-600'
    case 'info':
      return 'hover:bg-blue-200 hover:dark:bg-blue-600'
    default:
      return 'hover:bg-gray-300 hover:dark:bg-gray-500'
  }
})

function onIconClick() {
  emit('iconClick')
}
</script>

<template>
  <div
    :class="[
      textClasses,
      spacingClasses,
      paddingClasses,
      kindClasses,
      rounded ? 'rounded-full' : 'rounded'
    ]"
    class="flex w-fit items-center py-0.5 font-medium"
  >
    <template v-if="icon">
      <button
        v-if="iconClickable"
        type="button"
        :class="[iconPosition == 'right' ? 'order-1' : '', iconButtonClasses, 'flex', 'rounded']"
        @click="onIconClick"
      >
        <FontAwesomeIcon :icon="icon" class="h-4 w-4" />
      </button>

      <FontAwesomeIcon
        v-else
        :class="[iconPosition == 'right' ? 'order-1' : '']"
        :icon="icon"
        class="h-4 w-4"
      />
    </template>
    <div>
      <p>{{ text }}</p>
      <p v-if="label" class="text-xs">{{ label }}</p>
    </div>
  </div>
</template>
