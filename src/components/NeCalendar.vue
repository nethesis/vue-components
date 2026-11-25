<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<!--
  The calendar shown by NeDatePicker: a grid of days, with views to choose the month and the year.
  Keyboard support follows the date picker dialog of the WAI-ARIA Authoring Practices.
-->

<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import {
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isSameDay,
  isSameMonth,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  type Day
} from 'date-fns'
import { capitalizeFirst } from '../lib/utils'
import { formatIsoDate, isDaySelectable, parseIsoDate } from '../lib/calendar'

type CalendarView = 'days' | 'months' | 'years'

const YEARS_PER_PAGE = 12

const props = withDefaults(
  defineProps<{
    // the selected day, as 'yyyy-MM-dd'; the first day with range
    modelValue?: string
    // show a range of days, from modelValue to rangeEnd
    range?: boolean
    // the last day of the range, as 'yyyy-MM-dd'; while it is empty, the range follows the day
    // under the pointer or with the focus
    rangeEnd?: string
    min?: string
    max?: string
    isDateDisabled?: (date: Date) => boolean
    // a locale supported by Intl, undefined for the browser language
    locale?: string
    // 0 is Sunday, 1 is Monday
    weekStart?: number
    previousMonthLabel?: string
    nextMonthLabel?: string
    previousYearLabel?: string
    nextYearLabel?: string
    previousYearsLabel?: string
    nextYearsLabel?: string
    chooseMonthLabel?: string
    chooseYearLabel?: string
    // announced after the first day of a range is chosen
    chooseEndDateLabel?: string
    // today, as 'yyyy-MM-dd', in the time zone of the picker; today in the browser if empty
    today?: string
  }>(),
  {
    modelValue: '',
    range: false,
    rangeEnd: '',
    min: '',
    max: '',
    isDateDisabled: undefined,
    locale: undefined,
    weekStart: 1,
    previousMonthLabel: 'Previous month',
    nextMonthLabel: 'Next month',
    previousYearLabel: 'Previous year',
    nextYearLabel: 'Next year',
    previousYearsLabel: 'Previous years',
    nextYearsLabel: 'Next years',
    chooseMonthLabel: 'Choose month',
    chooseYearLabel: 'Choose year',
    chooseEndDateLabel: 'Choose end date',
    today: ''
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineExpose({
  focus
})

const componentId = useId()
const view = ref<CalendarView>('days')
// the day that has the keyboard focus in the grid, which also sets the month shown
const activeDate = ref<Date>(getInitialActiveDate())
const calendarRef = ref<HTMLElement>()

const minDate = computed(() => parseIsoDate(props.min))
const maxDate = computed(() => parseIsoDate(props.max))
const selectedDate = computed(() => parseIsoDate(props.modelValue))
const rangeEndDate = computed(() => (props.range ? parseIsoDate(props.rangeEnd) : null))
// the last day of the range while it is being chosen
const previewDate = ref<Date | null>(null)

// the range shown, first day first: the chosen one, or the one being chosen
const shownRange = computed((): [Date, Date] | null => {
  const start = selectedDate.value
  const end = rangeEndDate.value ?? previewDate.value
  if (!props.range || !start || !end) {
    return null
  }
  return end < start ? [end, start] : [start, end]
})

const isChoosingRangeEnd = computed(
  () => props.range && !!selectedDate.value && !rangeEndDate.value
)

// show the month of a day set from outside, such as a preset
watch(
  () => props.modelValue,
  () => {
    const date = parseIsoDate(props.modelValue)
    if (date && !isSameMonth(date, activeDate.value)) {
      activeDate.value = date
    }
    previewDate.value = null
  }
)

const weekStartsOn = computed(() => (((props.weekStart % 7) + 7) % 7) as Day)

const monthLabel = computed(() =>
  capitalizeFirst(new Intl.DateTimeFormat(props.locale, { month: 'long' }).format(activeDate.value))
)

const yearLabel = computed(() => String(activeDate.value.getFullYear()))

// month and year in the order of the locale: November 2026, 2026년 11월
const monthYearLabel = computed(() =>
  capitalizeFirst(
    new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric' }).format(
      activeDate.value
    )
  )
)

const firstYearOfPage = computed(
  () => Math.floor(activeDate.value.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE
)

// announced by screen readers when the month, the year or the view changes
const liveText = computed(() => {
  switch (view.value) {
    case 'months':
      return yearLabel.value
    case 'years':
      return `${firstYearOfPage.value} – ${firstYearOfPage.value + YEARS_PER_PAGE - 1}`
    default:
      return monthYearLabel.value
  }
})

const weekdays = computed(() => {
  const firstDay = startOfWeek(new Date(), { weekStartsOn: weekStartsOn.value })
  const shortFormat = new Intl.DateTimeFormat(props.locale, { weekday: 'short' })
  const longFormat = new Intl.DateTimeFormat(props.locale, { weekday: 'long' })

  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(firstDay, index)
    return {
      short: capitalizeFirst(shortFormat.format(day)),
      long: capitalizeFirst(longFormat.format(day))
    }
  })
})

// six weeks, so that the calendar keeps its height; days of other months are empty cells
const weeks = computed(() => {
  const firstDay = startOfWeek(startOfMonth(activeDate.value), {
    weekStartsOn: weekStartsOn.value
  })

  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, weekday) => {
      const day = addDays(firstDay, week * 7 + weekday)
      return isSameMonth(day, activeDate.value) ? day : null
    })
  )
})

const months = computed(() => {
  const monthFormat = new Intl.DateTimeFormat(props.locale, { month: 'short' })

  return Array.from({ length: 12 }, (_, index) => {
    const month = setMonth(startOfMonth(activeDate.value), index)
    return {
      index,
      label: capitalizeFirst(monthFormat.format(month)),
      disabled: !isPeriodInRange(month, endOfMonth(month)),
      selected: !!selectedDate.value && isSameMonth(month, selectedDate.value)
    }
  })
})

const years = computed(() =>
  Array.from({ length: YEARS_PER_PAGE }, (_, index) => {
    const year = firstYearOfPage.value + index
    const date = new Date(year, 0, 1)
    return {
      year,
      disabled: !isPeriodInRange(startOfYear(date), endOfYear(date)),
      selected: selectedDate.value?.getFullYear() === year
    }
  })
)

// months and years in rows of three, as the grid shows them
const monthRows = computed(() => toRows(months.value))
const yearRows = computed(() => toRows(years.value))

function toRows<T>(items: T[]): T[][] {
  return Array.from({ length: Math.ceil(items.length / 3) }, (_, row) =>
    items.slice(row * 3, row * 3 + 3)
  )
}

const isPreviousDisabled = computed(() => {
  if (!minDate.value) {
    return false
  }
  switch (view.value) {
    case 'months':
      return activeDate.value.getFullYear() <= minDate.value.getFullYear()
    case 'years':
      return firstYearOfPage.value <= minDate.value.getFullYear()
    default:
      return startOfMonth(activeDate.value) <= minDate.value
  }
})

const isNextDisabled = computed(() => {
  if (!maxDate.value) {
    return false
  }
  switch (view.value) {
    case 'months':
      return activeDate.value.getFullYear() >= maxDate.value.getFullYear()
    case 'years':
      return firstYearOfPage.value + YEARS_PER_PAGE - 1 >= maxDate.value.getFullYear()
    default:
      return endOfMonth(activeDate.value) >= maxDate.value
  }
})

const previousLabel = computed(() => {
  switch (view.value) {
    case 'months':
      return props.previousYearLabel
    case 'years':
      return props.previousYearsLabel
    default:
      return props.previousMonthLabel
  }
})

const nextLabel = computed(() => {
  switch (view.value) {
    case 'months':
      return props.nextYearLabel
    case 'years':
      return props.nextYearsLabel
    default:
      return props.nextMonthLabel
  }
})

const focusRingStyle =
  'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-primary-300 dark:focus-visible:ring-offset-gray-950'

const navButtonStyle = `flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-700 transition-colors duration-200 hover:bg-gray-200/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent dark:text-gray-200 dark:hover:bg-gray-600/30 ${focusRingStyle}`

const headerButtonStyle = `cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-gray-900 transition-colors duration-200 hover:bg-gray-200/70 dark:text-gray-50 dark:hover:bg-gray-600/30 ${focusRingStyle}`

const cellBaseStyle = `flex items-center justify-center rounded-md border text-sm transition-colors duration-200 ${focusRingStyle}`

function getInitialActiveDate(): Date {
  const selected = parseIsoDate(props.modelValue)
  if (selected) {
    return selected
  }
  // today, moved within min and max
  const today = getToday()
  const min = parseIsoDate(props.min)
  const max = parseIsoDate(props.max)
  if (min && today < min) {
    return min
  }
  if (max && today > max) {
    return max
  }
  return today
}

// true if at least a day of the period is within min and max
function isPeriodInRange(start: Date, end: Date): boolean {
  return (!minDate.value || end >= minDate.value) && (!maxDate.value || start <= maxDate.value)
}

function getToday(): Date {
  return parseIsoDate(props.today) ?? startOfDay(new Date())
}

function isToday(day: Date): boolean {
  return isSameDay(day, getToday())
}

function isSelectable(day: Date): boolean {
  return isDaySelectable(day, props.min, props.max, props.isDateDisabled)
}

// the chosen day, or the first or the last day of the chosen range
function isDaySelected(day: Date): boolean {
  return (
    (!!selectedDate.value && isSameDay(day, selectedDate.value)) ||
    (!!rangeEndDate.value && isSameDay(day, rangeEndDate.value))
  )
}

function isRangeEdge(day: Date): boolean {
  const range = shownRange.value
  return !!range && (isSameDay(day, range[0]) || isSameDay(day, range[1]))
}

function isInRange(day: Date): boolean {
  const range = shownRange.value
  return !!range && day > range[0] && day < range[1]
}

function onDayHover(day: Date) {
  if (isChoosingRangeEnd.value) {
    previewDate.value = day
  }
}

function getDayStyle(day: Date): string {
  const isSelected = isDaySelected(day) || isRangeEdge(day)
  const styles = [cellBaseStyle, 'size-9']

  if (isSelected) {
    styles.push(
      'border-transparent bg-primary-700 font-medium text-white hover:bg-primary-800 dark:bg-primary-500 dark:text-gray-950 dark:hover:bg-primary-300'
    )
  } else if (isInRange(day)) {
    styles.push(
      'border-transparent bg-primary-100 text-gray-900 dark:bg-primary-900 dark:text-gray-50'
    )
  } else if (isToday(day)) {
    styles.push(
      'border-primary-700 font-medium text-primary-700 dark:border-primary-500 dark:text-primary-500'
    )
  } else {
    styles.push('border-transparent text-gray-900 dark:text-gray-50')
  }

  if (isSelectable(day)) {
    styles.push('cursor-pointer')
    if (!isSelected) {
      styles.push('hover:bg-gray-200/70 dark:hover:bg-gray-600/30')
    }
  } else {
    styles.push('cursor-not-allowed opacity-50')
  }
  return styles.join(' ')
}

function getOptionStyle(selected: boolean, disabled: boolean): string {
  const styles = [cellBaseStyle, 'h-full w-full']

  if (selected) {
    styles.push(
      'border-transparent bg-primary-700 font-medium text-white hover:bg-primary-800 dark:bg-primary-500 dark:text-gray-950 dark:hover:bg-primary-300'
    )
  } else {
    styles.push('border-transparent text-gray-900 dark:text-gray-50')
  }

  if (disabled) {
    styles.push('cursor-not-allowed opacity-50')
  } else {
    styles.push('cursor-pointer')
    if (!selected) {
      styles.push('hover:bg-gray-200/70 dark:hover:bg-gray-600/30')
    }
  }
  return styles.join(' ')
}

function getDayLabel(day: Date): string {
  return capitalizeFirst(
    new Intl.DateTimeFormat(props.locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(day)
  )
}

function focusActiveElement() {
  calendarRef.value?.querySelector<HTMLElement>('[data-active="true"]')?.focus()
}

// focus the active day, month or year
async function focus() {
  await nextTick()
  focusActiveElement()
}

async function moveActiveDate(date: Date) {
  activeDate.value = startOfDay(date)
  onDayHover(activeDate.value)
  await focus()
}

// a previous or next button disabled at min or max loses the focus: it moves to the active day
async function keepFocus() {
  await nextTick()
  const element = document.activeElement as HTMLButtonElement | null
  if (!element || element === document.body || element.disabled) {
    focusActiveElement()
  }
}

function goToPrevious() {
  switch (view.value) {
    case 'months':
      activeDate.value = addYears(activeDate.value, -1)
      break
    case 'years':
      activeDate.value = addYears(activeDate.value, -YEARS_PER_PAGE)
      break
    default:
      activeDate.value = addMonths(activeDate.value, -1)
  }
  keepFocus()
}

function goToNext() {
  switch (view.value) {
    case 'months':
      activeDate.value = addYears(activeDate.value, 1)
      break
    case 'years':
      activeDate.value = addYears(activeDate.value, YEARS_PER_PAGE)
      break
    default:
      activeDate.value = addMonths(activeDate.value, 1)
  }
  keepFocus()
}

async function showView(newView: CalendarView) {
  view.value = newView
  await focus()
}

function selectDay(day: Date) {
  activeDate.value = day
  if (isSelectable(day)) {
    emit('update:modelValue', formatIsoDate(day))
  }
}

function selectMonth(monthIndex: number) {
  activeDate.value = setMonth(activeDate.value, monthIndex)
  showView('days')
}

function selectYear(year: number) {
  activeDate.value = setYear(activeDate.value, year)
  showView('months')
}

function onDayKeydown(event: KeyboardEvent) {
  const day = activeDate.value
  let nextDay: Date

  switch (event.key) {
    case 'ArrowLeft':
      nextDay = addDays(day, -1)
      break
    case 'ArrowRight':
      nextDay = addDays(day, 1)
      break
    case 'ArrowUp':
      nextDay = addDays(day, -7)
      break
    case 'ArrowDown':
      nextDay = addDays(day, 7)
      break
    case 'Home':
      nextDay = startOfWeek(day, { weekStartsOn: weekStartsOn.value })
      break
    case 'End':
      nextDay = startOfDay(endOfWeek(day, { weekStartsOn: weekStartsOn.value }))
      break
    case 'PageUp':
      nextDay = event.shiftKey ? addYears(day, -1) : addMonths(day, -1)
      break
    case 'PageDown':
      nextDay = event.shiftKey ? addYears(day, 1) : addMonths(day, 1)
      break
    default:
      return
  }
  event.preventDefault()
  moveActiveDate(nextDay)
}

// arrows move by one, up and down by a row of three
function onOptionKeydown(event: KeyboardEvent) {
  const isMonths = view.value === 'months'
  const step = (amount: number) =>
    isMonths ? addMonths(activeDate.value, amount) : addYears(activeDate.value, amount)
  let nextDate: Date

  switch (event.key) {
    case 'ArrowLeft':
      nextDate = step(-1)
      break
    case 'ArrowRight':
      nextDate = step(1)
      break
    case 'ArrowUp':
      nextDate = step(-3)
      break
    case 'ArrowDown':
      nextDate = step(3)
      break
    case 'Home':
      nextDate = isMonths
        ? setMonth(activeDate.value, 0)
        : setYear(activeDate.value, firstYearOfPage.value)
      break
    case 'End':
      nextDate = isMonths
        ? setMonth(activeDate.value, 11)
        : setYear(activeDate.value, firstYearOfPage.value + YEARS_PER_PAGE - 1)
      break
    case 'PageUp':
      nextDate = isMonths ? addYears(activeDate.value, -1) : step(-YEARS_PER_PAGE)
      break
    case 'PageDown':
      nextDate = isMonths ? addYears(activeDate.value, 1) : step(YEARS_PER_PAGE)
      break
    default:
      return
  }
  event.preventDefault()
  // stay within the year in the months view
  if (isMonths && nextDate.getFullYear() !== activeDate.value.getFullYear()) {
    if (event.key !== 'PageUp' && event.key !== 'PageDown') {
      return
    }
  }
  moveActiveDate(nextDate)
}

// escape goes back from the months and years views to the days, instead of closing the picker
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && view.value !== 'days') {
    event.stopPropagation()
    event.preventDefault()
    showView('days')
  }
}
</script>

<template>
  <div ref="calendarRef" class="w-68 text-sm" @keydown="onKeydown">
    <!-- header -->
    <div class="mb-2 flex items-center justify-between gap-2">
      <button
        type="button"
        :class="navButtonStyle"
        :aria-label="previousLabel"
        :disabled="isPreviousDisabled"
        @click="goToPrevious"
      >
        <FontAwesomeIcon :icon="faChevronLeft" class="size-3.5" aria-hidden="true" />
      </button>
      <div class="flex items-center gap-1">
        <button
          v-if="view === 'days'"
          type="button"
          :class="headerButtonStyle"
          :aria-label="`${monthLabel}, ${chooseMonthLabel}`"
          @click="showView('months')"
        >
          {{ monthLabel }}
        </button>
        <button
          v-if="view !== 'years'"
          type="button"
          :class="headerButtonStyle"
          :aria-label="`${yearLabel}, ${chooseYearLabel}`"
          @click="showView('years')"
        >
          {{ yearLabel }}
        </button>
        <span v-else class="px-2 py-1 font-medium text-gray-900 dark:text-gray-50">
          {{ firstYearOfPage }} – {{ firstYearOfPage + YEARS_PER_PAGE - 1 }}
        </span>
      </div>
      <button
        type="button"
        :class="navButtonStyle"
        :aria-label="nextLabel"
        :disabled="isNextDisabled"
        @click="goToNext"
      >
        <FontAwesomeIcon :icon="faChevronRight" class="size-3.5" aria-hidden="true" />
      </button>
    </div>
    <div class="sr-only" aria-live="polite">{{ liveText }}</div>
    <div class="sr-only" aria-live="polite">{{ isChoosingRangeEnd ? chooseEndDateLabel : '' }}</div>

    <!-- days -->
    <table
      v-if="view === 'days'"
      :id="`${componentId}-grid`"
      role="grid"
      :aria-label="monthYearLabel"
      :aria-multiselectable="range || undefined"
      class="w-full border-separate border-spacing-0.5"
    >
      <thead>
        <tr>
          <th
            v-for="weekday in weekdays"
            :key="weekday.long"
            scope="col"
            class="h-8 text-xs font-normal text-gray-600 dark:text-gray-400"
          >
            <abbr :title="weekday.long" class="no-underline">{{ weekday.short }}</abbr>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <template v-for="(day, dayIndex) in week" :key="dayIndex">
            <td
              v-if="day"
              role="gridcell"
              :aria-selected="isDaySelected(day) || (!!rangeEndDate && isInRange(day))"
              class="p-0"
            >
              <button
                type="button"
                :class="getDayStyle(day)"
                :tabindex="isSameDay(day, activeDate) ? 0 : -1"
                :data-active="isSameDay(day, activeDate)"
                :aria-label="getDayLabel(day)"
                :aria-current="isToday(day) ? 'date' : undefined"
                :aria-disabled="!isSelectable(day) || undefined"
                @click="selectDay(day)"
                @mouseenter="onDayHover(day)"
                @keydown="onDayKeydown"
              >
                {{ day.getDate() }}
              </button>
            </td>
            <td v-else class="size-9 p-0"></td>
          </template>
        </tr>
      </tbody>
    </table>

    <!-- months, a grid as the days -->
    <div
      v-else-if="view === 'months'"
      role="grid"
      :aria-label="chooseMonthLabel"
      class="flex h-66 flex-col gap-2 p-1"
    >
      <div
        v-for="(row, rowIndex) in monthRows"
        :key="rowIndex"
        role="row"
        class="grid flex-1 grid-cols-3 gap-2"
      >
        <div
          v-for="month in row"
          :key="month.index"
          role="gridcell"
          :aria-selected="month.selected"
        >
          <button
            type="button"
            :class="getOptionStyle(month.selected, month.disabled)"
            :tabindex="month.index === activeDate.getMonth() ? 0 : -1"
            :data-active="month.index === activeDate.getMonth()"
            :aria-disabled="month.disabled || undefined"
            @click="!month.disabled && selectMonth(month.index)"
            @keydown="onOptionKeydown"
          >
            {{ month.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- years -->
    <div v-else role="grid" :aria-label="chooseYearLabel" class="flex h-66 flex-col gap-2 p-1">
      <div
        v-for="(row, rowIndex) in yearRows"
        :key="rowIndex"
        role="row"
        class="grid flex-1 grid-cols-3 gap-2"
      >
        <div v-for="item in row" :key="item.year" role="gridcell" :aria-selected="item.selected">
          <button
            type="button"
            :class="getOptionStyle(item.selected, item.disabled)"
            :tabindex="item.year === activeDate.getFullYear() ? 0 : -1"
            :data-active="item.year === activeDate.getFullYear()"
            :aria-disabled="item.disabled || undefined"
            @click="!item.disabled && selectYear(item.year)"
            @keydown="onOptionKeydown"
          >
            {{ item.year }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
