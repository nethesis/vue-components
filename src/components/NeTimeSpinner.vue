<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<!--
  The time of NeDatePicker: hours, minutes and seconds as spin buttons of the WAI-ARIA Authoring
  Practices, with AM and PM in locales that use the 12-hour clock.
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
    hoursLabel?: string
    minutesLabel?: string
    secondsLabel?: string
  }>(),
  {
    showSeconds: false,
    minuteStep: 1,
    locale: undefined,
    hoursLabel: 'Hours',
    minutesLabel: 'Minutes',
    secondsLabel: 'Seconds'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: TimeParts]
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

const periodStyle = `ml-2 flex h-10 min-w-11 cursor-pointer items-center justify-center rounded-md px-2 text-sm font-medium text-primary-700 ring-1 ring-gray-300 transition-colors duration-200 ring-inset hover:bg-gray-200/70 dark:text-primary-500 dark:ring-gray-600 dark:hover:bg-gray-600/30 ${focusRingStyle}`

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

function setValue(segment: Segment, value: number) {
  emit('update:modelValue', { ...props.modelValue, [segment]: value })
}

// add or remove one step, going round: after 23 comes 0, after 55 comes 0 with a step of 5
function increment(segment: Segment, direction: 1 | -1) {
  const value = getValue(segment)

  if (segment === 'hours') {
    setValue(segment, (value + direction + 24) % 24)
  } else if (segment === 'minutes') {
    const stepSize = step.value
    // move to the next multiple of the step, also from a value that is not one
    const next =
      direction === 1
        ? Math.floor(value / stepSize) * stepSize + stepSize
        : Math.ceil(value / stepSize) * stepSize - stepSize
    setValue(segment, ((next % 60) + 60) % 60)
  } else {
    setValue(segment, (value + direction + 60) % 60)
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
      setValue(segment, segment === 'hours' ? fromDisplayHours(max) : max)
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
  <div ref="rootRef" class="flex items-center justify-center">
    <template v-for="(segment, index) in segments" :key="segment">
      <span
        v-if="index > 0"
        class="px-0.5 text-lg font-medium text-gray-900 dark:text-gray-50"
        aria-hidden="true"
        >:</span
      >
      <div class="flex flex-col items-center gap-1">
        <!-- the buttons are for the mouse: the spin button has the keyboard and its value -->
        <button
          type="button"
          tabindex="-1"
          aria-hidden="true"
          :class="stepButtonStyle"
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
          aria-hidden="true"
          :class="stepButtonStyle"
          @click="increment(segment, -1)"
        >
          <FontAwesomeIcon :icon="faChevronDown" class="size-3" aria-hidden="true" />
        </button>
      </div>
    </template>
    <button v-if="is12HourClock" type="button" :class="periodStyle" @click="togglePeriod">
      {{ dayPeriodNames[isPm ? 1 : 0] }}
    </button>
  </div>
</template>
