//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { addDays, addHours, format, isWeekend, setHours, startOfHour, startOfMonth } from 'date-fns'

import { NeDatePicker, type NeDatePickerPreset } from '../src/main'

const meta = {
  title: 'Components/NeDatePicker',
  component: NeDatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "A field to choose a day, a date and time, or a time of day, in forms and filters. `type` sets the value: `'date'` (default) is a `'yyyy-MM-dd'` string, which carries no time zone; `'datetime'` is a `Date`, a moment; `'time'` is a `'HH:mm'` string, `'HH:mm:ss'` with `showSeconds`. An empty value is `''`, `null` for `'datetime'`. `min` and `max` have the same type as the value; `isDateDisabled` disables other days. `'datetime'` is shown and chosen in the browser time zone, or in `timeZone`, an IANA name such as `'Europe/Rome'`, whose name is shown after the time; an invalid `timeZone` falls back to the browser time zone. `minuteStep` sets the step of the minutes. For `'date'`, a click on a day applies it; for `'datetime'` and `'time'`, the popup has Cancel and Select buttons. `autoApply` changes this. `range` chooses a range of days, as `[first, last]`, `null` when empty, with two clicks; it is only for `'date'`. `presets` adds values to choose with a click next to the calendar, such as `Last 7 days`: each has a `label`, translated by the product, and a `value`, or a function that returns it when the preset is chosen. A preset outside `min` and `max`, or on a disabled day, is disabled. The library has no presets of its own. `textInput` also lets the user type the value in the format of the `locale`, such as `24/11/2026, 14:30` in Italian. Month and day names, the date and time format, the 12 or 24-hour clock and the first day of the week come from `locale`, the browser language if empty; `hourCycle` sets the clock regardless of the language. The popup works inside NeSideDrawer and NeModal, with the keyboard support of the WAI-ARIA date picker dialog and spin button patterns. The `trigger` slot replaces the field with a custom button, which binds the `triggerAttrs` and calls `toggle` of the slot; the `popup-header` slot adds content above the calendar, with a `clear` function. For a date range filter next to NeDropdownFilterV2, use NeDateRangeFilter. For a start and an end, use two NeDatePicker fields: set the `min` of the end field to the start and the `max` of the start field to the end. Its label, helper text and validation messages follow [Forms](https://nethesis.github.io/nebula-design-system/?page=writing-guidelines#forms) in the writing guidelines."
      }
    }
  },
  // default values
  args: {
    type: 'date',
    label: 'Expiration date',
    modelValue: '',
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
    locale: 'en',
    weekStart: undefined,
    timeZone: '',
    minuteStep: 1,
    showSeconds: false,
    hourCycle: undefined,
    autoApply: undefined,
    textInput: false,
    clearable: true,
    range: false,
    presets: [],
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
} satisfies Meta<typeof NeDatePicker>

export default meta
type Story = StoryObj<typeof meta>

// keep the value in the story, so that the chosen day is shown
const render: Story['render'] = (args) => ({
  components: { NeDatePicker },
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
  template: '<NeDatePicker v-bind="args" v-model="value" class="max-w-xs" />'
})

export const Default: Story = {
  render,
  args: {}
}

export const WithValue: Story = {
  render,
  args: { modelValue: '2026-11-24' }
}

export const Placeholder: Story = {
  render,
  args: { placeholder: 'Choose a date' }
}

export const HelperText: Story = {
  render,
  args: { helperText: 'After this date, the license must be renewed.' }
}

export const MinAndMax: Story = {
  render,
  args: {
    label: 'Start date',
    modelValue: '2026-11-24',
    min: '2026-11-10',
    max: '2026-12-20',
    helperText: 'From November 10 to December 20, 2026.'
  }
}

export const DisabledDates: Story = {
  render,
  args: {
    label: 'Appointment date',
    modelValue: '2026-11-24',
    isDateDisabled: (date: Date) => isWeekend(date),
    helperText: 'Weekdays only.'
  }
}

export const TextInput: Story = {
  render,
  args: {
    textInput: true,
    placeholder: 'mm/dd/yyyy',
    helperText: 'For example, 11/24/2026.'
  }
}

export const CancelAndSelect: Story = {
  render,
  args: { autoApply: false }
}

const iso = (date: Date) => format(date, 'yyyy-MM-dd')

const rangePresets: NeDatePickerPreset[] = [
  { label: 'Today', value: () => [iso(new Date()), iso(new Date())] },
  { label: 'Last 7 days', value: () => [iso(addDays(new Date(), -6)), iso(new Date())] },
  { label: 'Last 30 days', value: () => [iso(addDays(new Date(), -29)), iso(new Date())] },
  { label: 'This month', value: () => [iso(startOfMonth(new Date())), iso(new Date())] }
]

export const Range: Story = {
  render,
  args: {
    label: 'Date range',
    range: true,
    modelValue: ['2026-11-10', '2026-11-18']
  }
}

export const RangeWithPresets: Story = {
  render,
  args: {
    label: 'Date range',
    range: true,
    presets: rangePresets,
    max: iso(new Date()),
    helperText: 'Up to today.'
  }
}

export const RangeTextInput: Story = {
  render,
  args: {
    label: 'Date range',
    range: true,
    textInput: true,
    placeholder: 'mm/dd/yyyy – mm/dd/yyyy',
    helperText: 'For example, 11/10/2026 – 11/18/2026.'
  }
}

export const DatePresets: Story = {
  render,
  args: {
    label: 'Expiration date',
    presets: [
      { label: 'Tomorrow', value: () => iso(addDays(new Date(), 1)) },
      { label: 'In a week', value: () => iso(addDays(new Date(), 7)) },
      { label: 'In a month', value: () => iso(addDays(new Date(), 30)) }
    ]
  }
}

export const DateAndTimePresets: Story = {
  render,
  args: {
    type: 'datetime',
    label: 'Mute end',
    presets: [
      { label: 'Next hour', value: () => addHours(startOfHour(new Date()), 1) },
      {
        label: 'Tomorrow at 9:00 AM',
        value: () => setHours(startOfHour(addDays(new Date(), 1)), 9)
      }
    ]
  }
}

export const DateAndTime: Story = {
  render,
  args: {
    type: 'datetime',
    label: 'Mute end',
    modelValue: new Date(2026, 10, 24, 14, 30)
  }
}

export const DateAndTimeAutoApply: Story = {
  render,
  args: {
    type: 'datetime',
    label: 'Update time',
    modelValue: new Date(2026, 10, 24, 3, 0),
    autoApply: true,
    minuteStep: 15
  }
}

export const DateAndTimeMin: Story = {
  render,
  args: {
    type: 'datetime',
    label: 'Mute end',
    min: new Date(2026, 10, 24, 9, 30),
    helperText: 'From November 24, 2026, 09:30.'
  }
}

export const TimeZone: Story = {
  render,
  args: {
    type: 'datetime',
    label: 'Update time',
    modelValue: new Date('2026-11-24T08:00:00Z'),
    timeZone: 'America/New_York',
    helperText: 'In the time zone of the unit, New York.'
  }
}

export const DateAndTimeWithSeconds: Story = {
  render,
  args: {
    type: 'datetime',
    label: 'Start time',
    modelValue: new Date(2026, 10, 24, 14, 30, 15),
    showSeconds: true,
    textInput: true,
    helperText: 'For example, 11/24/2026, 02:30:15 PM.'
  }
}

export const HourCycle: Story = {
  render,
  args: {
    type: 'datetime',
    label: 'Update time',
    modelValue: new Date(2026, 10, 24, 14, 30),
    hourCycle: 'h23'
  }
}

export const Time: Story = {
  render,
  args: {
    type: 'time',
    label: 'Automatic check-out',
    modelValue: '18:30',
    clearable: false
  }
}

export const TimeMinAndMax: Story = {
  render,
  args: {
    type: 'time',
    label: 'Opening time',
    min: '08:00',
    max: '18:00',
    minuteStep: 5,
    textInput: true,
    helperText: 'From 08:00 to 18:00.'
  }
}

export const WeekStartsOnSunday: Story = {
  render,
  args: { weekStart: 0 }
}

export const Optional: Story = {
  render,
  args: { optional: true }
}

export const NotClearable: Story = {
  render,
  args: { modelValue: '2026-11-24', clearable: false }
}

export const Invalid: Story = {
  render,
  args: { invalidMessage: 'Select an expiration date' }
}

export const Disabled: Story = {
  render,
  args: { modelValue: '2026-11-24', disabled: true }
}

export const Italian: Story = {
  render,
  args: {
    label: 'Data di scadenza',
    type: 'datetime',
    modelValue: new Date(2026, 10, 24, 14, 30),
    locale: 'it',
    textInput: true,
    placeholder: 'gg/mm/aaaa, hh:mm',
    helperText: 'Ad esempio, 24/11/2026, 14:30.',
    optionalLabel: 'Facoltativo',
    chooseDateLabel: 'Scegli la data',
    chooseTimeLabel: "Scegli l'ora",
    clearLabel: 'Azzera',
    cancelLabel: 'Annulla',
    selectLabel: 'Seleziona',
    invalidDateLabel: 'Inserisci una data valida',
    invalidDateTimeLabel: 'Inserisci una data e un orario validi',
    invalidTimeLabel: 'Inserisci un orario valido',
    unavailableDateLabel: 'Questa data non è disponibile',
    unavailableTimeLabel: 'Questo orario non è disponibile',
    previousMonthLabel: 'Mese precedente',
    nextMonthLabel: 'Mese successivo',
    previousYearLabel: 'Anno precedente',
    nextYearLabel: 'Anno successivo',
    previousYearsLabel: 'Anni precedenti',
    nextYearsLabel: 'Anni successivi',
    chooseMonthLabel: 'Scegli il mese',
    chooseYearLabel: "Scegli l'anno",
    chooseEndDateLabel: 'Scegli la data di fine',
    hoursLabel: 'Ore',
    minutesLabel: 'Minuti',
    secondsLabel: 'Secondi',
    dayPeriodLabel: 'AM/PM',
    increaseHoursLabel: 'Aumenta le ore',
    decreaseHoursLabel: 'Diminuisci le ore',
    increaseMinutesLabel: 'Aumenta i minuti',
    decreaseMinutesLabel: 'Diminuisci i minuti',
    increaseSecondsLabel: 'Aumenta i secondi',
    decreaseSecondsLabel: 'Diminuisci i secondi'
  }
}
