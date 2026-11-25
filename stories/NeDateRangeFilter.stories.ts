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
          "A filter button that opens a calendar to choose a range of days, for the filters above a table or a list, next to NeDropdownFilterV2. The value is `['yyyy-MM-dd', 'yyyy-MM-dd']`, or `null` when the filter is not set. The button shows the range, or the label of the matching preset. For a day, or a range in a form, use NeDatePicker. Its texts follow [Table filters](https://nethesis.github.io/nebula-design-system/?page=writing-guidelines#table-filters) in the writing guidelines."
      }
    }
  },
  // default values
  args: {
    label: 'Date range',
    id: '',
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
    chooseYearLabel: 'Choose year',
    chooseEndDateLabel: 'Choose end date'
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
