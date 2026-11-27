<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed } from 'vue'
import { isEqual } from 'lodash-es'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import NeBadgeV2 from './NeBadgeV2.vue'
import NeDatePicker, { type NeDatePickerPreset } from './NeDatePicker.vue'
import NeLink from './NeLink.vue'
import type { ButtonSize } from './NeButton.vue'

const sizeStyle: Record<ButtonSize, string> = {
  xs: 'rounded px-2 py-1 text-xs',
  sm: 'rounded px-2 py-1 text-sm',
  md: 'rounded-md px-2.5 py-1.5 text-sm',
  lg: 'rounded-md px-3 py-2 text-sm',
  xl: 'rounded-md px-3.5 py-2.5 text-sm'
}

const props = withDefaults(
  defineProps<{
    label: string
    id?: string
    /** The first day that can be chosen, as 'yyyy-MM-dd' */
    min?: string
    /** The last day that can be chosen, as 'yyyy-MM-dd' */
    max?: string
    /** Days that can't be chosen, besides those outside min and max */
    isDateDisabled?: (date: Date) => boolean
    /**
     * Ranges to choose with a click, such as the last 7 days, with labels translated by the
     * product. Their value is [first, last], or a function that returns it.
     */
    presets?: NeDatePickerPreset[]
    /**
     * The language of month and day names, of the date format and of the first day of the week.
     * The browser language if empty.
     */
    locale?: string
    /** First day of the week, 0 for Sunday, 1 for Monday. From the locale if not set. */
    weekStart?: number
    /** Apply the range at the second click, without Cancel and Select buttons */
    autoApply?: boolean
    size?: ButtonSize
    disabled?: boolean
    /** Show a link above the calendar to clear the range, with clearFilterLabel */
    showClearFilter?: boolean
    clearFilterLabel?: string
    cancelLabel?: string
    selectLabel?: string
    presetsLabel?: string
    previousMonthLabel?: string
    nextMonthLabel?: string
    previousYearLabel?: string
    nextYearLabel?: string
    previousYearsLabel?: string
    nextYearsLabel?: string
    chooseMonthLabel?: string
    chooseYearLabel?: string
    chooseEndDateLabel?: string
  }>(),
  {
    min: '',
    max: '',
    isDateDisabled: undefined,
    presets: () => [],
    locale: '',
    weekStart: undefined,
    autoApply: true,
    size: 'md',
    disabled: false,
    showClearFilter: true,
    clearFilterLabel: 'Clear selection',
    cancelLabel: 'Cancel',
    selectLabel: 'Select',
    presetsLabel: 'Presets',
    previousMonthLabel: 'Previous month',
    nextMonthLabel: 'Next month',
    previousYearLabel: 'Previous year',
    nextYearLabel: 'Next year',
    previousYearsLabel: 'Previous years',
    nextYearsLabel: 'Next years',
    chooseMonthLabel: 'Choose month',
    chooseYearLabel: 'Choose year',
    id: '',
    chooseEndDateLabel: 'Choose end date'
  }
)

// the range of days, as ['yyyy-MM-dd', 'yyyy-MM-dd'], or null when the filter is not set
const model = defineModel<[string, string] | null>({ default: null })

// the label of the preset that matches the range, shown in the badge instead of the dates
const presetLabel = computed(() => {
  if (!model.value) {
    return ''
  }
  const preset = props.presets.find((item) => {
    const value = typeof item.value === 'function' ? item.value() : item.value
    return isEqual(value, model.value)
  })
  return preset?.label ?? ''
})
</script>

<template>
  <NeDatePicker
    v-model="model"
    class="inline-block"
    type="date"
    range
    :label="label"
    :min="min"
    :max="max"
    :is-date-disabled="isDateDisabled"
    :presets="presets"
    :locale="locale"
    :week-start="weekStart"
    :auto-apply="autoApply"
    :disabled="disabled"
    :cancel-label="cancelLabel"
    :select-label="selectLabel"
    :presets-label="presetsLabel"
    :previous-month-label="previousMonthLabel"
    :next-month-label="nextMonthLabel"
    :previous-year-label="previousYearLabel"
    :next-year-label="nextYearLabel"
    :previous-years-label="previousYearsLabel"
    :next-years-label="nextYearsLabel"
    :choose-month-label="chooseMonthLabel"
    :choose-year-label="chooseYearLabel"
    :choose-end-date-label="chooseEndDateLabel"
  >
    <template #trigger="{ displayValue, toggle, triggerAttrs }">
      <button
        :id="id || undefined"
        type="button"
        class="focus:ring-primary-500 dark:focus:ring-primary-300 dark:focus:ring-offset-primary-950 cursor-pointer font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-colors duration-200 hover:bg-gray-200/70 hover:text-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:ring-gray-500 dark:hover:bg-gray-600/30 dark:hover:text-gray-50"
        :class="sizeStyle[size]"
        :disabled="disabled"
        v-bind="triggerAttrs"
        @click="toggle"
      >
        <span class="flex items-center justify-center">
          <span>{{ label }}</span>
          <NeBadgeV2 v-if="displayValue" size="xs" kind="indigo" class="ml-2">
            {{ presetLabel || displayValue }}
          </NeBadgeV2>
          <FontAwesomeIcon :icon="faChevronDown" class="ml-2 h-3 w-3" aria-hidden="true" />
        </span>
      </button>
    </template>
    <template v-if="showClearFilter" #popup-header="{ clear }">
      <div class="mb-3 px-2 text-sm">
        <NeLink @click="clear">{{ clearFilterLabel }}</NeLink>
      </div>
    </template>
  </NeDatePicker>
</template>
