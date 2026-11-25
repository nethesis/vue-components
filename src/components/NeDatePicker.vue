<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useId, useSlots, watch } from 'vue'
import { onClickOutside, useEventListener, useResizeObserver } from '@vueuse/core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCalendar,
  faCircleExclamation,
  faClock,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import NeButton from './NeButton.vue'
import NeCalendar from './NeCalendar.vue'
import NeTimeSpinner from './NeTimeSpinner.vue'
import {
  formatIsoDate,
  formatLocalizedDate,
  formatLocalizedDateTime,
  formatLocalizedTime,
  formatTimeString,
  getDayAndTime,
  getDayPeriodNames,
  getLocaleWeekStart,
  isDaySelectable,
  parseIsoDate,
  parseLocalizedDate,
  parseLocalizedDateTime,
  parseLocalizedTime,
  parseTimeString,
  resolveLocale,
  resolveTimeZone,
  timeToSeconds,
  toMoment,
  type TimeParts
} from '../lib/calendar'

export type NeDatePickerType = 'date' | 'datetime' | 'time'

// 'yyyy-MM-dd' for 'date', [first, last] with range, a Date for 'datetime', 'HH:mm' for 'time'
export type NeDatePickerValue = string | Date | [string, string] | null

export type NeDatePickerPreset = {
  label: string
  // a value, or a function that returns it when the preset is chosen, such as the last 7 days
  value: NeDatePickerValue | (() => NeDatePickerValue)
}

type ValueParts = { day: string; end: string; time: TimeParts | null }

const props = withDefaults(
  defineProps<{
    // 'date': a day, as 'yyyy-MM-dd'; 'datetime': a moment, as a Date; 'time': a time of day, as
    // 'HH:mm', or 'HH:mm:ss' with showSeconds
    type?: NeDatePickerType
    label?: string
    id?: string
    placeholder?: string
    helperText?: string
    invalidMessage?: string
    optional?: boolean
    optionalLabel?: string
    disabled?: boolean
    // the first and the last value that can be chosen, of the same type as the value: 'yyyy-MM-dd'
    // for 'date', a Date for 'datetime', 'HH:mm' for 'time'; for 'datetime', a string is read as
    // an ISO 8601 moment, so '2026-11-10' is midnight UTC: pass a Date, or a string with the time
    // and the offset
    min?: string | Date | null
    max?: string | Date | null
    // days that can't be chosen, besides those outside min and max; it receives the day at
    // midnight, local time
    isDateDisabled?: (date: Date) => boolean
    // the language of month and day names, of the date and time format, of the 12 or 24-hour
    // clock and of the first day of the week, such as 'en' or 'it-IT'; the browser language if
    // empty
    locale?: string
    // first day of the week, 0 for Sunday, 1 for Monday; from the locale if not set
    weekStart?: number
    // the time zone of 'datetime', such as 'Europe/Rome', shown next to the time; the browser
    // time zone if empty
    timeZone?: string
    // the step of the minutes, from 1 to 30
    minuteStep?: number
    showSeconds?: boolean
    // the clock of 'datetime' and 'time': 'h12' with AM and PM, 'h23' from 00 to 23; from the
    // locale if not set
    hourCycle?: 'h12' | 'h23'
    // apply each change at once, without Cancel and Select buttons; on for 'date', off for
    // 'datetime' and 'time' if not set
    autoApply?: boolean
    // let the user type the value, in the format of the locale
    textInput?: boolean
    // choose a range of days, from the first to the last; only for 'date'
    range?: boolean
    // values to choose with a click, shown next to the calendar
    presets?: NeDatePickerPreset[]
    clearable?: boolean
    chooseDateLabel?: string
    chooseTimeLabel?: string
    clearLabel?: string
    cancelLabel?: string
    selectLabel?: string
    invalidDateLabel?: string
    invalidRangeLabel?: string
    presetsLabel?: string
    invalidDateTimeLabel?: string
    invalidTimeLabel?: string
    unavailableDateLabel?: string
    unavailableTimeLabel?: string
    previousMonthLabel?: string
    nextMonthLabel?: string
    previousYearLabel?: string
    nextYearLabel?: string
    previousYearsLabel?: string
    nextYearsLabel?: string
    chooseMonthLabel?: string
    chooseYearLabel?: string
    chooseEndDateLabel?: string
    hoursLabel?: string
    minutesLabel?: string
    secondsLabel?: string
    dayPeriodLabel?: string
    increaseHoursLabel?: string
    decreaseHoursLabel?: string
    increaseMinutesLabel?: string
    decreaseMinutesLabel?: string
    increaseSecondsLabel?: string
    decreaseSecondsLabel?: string
  }>(),
  {
    type: 'date',
    label: '',
    id: '',
    placeholder: '',
    helperText: '',
    invalidMessage: '',
    optional: false,
    optionalLabel: 'Optional',
    disabled: false,
    min: '',
    max: '',
    isDateDisabled: undefined,
    locale: '',
    weekStart: undefined,
    timeZone: '',
    minuteStep: 1,
    showSeconds: false,
    hourCycle: undefined,
    autoApply: undefined,
    textInput: false,
    clearable: true,
    range: false,
    presets: () => [],
    chooseDateLabel: 'Choose date',
    chooseTimeLabel: 'Choose time',
    clearLabel: 'Clear',
    cancelLabel: 'Cancel',
    selectLabel: 'Select',
    invalidDateLabel: 'Enter a valid date',
    invalidRangeLabel: 'Enter a valid start and end date',
    presetsLabel: 'Presets',
    invalidDateTimeLabel: 'Enter a valid date and time',
    invalidTimeLabel: 'Enter a valid time',
    unavailableDateLabel: 'This date is not available',
    unavailableTimeLabel: 'This time is not available',
    previousMonthLabel: 'Previous month',
    nextMonthLabel: 'Next month',
    previousYearLabel: 'Previous year',
    nextYearLabel: 'Next year',
    previousYearsLabel: 'Previous years',
    nextYearsLabel: 'Next years',
    chooseMonthLabel: 'Choose month',
    chooseYearLabel: 'Choose year',
    chooseEndDateLabel: 'Choose end date',
    hoursLabel: 'Hours',
    minutesLabel: 'Minutes',
    secondsLabel: 'Seconds',
    dayPeriodLabel: 'AM/PM',
    increaseHoursLabel: 'Increase hours',
    decreaseHoursLabel: 'Decrease hours',
    increaseMinutesLabel: 'Increase minutes',
    decreaseMinutesLabel: 'Decrease minutes',
    increaseSecondsLabel: 'Increase seconds',
    decreaseSecondsLabel: 'Decrease seconds'
  }
)

// 'yyyy-MM-dd' for 'date', [first, last] with range, a Date for 'datetime', 'HH:mm' for 'time';
// '' when empty, null for 'datetime' and range
const model = defineModel<NeDatePickerValue>({ default: '' })

defineOptions({
  inheritAttrs: false
})

defineExpose({
  focus
})

const attrs = useAttrs()
const slots = useSlots()
const generatedId = useId()
const componentId = computed(() => props.id || generatedId)

const fieldRef = ref<HTMLElement>()
const labelRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()
const popupRef = ref<HTMLElement>()
const calendarRef = ref<InstanceType<typeof NeCalendar>>()
const timeSpinnerRef = ref<InstanceType<typeof NeTimeSpinner>>()

const isOpen = ref(false)
// the day and the time chosen in the popup; with autoApply they are applied at each change
const pendingDay = ref('')
// the last day of the range
const pendingEnd = ref('')
const pendingTime = ref<TimeParts>({ hours: 0, minutes: 0, seconds: 0 })
// the text typed by the user, with textInput
const inputText = ref('')
// the error of the typed text
const typedError = ref('')
const popupTop = ref(0)
const popupLeft = ref(0)
// the height of the popup when it doesn't fit the screen, which then scrolls
const popupMaxHeight = ref<number>()
// the element that opened the popup
let opener: HTMLElement | undefined

const hasCalendar = computed(() => props.type !== 'time')
const hasTime = computed(() => props.type !== 'date')
const isRange = computed(() => props.range && props.type === 'date')
const resolvedAutoApply = computed(() => props.autoApply ?? props.type === 'date')
// the locale, with the hour cycle if set, so that the spinner, the field and the typed text use
// the same clock; always with the Gregorian calendar and Latin digits, which the calendar grid and
// the typed text use (Thai shows Buddhist years otherwise, Arabic its own digits)
const resolvedLocale = computed(() => {
  const locale = resolveLocale(props.locale) ?? new Intl.DateTimeFormat().resolvedOptions().locale
  return new Intl.Locale(locale, {
    calendar: 'gregory',
    numberingSystem: 'latn',
    hourCycle: props.hourCycle
  }).toString()
})
// an invalid time zone, such as a POSIX TZ string, falls back to the browser time zone
const resolvedTimeZone = computed(() =>
  props.type === 'datetime' ? resolveTimeZone(props.timeZone) : undefined
)
const emptyValue = computed(() => (props.type === 'datetime' || isRange.value ? null : ''))
const openLabel = computed(() =>
  props.type === 'time' ? props.chooseTimeLabel : props.chooseDateLabel
)

const resolvedWeekStart = computed(() =>
  props.weekStart === undefined ? getLocaleWeekStart(resolvedLocale.value) : props.weekStart
)

const minMoment = computed(() => toValidDate(props.min))
const maxMoment = computed(() => toValidDate(props.max))
// the time limits on the minute step, as the spinner shows them: min rounds up, max down
const timeLimits = computed(() => {
  const min = typeof props.min === 'string' ? parseTimeString(props.min) : null
  const max = typeof props.max === 'string' ? parseTimeString(props.max) : null
  const roundedMin = roundTimeLimit(min, 'up')
  const roundedMax = roundTimeLimit(max, 'down')
  // when no time on the step is between min and max, they stay as they are
  if (roundedMin && roundedMax && timeToSeconds(roundedMin) > timeToSeconds(roundedMax)) {
    return { min, max }
  }
  return { min: roundedMin, max: roundedMax }
})
const minTime = computed(() => timeLimits.value.min)
const maxTime = computed(() => timeLimits.value.max)

// the first and the last day of the calendar
const calendarMin = computed(() => getCalendarLimit(props.min, minMoment.value))
const calendarMax = computed(() => getCalendarLimit(props.max, maxMoment.value))

// the value as a day, the last day of a range and a time, in the time zone
const modelParts = computed(() => getValueParts(model.value))

const hasValue = computed(() => {
  if (props.type === 'time') {
    return !!modelParts.value.time
  }
  return !!modelParts.value.day && (!isRange.value || !!modelParts.value.end)
})

const displayValue = computed(() => {
  const { day, time } = modelParts.value
  const date = parseIsoDate(day)

  switch (props.type) {
    case 'time':
      return time ? formatLocalizedTime(time, resolvedLocale.value, props.showSeconds) : ''
    case 'datetime': {
      const moment = toValidDate(model.value)
      return moment
        ? formatLocalizedDateTime(
            moment,
            resolvedLocale.value,
            props.showSeconds,
            resolvedTimeZone.value
          )
        : ''
    }
    default: {
      const end = parseIsoDate(modelParts.value.end)
      if (isRange.value) {
        return date && end
          ? `${formatLocalizedDate(date, resolvedLocale.value)} – ${formatLocalizedDate(end, resolvedLocale.value)}`
          : ''
      }
      return date ? formatLocalizedDate(date, resolvedLocale.value) : ''
    }
  }
})

const isSelectDisabled = computed(
  () => hasCalendar.value && (!pendingDay.value || (isRange.value && !pendingEnd.value))
)

const presetItems = computed(() =>
  props.presets.map((preset, index) => ({
    key: `${index}-${preset.label}`,
    preset,
    selected: isPresetSelected(preset),
    available: isPresetAvailable(preset)
  }))
)

const shownInvalidMessage = computed(() => props.invalidMessage || typedError.value)

// the field is named by its label and its value; without a label, by its value and the action
const triggerLabelledBy = computed(() => {
  const ids = [props.label ? `${componentId.value}-label` : '', `${componentId.value}-value`]
  if (!props.label && (displayValue.value || props.placeholder)) {
    ids.push(`${componentId.value}-action`)
  }
  return ids.filter(Boolean).join(' ')
})

const isClearShown = computed(
  () =>
    props.clearable && !props.disabled && (hasValue.value || (props.textInput && !!inputText.value))
)

const descriptionId = computed(() =>
  shownInvalidMessage.value || props.helperText ? `${componentId.value}-description` : undefined
)

const rootAttrs = computed(() => (attrs.class ? { class: attrs.class } : {}))

const fieldAttrs = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _class, ...rest } = attrs
  return rest
})

const fieldBaseStyle =
  'block w-full rounded-md border-0 py-1.5 pl-3 text-left text-gray-900 ring-1 ring-inset outline-hidden transition-colors duration-200 focus:ring-2 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm sm:leading-6 bg-white dark:bg-gray-950 dark:text-gray-50'

// room for the icons on the right: error, clear and calendar
const fieldPaddingStyle = computed(() => {
  const iconCount = 1 + (shownInvalidMessage.value ? 1 : 0) + (isClearShown.value ? 1 : 0)
  return ['pr-10', 'pr-18', 'pr-22'][iconCount - 1]
})

const fieldStyle = computed(() => [
  fieldBaseStyle,
  fieldPaddingStyle.value,
  shownInvalidMessage.value
    ? 'ring-rose-700 focus:ring-rose-500 dark:ring-rose-500 dark:focus:ring-rose-500'
    : 'ring-gray-300 focus:ring-primary-500 dark:ring-gray-600 dark:focus:ring-primary-300',
  props.textInput
    ? 'placeholder:text-gray-400 dark:placeholder:text-gray-500'
    : 'min-h-9 cursor-pointer',
  isOpen.value && !shownInvalidMessage.value ? 'ring-2 ring-primary-500 dark:ring-primary-300' : ''
])

const iconButtonStyle =
  'pointer-events-auto flex size-6 cursor-pointer items-center justify-center rounded-sm text-gray-500 hover:text-gray-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-primary-300'

// show the value in the text field, unless the user is typing
watch(
  displayValue,
  (value) => {
    inputText.value = value
    typedError.value = ''
  },
  { immediate: true }
)

// keep the popup next to the field while the page scrolls or resizes
useEventListener(window, 'scroll', () => isOpen.value && updatePosition(), {
  capture: true,
  passive: true
})
useEventListener(window, 'resize', () => isOpen.value && updatePosition(), { passive: true })
// the months and years views change the height of the popup
useResizeObserver(popupRef, () => updatePosition())

onClickOutside(
  popupRef,
  () => {
    if (isOpen.value) {
      close(false)
    }
  },
  // a click on the label goes to the field, which opens and closes the popup
  { ignore: [fieldRef, labelRef] }
)

function getValueParts(value: NeDatePickerValue): ValueParts {
  const empty: ValueParts = { day: '', end: '', time: null }

  if (props.type === 'time') {
    return { ...empty, time: typeof value === 'string' ? parseTimeString(value) : null }
  }
  if (props.type === 'datetime') {
    const date = toValidDate(value)
    return date ? { ...getDayAndTime(date, resolvedTimeZone.value), end: '' } : empty
  }
  if (isRange.value) {
    if (Array.isArray(value) && parseIsoDate(value[0]) && parseIsoDate(value[1])) {
      return { ...empty, day: value[0], end: value[1] }
    }
    return empty
  }
  return { ...empty, day: typeof value === 'string' && parseIsoDate(value) ? value : '' }
}

function getPresetValue(preset: NeDatePickerPreset): NeDatePickerValue {
  return typeof preset.value === 'function' ? preset.value() : preset.value
}

// true if the preset is what the popup shows
function isPresetSelected(preset: NeDatePickerPreset): boolean {
  const parts = getValueParts(getPresetValue(preset))
  const time = parts.time ? timeToSeconds(normalizeTime(parts.time)) : null
  const pending = timeToSeconds(normalizeTime(pendingTime.value))

  switch (props.type) {
    case 'time':
      return time === pending
    case 'datetime':
      return !!parts.day && parts.day === pendingDay.value && time === pending
    default:
      return !!parts.day && parts.day === pendingDay.value && parts.end === pendingEnd.value
  }
}

// true if the preset can be chosen: its days and times are within min and max, and not disabled
function isPresetAvailable(preset: NeDatePickerPreset): boolean {
  const parts = getValueParts(getPresetValue(preset))

  if (props.type === 'time') {
    if (!parts.time) {
      return false
    }
    const time = normalizeTime(parts.time)
    return timeToSeconds(clampTime(time)) === timeToSeconds(time)
  }
  const days = isRange.value ? [parts.day, parts.end] : [parts.day]
  const areDaysSelectable = days.every((day) => {
    const date = parseIsoDate(day)
    return (
      !!date && isDaySelectable(date, calendarMin.value, calendarMax.value, props.isDateDisabled)
    )
  })
  if (!areDaysSelectable) {
    return false
  }
  if (props.type === 'datetime') {
    const moment = toValidDate(getPresetValue(preset))
    return (
      !!moment &&
      (!minMoment.value || moment >= minMoment.value) &&
      (!maxMoment.value || moment <= maxMoment.value)
    )
  }
  return true
}

// today in the time zone, for the calendar
function getToday(): string {
  return getDayAndTime(new Date(), resolvedTimeZone.value).day
}

// a Date, or an ISO 8601 string, as a valid Date
function toValidDate(value: unknown): Date | null {
  if (props.type !== 'datetime' || !value) {
    return null
  }
  const date = value instanceof Date ? value : typeof value === 'string' ? new Date(value) : null
  return date && !isNaN(date.getTime()) ? date : null
}

function getCalendarLimit(limit: string | Date | null, moment: Date | null): string {
  if (props.type === 'date') {
    return typeof limit === 'string' ? limit : limit instanceof Date ? formatIsoDate(limit) : ''
  }
  return moment ? getDayAndTime(moment, resolvedTimeZone.value).day : ''
}

function roundTimeLimit(time: TimeParts | null, direction: 'up' | 'down'): TimeParts | null {
  if (!time || props.showSeconds) {
    return time
  }
  const step = Math.min(Math.max(Math.floor(props.minuteStep), 1), 30)
  const lastStep = Math.floor(59 / step) * step
  if (direction === 'down') {
    return { hours: time.hours, minutes: Math.floor(time.minutes / step) * step, seconds: 0 }
  }
  const minutes = Math.ceil((time.minutes + (time.seconds > 0 ? 1 : 0)) / step) * step
  if (minutes <= lastStep) {
    return { hours: time.hours, minutes, seconds: 0 }
  }
  // after the last step of the hour comes the next hour
  return time.hours < 23 ? { hours: time.hours + 1, minutes: 0, seconds: 0 } : time
}

// seconds are kept only when shown
function normalizeTime(time: TimeParts): TimeParts {
  return props.showSeconds ? time : { ...time, seconds: 0 }
}

// the current time, rounded down to the minute step
function getDefaultTime(): TimeParts {
  const now = getDayAndTime(new Date(), resolvedTimeZone.value).time
  const step = Math.min(Math.max(Math.floor(props.minuteStep), 1), 30)
  return { hours: now.hours, minutes: Math.floor(now.minutes / step) * step, seconds: 0 }
}

// move a moment to the closest value that can be chosen, later or earlier: the next second with
// seconds, the next minute step of the hour in the time zone otherwise, as the spinner shows
function roundMoment(moment: Date, direction: 'up' | 'down'): Date {
  const round = direction === 'up' ? Math.ceil : Math.floor
  if (props.showSeconds) {
    return new Date(round(moment.getTime() / 1000) * 1000)
  }
  const step = Math.min(Math.max(Math.floor(props.minuteStep), 1), 30)
  const { time } = getDayAndTime(moment, resolvedTimeZone.value)
  const startOfHour =
    moment.getTime() - (time.minutes * 60 + time.seconds) * 1000 - moment.getMilliseconds()
  const minutes = time.minutes + (time.seconds * 1000 + moment.getMilliseconds()) / 60000
  // after the last step of the hour comes the next hour
  const roundedMinutes = Math.min(round(minutes / step) * step, 60)
  return new Date(startOfHour + roundedMinutes * 60000)
}

// move a moment within min and max, on a minute step
function clampMoment(moment: Date): Date {
  const min = minMoment.value
  const max = maxMoment.value
  // when no moment on the step is between min and max, min and max are used as they are
  if (min && moment < min) {
    const rounded = roundMoment(min, 'up')
    moment = max && rounded > max ? min : rounded
  }
  if (max && moment > max) {
    const rounded = roundMoment(max, 'down')
    moment = min && rounded < min ? max : rounded
  }
  return moment
}

function clampTime(time: TimeParts): TimeParts {
  const seconds = timeToSeconds(time)
  if (minTime.value && seconds < timeToSeconds(minTime.value)) {
    return minTime.value
  }
  if (maxTime.value && seconds > timeToSeconds(maxTime.value)) {
    return maxTime.value
  }
  return time
}

// the moment of the pending day and time; the value itself when they are the value's, since a
// time repeated when daylight saving time ends is two moments
function getPendingMoment(): Date | null {
  if (!pendingDay.value) {
    return null
  }
  const time = normalizeTime(pendingTime.value)
  const current = toValidDate(model.value)
  const currentTime = modelParts.value.time
  if (
    current &&
    currentTime &&
    modelParts.value.day === pendingDay.value &&
    timeToSeconds(normalizeTime(currentTime)) === timeToSeconds(time)
  ) {
    const precision = props.showSeconds ? 1000 : 60000
    return new Date(Math.floor(current.getTime() / precision) * precision)
  }
  return toMoment(pendingDay.value, time, resolvedTimeZone.value)
}

// move the pending day and time within min and max, so that the popup shows what will be applied;
// previousTime is the time before a change in the spinner, direction the arrow that changed it
function normalizePending(previousTime?: TimeParts, direction?: 1 | -1) {
  if (props.type === 'datetime' && pendingDay.value) {
    let moment = getPendingMoment()
    if (!moment) {
      return
    }
    // a time skipped when daylight saving time starts moves forward, after the skipped hour;
    // when the user goes back in time, it moves before it instead, so that the spinner goes on
    const requested = timeToSeconds(normalizeTime(pendingTime.value))
    const shown = timeToSeconds(getDayAndTime(moment, resolvedTimeZone.value).time)
    // an arrow tells the direction, also when the hours go round from 23 to 0
    const isBackward = direction
      ? direction === -1
      : !!previousTime && requested < timeToSeconds(previousTime)
    if (previousTime && shown > requested && isBackward) {
      moment = new Date(moment.getTime() - (shown - requested) * 1000)
    }
    const parts = getDayAndTime(clampMoment(moment), resolvedTimeZone.value)
    pendingDay.value = parts.day
    pendingTime.value = parts.time
  } else if (props.type === 'time') {
    pendingTime.value = clampTime(normalizeTime(pendingTime.value))
  }
}

// the value of the pending day and time, or null if no day is chosen
function getPendingValue(): NeDatePickerValue {
  switch (props.type) {
    case 'time':
      return formatTimeString(normalizeTime(pendingTime.value), props.showSeconds)
    case 'datetime':
      return getPendingMoment()
    default:
      if (isRange.value) {
        return pendingDay.value && pendingEnd.value ? [pendingDay.value, pendingEnd.value] : null
      }
      return pendingDay.value || null
  }
}

function applyPendingValue() {
  const value = getPendingValue()
  if (value !== null) {
    model.value = value
    inputText.value = displayValue.value
    typedError.value = ''
  }
}

function updatePosition() {
  if (!fieldRef.value || !popupRef.value) {
    return
  }
  const margin = 8
  const gap = 4
  const field = fieldRef.value.getBoundingClientRect()
  const popupWidth = popupRef.value.offsetWidth
  // the height of the content, also when the popup scrolls
  const popupHeight = popupRef.value.scrollHeight
  const viewportWidth = document.documentElement.clientWidth
  const viewportHeight = window.innerHeight

  // below the field, or above it when it doesn't fit below and there is more space above; when
  // it fits neither, it scrolls
  const spaceBelow = viewportHeight - field.bottom - gap - margin
  const spaceAbove = field.top - gap - margin
  const isAbove = spaceBelow < popupHeight && spaceAbove > spaceBelow
  const space = Math.max(isAbove ? spaceAbove : spaceBelow, 160)
  popupMaxHeight.value = popupHeight > space ? space : undefined
  // below, moved up when the popup is taller than the space left
  popupTop.value = isAbove
    ? Math.max(margin, field.top - gap - Math.min(popupHeight, space))
    : Math.max(
        margin,
        Math.min(field.bottom + gap, viewportHeight - margin - Math.min(popupHeight, space))
      )

  // aligned to the left of the field, moved left when it goes past the right of the screen
  popupLeft.value = Math.max(margin, Math.min(field.left, viewportWidth - popupWidth - margin))
}

async function open() {
  if (props.disabled || isOpen.value) {
    return
  }
  // the typed text is applied first, so that the popup shows it
  if (props.textInput) {
    commitInputText()
    // the value of v-model changes when the parent updates it
    await nextTick()
  }
  // the focus goes back to the element that opened the popup, such as the calendar button
  opener = fieldRef.value?.contains(document.activeElement)
    ? (document.activeElement as HTMLElement)
    : undefined
  pendingDay.value = modelParts.value.day
  pendingEnd.value = modelParts.value.end
  pendingTime.value = modelParts.value.time ?? getDefaultTime()
  // the default time, or a value outside min and max, moves within them
  normalizePending()
  isOpen.value = true
  await nextTick()
  updatePosition()
  if (hasCalendar.value) {
    calendarRef.value?.focus()
  } else {
    timeSpinnerRef.value?.focus()
  }
}

function close(returnFocus = true) {
  isOpen.value = false
  if (returnFocus) {
    if (opener?.isConnected) {
      opener.focus()
    } else {
      focus()
    }
  }
}

function toggle() {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

function focus() {
  if (slots.trigger) {
    // the first button or field of the trigger slot
    fieldRef.value
      ?.querySelector<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])')
      ?.focus()
  } else {
    triggerRef.value?.focus()
  }
}

function onCalendarSelect(day: string) {
  typedError.value = ''

  if (isRange.value) {
    selectRangeDay(day)
    return
  }
  pendingDay.value = day
  normalizePending()

  if (resolvedAutoApply.value) {
    applyPendingValue()
    // with a time to choose, the popup stays open
    if (props.type === 'date') {
      close()
    }
  }
}

// the first click chooses the first day, the second the last one; the days are sorted
function selectRangeDay(day: string) {
  if (!pendingDay.value || pendingEnd.value) {
    pendingDay.value = day
    pendingEnd.value = ''
    return
  }
  if (day < pendingDay.value) {
    pendingEnd.value = pendingDay.value
    pendingDay.value = day
  } else {
    pendingEnd.value = day
  }
  if (resolvedAutoApply.value) {
    applyPendingValue()
    close()
  }
}

function selectPreset(preset: NeDatePickerPreset) {
  const parts = getValueParts(getPresetValue(preset))
  if (props.type === 'time' ? !parts.time : !parts.day) {
    return
  }
  if (!isPresetAvailable(preset)) {
    return
  }
  typedError.value = ''
  pendingDay.value = parts.day
  pendingEnd.value = parts.end
  pendingTime.value = parts.time ?? pendingTime.value
  normalizePending()

  if (resolvedAutoApply.value) {
    applyPendingValue()
    close()
  }
}

function onTimeChange(time: TimeParts, direction?: 1 | -1) {
  typedError.value = ''
  const previousTime = pendingTime.value
  pendingTime.value = time
  normalizePending(previousTime, direction)

  if (resolvedAutoApply.value) {
    applyPendingValue()
  }
}

// Enter applies the time shown, also with autoApply when the value is still empty
function onTimeEnter() {
  if (!isSelectDisabled.value) {
    applyPendingValue()
  } else if (!resolvedAutoApply.value) {
    return
  }
  close()
}

function onSelectClick() {
  applyPendingValue()
  close()
}

// clear the value from the popup, which stays open, as the clear button of a filter does; the
// focus moves to the calendar, since the button that cleared may no longer be focusable
function clearFromPopup() {
  pendingDay.value = ''
  pendingEnd.value = ''
  model.value = emptyValue.value
  inputText.value = ''
  typedError.value = ''
  if (hasCalendar.value) {
    calendarRef.value?.focus()
  } else {
    timeSpinnerRef.value?.focus()
  }
}

function clear() {
  isOpen.value = false
  model.value = emptyValue.value
  inputText.value = ''
  typedError.value = ''
  focus()
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    open()
  }
}

// a click in the text field closes the popup, so that the focus is not outside it while open
function onInputFocus() {
  if (isOpen.value) {
    close(false)
  }
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' && event.altKey) {
    event.preventDefault()
    open()
  } else if (event.key === 'Enter' && !commitInputText()) {
    // the form is submitted only when the typed value is valid
    event.preventDefault()
  }
}

// the typed text without the name of the time zone, which is shown after the time, before it
// (Chinese), in brackets (Chinese of Taiwan) or in parentheses (Persian); the name changes with
// daylight saving time (CET, CEST), so the names of winter and summer are removed
function removeTimeZoneName(text: string): string {
  if (!resolvedTimeZone.value) {
    return text
  }
  const zoneFormat = new Intl.DateTimeFormat(resolvedLocale.value, {
    timeZone: resolvedTimeZone.value,
    timeZoneName: 'short'
  })
  const year = new Date().getFullYear()
  const moments = [new Date(year, 0, 1), new Date(year, 6, 1), toValidDate(model.value)]
  for (const moment of moments) {
    const zoneName = moment
      ? zoneFormat.formatToParts(moment).find((part) => part.type === 'timeZoneName')?.value
      : undefined
    if (zoneName && text.includes(zoneName)) {
      return text
        .replace(`[${zoneName}]`, ' ')
        .replace(`(${zoneName})`, ' ')
        .replace(zoneName, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    }
  }
  return text
}

// apply the typed text, or show why it can't be applied; return false if it is not valid
function commitInputText(): boolean {
  const text = inputText.value.trim()

  if (!text) {
    if (props.clearable) {
      model.value = emptyValue.value
    } else {
      inputText.value = displayValue.value
    }
    typedError.value = ''
    return true
  }
  if (text === displayValue.value) {
    typedError.value = ''
    return true
  }

  const error = applyTypedText(text)
  typedError.value = error
  if (!error) {
    inputText.value = displayValue.value
  }
  return !error
}

// apply a typed value and return '', or return the error to show
function applyTypedText(text: string): string {
  const dayPeriods = getDayPeriodNames(resolvedLocale.value)

  if (props.type === 'time') {
    const time = parseLocalizedTime(text, dayPeriods)
    if (!time) {
      return props.invalidTimeLabel
    }
    const normalized = normalizeTime(time)
    if (timeToSeconds(clampTime(normalized)) !== timeToSeconds(normalized)) {
      return props.unavailableTimeLabel
    }
    model.value = formatTimeString(normalized, props.showSeconds)
    return ''
  }

  if (props.type === 'datetime') {
    const parts = parseLocalizedDateTime(removeTimeZoneName(text), resolvedLocale.value, dayPeriods)
    const day = parts && parseIsoDate(parts.day)
    if (!parts || !day) {
      return props.invalidDateTimeLabel
    }
    const moment = toMoment(parts.day, normalizeTime(parts.time), resolvedTimeZone.value)
    if (
      !moment ||
      !isDaySelectable(day, calendarMin.value, calendarMax.value, props.isDateDisabled)
    ) {
      return props.unavailableDateLabel
    }
    // the day can be chosen, but not at this time
    if (
      (minMoment.value && moment < minMoment.value) ||
      (maxMoment.value && moment > maxMoment.value)
    ) {
      return props.unavailableTimeLabel
    }
    model.value = moment
    return ''
  }

  if (isRange.value) {
    return applyTypedRange(text)
  }

  const date = parseLocalizedDate(text, resolvedLocale.value)
  if (!date) {
    return props.invalidDateLabel
  }
  if (!isDaySelectable(date, calendarMin.value, calendarMax.value, props.isDateDisabled)) {
    return props.unavailableDateLabel
  }
  model.value = formatIsoDate(date)
  return ''
}

// a range typed as two dates separated by a dash: 20/11/2026 – 24/11/2026
function applyTypedRange(text: string): string {
  const texts = text.split(/\s+[-–—]\s+|\s*[–—]\s*/)
  const dates = texts.map((dateText) => parseLocalizedDate(dateText, resolvedLocale.value))
  if (dates.length !== 2 || !dates[0] || !dates[1]) {
    return props.invalidRangeLabel
  }
  const [first, last] = (dates as Date[]).sort((a, b) => a.getTime() - b.getTime())
  if (
    ![first, last].every((date) =>
      isDaySelectable(date, calendarMin.value, calendarMax.value, props.isDateDisabled)
    )
  ) {
    return props.unavailableDateLabel
  }
  model.value = [formatIsoDate(first), formatIsoDate(last)]
  return ''
}

function onPopupKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  } else if (event.key === 'Tab') {
    trapFocus(event)
  }
}

// keep the focus inside the popup, as in a modal dialog
function trapFocus(event: KeyboardEvent) {
  // the popup itself has the focus after a click on an empty area
  const isPopupFocused = document.activeElement === popupRef.value
  const focusable = Array.from(
    popupRef.value?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) ?? []
  ).filter((element) => element.tabIndex >= 0)

  if (!focusable.length) {
    return
  }
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && (document.activeElement === first || isPopupFocused)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (document.activeElement === last || isPopupFocused)) {
    event.preventDefault()
    first.focus()
  }
}
</script>

<template>
  <div v-bind="rootAttrs">
    <!-- a custom trigger, such as the button of a filter, instead of the field -->
    <div v-if="$slots.trigger" ref="fieldRef" class="inline-block">
      <slot
        name="trigger"
        :is-open="isOpen"
        :display-value="displayValue"
        :disabled="disabled"
        :toggle="toggle"
        :trigger-attrs="{ 'aria-haspopup': 'dialog' as const, 'aria-expanded': isOpen }"
      ></slot>
    </div>
    <template v-else>
      <label
        v-if="label"
        :id="`${componentId}-label`"
        ref="labelRef"
        :for="componentId"
        class="mb-2 flex items-end justify-between text-sm leading-6 font-medium text-gray-700 dark:text-gray-200"
      >
        <span>
          {{ label }}
          <span v-if="$slots.tooltip" class="ml-1">
            <slot name="tooltip"></slot>
          </span>
        </span>
        <span v-if="optional" class="ml-2 font-normal">{{ optionalLabel }}</span>
      </label>
      <div ref="fieldRef" class="relative rounded-md shadow-sm">
        <!-- typed date -->
        <input
          v-if="textInput"
          :id="componentId"
          ref="triggerRef"
          v-model="inputText"
          type="text"
          autocomplete="off"
          :class="fieldStyle"
          :placeholder="placeholder"
          :disabled="disabled"
          :aria-label="label ? undefined : openLabel"
          :aria-invalid="!!shownInvalidMessage || undefined"
          :aria-describedby="descriptionId"
          v-bind="fieldAttrs"
          @focus="onInputFocus"
          @keydown="onInputKeydown"
          @blur="commitInputText"
        />
        <!-- date chosen from the calendar only -->
        <button
          v-else
          :id="componentId"
          ref="triggerRef"
          type="button"
          :class="fieldStyle"
          :disabled="disabled"
          aria-haspopup="dialog"
          :aria-expanded="isOpen"
          :aria-labelledby="triggerLabelledBy"
          :aria-describedby="descriptionId"
          v-bind="fieldAttrs"
          @click="toggle"
          @keydown="onTriggerKeydown"
        >
          <span
            :id="`${componentId}-value`"
            :class="[
              'block truncate',
              displayValue ? '' : 'text-gray-400 dark:text-gray-500',
              !displayValue && !placeholder ? 'sr-only' : ''
            ]"
            >{{ displayValue || placeholder || openLabel }}</span
          >
          <span v-if="!label" :id="`${componentId}-action`" class="sr-only">{{ openLabel }}</span>
        </button>
        <!-- clicks on the icons, except the buttons, go through to the field below -->
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
          <FontAwesomeIcon
            v-if="shownInvalidMessage"
            :icon="faCircleExclamation"
            class="size-4 text-rose-700 dark:text-rose-400"
            aria-hidden="true"
          />
          <button
            v-if="isClearShown"
            type="button"
            :class="iconButtonStyle"
            :aria-label="clearLabel"
            @click="clear"
          >
            <FontAwesomeIcon :icon="faXmark" class="size-4" aria-hidden="true" />
          </button>
          <!-- with textInput the calendar has its own button, otherwise the whole field opens it -->
          <button
            v-if="textInput"
            type="button"
            :class="iconButtonStyle"
            :disabled="disabled"
            aria-haspopup="dialog"
            :aria-expanded="isOpen"
            :aria-label="openLabel"
            @click="toggle"
          >
            <FontAwesomeIcon
              :icon="type === 'time' ? faClock : faCalendar"
              class="size-4"
              aria-hidden="true"
            />
          </button>
          <FontAwesomeIcon
            v-else
            :icon="type === 'time' ? faClock : faCalendar"
            :class="[
              'pointer-events-none size-4 text-gray-500 dark:text-gray-400',
              disabled ? 'opacity-50' : ''
            ]"
            aria-hidden="true"
          />
        </div>
      </div>
      <!-- invalid message -->
      <!-- the error of the typed text is announced when it appears -->
      <p
        v-if="shownInvalidMessage"
        :id="descriptionId"
        :role="invalidMessage ? undefined : 'alert'"
        class="mt-2 text-sm text-rose-700 dark:text-rose-400"
      >
        {{ shownInvalidMessage }}
      </p>
      <!-- helper text -->
      <p
        v-else-if="helperText"
        :id="descriptionId"
        class="mt-2 text-sm text-gray-500 dark:text-gray-400"
      >
        {{ helperText }}
      </p>
    </template>

    <!-- calendar -->
    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          ref="popupRef"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          :aria-label="label || openLabel"
          :style="{
            top: `${popupTop}px`,
            left: `${popupLeft}px`,
            maxHeight: popupMaxHeight ? `${popupMaxHeight}px` : undefined
          }"
          class="fixed z-110 overflow-y-auto rounded-md bg-white p-3 shadow-lg ring-1 ring-gray-900/5 focus:outline-hidden dark:bg-gray-950 dark:ring-gray-500/50"
          @keydown="onPopupKeydown"
        >
          <!-- content above the calendar, such as the clear link of a filter -->
          <slot name="popup-header" :clear="clearFromPopup"></slot>
          <div class="flex flex-col gap-3 sm:flex-row">
            <!-- presets: above the calendar on small screens, as wide as it, on its left otherwise -->
            <div
              v-if="presetItems.length"
              role="group"
              :aria-label="presetsLabel"
              class="flex w-0 min-w-full flex-wrap gap-1 border-b border-gray-200 pb-3 sm:w-40 sm:min-w-0 sm:flex-col sm:flex-nowrap sm:border-r sm:border-b-0 sm:pr-3 sm:pb-0 dark:border-gray-700"
            >
              <button
                v-for="item in presetItems"
                :key="item.key"
                type="button"
                :class="[
                  'focus-visible:ring-primary-500 dark:focus-visible:ring-primary-300 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-200 focus:outline-hidden focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
                  item.selected
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-200',
                  item.available && !item.selected
                    ? 'cursor-pointer hover:bg-gray-200/70 dark:hover:bg-gray-600/30'
                    : ''
                ]"
                :disabled="!item.available"
                :aria-current="item.selected || undefined"
                @click="selectPreset(item.preset)"
              >
                {{ item.preset.label }}
              </button>
            </div>
            <div>
              <NeCalendar
                v-if="hasCalendar"
                ref="calendarRef"
                :model-value="pendingDay"
                :range="isRange"
                :range-end="pendingEnd"
                :min="calendarMin"
                :max="calendarMax"
                :is-date-disabled="isDateDisabled"
                :locale="resolvedLocale"
                :week-start="resolvedWeekStart"
                :previous-month-label="previousMonthLabel"
                :next-month-label="nextMonthLabel"
                :previous-year-label="previousYearLabel"
                :next-year-label="nextYearLabel"
                :previous-years-label="previousYearsLabel"
                :next-years-label="nextYearsLabel"
                :choose-month-label="chooseMonthLabel"
                :choose-year-label="chooseYearLabel"
                :choose-end-date-label="chooseEndDateLabel"
                :today="getToday()"
                @update:model-value="onCalendarSelect"
              />
              <div
                v-if="hasTime"
                :class="[
                  'flex items-center justify-center',
                  hasCalendar ? 'mt-3 border-t border-gray-200 pt-3 dark:border-gray-700' : ''
                ]"
              >
                <NeTimeSpinner
                  ref="timeSpinnerRef"
                  :model-value="pendingTime"
                  :show-seconds="showSeconds"
                  :minute-step="minuteStep"
                  :locale="resolvedLocale"
                  :hours-label="hoursLabel"
                  :minutes-label="minutesLabel"
                  :seconds-label="secondsLabel"
                  :label="chooseTimeLabel"
                  :day-period-label="dayPeriodLabel"
                  :increase-hours-label="increaseHoursLabel"
                  :decrease-hours-label="decreaseHoursLabel"
                  :increase-minutes-label="increaseMinutesLabel"
                  :decrease-minutes-label="decreaseMinutesLabel"
                  :increase-seconds-label="increaseSecondsLabel"
                  :decrease-seconds-label="decreaseSecondsLabel"
                  @update:model-value="onTimeChange"
                  @enter="onTimeEnter"
                />
              </div>
            </div>
          </div>
          <div v-if="!resolvedAutoApply" class="mt-3 flex justify-end gap-2">
            <NeButton kind="tertiary" size="sm" @click="close()">{{ cancelLabel }}</NeButton>
            <NeButton kind="primary" size="sm" :disabled="isSelectDisabled" @click="onSelectClick">
              {{ selectLabel }}
            </NeButton>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>
