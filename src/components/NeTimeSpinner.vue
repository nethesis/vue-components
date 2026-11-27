<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<!--
  The time of NeDatePicker: hours, minutes and seconds as spin buttons of the WAI-ARIA Authoring
  Practices, with AM and PM, also a spin button, in locales that use the 12-hour clock.
-->

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { getDayPeriodNames, uses12HourClock, type TimeParts } from '../lib/calendar'

type Segment = 'hours' | 'minutes' | 'seconds'

const props = withDefaults(
  defineProps<{
    modelValue: TimeParts
    showSeconds?: boolean
    minuteStep?: number
    // a locale supported by Intl, undefined for the browser language
    locale?: string
    // the name of the group of spin buttons, such as "Choose time"
    label?: string
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
    showSeconds: false,
    minuteStep: 1,
    locale: undefined,
    label: '',
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

const emit = defineEmits<{
  // direction is 1 or -1 when an arrow or a step button changed the value
  'update:modelValue': [value: TimeParts, direction?: 1 | -1]
  // Enter pressed on a spin button
  enter: []
}>()

defineExpose({
  focus
})

const rootRef = ref<HTMLElement>()
// digits typed in the focused spin button
let typedDigits = ''
let typedDigitsTimeout: ReturnType<typeof setTimeout> | undefined

const is12HourClock = computed(() => uses12HourClock(props.locale))
const dayPeriodNames = computed(() => getDayPeriodNames(props.locale))
const isPm = computed(() => props.modelValue.hours >= 12)
const step = computed(() => Math.min(Math.max(Math.floor(props.minuteStep), 1), 30))

const segments = computed(() => {
  const list: Segment[] = ['hours', 'minutes']
  if (props.showSeconds) {
    list.push('seconds')
  }
  return list
})

const focusRingStyle =
  'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-300'

const stepButtonStyle =
  'flex h-6 w-11 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors duration-200 hover:bg-gray-200/70 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600/30 dark:hover:text-gray-200'

const valueStyle = `flex h-10 w-11 cursor-default items-center justify-center rounded-md text-lg font-medium text-gray-900 tabular-nums select-none dark:text-gray-50 ${focusRingStyle}`

const periodStyle = `ml-2 flex h-10 min-w-11 cursor-pointer items-center select-none justify-center rounded-md px-2 text-sm font-medium text-primary-700 ring-1 ring-gray-300 transition-colors duration-200 ring-inset hover:bg-gray-200/70 dark:text-primary-500 dark:ring-gray-500 dark:hover:bg-gray-600/30 ${focusRingStyle}`

function getLabel(segment: Segment): string {
  switch (segment) {
    case 'hours':
      return props.hoursLabel
    case 'minutes':
      return props.minutesLabel
    default:
      return props.secondsLabel
  }
}

function getStepLabel(segment: Segment, direction: 1 | -1): string {
  switch (segment) {
    case 'hours':
      return direction === 1 ? props.increaseHoursLabel : props.decreaseHoursLabel
    case 'minutes':
      return direction === 1 ? props.increaseMinutesLabel : props.decreaseMinutesLabel
    default:
      return direction === 1 ? props.increaseSecondsLabel : props.decreaseSecondsLabel
  }
}

function getValue(segment: Segment): number {
  return props.modelValue[segment]
}

// the value shown: hours from 1 to 12 with the 12-hour clock
function getDisplayValue(segment: Segment): number {
  const value = getValue(segment)
  if (segment === 'hours' && is12HourClock.value) {
    return value % 12 === 0 ? 12 : value % 12
  }
  return value
}

function getRange(segment: Segment): [number, number] {
  if (segment === 'hours') {
    return is12HourClock.value ? [1, 12] : [0, 23]
  }
  return [0, 59]
}

function getValueText(segment: Segment): string {
  const value = String(getDisplayValue(segment)).padStart(2, '0')
  if (segment === 'hours' && is12HourClock.value) {
    return `${value} ${dayPeriodNames.value[isPm.value ? 1 : 0]}`
  }
  return value
}

function setValue(segment: Segment, value: number, direction?: 1 | -1) {
  emit('update:modelValue', { ...props.modelValue, [segment]: value }, direction)
}

// add or remove one step, going round: after 23 comes 0, after 55 comes 0 with a step of 5
function increment(segment: Segment, direction: 1 | -1) {
  const value = getValue(segment)

  if (segment === 'hours') {
    setValue(segment, (value + direction + 24) % 24, direction)
  } else if (segment === 'minutes') {
    const stepSize = step.value
    // move to the next multiple of the step, also from a value that is not one
    const next =
      direction === 1
        ? Math.floor(value / stepSize) * stepSize + stepSize
        : Math.ceil(value / stepSize) * stepSize - stepSize
    // after the last step of the hour comes 0, before 0 the last step: 50 with a step of 25
    const lastStep = Math.floor(59 / stepSize) * stepSize
    setValue(segment, next > lastStep ? 0 : next < 0 ? lastStep : next, direction)
  } else {
    setValue(segment, (value + direction + 60) % 60, direction)
  }
}

// the hours typed with the 12-hour clock keep AM or PM
function fromDisplayHours(displayHours: number): number {
  if (!is12HourClock.value) {
    return displayHours
  }
  return (displayHours % 12) + (isPm.value ? 12 : 0)
}

function togglePeriod() {
  setValue('hours', (props.modelValue.hours + 12) % 24)
}

// AM and PM: arrows, Home and End, A and P change it
function onPeriodKeydown(event: KeyboardEvent) {
  const key = event.key.toLowerCase()
  if (['arrowup', 'arrowdown'].includes(key)) {
    togglePeriod()
  } else if (key === 'home' || key === 'a') {
    if (isPm.value) {
      togglePeriod()
    }
  } else if (key === 'end' || key === 'p') {
    if (!isPm.value) {
      togglePeriod()
    }
  } else if (key === 'enter') {
    emit('enter')
  } else {
    return
  }
  event.preventDefault()
}

function onSegmentKeydown(event: KeyboardEvent, segment: Segment) {
  const [min, max] = getRange(segment)

  switch (event.key) {
    case 'ArrowUp':
      increment(segment, 1)
      break
    case 'ArrowDown':
      increment(segment, -1)
      break
    case 'Home':
      setValue(segment, segment === 'hours' ? fromDisplayHours(min) : min)
      break
    case 'End':
      // the last minute on the step: 45 with a step of 15
      setValue(
        segment,
        segment === 'hours'
          ? fromDisplayHours(max)
          : segment === 'minutes'
            ? Math.floor(max / step.value) * step.value
            : max
      )
      break
    case 'Enter':
      emit('enter')
      break
    default:
      if (/^\d$/.test(event.key)) {
        typeDigit(segment, event.key)
        break
      }
      if (segment === 'hours' && is12HourClock.value && /^[ap]$/i.test(event.key)) {
        const wantsPm = event.key.toLowerCase() === 'p'
        if (wantsPm !== isPm.value) {
          togglePeriod()
        }
        break
      }
      return
  }
  event.preventDefault()
}

// typing "1" then "4" sets 14; after two digits, or a digit that can't start a bigger number,
// the focus moves to the next spin button
function typeDigit(segment: Segment, digit: string) {
  const [min, max] = getRange(segment)
  clearTimeout(typedDigitsTimeout)
  typedDigits += digit

  let value = Number(typedDigits)
  if (value > max) {
    typedDigits = digit
    value = Number(digit)
  }
  if (value >= min) {
    setValue(segment, segment === 'hours' ? fromDisplayHours(value) : value)
  }

  if (typedDigits.length >= 2 || value * 10 > max) {
    typedDigits = ''
    focusNextSegment(segment)
  } else {
    typedDigitsTimeout = setTimeout(() => {
      typedDigits = ''
    }, 1000)
  }
}

function focusNextSegment(segment: Segment) {
  const index = segments.value.indexOf(segment)
  const next = segments.value[index + 1]
  if (next) {
    rootRef.value?.querySelector<HTMLElement>(`[data-segment="${next}"]`)?.focus()
  }
}

function onSegmentBlur() {
  typedDigits = ''
}

async function focus() {
  await nextTick()
  rootRef.value?.querySelector<HTMLElement>('[data-segment="hours"]')?.focus()
}
</script>

<template>
  <div
    ref="rootRef"
    role="group"
    :aria-label="label || undefined"
    class="flex items-center justify-center"
  >
    <template v-for="(segment, index) in segments" :key="segment">
      <span
        v-if="index > 0"
        class="px-0.5 text-lg font-medium text-gray-900 dark:text-gray-50"
        aria-hidden="true"
        >:</span
      >
      <div class="flex flex-col items-center gap-1">
        <!-- the buttons are for the mouse and touch screen readers, the keyboard uses the spin
          button: they are not in the tab order, and a click leaves the focus on the spin button -->
        <button
          type="button"
          tabindex="-1"
          :aria-label="getStepLabel(segment, 1)"
          :class="stepButtonStyle"
          @mousedown.prevent
          @click="increment(segment, 1)"
        >
          <FontAwesomeIcon :icon="faChevronUp" class="size-3" aria-hidden="true" />
        </button>
        <div
          role="spinbutton"
          tabindex="0"
          :data-segment="segment"
          :class="valueStyle"
          :aria-label="getLabel(segment)"
          :aria-valuenow="getDisplayValue(segment)"
          :aria-valuemin="getRange(segment)[0]"
          :aria-valuemax="getRange(segment)[1]"
          :aria-valuetext="getValueText(segment)"
          @keydown="onSegmentKeydown($event, segment)"
          @blur="onSegmentBlur"
        >
          {{ String(getDisplayValue(segment)).padStart(2, '0') }}
        </div>
        <button
          type="button"
          tabindex="-1"
          :aria-label="getStepLabel(segment, -1)"
          :class="stepButtonStyle"
          @mousedown.prevent
          @click="increment(segment, -1)"
        >
          <FontAwesomeIcon :icon="faChevronDown" class="size-3" aria-hidden="true" />
        </button>
      </div>
    </template>
    <!-- AM and PM, a spin button with two values; a click changes it -->
    <div
      v-if="is12HourClock"
      role="spinbutton"
      tabindex="0"
      :class="periodStyle"
      :aria-label="dayPeriodLabel"
      :aria-valuenow="isPm ? 1 : 0"
      aria-valuemin="0"
      aria-valuemax="1"
      :aria-valuetext="dayPeriodNames[isPm ? 1 : 0]"
      @click="togglePeriod"
      @keydown="onPeriodKeydown"
    >
      {{ dayPeriodNames[isPm ? 1 : 0] }}
    </div>
  </div>
</template>
