import { ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

export function useSort<T>(
  items: MaybeRefOrGetter<T[]>,
  sortKey: MaybeRefOrGetter<keyof T>,
  descending: MaybeRefOrGetter<boolean> = false,
  sortFunctions: Partial<Record<keyof T | string, (a: T, b: T) => number>> = {}
) {
  const sortedItems = ref<T[]>([])

  function defaultSortFn(a: T, b: T) {
    const sortKeyValue = toValue(sortKey)
    const valueA = a[sortKeyValue]
    const valueB = b[sortKeyValue]

    // numbers

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return valueA - valueB
    }

    // strings

    if (typeof valueA == 'string' && typeof valueB == 'string') {
      return valueA.localeCompare(valueB)
    }

    // dates

    if (valueA instanceof Date && valueB instanceof Date) {
      return valueA.getTime() - new Date(valueB).getTime()
    }

    // booleans

    if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
      return valueA === valueB ? 0 : valueA ? 1 : -1
    }

    // arrays

    if (Array.isArray(valueA) && Array.isArray(valueB)) {
      return valueA.length - valueB.length
    }

    if (typeof valueA !== 'undefined' && typeof valueB === 'undefined') {
      return -1
    } else if (typeof valueA === 'undefined' && typeof valueB !== 'undefined') {
      return 1
    } else {
      return 0
    }
  }

  watchEffect(() => {
    const itemsValue = toValue(items)
    const sortKeyValue = toValue(sortKey)
    const descendingValue = toValue(descending)

    const sortFunction = sortFunctions[sortKeyValue] || defaultSortFn

    // sort the items without mutating (slice) the original array
    sortedItems.value = itemsValue.slice().sort((a, b) => {
      const result = sortFunction(a, b)
      return descendingValue ? -result : result
    })
  })

  return {
    sortedItems
  }
}
