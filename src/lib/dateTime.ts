// Copyright (C) 2024 Nethesis S.r.l.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { enGB, it } from 'date-fns/locale'
import { format, utcToZonedTime } from 'date-fns-tz'
import { formatDistanceToNowStrict, formatDuration, intervalToDuration } from 'date-fns'
import { capitalizeFirst } from './utils'

const RELATIVE_DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' }
]

/**
 * Format a date expressed in milliseconds to current locale
 *
 */
export function formatDateLoc(date: Date | number, fmt: string) {
  return format(date, fmt, { locale: getDateFnsLocale() })
}

export const formatInTimeZoneLoc = (date: Date | string | number, fmt: string, tz: string) => {
  return format(utcToZonedTime(date, tz), fmt, { timeZone: tz, locale: getDateFnsLocale() })
}

export const getBrowserLocale = () => {
  return navigator?.language.substring(0, 2) || 'en'
}

/**
 * Get date-fns locale. Accepts optional two-letter locale string (e.g., 'en', 'it').
 * Defaults to browser language via navigator.language. Falls back to English.
 */
export const getDateFnsLocale = (localeArg?: string) => {
  let loc = enGB
  const lang = localeArg || getBrowserLocale()

  if (lang) {
    switch (lang) {
      case 'it':
        loc = it
        break
      // add other supported languages
    }
  }
  return loc
}

/**
 * Format a duration expressed in seconds to a human readable value. E.g. 189 -> 3 minutes 9 seconds
 *
 * @param durationSeconds - duration to format
 * @param options - date-fns formatDuration options; 'locale' is always overridden with the current
 * locale
 *
 */
export function formatDurationLoc(
  durationSeconds: number,
  options: Parameters<typeof formatDuration>[1] = {}
) {
  if (!durationSeconds) {
    return null
  }

  return formatDuration(
    intervalToDuration({
      start: 0,
      end: durationSeconds * 1000
    }),
    { ...options, locale: getDateFnsLocale() }
  )
}

/**
 * Return the approximate and concise distance from a date to now. Example output: '2 hours'.
 * Useful to show how long ago something has happened (e.g. a notification timestamp)
 *
 * @param date - date to compare with now
 * @param options - date-fns formatDistanceToNowStrict options; 'locale' is always overridden with
 * the current locale
 *
 * @deprecated Use {@link formatRelativeTime} instead: it produces a complete relative time string
 * (e.g. '2 hours ago', 'Yesterday') instead of a bare distance, and relies on
 * Intl.RelativeTimeFormat rather than date-fns.
 */
export function humanDistanceToNowLoc(
  date: Date,
  options: Parameters<typeof formatDistanceToNowStrict>[1] = {}
) {
  if (!date) {
    return null
  }
  return formatDistanceToNowStrict(date, { ...options, locale: getDateFnsLocale() })
}

/**
 * Format a date as a relative time string against the current instant, picking the largest
 * fitting unit (second, minute, hour, day, week, month, year).
 * Past dates yield e.g. '2 hours ago', future dates 'in 2 hours'; dates within the previous or
 * next unit yield the idiomatic wording when available (e.g. 'Yesterday', 'Last month').
 * The result is capitalized.
 *
 * Strings are not accepted, because `new Date(string)` parsing is ambiguous. Build the Date at the
 * call site instead:
 * - ISO 8601 with 'Z' or an offset is safe and portable: `new Date('2026-07-27T10:00:00Z')`
 * - epoch seconds: pass the number directly, e.g. `formatRelativeTime(seconds * 1000, locale)`
 * - no offset ('2026-07-27T10:00:00') is parsed as LOCAL time; append 'Z' if the value is UTC
 * - date-only ('2026-07-27') is parsed as UTC midnight and can render as the wrong day; for local
 *   midnight use `new Date(2026, 6, 27)`
 * - other forms ('2026-07-27 10:00', '27/07/2026') are implementation-defined; do not rely on them
 *
 * @param date - date to compare with now, or a timestamp in milliseconds
 * @param locale - BCP 47 locale tag used by Intl.RelativeTimeFormat (e.g. 'en-GB', 'it')
 * @returns the formatted relative time, or '-' if the date is missing or invalid
 *
 */
export function formatRelativeTime(date: Date | number, locale: string): string {
  const validDate = toValidDate(date, 'formatRelativeTime')

  if (!validDate) {
    return '-'
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  let duration = (validDate.getTime() - Date.now()) / 1000

  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return capitalizeFirst(rtf.format(Math.round(duration), division.unit))
    }
    duration /= division.amount
  }

  return capitalizeFirst(rtf.format(Math.round(duration), 'year'))
}

/**
 * Normalize a date input to a valid Date, or null when the value is missing or not a real date.
 *
 * Accepts a Date or a timestamp in milliseconds. Strings are intentionally not accepted: parsing
 * them with `new Date(...)` is ambiguous (e.g. '2026-07-27' is UTC midnight, not local midnight)
 * and only the caller knows the format. A present but unusable value is reported on the console so
 * that the '-' rendered by the formatters is debuggable; a missing value is a legitimate absence
 * and stays silent.
 *
 * @param value - value to normalize
 * @param fnName - name of the calling formatter, used to prefix the console warning
 * @returns a valid Date, or null if the value is missing or invalid
 *
 */
function toValidDate(value: Date | number | null | undefined, fnName: string): Date | null {
  if (value == null) {
    return null
  }
  const date = value instanceof Date ? value : new Date(value)

  if (isNaN(date.getTime())) {
    console.warn(`[${fnName}] received an invalid date, rendering '-':`, value)
    return null
  }
  return date
}

/**
 * Build the Intl.DateTimeFormat options needed to render a date in a specific time zone,
 * including its short time zone name (e.g. 'GMT+2').
 *
 * @param timeZone - IANA time zone name (e.g. 'Europe/Rome'); if omitted the local time zone is used
 * @returns the time zone options, or an empty object when no time zone is given
 *
 */
function getTimeZoneOptions(timeZone?: string): Intl.DateTimeFormatOptions {
  if (!timeZone) {
    return {}
  }

  return {
    timeZone,
    timeZoneName: 'short'
  }
}

/**
 * Format a date and time using the locale conventions. Example output: '27/07/2026, 15:30:00'.
 * When a time zone is provided, the date is converted to it and the short time zone name is
 * appended (e.g. '27/07/2026, 15:30:00 GMT+2'); otherwise the local time zone is used.
 *
 * Strings are not accepted, because `new Date(string)` parsing is ambiguous. Build the Date at the
 * call site instead:
 * - ISO 8601 with 'Z' or an offset is safe and portable: `new Date('2026-07-27T10:00:00Z')`
 * - epoch seconds: pass the number directly, e.g. `formatDateTime(seconds * 1000, locale)`
 * - no offset ('2026-07-27T10:00:00') is parsed as LOCAL time; append 'Z' if the value is UTC
 * - date-only ('2026-07-27') is parsed as UTC midnight and can render as the wrong day; for local
 *   midnight use `new Date(2026, 6, 27)`
 * - other forms ('2026-07-27 10:00', '27/07/2026') are implementation-defined; do not rely on them
 *
 * @param dateTime - date to format, or a timestamp in milliseconds
 * @param locale - BCP 47 locale tag used by Date.toLocaleString (e.g. 'en-GB', 'it')
 * @param timeZone - optional IANA time zone name (e.g. 'Europe/Rome')
 * @returns the formatted date and time, or '-' if the date is missing or invalid
 *
 */
export function formatDateTime(dateTime: Date | number, locale: string, timeZone?: string): string {
  const validDate = toValidDate(dateTime, 'formatDateTime')

  if (!validDate) {
    return '-'
  }
  const options = getTimeZoneOptions(timeZone)

  return Object.keys(options).length > 0
    ? validDate.toLocaleString(locale, options)
    : validDate.toLocaleString(locale)
}

/**
 * Format a date and time using the locale conventions, omitting seconds and using an abbreviated
 * month name. Example output: '27 Jul 2026, 15:30'.
 * When a time zone is provided, the date is converted to it and the short time zone name is
 * appended (e.g. '27 Jul 2026, 15:30 GMT+2'); otherwise the local time zone is used.
 *
 * Strings are not accepted, because `new Date(string)` parsing is ambiguous. Build the Date at the
 * call site instead:
 * - ISO 8601 with 'Z' or an offset is safe and portable: `new Date('2026-07-27T10:00:00Z')`
 * - epoch seconds: pass the number directly, e.g. `formatDateTimeNoSeconds(seconds * 1000, locale)`
 * - no offset ('2026-07-27T10:00:00') is parsed as LOCAL time; append 'Z' if the value is UTC
 * - date-only ('2026-07-27') is parsed as UTC midnight and can render as the wrong day; for local
 *   midnight use `new Date(2026, 6, 27)`
 * - other forms ('2026-07-27 10:00', '27/07/2026') are implementation-defined; do not rely on them
 *
 * @param dateTime - date to format, or a timestamp in milliseconds
 * @param locale - BCP 47 locale tag used by Date.toLocaleString (e.g. 'en-GB', 'it')
 * @param timeZone - optional IANA time zone name (e.g. 'Europe/Rome')
 * @returns the formatted date and time without seconds, or '-' if the date is missing or invalid
 *
 */
export function formatDateTimeNoSeconds(
  dateTime: Date | number,
  locale: string,
  timeZone?: string
): string {
  const validDate = toValidDate(dateTime, 'formatDateTimeNoSeconds')

  if (!validDate) {
    return '-'
  }

  return validDate.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...getTimeZoneOptions(timeZone)
  })
}
