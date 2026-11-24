//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

// Internal helpers of NeCalendar and NeDatePicker. Calendar days are handled as Date objects at
// local midnight, and exchanged with the products as 'yyyy-MM-dd' strings, which carry no time
// zone.

import { format, isValid, parse, startOfDay } from 'date-fns'
import { TZDate } from '@date-fns/tz'

export type DateField = 'day' | 'month' | 'year'

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

/**
 * Return the locale if Intl supports it, undefined (the browser language) otherwise.
 */
export function resolveLocale(locale?: string): string | undefined {
  if (!locale) {
    return undefined
  }
  try {
    return Intl.getCanonicalLocales(locale)[0]
  } catch {
    return undefined
  }
}

/**
 * Format a calendar day as 'yyyy-MM-dd'.
 */
export function formatIsoDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Parse a 'yyyy-MM-dd' string into a Date at local midnight, or null if it is not a valid day.
 */
export function parseIsoDate(value?: string | null): Date | null {
  if (!value || !ISO_DATE_REGEX.test(value)) {
    return null
  }
  const date = parse(value, 'yyyy-MM-dd', new Date())
  return isValid(date) ? date : null
}

/**
 * First day of the week of the locale: 0 is Sunday, 1 is Monday. Monday when the browser can't
 * tell.
 */
export function getLocaleWeekStart(locale?: string): number {
  try {
    const intlLocale = new Intl.Locale(
      locale ?? new Intl.DateTimeFormat().resolvedOptions().locale
    ) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number }
      weekInfo?: { firstDay: number }
    }
    const weekInfo = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo
    if (weekInfo?.firstDay) {
      // Intl uses 1 for Monday and 7 for Sunday
      return weekInfo.firstDay % 7
    }
  } catch {
    // fall back to Monday
  }
  return 1
}

/**
 * Order of day, month and year in a numeric date of the locale: day, month, year in Italian;
 * month, day, year in American English.
 */
export function getDateFieldOrder(locale?: string): DateField[] {
  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).formatToParts(new Date(2026, 10, 24))
  return parts
    .map((part) => part.type)
    .filter((type): type is DateField => type === 'day' || type === 'month' || type === 'year')
}

/**
 * Format a calendar day as a numeric date of the locale: 24/11/2026 in Italian, 11/24/2026 in
 * American English.
 */
export function formatLocalizedDate(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

/**
 * Parse a date typed by the user, in the numeric format of the locale, with any separator
 * (24/11/2026, 24.11.2026, 24-11-26), or as 'yyyy-MM-dd'. Two-digit years are in the 2000s.
 * Return null if the text is not a valid day.
 */
export function parseLocalizedDate(text: string, locale?: string): Date | null {
  const trimmed = text.trim()
  let numbers: string[]
  let order: DateField[]

  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
    numbers = trimmed.split('-')
    order = ['year', 'month', 'day']
  } else {
    numbers = trimmed.split(/\D+/).filter(Boolean)
    order = getDateFieldOrder(locale)
  }

  if (numbers.length !== 3 || order.length !== 3) {
    return null
  }
  const fields: Partial<Record<DateField, string>> = {}
  order.forEach((field, index) => {
    fields[field] = numbers[index]
  })

  const yearText = fields.year ?? ''
  if (yearText.length !== 2 && yearText.length !== 4) {
    return null
  }
  const year = Number(yearText) + (yearText.length === 2 ? 2000 : 0)
  const month = Number(fields.month)
  const day = Number(fields.day)
  const date = new Date(year, month - 1, day)

  // reject days that don't exist, such as 31/02, which Date moves to March
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }
  return date
}

/**
 * True if the calendar day can be selected: within min and max ('yyyy-MM-dd', both included),
 * and not disabled by isDateDisabled.
 */
export function isDaySelectable(
  date: Date,
  min?: string,
  max?: string,
  isDateDisabled?: (date: Date) => boolean
): boolean {
  const day = startOfDay(date)
  const minDate = parseIsoDate(min)
  const maxDate = parseIsoDate(max)

  if (minDate && day < minDate) {
    return false
  }
  if (maxDate && day > maxDate) {
    return false
  }
  return !isDateDisabled?.(day)
}

// Times of day

export type TimeParts = { hours: number; minutes: number; seconds: number }

export type DayAndTime = { day: string; time: TimeParts }

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/

/**
 * Parse a 'HH:mm' or 'HH:mm:ss' string, or return null if it is not a valid time.
 */
export function parseTimeString(value?: string | null): TimeParts | null {
  const match = value?.match(TIME_REGEX)
  if (!match) {
    return null
  }
  return { hours: Number(match[1]), minutes: Number(match[2]), seconds: Number(match[3] ?? 0) }
}

/**
 * Format a time as 'HH:mm', or 'HH:mm:ss' with seconds.
 */
export function formatTimeString(time: TimeParts, withSeconds = false): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  const text = `${pad(time.hours)}:${pad(time.minutes)}`
  return withSeconds ? `${text}:${pad(time.seconds)}` : text
}

/**
 * Seconds from midnight, to compare times.
 */
export function timeToSeconds(time: TimeParts): number {
  return time.hours * 3600 + time.minutes * 60 + time.seconds
}

/**
 * True if the locale uses the 12-hour clock, with AM and PM.
 */
export function uses12HourClock(locale?: string): boolean {
  const hourCycle = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle
  return hourCycle === 'h11' || hourCycle === 'h12'
}

/**
 * The names of AM and PM in the locale.
 */
export function getDayPeriodNames(locale?: string): [string, string] {
  const format = (hours: number) =>
    new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true })
      .formatToParts(new Date(2026, 0, 1, hours))
      .find((part) => part.type === 'dayPeriod')?.value ?? (hours < 12 ? 'AM' : 'PM')
  return [format(9), format(21)]
}

/**
 * Format a time of day in the format of the locale: 14:30 in Italian, 02:30 PM in American
 * English.
 */
export function formatLocalizedTime(time: TimeParts, locale?: string, withSeconds = false): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined
  }).format(new Date(2026, 0, 1, time.hours, time.minutes, time.seconds))
}

/**
 * Format a moment as date and time in the format of the locale, in the time zone if given, with
 * the short name of the time zone: 24/11/2026, 14:30 CET.
 */
export function formatLocalizedDateTime(
  date: Date,
  locale?: string,
  withSeconds = false,
  timeZone?: string
): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
    timeZone: timeZone || undefined,
    timeZoneName: timeZone ? 'short' : undefined
  }).format(date)
}

/**
 * The calendar day and the time of a moment, in the time zone if given, in the browser time zone
 * otherwise.
 */
export function getDayAndTime(date: Date, timeZone?: string): DayAndTime {
  const zoned = timeZone ? new TZDate(date.getTime(), timeZone) : date
  return {
    day: formatIsoDate(zoned),
    time: { hours: zoned.getHours(), minutes: zoned.getMinutes(), seconds: zoned.getSeconds() }
  }
}

/**
 * The moment of a calendar day ('yyyy-MM-dd') and a time, in the time zone if given, in the
 * browser time zone otherwise. A time skipped by daylight saving time moves forward.
 */
export function toMoment(day: string, time: TimeParts, timeZone?: string): Date | null {
  const date = parseIsoDate(day)
  if (!date) {
    return null
  }
  const args = [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.hours,
    time.minutes,
    time.seconds
  ] as const
  return timeZone ? new Date(new TZDate(...args, 0, timeZone).getTime()) : new Date(...args)
}

/**
 * Parse a time typed by the user: 14:30, 14.30, 2:30 pm, 2:30:15 PM. Return null if the text is
 * not a valid time.
 */
export function parseLocalizedTime(text: string, dayPeriods?: [string, string]): TimeParts | null {
  const match = text.trim().match(/^(\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?\s*([^\d\s:.]+\.?)?$/u)
  if (!match) {
    return null
  }
  let hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = Number(match[3] ?? 0)
  const period = match[4]?.toLowerCase().replace(/\./g, '')

  if (period) {
    const [am, pm] = (dayPeriods ?? ['AM', 'PM']).map((name) =>
      name.toLowerCase().replace(/\./g, '')
    )
    const isAm = period === am || period === 'am' || period === 'a'
    const isPm = period === pm || period === 'pm' || period === 'p'
    if ((!isAm && !isPm) || hours < 1 || hours > 12) {
      return null
    }
    hours = (hours % 12) + (isPm ? 12 : 0)
  }
  if (hours > 23 || minutes > 59 || seconds > 59) {
    return null
  }
  return { hours, minutes, seconds }
}

/**
 * Parse a date and time typed by the user, such as 24/11/2026, 14:30 or 11/24/2026 2:30 PM.
 */
export function parseLocalizedDateTime(
  text: string,
  locale?: string,
  dayPeriods?: [string, string]
): DayAndTime | null {
  const match = text.trim().match(/^(.*?)[,\s]+(\d{1,2}[:.]\d{2}.*)$/u)
  if (!match) {
    return null
  }
  const date = parseLocalizedDate(match[1], locale)
  const time = parseLocalizedTime(match[2], dayPeriods)
  return date && time ? { day: formatIsoDate(date), time } : null
}
