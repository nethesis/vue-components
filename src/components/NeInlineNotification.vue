<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { type PropType, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faTriangleExclamation,
  faXmark,
  type IconDefinition
} from '@fortawesome/free-solid-svg-icons'

type NotificationKind = 'info' | 'warning' | 'error' | 'success'

const props = defineProps({
  kind: {
    type: String as PropType<NotificationKind>,
    required: true
  },
  title: {
    type: String,
    default: undefined
  },
  description: {
    type: String,
    default: undefined
  },
  showCloseButton: {
    type: Boolean,
    default: false
  },
  primaryButtonLabel: {
    type: String,
    default: undefined
  },
  secondaryButtonLabel: {
    type: String,
    default: undefined
  },
  showDetailsLabel: {
    type: String,
    default: 'Show details'
  },
  closeAriaLabel: { type: String, default: 'Dismiss' }
})

const emit = defineEmits(['close', 'primaryClick', 'secondaryClick'])

const isExpandedDetails = ref(false)

const containerKindStyle: { [index: string]: string } = {
  info: 'border-indigo-500 bg-indigo-100 dark:border-indigo-300 dark:bg-indigo-900',
  warning: 'border-amber-500 bg-amber-100 dark:border-amber-300 dark:bg-amber-700',
  error: 'border-rose-500 bg-rose-100 dark:border-rose-300 dark:bg-rose-900',
  success: 'border-green-600 bg-green-100 dark:border-green-500 dark:bg-green-900'
}

const iconName: { [index: string]: IconDefinition } = {
  info: faCircleInfo,
  warning: faTriangleExclamation,
  error: faCircleXmark,
  success: faCircleCheck
}

const iconKindStyle: { [index: string]: string } = {
  info: 'text-indigo-700 dark:text-indigo-200',
  warning: 'text-amber-700 dark:text-amber-100',
  error: 'text-rose-700 dark:text-rose-200',
  success: 'text-green-700 dark:text-green-200'
}

const titleKindStyle: { [index: string]: string } = {
  info: 'text-indigo-800 dark:text-indigo-100',
  warning: 'text-amber-800 dark:text-amber-50',
  error: 'text-rose-800 dark:text-rose-100',
  success: 'text-green-800 dark:text-green-100'
}

const descriptionKindStyle: { [index: string]: string } = {
  info: 'text-indigo-700 dark:text-indigo-200',
  warning: 'text-amber-700 dark:text-amber-100',
  error: 'text-rose-700 dark:text-rose-200',
  success: 'text-green-700 dark:text-green-200'
}

const buttonsKindStyle: { [index: string]: string } = {
  info: 'ring-indigo-400 dark:ring-indigo-400 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 focus:ring-indigo-600 focus:ring-offset-indigo-100 dark:bg-indigo-900 dark:text-indigo-100 dark:hover:bg-indigo-800 dark:focus:ring-indigo-400 dark:focus:ring-offset-indigo-900',
  warning:
    'ring-amber-500 dark:ring-amber-400 bg-amber-100 text-amber-800 hover:bg-amber-200 focus:ring-amber-600 focus:ring-offset-amber-100 dark:bg-amber-700 dark:text-amber-50 dark:hover:bg-amber-600 dark:focus:ring-amber-400 dark:focus:ring-offset-amber-700',
  error:
    'ring-rose-400 dark:ring-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-200 focus:ring-rose-600 focus:ring-offset-rose-100 dark:bg-rose-900 dark:text-rose-100 dark:hover:bg-rose-800 dark:focus:ring-rose-400 dark:focus:ring-offset-rose-900',
  success:
    'ring-green-600 dark:ring-green-600 bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-600 focus:ring-offset-green-100 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800 dark:focus:ring-green-400 dark:focus:ring-offset-green-900'
}

const closeIconKindStyle: { [index: string]: string } = {
  info: 'text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-600 focus:ring-offset-indigo-100 dark:text-indigo-200 dark:hover:bg-indigo-700 dark:focus:ring-indigo-300 dark:focus:ring-offset-indigo-900',
  warning:
    'text-amber-700 hover:bg-amber-200 focus:ring-amber-600 focus:ring-offset-amber-100 dark:text-amber-100 dark:hover:bg-amber-600 dark:focus:ring-amber-400 dark:focus:ring-offset-amber-700',
  error:
    'text-rose-700 hover:bg-rose-200 focus:ring-rose-600 focus:ring-offset-rose-100 dark:text-rose-200 dark:hover:bg-rose-700 dark:focus:ring-rose-300 dark:focus:ring-offset-rose-900',
  success:
    'text-green-700 hover:bg-green-200 focus:ring-green-600 focus:ring-offset-green-100 dark:text-green-200 dark:hover:bg-green-700 dark:focus:ring-green-300 dark:focus:ring-offset-green-900'
}
</script>

<template>
  <div :class="`rounded-md border-l-4 p-4 text-sm ${containerKindStyle[props.kind as string]}`">
    <div class="flex">
      <div class="shrink-0">
        <FontAwesomeIcon
          :class="`h-4 w-4 ${iconKindStyle[props.kind as string]}`"
          :icon="iconName[props.kind as string]"
          aria-hidden="true"
        />
      </div>
      <div class="ml-3">
        <h3
          v-if="props.title || $slots.title"
          :class="`mb-2 font-medium ${titleKindStyle[props.kind as string]}`"
        >
          <slot name="title">
            {{ props.title }}
          </slot>
        </h3>
        <div
          v-if="props.description || $slots.description"
          :class="`${descriptionKindStyle[props.kind as string]}`"
        >
          <p>
            <slot name="description">
              {{ props.description }}
            </slot>
          </p>
        </div>
        <!-- expandable details -->
        <template v-if="$slots.details">
          <button
            :class="`mt-3 -ml-2 rounded-md px-2 py-1.5 font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-hidden ${
              buttonsKindStyle[props.kind as string]
            }`"
            @click="isExpandedDetails = !isExpandedDetails"
          >
            <span>{{ showDetailsLabel }}</span>
            <FontAwesomeIcon
              :icon="isExpandedDetails ? faChevronUp : faChevronDown"
              aria-hidden="true"
              class="ml-2 h-3 w-3"
            />
          </button>
          <Transition name="slide-down">
            <div
              v-show="isExpandedDetails"
              :class="`mt-2 ${descriptionKindStyle[props.kind as string]}`"
            >
              <slot name="details" />
            </div>
          </Transition>
        </template>
        <!-- buttons -->
        <div v-if="primaryButtonLabel || secondaryButtonLabel" class="mt-4">
          <div class="-mx-2 flex">
            <button
              v-if="primaryButtonLabel"
              :class="`rounded-md px-2 py-1.5 text-sm font-medium ring-1 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-hidden ${
                buttonsKindStyle[props.kind as string]
              }`"
              type="button"
              @click="emit('primaryClick')"
            >
              {{ primaryButtonLabel }}
            </button>
            <button
              v-if="secondaryButtonLabel"
              :class="[
                `rounded-md px-2 py-1.5 text-sm font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-hidden ${
                  buttonsKindStyle[props.kind as string]
                }`,
                { 'ml-3': primaryButtonLabel }
              ]"
              type="button"
              @click="emit('secondaryClick')"
            >
              {{ secondaryButtonLabel }}
            </button>
          </div>
        </div>
      </div>
      <!-- close button -->
      <div v-if="props.showCloseButton" class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            :class="`inline-flex rounded-md p-1.5 focus:ring-2 focus:ring-offset-2 focus:outline-hidden ${
              closeIconKindStyle[props.kind as string]
            }`"
            type="button"
            @click="emit('close')"
          >
            <span class="sr-only">{{ props.closeAriaLabel }}</span>
            <FontAwesomeIcon :icon="faXmark" class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
