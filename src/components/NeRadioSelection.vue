<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { type PropType, type Ref, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import NeFormItemLabel from '@/components/NeFormItemLabel.vue'

export type RadioCardSize = 'md' | 'lg' | 'xl'

type RadioOption = {
  id: string
  label: string
  description?: string
  icon?: string
  iconStyle?: string
  disabled?: boolean
}

const props = defineProps({
  modelValue: {
    type: String
  },
  label: {
    required: true,
    type: String
  },
  description: {
    required: false,
    type: String
  },
  options: {
    required: true,
    type: Array<RadioOption>
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
  }
})

const emit = defineEmits(['update:modelValue'])

// expose focus function
defineExpose({
  focus
})

library.add(faCircleCheck)

const value: Ref<any> = ref(props.modelValue ?? '')

const inputRef = ref()

const cardClasses: Record<RadioCardSize, string> = {
  md: 'px-4 py-2',
  lg: 'px-5 py-4',
  xl: 'px-6 py-5'
}

const iconClasses: Record<RadioCardSize, string> = {
  md: 'h-7 w-7 pr-4',
  lg: 'h-10 w-10 pr-5',
  xl: 'h-12 w-12 pr-6'
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
  <div>
    <div class="mb-2 text-sm">
      <NeFormItemLabel class="mb-0">
        {{ label }}
        <span v-if="$slots.tooltip" class="ml-1">
          <slot name="tooltip"></slot>
        </span>
      </NeFormItemLabel>
      <p v-if="description" class="text-gray-500 dark:text-gray-400">{{ description }}</p>
    </div>
    <div v-if="card" :class="gridStyle" class="grid">
      <button
        v-for="option in options"
        :key="option.id"
        ref="inputRef"
        type="button"
        :class="[
          `${cardClasses[cardSize]}`,
          value == option.id ? 'ring-2 ring-primary-700 dark:ring-primary-500' : ''
        ]"
        class="relative flex w-full items-center overflow-hidden rounded-md border text-gray-700 shadow-sm hover:bg-gray-200/70 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-500 dark:text-gray-50 dark:hover:bg-gray-600/30 dark:focus:ring-primary-500 dark:focus:ring-offset-primary-950"
        role="button"
        :disabled="option.disabled || disabled"
        @click="value = option.id"
      >
        <FontAwesomeIcon
          v-if="option.icon"
          :icon="[option.iconStyle ?? 'fas', option.icon]"
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
          :icon="['fas', 'circle-check']"
          :class="`absolute text-primary-700 dark:text-primary-500 ${selectionMarkClasses[cardSize]}`"
        />
      </button>
    </div>
    <template v-else>
      <fieldset>
        <legend class="sr-only">{{ label }}</legend>
        <div class="space-y-3">
          <div v-for="option in options" :key="option.id" class="flex items-center">
            <input
              :id="option.id"
              ref="inputRef"
              v-model="value"
              :checked="value == option.id"
              :value="option.id"
              class="peer border-gray-300 text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:text-primary-500 checked:dark:bg-primary-500 dark:focus:ring-primary-300 focus:dark:ring-primary-200 focus:dark:ring-offset-gray-900"
              type="radio"
              :disabled="option.disabled || disabled"
            />
            <label
              :for="option.id"
              :disabled="option.disabled"
              class="ml-2 text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:text-gray-50"
            >
              {{ option.label }}
            </label>
          </div>
        </div>
      </fieldset>
    </template>
  </div>
</template>
