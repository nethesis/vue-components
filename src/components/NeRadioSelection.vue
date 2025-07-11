<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts">
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export type RadioOption = {
  id: string
  label: string
  description?: string
  icon?: IconDefinition
  disabled?: boolean
}
</script>

<script lang="ts" setup generic="T extends RadioOption">
import { computed, type PropType, type Ref, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import NeFormItemLabel from './NeFormItemLabel.vue'
import { v4 as uuidv4 } from 'uuid'

export type RadioCardSize = 'md' | 'lg' | 'xl'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  // name of radio button group
  name: {
    type: String,
    default: ''
  },
  options: {
    required: true,
    type: Array<T>
  },
  card: {
    type: Boolean,
    default: false
  },
  gridStyle: {
    type: String,
    default: 'grid-cols-3 gap-3'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  cardSize: {
    type: String as PropType<RadioCardSize>,
    default: 'md'
  },
  cardSelectionMark: {
    type: Boolean,
    default: true
  },
  invalidMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// expose focus function
defineExpose({
  focus
})

const value: Ref<any> = ref(props.modelValue ?? '')

const inputRef = ref()

const cardClasses: Record<RadioCardSize, string> = {
  md: 'px-4 py-2',
  lg: 'px-5 py-4',
  xl: 'px-6 py-5'
}

const iconClasses: Record<RadioCardSize, string> = {
  md: 'h-7 w-7 pr-2',
  lg: 'h-10 w-10 pr-3',
  xl: 'h-12 w-12 pr-5'
}

const textClasses: Record<RadioCardSize, string> = {
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-base'
}

const selectionMarkClasses: Record<RadioCardSize, string> = {
  md: 'right-2 top-2 h-4 w-4',
  lg: 'right-3 top-3 h-4 w-4',
  xl: 'right-3 top-3 h-5 w-5'
}

const radioName = computed(() => (props.name ? props.name : uuidv4()))

watch(value, (newValue) => emit('update:modelValue', newValue))

watch(
  () => props.modelValue,
  () => {
    value.value = props.modelValue
  }
)

function focus() {
  inputRef.value[0].focus()
}
</script>

<template>
  <div class="text-sm">
    <div class="mb-2">
      <NeFormItemLabel v-if="props.label || $slots.label" class="mb-0">
        <slot name="label">
          {{ label }}
        </slot>
        <span v-if="$slots.tooltip" class="ml-1">
          <slot name="tooltip"></slot>
        </span>
      </NeFormItemLabel>
      <p v-if="description" class="text-gray-500 dark:text-gray-400">{{ description }}</p>
    </div>
    <div v-if="card" :class="gridStyle" class="grid">
      <!-- card layout -->
      <button
        v-for="option in options"
        :key="option.id"
        ref="inputRef"
        type="button"
        :class="[
          `${cardClasses[cardSize]}`,
          value == option.id ? 'ring-primary-700 dark:ring-primary-500 ring-2' : ''
        ]"
        class="focus:ring-primary-700 dark:focus:ring-primary-500 dark:focus:ring-offset-primary-950 relative flex w-full items-center overflow-hidden rounded-md border text-gray-700 shadow-sm hover:bg-gray-200/70 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-500 dark:text-gray-50 dark:hover:bg-gray-600/30"
        role="button"
        :disabled="option.disabled || disabled"
        @click="value = option.id"
      >
        <FontAwesomeIcon
          v-if="option.icon"
          :icon="option.icon"
          :class="`${iconClasses[cardSize]}`"
        />
        <!-- custom content -->
        <template v-if="$slots.option">
          <slot :option="option" name="option" />
        </template>
        <!-- standard label and description -->
        <div v-else :class="`text-left ${textClasses[cardSize]}`">
          <p class="font-medium">
            {{ option.label }}
          </p>
          <p v-if="option.description != undefined">{{ option.description }}</p>
        </div>
        <!-- top-right selection icon -->
        <FontAwesomeIcon
          v-if="value == option.id && cardSelectionMark"
          :icon="faCircleCheck"
          :class="`text-primary-700 dark:text-primary-500 absolute ${selectionMarkClasses[cardSize]}`"
        />
      </button>
    </div>
    <template v-else>
      <!-- standard layout -->
      <fieldset>
        <legend class="sr-only">{{ label }}</legend>
        <div class="space-y-3">
          <div v-for="option in options" :key="option.id" class="flex items-center">
            <input
              :id="`${radioName}-${option.id}`"
              ref="inputRef"
              v-model="value"
              :name="radioName"
              :checked="value == option.id"
              :value="option.id"
              class="peer text-primary-700 focus:ring-primary-500 dark:text-primary-500 checked:dark:bg-primary-500 dark:focus:ring-primary-300 focus:dark:ring-primary-200 border-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 focus:dark:ring-offset-gray-900"
              type="radio"
              :disabled="option.disabled || disabled"
            />
            <label
              :for="`${radioName}-${option.id}`"
              :disabled="option.disabled"
              class="ms-2 text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:text-gray-50"
            >
              <div>{{ option.label }}</div>
              <div v-if="option.description" class="text-gray-500 dark:text-gray-400">
                {{ option.description }}
              </div>
            </label>
          </div>
        </div>
      </fieldset>
    </template>
    <!-- invalid message -->
    <p v-if="invalidMessage" class="mt-2 text-sm text-rose-700 dark:text-rose-400">
      {{ invalidMessage }}
    </p>
  </div>
</template>
