//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { addDays, format, startOfMonth } from 'date-fns'

import { NeDateRangeFilter, type NeDatePickerPreset } from '../src/main'

const iso = (date: Date) => format(date, 'yyyy-MM-dd')

const presets: NeDatePickerPreset[] = [
  { label: 'Today', value: () => [iso(new Date()), iso(new Date())] },
  { label: 'Last 7 days', value: () => [iso(addDays(new Date(), -6)), iso(new Date())] },
  { label: 'Last 30 days', value: () => [iso(addDays(new Date(), -29)), iso(new Date())] },
  { label: 'This month', value: () => [iso(startOfMonth(new Date())), iso(new Date())] }
]

const meta = {
  title: 'Components/NeDateRangeFilter',
  component: NeDateRangeFilter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "A filter button that opens a calendar to choose a range of days, for the filters above a table or a list, next to NeDropdownFilterV2. The value is `['yyyy-MM-dd', 'yyyy-MM-dd']`, the first and the last day, or `null` when the filter is not set. The button shows the range, or the label of the preset that matches it. `presets` adds ranges to choose with a click, such as `Last 7 days`, with labels translated by the product: the library has none. A click on the second day applies the range; with `autoApply` off, the calendar has Cancel and Select buttons. The popup has a button to clear the range: `clearFilterLabel` is `Clear selection`, or `Reset selection` when the filter has a default range. For a day, or a range in a form with a label, use NeDatePicker. Its texts follow [Table filters](https://nethesis.github.io/nebula-design-system/?page=writing-guidelines#table-filters) in the writing guidelines."
      }
    }
  },
  // default values
  args: {
    label: 'Date range',
    modelValue: null,
    min: '',
    max: '',
    isDateDisabled: undefined,
    presets: [],
    locale: 'en',
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
    chooseYearLabel: 'Choose year'
  }
} satisfies Meta<typeof NeDateRangeFilter>

export default meta
type Story = StoryObj<typeof meta>

// keep the value in the story, so that the chosen range is shown
const render: Story['render'] = (args) => ({
  components: { NeDateRangeFilter },
  setup() {
    const value = ref(args.modelValue)
    watch(
      () => args.modelValue,
      (newValue) => {
        value.value = newValue
      }
    )
    return { args, value }
  },
  template: '<NeDateRangeFilter v-bind="args" v-model="value" />'
})

export const Default: Story = {
  render,
  args: {}
}

export const WithValue: Story = {
  render,
  args: { modelValue: ['2026-11-10', '2026-11-18'] }
}

export const Presets: Story = {
  render,
  args: { presets, max: iso(new Date()) }
}

export const CancelAndSelect: Story = {
  render,
  args: { autoApply: false }
}

export const Small: Story = {
  render,
  args: { size: 'sm' }
}

export const Disabled: Story = {
  render,
  args: { disabled: true }
}
