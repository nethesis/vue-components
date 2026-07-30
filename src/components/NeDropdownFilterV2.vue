<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts" generic="T extends NeDropdownFilterV2Option = NeDropdownFilterV2Option">
import { ref, shallowRef, watch, computed, useId } from 'vue'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { isEqual } from 'lodash-es'
import NeBadgeV2 from './NeBadgeV2.vue'
import NeLink from './NeLink.vue'
import NeSkeleton from './NeSkeleton.vue'
import type { ButtonSize } from './NeButton.vue'
import NeTextInput from './NeTextInput.vue'
import { focusElement } from '../lib/utils'

export type FilterKind = 'radio' | 'checkbox'

export type NeDropdownFilterV2Option = {
  id: string
  label: string
  description?: string
  disabled?: boolean
}

export type NeDropdownFilterV2OptionGroup<
  T extends NeDropdownFilterV2Option = NeDropdownFilterV2Option
> = {
  group: string
  options: T[]
}

const sizeStyle: { [index: string]: string } = {
  xs: 'rounded px-2 py-1 text-xs',
  sm: 'rounded px-2 py-1 text-sm',
  md: 'rounded-md px-2.5 py-1.5 text-sm',
  lg: 'rounded-md px-3 py-2 text-sm',
  xl: 'rounded-md px-3.5 py-2.5 text-sm'
}

const props = withDefaults(
  defineProps<{
    label: string
    options: (T | NeDropdownFilterV2OptionGroup<T>)[]
    kind: FilterKind
    clearFilterLabel: string
    openMenuAriaLabel: string
    showClearFilter?: boolean
    showSelectionCount?: boolean
    showRadioSelection?: boolean
    noOptionsLabel: string
    showOptionsFilter?: boolean
    optionsFilterPlaceholder?: string
    // limit the number of options displayed for performance
    maxOptionsShown?: number
    moreOptionsHiddenLabel: string
    alignToRight?: boolean
    size?: ButtonSize
    disabled?: boolean
    id?: string
    clearSearchLabel: string
    externalFilter?: boolean
    loadingOptions?: boolean
    customActionLabel?: string
  }>(),
  {
    showClearFilter: true,
    showSelectionCount: true,
    showRadioSelection: false,
    showOptionsFilter: false,
    clearSearchLabel: 'Clear',
    optionsFilterPlaceholder: '',
    maxOptionsShown: 25,
    alignToRight: false,
    size: 'md',
    disabled: false,
    id: '',
    externalFilter: false,
    loadingOptions: false,
    customActionLabel: ''
  }
)

const emit = defineEmits<{
  search: [query: string]
  customAction: []
}>()

const model = defineModel<T[]>({ default: () => [] })
const radioModel = ref('')
const checkboxModel = ref<string[]>([])
// selected options hoisted to the top of the list, frozen while the menu is open
const selectionSnapshot = shallowRef<T[]>([])
const isMenuOpen = ref(false)
const top = ref(0)
const left = ref(0)
const right = ref(0)
const buttonRef = ref()
const optionsFilter = ref('')
const optionsFilterRef = ref()

const generatedId = useId()
const componentId = computed(() => (props.id ? props.id : generatedId))

// Show badge when checkbox mode + items selected
const isSelectionCountShown = computed(() => {
  return props.showSelectionCount && props.kind == 'checkbox' && checkboxModel.value.length > 0
})

// Get radio selection label for display
const currentRadioSelectionLabel = computed(() => {
  if (!props.showRadioSelection || props.kind !== 'radio' || !radioModel.value) {
    return ''
  }
  return resolveOption(radioModel.value)?.label ?? ''
})

// Find option by id, check props.options first then model (preserve selected but not shown options)
function resolveOption(id: string): T {
  return (
    allFlatOptions.value.find((o) => o.id === id) ??
    model.value?.find((o) => o.id === id) ??
    ({ id, label: id } as T)
  )
}

// Flatten grouped + ungrouped options
const allFlatOptions = computed((): T[] => {
  return props.options.flatMap((item) => (isFilterOptionGroup(item) ? item.options : [item]))
})

// Show search filter when many options or forced
const isShowingOptionsFilter = computed(() => {
  return props.showOptionsFilter || allFlatOptions.value.length > props.maxOptionsShown
})

// Filter options by search query (skip if external filter or no search enabled)
const filteredOptions = computed((): T[] => {
  if (props.externalFilter || !isShowingOptionsFilter.value) {
    return allFlatOptions.value
  }

  const queryText = normalizeSearchText(optionsFilter.value)

  // build a set of matching option IDs, also matching group names
  const matchingIds = new Set<string>()

  for (const entry of props.options) {
    if (isFilterOptionGroup(entry)) {
      const groupMatches = matchesSearchQuery(entry.group, queryText)

      for (const opt of entry.options) {
        if (groupMatches || optionMatchesSearchQuery(opt, queryText)) {
          matchingIds.add(opt.id)
        }
      }
    } else {
      if (optionMatchesSearchQuery(entry, queryText)) {
        matchingIds.add(entry.id)
      }
    }
  }

  return allFlatOptions.value.filter((opt) => matchingIds.has(opt.id))
})

// Pinned selections still matching the search query. Options coming from props.options
// reuse the filteredOptions result (so a group name match keeps them, and with
// externalFilter the caller's own filtering wins); selections that are not part of
// props.options are matched on their label and description
const visiblePinnedOptions = computed((): T[] => {
  if (!optionsFilter.value || !isShowingOptionsFilter.value) {
    return selectionSnapshot.value
  }

  const filteredIds = new Set(filteredOptions.value.map((o) => o.id))
  const knownIds = new Set(allFlatOptions.value.map((o) => o.id))
  const queryText = normalizeSearchText(optionsFilter.value)

  return selectionSnapshot.value.filter((o) =>
    knownIds.has(o.id) ? filteredIds.has(o.id) : optionMatchesSearchQuery(o, queryText)
  )
})

// Pinned selections consume the maxOptionsShown budget first, so the total number of
// rendered options never exceeds it
const pinnedItems = computed((): T[] => {
  return visiblePinnedOptions.value.slice(0, props.maxOptionsShown)
})

// Build list with group headers + options, respecting the remaining maxOptionsShown budget.
// Pinned selections are skipped here to avoid rendering an option twice
const displayItems = computed(() => {
  const filteredSet = new Set(filteredOptions.value.map((o) => o.id))
  const pinnedIds = new Set(selectionSnapshot.value.map((o) => o.id))
  const maxOptions = props.maxOptionsShown - pinnedItems.value.length
  const items: {
    type: 'group' | 'option' | 'divider'
    label?: string
    option?: T
    key: string
  }[] = []
  let optionCount = 0

  for (const entry of props.options) {
    if (optionCount >= maxOptions) break

    if (isFilterOptionGroup(entry)) {
      const visibleOptions = entry.options.filter(
        (o) => filteredSet.has(o.id) && !pinnedIds.has(o.id)
      )
      if (visibleOptions.length === 0) continue

      items.push({ type: 'group', label: entry.group, key: `group-${entry.group}` })
      for (const opt of visibleOptions) {
        if (optionCount >= maxOptions) break
        if (isDivider(opt)) {
          items.push({ type: 'divider', key: opt.id })
          continue
        }
        items.push({ type: 'option', option: opt, key: opt.id })
        optionCount++
      }
    } else if (isDivider(entry)) {
      // dividers are not options: they don't consume the maxOptionsShown budget
      items.push({ type: 'divider', key: entry.id })
    } else {
      if (!filteredSet.has(entry.id) || pinnedIds.has(entry.id)) continue
      items.push({ type: 'option', option: entry, key: entry.id })
      optionCount++
    }
  }

  // drop group headers and dividers that ended up with no option after them, as well as
  // leading and repeated dividers (e.g. when the options around them are pinned or filtered out)
  while (items.length > 0 && items[items.length - 1].type !== 'option') {
    items.pop()
  }
  return items.filter(
    (item, index) => item.type !== 'divider' || items[index - 1]?.type === 'option'
  )
})

// IDs of options visible after filter + limit (not pinned)
const displayedOptionIds = computed(() => {
  return new Set(
    displayItems.value.filter((item) => item.type === 'option').map((item) => item.option!.id)
  )
})

// True when some options matching the current filter are left out of the rendered list
const moreOptionsHidden = computed(() => {
  const shownIds = new Set([...pinnedItems.value.map((o) => o.id), ...displayedOptionIds.value])
  return (
    pinnedItems.value.length < visiblePinnedOptions.value.length ||
    filteredOptions.value.some((o) => !isDivider(o) && !shownIds.has(o.id))
  )
})

// Render order: pinned selections first, then limited display list
const renderItems = computed(() => {
  const pinned = pinnedItems.value.map((option) => ({
    type: 'option' as const,
    option,
    key: `pinned-${option.id}`
  }))
  return [...pinned, ...displayItems.value]
})

// Recalc position on alignment change
watch(
  () => props.alignToRight,
  () => {
    calculatePosition()
  }
)

// Sync radio selection to model
watch(
  () => radioModel.value,
  () => {
    model.value = radioModel.value ? [resolveOption(radioModel.value)] : []
  }
)

// Sync checkbox selections to model
watch(
  () => checkboxModel.value,
  () => {
    model.value = checkboxModel.value.map((id) => resolveOption(id))
  }
)

// Sync external model changes to internal radio/checkbox models
watch(
  () => model.value,
  () => {
    updateInternalModel()
  },
  { immediate: true }
)

// Emit search query on filter change
watch(optionsFilter, (query) => {
  emit('search', query)
})

// Keep the selection snapshot up to date while the menu is closed, so that selected
// options are hoisted to the top only when the menu is (re)opened
watch(
  [() => model.value, () => props.options],
  () => {
    if (!isMenuOpen.value) {
      snapshotSelection()
    }
  },
  { immediate: true }
)

// Strip characters that shouldn't take part in the search (spaces, punctuation, ...), so
// that the query matches regardless of them and is safe to use as a regular expression
function normalizeSearchText(text?: string): string {
  return text?.replace(/[^a-zA-Z0-9-]/g, '') ?? ''
}

// Case insensitive match of an already normalized query against a text
function matchesSearchQuery(text: string | undefined, normalizedQuery: string): boolean {
  return new RegExp(normalizedQuery, 'i').test(normalizeSearchText(text))
}

// An option matches when the query is found in its label or in its description
function optionMatchesSearchQuery(option: T, normalizedQuery: string): boolean {
  return (
    matchesSearchQuery(option.label, normalizedQuery) ||
    matchesSearchQuery(option.description, normalizedQuery)
  )
}

// Options whose id contains 'divider' are rendered as a separator, not as an option
function isDivider(item: T | NeDropdownFilterV2OptionGroup<T>): boolean {
  return !isFilterOptionGroup(item) && item.id.includes('divider')
}

function isFilterOptionGroup(
  item: T | NeDropdownFilterV2OptionGroup<T>
): item is NeDropdownFilterV2OptionGroup<T> {
  return 'group' in item && Array.isArray((item as NeDropdownFilterV2OptionGroup<T>).options)
}

// Sync model.value to internal radio/checkbox models. Check equality to avoid recursion
function updateInternalModel() {
  const modelIds = (model.value ?? []).map((o) => o.id)
  if (props.kind === 'radio') {
    if (radioModel.value !== (modelIds[0] ?? '')) {
      radioModel.value = modelIds[0] ?? ''
    }
  } else if (props.kind === 'checkbox') {
    if (!isEqual(checkboxModel.value, modelIds)) {
      checkboxModel.value = modelIds
    }
  }
}

// Take a snapshot of the current selection, ordered as in the options list. Selections
// missing from props.options (e.g. when filtering externally) are appended at the end
function snapshotSelection() {
  const selected = model.value ?? []
  const selectedIds = new Set(selected.map((o) => o.id))
  const inOptionsOrder = allFlatOptions.value.filter((o) => selectedIds.has(o.id))
  const knownIds = new Set(inOptionsOrder.map((o) => o.id))
  selectionSnapshot.value = [...inOptionsOrder, ...selected.filter((o) => !knownIds.has(o.id))]
}

// The transition hooks are used instead of the button click because Headless UI opens the
// menu on Enter/Space without emitting a click event
function onMenuOpen() {
  isMenuOpen.value = true
  snapshotSelection()
}

function onMenuClose() {
  isMenuOpen.value = false
  clearOptionsFilter()
  snapshotSelection()
}

function calculatePosition() {
  top.value = buttonRef.value?.$el.getBoundingClientRect().bottom + window.scrollY
  left.value = buttonRef.value?.$el.getBoundingClientRect().left - window.scrollX
  right.value =
    document.documentElement.clientWidth -
    buttonRef.value?.$el.getBoundingClientRect().right -
    window.scrollX
}

// Focus search input if visible
function maybeFocusOptionsFilter() {
  if (isShowingOptionsFilter.value) {
    focusElement(optionsFilterRef)
  }
}

// Clear search query
function clearOptionsFilter() {
  optionsFilter.value = ''
}

// Reset all selections + search
function clearFilter() {
  checkboxModel.value = []
  optionsFilter.value = ''
  maybeFocusOptionsFilter()
}
</script>

<template>
  <Menu as="div" class="relative inline-block text-left text-sm">
    <MenuButton ref="buttonRef" @click="calculatePosition()">
      <span class="sr-only">{{ openMenuAriaLabel }}</span>
      <slot name="button">
        <!-- default button -->
        <button
          class="focus:ring-primary-500 dark:focus:ring-primary-300 dark:focus:ring-offset-primary-950 font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-colors duration-200 hover:bg-gray-200/70 hover:text-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100 dark:ring-gray-500 dark:hover:bg-gray-600/30 dark:hover:text-gray-50"
          :class="sizeStyle[props.size]"
          :disabled="disabled"
          type="button"
        >
          <span class="flex items-center justify-center">
            <slot v-if="$slots.label" name="label"></slot>
            <span v-else>{{ label }}</span>
            <NeBadgeV2 v-if="isSelectionCountShown" size="xs" class="ml-2">{{
              checkboxModel.length
            }}</NeBadgeV2>
            <NeBadgeV2 v-else-if="currentRadioSelectionLabel" size="xs" class="ml-2">{{
              currentRadioSelectionLabel
            }}</NeBadgeV2>
            <FontAwesomeIcon :icon="faChevronDown" class="ml-2 h-3 w-3" aria-hidden="true" />
          </span>
        </button>
      </slot>
    </MenuButton>
    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
        @before-enter="onMenuOpen"
        @after-enter="maybeFocusOptionsFilter"
        @after-leave="onMenuClose"
      >
        <MenuItems
          :style="[
            { top: top + 'px' },
            alignToRight ? { right: right + 'px' } : { left: left + 'px' }
          ]"
          class="absolute z-50 mt-2.5 max-h-[17.2rem] min-w-40 overflow-y-auto rounded-md bg-white px-4 py-2 text-sm shadow-lg ring-1 ring-gray-900/5 focus:outline-hidden dark:bg-gray-950 dark:ring-gray-500/50"
        >
          <div v-if="isShowingOptionsFilter" class="py-2">
            <label class="sr-only" :for="`${componentId}-options-filter`">
              {{ optionsFilterPlaceholder }}
            </label>
            <NeTextInput
              :id="`${componentId}-options-filter`"
              ref="optionsFilterRef"
              v-model="optionsFilter"
              :placeholder="optionsFilterPlaceholder"
              :clear-search-label="clearSearchLabel"
              is-search
              @keydown.stop
            />
          </div>
          <div v-if="customActionLabel || (showClearFilter && kind == 'checkbox')" class="py-2">
            <NeLink v-if="customActionLabel" @click.stop="emit('customAction')">
              {{ customActionLabel }}
            </NeLink>
            <NeLink v-else @click.stop="clearFilter">
              {{ clearFilterLabel }}
            </NeLink>
          </div>
          <!-- skeleton while loading -->
          <div v-if="loadingOptions" class="py-2">
            <NeSkeleton :lines="3" />
          </div>
          <template v-for="item in renderItems" v-else :key="item.key">
            <!-- group header -->
            <div
              v-if="item.type === 'group'"
              class="pt-3 pb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
            >
              {{ item.label }}
            </div>
            <!-- divider -->
            <hr
              v-else-if="item.type === 'divider'"
              class="my-1 border-gray-200 dark:border-gray-700"
            />
            <!-- option -->
            <MenuItem v-else as="div" :disabled="item.option?.disabled">
              <!-- radio option -->
              <div v-if="kind === 'radio'" class="flex items-center py-2">
                <input
                  :id="`${componentId}-${item.option?.id}`"
                  v-model="radioModel"
                  type="radio"
                  :name="componentId"
                  :value="item.option?.id"
                  :aria-describedby="`${componentId}-${item.option?.id}-description`"
                  class="peer text-primary-700 focus:ring-primary-500 dark:text-primary-500 checked:dark:bg-primary-500 dark:focus:ring-primary-300 border-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 focus:dark:ring-offset-gray-900"
                  :disabled="item.option?.disabled || disabled"
                />
                <label
                  :for="`${componentId}-${item.option?.id}`"
                  class="ms-2 flex flex-col text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:text-gray-50"
                >
                  <span>{{ item.option?.label }}</span>
                  <span
                    v-if="item.option?.description"
                    :id="`${componentId}-${item.option?.id}-description`"
                    class="text-gray-500 dark:text-gray-400"
                  >
                    {{ item.option?.description }}
                  </span>
                </label>
              </div>
              <!-- checkbox option -->
              <div v-else-if="kind === 'checkbox'" class="flex items-center py-2" @click.stop>
                <div class="flex h-6 items-center">
                  <input
                    :id="`${componentId}-${item.option?.id}`"
                    v-model="checkboxModel"
                    type="checkbox"
                    :value="item.option?.id"
                    :aria-describedby="`${componentId}-${item.option?.id}-description`"
                    :disabled="item.option?.disabled || disabled"
                    class="text-primary-700 focus:ring-primary-500 dark:text-primary-500 dark:focus:ring-primary-300 dark:focus:ring-offset-primary-950 h-5 w-5 rounded-sm border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-4 sm:w-4 dark:border-gray-500"
                  />
                </div>
                <div class="ml-3 text-sm leading-6">
                  <label
                    :class="[
                      'flex flex-col font-medium text-gray-700 dark:text-gray-50',
                      { 'cursor-not-allowed opacity-50': item.option?.disabled }
                    ]"
                    :for="`${componentId}-${item.option?.id}`"
                  >
                    <span>{{ item.option?.label }}</span>
                    <span
                      v-if="item.option?.description"
                      :id="`${componentId}-${item.option?.id}-description`"
                      class="text-gray-500 dark:text-gray-400"
                    >
                      {{ item.option?.description }}
                    </span>
                  </label>
                </div>
              </div>
            </MenuItem>
          </template>
          <!-- showing a limited number of options for performance, but more options are available -->
          <div
            v-if="moreOptionsHidden"
            class="cursor-default py-2 text-gray-500 dark:text-gray-400"
          >
            {{ moreOptionsHiddenLabel }}
          </div>
          <!-- no option matching filter -->
          <div v-if="!loadingOptions && !renderItems.length">
            <div class="py-2 text-gray-500 dark:text-gray-400">
              {{ noOptionsLabel }}
            </div>
          </div>
        </MenuItems>
      </transition>
    </Teleport>
  </Menu>
</template>
