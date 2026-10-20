<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts" generic="T extends NeCheckboxCardsOption = NeCheckboxCardsOption">
import { computed, useId, useTemplateRef } from 'vue'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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

export type NeCheckboxCardsOption = {
  id: string
  label: string
  description?: string
  icon?: IconDefinition
  // URL of an image shown before the label (e.g. an application logo, an SVG
  // data URL). When set it replaces the icon, which is limited to FontAwesome.
  image?: string
  disabled?: boolean
}

export type NeCheckboxCardsSize = SelectionCardSize

const {
  options,
  label = '',
  name = '',
  gridStyle = 'grid-cols-3 gap-3',
  disabled = false,
  size = 'md',
  invalidMessage = ''
} = defineProps<{
  options: T[]
  label?: string
  // name of checkbox group
  name?: string
  gridStyle?: string
  disabled?: boolean
  size?: NeCheckboxCardsSize
  invalidMessage?: string
}>()

defineSlots<{
  label?: () => unknown
  tooltip?: () => unknown
  option?: (props: { option: T; checked: boolean }) => unknown
}>()

const model = defineModel<string[]>({ default: () => [] })

defineExpose({
  focus
})

const generatedId = useId()
const groupName = computed(() => name || generatedId)
const labelId = `${generatedId}-label`
const invalidMessageId = `${generatedId}-invalid-message`

const inputs = useTemplateRef<HTMLInputElement[]>('inputs')

function isChecked(option: T) {
  return model.value.includes(option.id)
}

function isDisabled(option: T) {
  return disabled || !!option.disabled
}

function focus() {
  inputs.value?.find((input) => !input.disabled)?.focus()
}
</script>

<template>
  <div class="text-sm">
    <NeFormItemLabel v-if="label || $slots.label" :id="labelId">
      <slot name="label">
        {{ label }}
      </slot>
      <span v-if="$slots.tooltip" class="ml-1">
        <slot name="tooltip"></slot>
      </span>
    </NeFormItemLabel>
    <!-- labelled by the visible label, so that the label slot names the group too -->
    <fieldset
      :disabled="disabled"
      :aria-labelledby="label || $slots.label ? labelId : undefined"
      :aria-describedby="invalidMessage ? invalidMessageId : undefined"
    >
      <div :class="gridStyle" class="grid">
        <label
          v-for="option in options"
          :key="option.id"
          :class="[
            selectionCardClasses[size],
            isChecked(option) ? 'ring-primary-700 dark:ring-primary-500 ring-2' : '',
            isDisabled(option)
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
          ]"
          class="has-focus-visible:ring-primary-700 dark:has-focus-visible:ring-primary-500 dark:has-focus-visible:ring-offset-primary-950 relative flex w-full items-center overflow-hidden rounded-md border bg-white text-gray-700 shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-white dark:border-gray-500 dark:bg-gray-950 dark:text-gray-50"
        >
          <span
            v-if="option.image || option.icon"
            :class="selectionCardMediaClasses[size]"
            class="flex shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            <img v-if="option.image" :src="option.image" alt="" class="size-full object-contain" />
            <FontAwesomeIcon
              v-else-if="option.icon"
              :icon="option.icon"
              :class="selectionCardIconClasses[size]"
            />
          </span>
          <div :class="['text-left', selectionCardTextClasses[size], selectionCardMarkSpaceClass]">
            <!-- custom content, standard label and description by default -->
            <slot name="option" :option="option" :checked="isChecked(option)">
              <p class="font-medium">
                {{ option.label }}
              </p>
              <p v-if="option.description">{{ option.description }}</p>
            </slot>
          </div>
          <!-- top-right selection mark -->
          <input
            ref="inputs"
            v-model="model"
            :name="groupName"
            :value="option.id"
            :disabled="isDisabled(option)"
            type="checkbox"
            :class="selectionCardMarkClasses[size]"
            class="text-primary-700 dark:text-primary-500 checked:dark:bg-primary-500 absolute rounded border-gray-300 focus:ring-0 focus:ring-offset-0 focus:outline-hidden disabled:cursor-not-allowed dark:border-gray-500 dark:bg-gray-950"
          />
        </label>
      </div>
    </fieldset>
    <!-- invalid message -->
    <p
      v-if="invalidMessage"
      :id="invalidMessageId"
      class="mt-2 text-sm text-rose-700 dark:text-rose-400"
    >
      {{ invalidMessage }}
    </p>
  </div>
</template>
