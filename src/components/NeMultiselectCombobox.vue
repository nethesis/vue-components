<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts" generic="T extends NeMultiselectComboboxOption">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCheck as fasCheck,
  faChevronDown as fasChevronDown,
  type IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { onClickOutside } from '@vueuse/core'
import { isEqual, uniqBy } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import NeBadgeV2 from './NeBadgeV2.vue'
import type { NeBadgeV2Kind } from './NeBadgeV2.vue'
import NeSkeleton from './NeSkeleton.vue'

export interface NeMultiselectComboboxOption {
  id: string
  label: string
  description?: string
  icon?: IconDefinition
  rawObj?: unknown
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    options: T[]
    label?: string
    placeholder?: string
    helperText?: string
    invalidMessage?: string
    disabled?: boolean
    showOptionsType?: boolean
    optional?: boolean
    noResultsLabel: string
    noOptionsLabel: string
    acceptUserInput?: boolean
    userInputLabel: string
    optionalLabel: string
    customOptionsWidth?: string
    maxHeight?: string
    maxOptionsShown?: number
    limitedOptionsLabel: string
    externalFilter?: boolean
    loadingOptions?: boolean
    badgeKind?: NeBadgeV2Kind
    badgeCustomKindClasses?: string
  }>(),
  {
    options: () => [],
    label: '',
    placeholder: '',
    helperText: '',
    invalidMessage: '',
    disabled: false,
    showOptionsType: true,
    optional: false,
    acceptUserInput: false,
    customOptionsWidth: '',
    maxHeight: '8.5rem',
    maxOptionsShown: 50,
    externalFilter: false,
    loadingOptions: false,
    badgeKind: 'gray',
    badgeCustomKindClasses: ''
  }
)

const emit = defineEmits<{
  filter: [query: string]
}>()

const modelValue = defineModel<T[]>({ default: () => [] })

defineExpose({
  focus
})

const query = ref('')
const selected = ref<T[]>([]) as Ref<T[]>
const showOptions = ref(false)
const comboboxRef = ref<HTMLDivElement | null>(null)
const userInputOptions = ref<T[]>([]) as Ref<T[]>
const componentId = `ne-multiselect-combobox-${uuidv4()}`

// Comparison fn for combobox v-model (match by id)
const byId = (a: NeMultiselectComboboxOption, b: NeMultiselectComboboxOption) => a?.id === b?.id

const inputValidStyle =
  'ring-gray-300 dark:ring-gray-600 focus-within:ring-primary-500 dark:focus-within:ring-primary-300'
const inputInvalidStyle = 'ring-rose-700 focus-within:ring-rose-500 dark:ring-rose-500'
const descriptionBaseStyle = 'mt-2 text-sm'

// Parent options + user-typed entries
const allOptions = computed(() => props.options.concat(userInputOptions.value))

// Filter options by search query or externalFilter mode
const filteredOptions = computed<T[]>(() => {
  if (props.externalFilter) {
    let results: T[] = [...props.options]

    if (query.value.trim()) {
      const matchingUserInputs = userInputOptions.value.filter((opt) =>
        opt.label.trim().toLowerCase().includes(query.value.trim().toLowerCase())
      )
      results = results.concat(matchingUserInputs)
    } else {
      results = results.concat(userInputOptions.value)

      // When not filtering, ensure selected items always appear at top even if
      // the server response doesn't include them (e.g. initial load, page change)
      for (const sel of selected.value) {
        if (!results.find((r) => r.id === sel.id)) {
          results.unshift(sel)
        }
      }
    }

    // Keep the user-input "add" entry separate so it is never counted toward
    // maxOptionsShown and never gets sliced off by getLimitedNumberOfOptions.
    let userInputEntry: T | undefined
    if (props.acceptUserInput && query.value.trim()) {
      const trimmedQuery = query.value.trim()
      const optionFound = results.find((option) => option.label === trimmedQuery)
      if (!optionFound) {
        userInputEntry = {
          id: trimmedQuery,
          label: trimmedQuery,
          description: props.userInputLabel
        } as unknown as T
      }
    }

    if (!results.length && query.value) {
      if (userInputEntry) {
        return [userInputEntry]
      }
      return [{ id: 'no_results', label: props.noResultsLabel, disabled: true } as unknown as T]
    }

    const limited = getLimitedNumberOfOptions(results)
    if (userInputEntry) {
      const hintIdx = limited.findIndex((o) => o.id === 'limited_options_hint')
      if (hintIdx === -1) {
        limited.push(userInputEntry)
      } else {
        limited.splice(hintIdx, 0, userInputEntry)
      }
    }
    return limited
  }

  if (!query.value) {
    return getLimitedNumberOfOptions(allOptions.value)
  }

  const results = allOptions.value.filter((option) => {
    return (
      option.label.trim().toLowerCase().includes(query.value.trim().toLowerCase()) ||
      (option.description &&
        option.description.trim().toLowerCase().includes(query.value.trim().toLowerCase()))
    )
  })

  // Same separation: keep user-input entry outside getLimitedNumberOfOptions.
  let userInputEntry: T | undefined
  if (props.acceptUserInput && query.value.trim()) {
    const trimmedQuery = query.value.trim()
    const optionFound = results.find((option) => option.label === trimmedQuery)
    if (!optionFound) {
      userInputEntry = {
        id: trimmedQuery,
        label: trimmedQuery,
        description: props.userInputLabel
      } as unknown as T
    }
  }

  if (!results.length) {
    if (userInputEntry) {
      return [userInputEntry]
    }
    return [{ id: 'no_results', label: props.noResultsLabel, disabled: true } as unknown as T]
  }

  const limited = getLimitedNumberOfOptions(results)
  if (userInputEntry) {
    const hintIdx = limited.findIndex((o) => o.id === 'limited_options_hint')
    if (hintIdx === -1) {
      limited.push(userInputEntry)
    } else {
      limited.splice(hintIdx, 0, userInputEntry)
    }
  }
  return limited
})

// Styling for input shell container
const inputShellStyle = computed(() => ({
  maxHeight: props.maxHeight || undefined
}))

// Hide placeholder when items selected
const inputPlaceholder = computed(() => (selected.value.length ? '' : props.placeholder))

// ID for error/help text aria-describedby
const descriptionId = computed(() =>
  props.invalidMessage || props.helperText ? `${componentId}-description` : undefined
)

// Sync selections to v-model, clear query on add (with dedup), emit filter event
watch(selected, (newVal, oldVal) => {
  const uniqueSelected = uniqBy(selected.value, 'id')

  if (uniqueSelected.length !== selected.value.length) {
    selected.value = uniqueSelected
    return
  }

  // Clear query when an item is added via the dropdown. This is a fallback for the case
  // where onOptionSelected is not called — e.g. when adding a badge causes the component
  // to grow vertically and the mouseup lands on the input instead of the option element,
  // so the click event on the ComboboxOption never fires.
  if (newVal.length > (oldVal?.length ?? 0) && showOptions.value) {
    query.value = ''
    if (props.externalFilter) {
      emit('filter', '')
    }
  }

  modelValue.value = selected.value
})

// Sync props.options → selected (unless externally filtering + dropdown open)
watch(
  () => props.options,
  () => {
    if (props.externalFilter && showOptions.value) {
      return
    }
    selectOptionsFromModelValue()
  }
)

// Sync v-model changes → selected (unless externally filtering + dropdown open)
watch(
  () => modelValue.value,
  () => {
    if (props.externalFilter && showOptions.value) {
      return
    }
    selectOptionsFromModelValue()
  }
)

onMounted(() => {
  selectOptionsFromModelValue()

  if (props.externalFilter) {
    const input = comboboxRef.value?.querySelector('input')
    if (input) {
      const handleBlur = () => {
        if (showOptions.value && query.value) {
          setTimeout(() => {
            if (showOptions.value && query.value) {
              focus()
            }
          }, 0)
        }
      }
      input.addEventListener('blur', handleBlur)
      onBeforeUnmount(() => {
        input.removeEventListener('blur', handleBlur)
      })
    }
  }
})

function getLimitedNumberOfOptions(options: T[]): T[] {
  // No options + no user input allowed = show "no options" msg
  if (!options.length && !props.acceptUserInput) {
    return [{ id: 'no_option', label: props.noOptionsLabel, disabled: true } as unknown as T]
  }

  // Under limit = return all
  if (options.length < props.maxOptionsShown) {
    return options
  }

  // Over limit: slice + add hint
  const limitedOptions = options.slice(0, props.maxOptionsShown)
  limitedOptions.push({
    id: 'limited_options_hint',
    label: props.limitedOptionsLabel,
    disabled: true
  } as unknown as T)

  // Pin selected items not in display list
  if (selected.value.length) {
    for (const selectedOption of selected.value) {
      const selectedOptionFound = limitedOptions.find((option) => option.id === selectedOption.id)

      if (!selectedOptionFound) {
        limitedOptions.unshift(selectedOption)
      }
    }
  }

  return limitedOptions
}

function onClickOutsideCombobox() {
  // Add search text to selection if acceptUserInput enabled
  if (props.acceptUserInput && query.value.trim()) {
    addQueryToSelection()
  }

  query.value = ''
  showOptions.value = false

  if (props.externalFilter) {
    emit('filter', '')
  }
}

// Handle option click: add to selection if new, clear query, focus input
function onOptionSelected(selectedOption: T) {
  if (props.acceptUserInput) {
    const optionFound = allOptions.value.find((option) => option.id === selectedOption.id)

    if (!optionFound) {
      userInputOptions.value.push({ ...selectedOption, description: props.userInputLabel } as T)
    }
  }

  query.value = ''
  showOptions.value = true

  if (props.externalFilter) {
    emit('filter', '')
  }

  nextTick(() => focus())
}

function selectOptionsFromModelValue() {
  // Sync v-model to selected, handling real options + user-input entries + missing items
  const selectedList: T[] = []

  for (const opt of modelValue.value) {
    const realOption = props.options.find((option) => option.id === opt.id)

    if (realOption) {
      // Real option found — remove any stale userInput entry for this id
      userInputOptions.value = userInputOptions.value.filter((u) => u.id !== opt.id)
      selectedList.push(realOption)
    } else {
      const userInputOption = userInputOptions.value.find((u) => u.id === opt.id)

      if (userInputOption) {
        selectedList.push(userInputOption)
      } else if (props.acceptUserInput) {
        const newOption = { ...opt, description: props.userInputLabel } as T
        userInputOptions.value.push(newOption)
        selectedList.push(newOption)
      } else {
        selectedList.push(opt)
      }
    }
  }

  if (!isEqual(selected.value, selectedList)) {
    selected.value = selectedList
  }
}

function addQueryToSelection() {
  // Add search query text as new selection (real option or user-input)
  const trimmedQuery = query.value.trim()
  let option = allOptions.value.find((opt) => opt.label === trimmedQuery)

  if (!option) {
    option = {
      id: trimmedQuery,
      label: trimmedQuery,
      description: props.userInputLabel
    } as unknown as T
    userInputOptions.value.push(option)
  }

  const alreadySelected = selected.value.find((opt) => opt.id === option!.id)
  if (!alreadySelected) {
    selected.value = [...selected.value, option]
  }
}

function focus() {
  comboboxRef.value?.querySelector('input')?.focus()
}

function onInputClick() {
  showOptions.value = true

  if (props.externalFilter) {
    emit('filter', query.value)
  }
}

function onInputChange(event: Event) {
  query.value = (event.target as HTMLInputElement).value
  showOptions.value = true
  emit('filter', query.value)
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Backspace' && !query.value && selected.value.length) {
    selected.value = selected.value.slice(0, -1)
  }
  if (event.key === 'Escape') {
    showOptions.value = false
    query.value = ''
    if (props.externalFilter) {
      emit('filter', '')
    }
  }
}

function removeFromSelection(optionToRemove: NeMultiselectComboboxOption) {
  // Remove selection by id + refocus input
  selected.value = selected.value.filter((option) => option.id !== optionToRemove.id)
  nextTick(() => focus())
}

onClickOutside(comboboxRef, () => onClickOutsideCombobox())
</script>

<template>
  <div ref="comboboxRef">
    <Combobox
      v-slot="{ open }"
      v-model="selected"
      as="div"
      multiple
      v-bind="$attrs"
      :by="byId"
      :disabled="disabled"
    >
      <ComboboxLabel
        v-if="label"
        class="mb-2 flex justify-between text-sm leading-6 font-medium text-gray-700 dark:text-gray-200"
      >
        <div>
          <span>{{ label }}</span>
          <span v-if="$slots.tooltip" class="ml-2">
            <slot name="tooltip"></slot>
          </span>
        </div>
        <span v-if="optional" class="ml-2 font-normal">{{ optionalLabel }}</span>
      </ComboboxLabel>

      <div class="relative">
        <div
          :class="[
            invalidMessage ? inputInvalidStyle : inputValidStyle,
            'flex min-h-9 w-full flex-wrap items-center gap-1.5 overflow-y-auto rounded-md border-0 bg-white py-1.5 pr-12 pl-3 text-gray-900 shadow-sm ring-1 outline-hidden transition-colors duration-200 ring-inset focus-within:ring-2 focus-within:ring-inset dark:bg-gray-950 dark:text-gray-50',
            disabled && 'cursor-not-allowed opacity-50'
          ]"
          :style="inputShellStyle"
          @click="focus"
        >
          <NeBadgeV2
            v-for="selectedOption in selected"
            :key="selectedOption.id"
            size="sm"
            dismissable
            :kind="badgeKind"
            :custom-kind-classes="badgeCustomKindClasses"
            :dismiss-aria-label="`Remove ${selectedOption.label}`"
            :pill="false"
            @dismiss="removeFromSelection(selectedOption)"
            @mousedown.prevent.stop
            @click.stop
          >
            <FontAwesomeIcon
              v-if="selectedOption.icon"
              :icon="selectedOption.icon"
              class="mr-0.5 size-3.5 shrink-0"
              aria-hidden="true"
            />
            {{ selectedOption.label }}
          </NeBadgeV2>

          <ComboboxInput
            class="min-w-28 flex-1 border-0 bg-transparent p-0 text-sm leading-6 text-gray-900 outline-hidden placeholder:text-gray-400 focus:ring-0 disabled:cursor-not-allowed dark:text-gray-50 dark:placeholder:text-gray-500"
            :display-value="() => query"
            :placeholder="inputPlaceholder"
            :disabled="disabled"
            :aria-describedby="descriptionId"
            :aria-invalid="invalidMessage ? 'true' : undefined"
            @change="onInputChange"
            @click="onInputClick"
            @keydown="onInputKeydown"
          />
        </div>

        <ComboboxButton
          :class="[
            'absolute inset-y-0 right-2 flex items-start px-2 pt-3 text-gray-500 focus:outline-hidden dark:text-gray-400',
            { 'cursor-not-allowed opacity-50': disabled }
          ]"
        >
          <FontAwesomeIcon :icon="fasChevronDown" class="h-3 w-3 shrink-0" aria-hidden="true" />
        </ComboboxButton>

        <div v-show="open || showOptions">
          <div
            v-if="loadingOptions && (open || showOptions)"
            :style="{ width: customOptionsWidth }"
            :class="[
              'absolute z-10 mt-1 overflow-auto rounded-md bg-white px-3 py-3 text-base shadow-lg ring-1 ring-gray-200 focus:outline-hidden sm:text-sm dark:bg-gray-950 dark:ring-gray-700',
              !customOptionsWidth && 'w-full'
            ]"
          >
            <NeSkeleton :lines="3" />
          </div>

          <ComboboxOptions
            v-show="!loadingOptions && filteredOptions.length > 0"
            static
            :style="{ width: customOptionsWidth }"
            :class="[
              'absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-200 focus:outline-hidden sm:text-sm dark:bg-gray-950 dark:ring-gray-700',
              !customOptionsWidth && 'w-full'
            ]"
          >
            <ComboboxOption
              v-for="option in filteredOptions"
              :key="option.id"
              v-slot="{ active, selected: optionSelected }"
              :value="option"
              as="template"
              :disabled="option.disabled"
              @click="onOptionSelected(option)"
            >
              <li
                :class="[
                  'relative cursor-default py-2 pr-9 pl-3 select-none',
                  active
                    ? 'cursor-pointer bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50'
                    : option.disabled
                      ? 'cursor-not-allowed opacity-50 dark:opacity-50'
                      : 'text-gray-700 dark:text-gray-200'
                ]"
              >
                <div class="flex items-center truncate">
                  <FontAwesomeIcon
                    v-if="option.icon"
                    :icon="option.icon"
                    class="mr-2.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span :class="['shrink-0 truncate', optionSelected && 'font-semibold']">
                    {{ option.label }}
                  </span>
                  <span
                    v-if="option.description && showOptionsType"
                    class="ml-2.5 truncate text-gray-500 dark:text-gray-400"
                  >
                    {{ option.description }}
                  </span>
                </div>

                <span
                  v-if="optionSelected"
                  class="text-primary-700 dark:text-primary-500 absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  <FontAwesomeIcon :icon="fasCheck" class="h-4 w-4 shrink-0" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </div>
      </div>

      <p
        v-if="invalidMessage"
        :id="descriptionId"
        :class="[descriptionBaseStyle, 'text-rose-700 dark:text-rose-400']"
      >
        {{ invalidMessage }}
      </p>
      <p
        v-else-if="helperText"
        :id="descriptionId"
        :class="[descriptionBaseStyle, 'text-gray-500 dark:text-gray-400']"
      >
        {{ helperText }}
      </p>
    </Combobox>
  </div>
</template>
