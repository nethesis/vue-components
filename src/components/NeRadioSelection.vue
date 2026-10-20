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
  // URL of an image shown before the label in the card layout (e.g. an application logo, an SVG
  // data URL). When set it replaces the icon, which is limited to FontAwesome.
  image?: string
  disabled?: boolean
}
</script>

<script lang="ts" setup generic="T extends RadioOption">
import { computed, type PropType, type Ref, ref, useId, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import NeFormItemLabel from './NeFormItemLabel.vue'
import {
  selectionCardClasses,
  selectionCardIconClasses,
  selectionCardMarkClasses,
  selectionCardMarkSpaceClass,
  selectionCardMediaClasses,
  selectionCardTextClasses,
  type SelectionCardSize
} from '../lib/selectionCards'

export type RadioCardSize = SelectionCardSize

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

const generatedName = useId()
const radioName = computed(() => (props.name ? props.name : generatedName))
const labelId = `${generatedName}-label`

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
      <NeFormItemLabel v-if="props.label || $slots.label" :id="labelId" class="mb-0">
        <slot name="label">
          {{ label }}
        </slot>
        <span v-if="$slots.tooltip" class="ml-1">
          <slot name="tooltip"></slot>
        </span>
      </NeFormItemLabel>
      <p v-if="description" class="text-gray-500 dark:text-gray-400">{{ description }}</p>
    </div>
    <!-- card layout: each card is a label wrapping a visually hidden native radio, so that arrow
    keys, the checked state and the radio role work as in the standard layout -->
    <!-- labelled by the visible label, so that the label slot names the group too -->
    <fieldset v-if="card" :aria-labelledby="props.label || $slots.label ? labelId : undefined">
      <div :class="gridStyle" class="grid">
        <label
          v-for="option in options"
          :key="option.id"
          :class="[
            selectionCardClasses[cardSize],
            value == option.id ? 'ring-primary-700 dark:ring-primary-500 ring-2' : '',
            option.disabled || disabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
          ]"
          class="has-focus-visible:ring-primary-700 dark:has-focus-visible:ring-primary-500 dark:has-focus-visible:ring-offset-primary-950 relative flex w-full items-center overflow-hidden rounded-md border bg-white text-gray-700 shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-white dark:border-gray-500 dark:bg-gray-950 dark:text-gray-50"
        >
          <input
            ref="inputRef"
            v-model="value"
            type="radio"
            :name="radioName"
            :value="option.id"
            :disabled="option.disabled || disabled"
            class="sr-only"
          />
          <span
            v-if="option.image || option.icon"
            :class="selectionCardMediaClasses[cardSize]"
            class="flex shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            <img v-if="option.image" :src="option.image" alt="" class="size-full object-contain" />
            <FontAwesomeIcon
              v-else-if="option.icon"
              :icon="option.icon"
              :class="selectionCardIconClasses[cardSize]"
            />
          </span>
          <!-- custom content, padded like the standard one so that it doesn't overlap the mark -->
          <span v-if="$slots.option" :class="cardSelectionMark ? selectionCardMarkSpaceClass : ''">
            <slot :option="option" name="option" />
          </span>
          <!-- standard label and description (spans, since a label only allows phrasing content) -->
          <span
            v-else
            :class="[
              'text-left',
              selectionCardTextClasses[cardSize],
              cardSelectionMark ? selectionCardMarkSpaceClass : ''
            ]"
          >
            <span class="block font-medium">
              {{ option.label }}
            </span>
            <span v-if="option.description != undefined" class="block">{{
              option.description
            }}</span>
          </span>
          <!-- top-right selection icon -->
          <FontAwesomeIcon
            v-if="value == option.id && cardSelectionMark"
            :icon="faCircleCheck"
            :class="selectionCardMarkClasses[cardSize]"
            class="text-primary-700 dark:text-primary-500 absolute"
            aria-hidden="true"
          />
        </label>
      </div>
    </fieldset>
    <template v-else>
      <!-- standard layout -->
      <fieldset :aria-labelledby="props.label || $slots.label ? labelId : undefined">
        <div class="space-y-3">
          <div v-for="option in options" :key="option.id" class="flex items-center">
            <input
              :id="`${radioName}-${option.id}`"
              ref="inputRef"
              v-model="value"
              :name="radioName"
              :checked="value == option.id"
              :value="option.id"
              class="peer text-primary-700 focus:ring-primary-500 dark:text-primary-500 checked:dark:bg-primary-500 focus:dark:ring-primary-200 border-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 focus:dark:ring-offset-gray-900"
              type="radio"
              :disabled="option.disabled || disabled"
            />
            <label
              :for="`${radioName}-${option.id}`"
              :disabled="option.disabled"
              class="ms-2 text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:text-gray-50"
            >
              <span class="block">{{ option.label }}</span>
              <span v-if="option.description" class="block text-gray-500 dark:text-gray-400">
                {{ option.description }}
              </span>
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
