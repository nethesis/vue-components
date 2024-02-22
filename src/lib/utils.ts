// Copyright (C) 2024 Nethesis S.r.l.
// SPDX-License-Identifier: AGPL-3.0-or-later

import { round } from 'lodash-es'
import { nextTick } from 'vue'

/**
 * Sort function to order array elements by a specific property (for array of objects) or by a specific index (for arrays of arrays)
 *
 */
export const sortByProperty = (property: string | number) => {
  return function (a: any, b: any) {
    if (a[property] < b[property]) {
      return -1
    }
    if (a[property] > b[property]) {
      return 1
    }
    return 0
  }
}

/**
 * Set the focus on an element. To set the focus on a custom component, it needs to expose focus() function (see NeTextInput for an example)
 *
 */
export const focusElement = (elementRef: any) => {
  nextTick(() => {
    if (elementRef && elementRef.value) {
      elementRef.value.focus()
    }
  })
}

/**
 * Returns a i18n key for an error returned by Axios
 *
 */
export const getAxiosErrorMessage = (error: any) => {
  if (error.message === 'Network Error') {
    return 'error.network_error'
  }

  if (/^timeout of .+ exceeded$/.test(error.message)) {
    // axios timeout reached
    return 'error.network_timeout'
  }

  if (error.response) {
    switch (error.response.status) {
      case 401:
        return 'error.http_401'
      case 403:
        return 'error.http_403'
      case 404:
        return 'error.http_404'
      case 500:
        return 'error.http_500'
    }
  }
  return 'error.generic_error'
}

/**
 * Format a byte size according to the International Electrotechnical Commission (IEC), using 1024 as multiple factor
 *
 * @param byteSize the number of bytes to format
 * @returns a string representing the byte size with the appropriate unit
 */
export const byteFormat1024 = (byteSize: number) => {
  switch (true) {
    case isNaN(byteSize) || (!byteSize && byteSize !== 0):
      return '-'
    case byteSize >= 0 && byteSize < 1024:
      return byteSize + ' B'
    case byteSize >= 1024 && byteSize < Math.pow(1024, 2):
      return round(byteSize / 1024, 2) + ' KiB'
    case byteSize >= Math.pow(1024, 2) && byteSize < Math.pow(1024, 3):
      return round(byteSize / Math.pow(1024, 2), 2) + ' MiB'
    case byteSize >= Math.pow(1024, 3) && byteSize < Math.pow(1024, 4):
      return round(byteSize / Math.pow(1024, 3), 2) + ' GiB'
    default:
      return round(byteSize / Math.pow(1024, 4), 2) + ' TiB'
  }
}

/**
 * Format a byte size according to the International System of Units (SI), using 1000 as multiple factor
 *
 * @param byteSize the number of bytes to format
 * @returns a string representing the byte size with the appropriate unit
 */
export const byteFormat1000 = (byteSize: number) => {
  switch (true) {
    case isNaN(byteSize) || (!byteSize && byteSize !== 0):
      return '-'
    case byteSize >= 0 && byteSize < 1000:
      return byteSize + ' B'
    case byteSize >= 1000 && byteSize < Math.pow(1000, 2):
      return round(byteSize / 1000, 2) + ' kB'
    case byteSize >= Math.pow(1000, 2) && byteSize < Math.pow(1000, 3):
      return round(byteSize / Math.pow(1000, 2), 2) + ' MB'
    case byteSize >= Math.pow(1000, 3) && byteSize < Math.pow(1000, 4):
      return round(byteSize / Math.pow(1000, 3), 2) + ' GB'
    default:
      return round(byteSize / Math.pow(1000, 4), 2) + ' TB'
  }
}

/**
 * Format kilobits per second (kbps, typically a network speed)
 *
 * @param kbps the number of kilobits to format
 * @returns a string representing the input value with the appropriate unit
 */
export const kbpsFormat = (kbps: number) => {
  switch (true) {
    case isNaN(kbps) || (!kbps && kbps !== 0):
      return '-'
    case kbps >= 0 && kbps < 1000:
      return round(kbps, 2) + ' kbps'
    case kbps >= 1000 && kbps < Math.pow(1000, 2):
      return round(kbps / 1000, 2) + ' Mbps'
    case kbps >= Math.pow(1000, 2) && kbps < Math.pow(1000, 3):
      return round(kbps / Math.pow(1000, 2), 2) + ' Gbps'
    default:
      return round(kbps / Math.pow(1000, 3), 2) + ' Tbps'
  }
}
