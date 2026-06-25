// Copyright (C) 2024 Nethesis S.r.l.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { enGB, it } from 'date-fns/locale'
import { format, utcToZonedTime } from 'date-fns-tz'
import { formatDistanceToNowStrict, formatDuration, intervalToDuration } from 'date-fns'

/**
 * Format a date expressed in milliseconds to current locale
 *
 */
export function formatDateLoc(date: any, fmt: string) {
  return format(date, fmt, { locale: getDateFnsLocale() })
}

export const formatInTimeZoneLoc = (date: any, fmt: string, tz: any) => {
  return format(utcToZonedTime(date, tz), fmt, { timeZone: tz, locale: getDateFnsLocale() })
}

/**
 * Get date-fns locale. Accepts optional two-letter locale string (e.g., 'en', 'it').
 * Defaults to browser language via navigator.language. Falls back to English.
 */
export const getDateFnsLocale = (localeArg?: string) => {
  let loc = enGB
  const lang = localeArg || navigator?.language.substring(0, 2)

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
 * @param seconds - duration to format
 *
 */
export function formatDurationLoc(durationSeconds: number, options: any = {}) {
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
 */
export function humanDistanceToNowLoc(date: Date, options: any = {}) {
  if (!date) {
    return null
  }
  return formatDistanceToNowStrict(date, { ...options, locale: getDateFnsLocale() })
}
