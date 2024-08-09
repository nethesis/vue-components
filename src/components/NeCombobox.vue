<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
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
  faChevronDown as fasChevronDown,
  type IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { faCheck as fasCheck } from '@fortawesome/free-solid-svg-icons'
import { faXmark as fasXmark } from '@fortawesome/free-solid-svg-icons'
import NeBadge from './NeBadge.vue'
import { onClickOutside } from '@vueuse/core'
import { uniqBy, isEqual } from 'lodash-es'

export interface NeComboboxOption {
  id: string
  label: string
  description?: string
  icon?: IconDefinition
  rawObj?: any
  disabled?: boolean
}

export interface Props {
  modelValue: string | Array<NeComboboxOption>
  options: NeComboboxOption[]
  label?: string
  placeholder?: string
  helperText?: string
  invalidMessage?: string
  // limit the number of options displayed for performance
  maxOptionsShown?: number
  multiple?: boolean
  disabled?: boolean
  showOptionsType: boolean
  optional?: boolean
  selectedLabel: string
  showSelectedLabel?: boolean
  noResultsLabel: string
  limitedOptionsLabel: string
  noOptionsLabel: string
  acceptUserInput?: boolean
  userInputLabel: string
  optionalLabel: string
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  label: '',
  placeholder: '',
  helperText: '',
  invalidMessage: '',
  maxOptionsShown: 50,
  multiple: false,
  disabled: false,
  showOptionsType: true,
  optional: false,
  showSelectedLabel: true,
  acceptUserInput: false
})

const emit = defineEmits(['update:modelValue'])

// expose focus function
defineExpose({
  focus
})

const query = ref('')
const selected = ref(props.multiple ? [] : null) as any
const showOptions = ref(false)
const comboboxRef = ref<HTMLDivElement | null>(null)
const userInputOptions = ref<NeComboboxOption[]>([])

const inputValidStyle =
  'ring-gray-300 dark:ring-gray-600 focus:ring-primary-500 dark:focus:ring-primary-300'

const inputInvalidStyle = 'ring-rose-300 focus:ring-rose-500 ring-rose-700 focus:ring-rose-500'

const descriptionBaseStyle = 'mt-2 text-sm'

const allOptions = computed(() => {
  return props.options.concat(userInputOptions.value)
})

const filteredOptions = computed(() => {
  if (!query.value) {
    return getLimitedNumberOfOptions(allOptions.value)
  }

  let results = allOptions.value.filter((option: NeComboboxOption) => {
    return (
      // search in option label
      option.label.trim().toLowerCase().includes(query.value.trim().toLowerCase()) ||
      // search in option description
      (option.description &&
        option.description.trim().toLowerCase().includes(query.value.trim().toLowerCase()))
    )
  })

  // user input

  if (props.acceptUserInput && query.value.trim()) {
    // suggest user input if not already present among options
    const trimmedQuery = query.value.trim()
    const optionFound = results.find((option) => option.label === trimmedQuery)

    if (!optionFound) {
      results.push({
        id: trimmedQuery,
        label: trimmedQuery,
        description: props.userInputLabel
      })
    }
  }

  if (results.length) {
    results = getLimitedNumberOfOptions(results)
    return results
  } else {
    return [{ id: 'no_results', label: props.noResultsLabel, disabled: true }]
  }
})

watch(selected, () => {
  if (props.multiple) {
    // remove duplicates (needed because of acceptUserInput glitch)
    if (uniqBy(selected.value, 'id').length !== selected.value.length) {
      selected.value = uniqBy(selected.value, 'id')
    }
    emit('update:modelValue', selected.value)
  } else {
    // single selection

    if (selected.value) {
      emit('update:modelValue', selected.value.id)
    } else {
      emit('update:modelValue', '')
    }
  }
})

watch(
  () => props.options,
  () => {
    // update selection

    if (props.multiple) {
      selectMultipleOptionsFromModelValue()
    } else {
      selectSingleOptionFromModelValue()
    }
  }
)

onMounted(() => {
  if (props.multiple) {
    selectMultipleOptionsFromModelValue()
  } else {
    selectSingleOptionFromModelValue()
  }
})

watch(
  () => props.modelValue,
  () => {
    if (props.multiple) {
      selectMultipleOptionsFromModelValue()
    } else {
      selectSingleOptionFromModelValue()
    }
  }
)

function getLimitedNumberOfOptions(options: NeComboboxOption[]) {
  if (!options.length && !props.acceptUserInput) {
    return [{ id: 'no_option', label: props.noOptionsLabel, disabled: true }]
  }

  if (options.length <= props.maxOptionsShown) {
    return options
  }

  // limit number of options
  options = options.slice(0, props.maxOptionsShown)

  // add hint
  options.push({ id: 'limited_options_hint', label: props.limitedOptionsLabel, disabled: true })

  // add selected item(s) if needed

  if (props.multiple) {
    if (selected.value.length) {
      for (const selectedOption of selected.value) {
        const selectedOptionFound = options.find(
          (option: NeComboboxOption) => option.id === selectedOption.id
        )

        if (!selectedOptionFound) {
          options.unshift(selectedOption)
        }
      }
    }
  } else {
    // single selection

    if (selected.value) {
      const selectedOptionFound = options.find(
        (option: NeComboboxOption) => option.id === selected.value?.id
      )

      if (!selectedOptionFound) {
        options.unshift(selected.value)
      }
    }
  }

  return options
}

function onClickOutsideCombobox() {
  query.value = ''
  showOptions.value = false
}

function onOptionSelected(selectedOption: NeComboboxOption) {
  if (!props.multiple) {
    showOptions.value = false
  }

  if (props.acceptUserInput) {
    // add user input if not already present among options
    const optionFound = allOptions.value.find((option) => option.id === selectedOption.id)

    if (!optionFound) {
      userInputOptions.value.push({
        id: selectedOption.id,
        label: selectedOption.label,
        description: props.userInputLabel
      })
    }
  }
}

function selectSingleOptionFromModelValue() {
  const optionFound = allOptions.value.find((option) => option.id === props.modelValue)

  if (optionFound) {
    selected.value = optionFound
  } else if (props.acceptUserInput && props.modelValue) {
    const userInputOption = {
      id: props.modelValue as string,
      label: props.modelValue as string,
      description: props.userInputLabel
    }
    userInputOptions.value.push(userInputOption)
    selected.value = userInputOption
  }
}

function selectMultipleOptionsFromModelValue() {
  const selectedList: NeComboboxOption[] = []

  for (const selectedOption of props.modelValue as NeComboboxOption[]) {
    const optionFound = allOptions.value.find((option) => option.id === selectedOption.id)

    if (optionFound) {
      selectedList.push(optionFound)
    } else if (props.acceptUserInput) {
      if (!selectedOption.description) {
        selectedOption.description = props.userInputLabel
      }
      userInputOptions.value.push(selectedOption)
      selectedList.push(selectedOption)
    }
  }

  // update selected list only if needed: this is needed to avoid loops that degrade performances
  if (!isEqual(selected.value, selectedList)) {
    selected.value = selectedList
  }
}

function focus() {
  comboboxRef.value?.querySelector('input')?.focus()
}

function onInputClick() {
  showOptions.value = true
}

function removeFromSelection(optionToRemove: NeComboboxOption) {
  selected.value = selected.value.filter(
    (option: NeComboboxOption) => option.id !== optionToRemove.id
  )
}

// detect click outside to close the options list
onClickOutside(comboboxRef, () => onClickOutsideCombobox())
</script>

<template>
  <div ref="comboboxRef">
    <Combobox
      v-slot="{ open }"
      v-model="selected"
      as="div"
      :multiple="multiple"
      v-bind="$attrs"
      :disabled="disabled"
    >
      <ComboboxLabel
        v-if="props.label"
        class="mb-2 flex justify-between text-sm font-medium leading-6 text-gray-700 dark:text-gray-200"
      >
        <div>
          <span>{{ props.label }}</span>
          <span v-if="$slots.tooltip" class="ml-2">
            <slot name="tooltip"></slot>
          </span>
        </div>
        <span v-if="optional" class="ml-2 font-normal">{{ optionalLabel }}</span>
      </ComboboxLabel>
      <div class="relative">
        <ComboboxInput
          :class="`${
            props.invalidMessage ? inputInvalidStyle : inputValidStyle
          } w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6`"
          :display-value="(option: any) => option?.label"
          :placeholder="props.placeholder"
          @change="query = $event.target.value"
          @click="onInputClick"
        />
        <ComboboxButton
          :class="[
            'absolute inset-y-0 right-0 flex items-center rounded-r-md pl-4 pr-3 text-gray-500 focus:outline-none dark:text-gray-400',
            { 'cursor-not-allowed opacity-50': disabled }
          ]"
        >
          <FontAwesomeIcon :icon="fasChevronDown" class="h-3 w-3 shrink-0" aria-hidden="true" />
        </ComboboxButton>
        <div v-show="open || showOptions">
          <ComboboxOptions
            v-if="filteredOptions.length > 0"
            static
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-900/5 ring-opacity-5 focus:outline-none dark:bg-gray-950 dark:ring-gray-500/50 sm:text-sm"
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
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                  active
                    ? 'cursor-pointer bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-gray-100'
                    : option.disabled
                      ? 'cursor-not-allowed text-gray-500 dark:text-gray-500'
                      : 'text-gray-900 dark:text-gray-100'
                ]"
              >
                <div class="flex items-center truncate">
                  <!-- option icon -->
                  <FontAwesomeIcon
                    v-if="option.icon"
                    :icon="option.icon"
                    class="mr-2.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <!-- option label -->
                  <span :class="['shrink-0 truncate', optionSelected && 'font-semibold']">
                    {{ option.label }}
                  </span>
                  <!-- option description -->
                  <span
                    v-if="option.description && showOptionsType"
                    :class="['ml-2.5 truncate text-gray-500 dark:text-gray-400']"
                  >
                    {{ option.description }}
                  </span>
                </div>

                <span
                  v-if="optionSelected"
                  :class="[
                    'absolute inset-y-0 right-0 flex items-center pr-4 text-primary-700 dark:text-primary-500'
                  ]"
                >
                  <FontAwesomeIcon :icon="fasCheck" class="h-4 w-4 shrink-0" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </div>
      </div>
      <!-- selected options (for multiple selection) -->
      <div
        v-if="multiple && selected.length"
        :class="[descriptionBaseStyle, 'flex flex-wrap items-center gap-2']"
      >
        <span v-if="showSelectedLabel" class="text-gray-700 dark:text-gray-50">{{
          selectedLabel
        }}</span>
        <NeBadge
          v-for="selectedOption in selected"
          :key="selectedOption.id"
          kind="primary"
          :text="selectedOption.label"
          :icon="fasXmark"
          icon-position="right"
          icon-clickable
          @icon-click="removeFromSelection(selectedOption)"
        />
      </div>
      <!-- invalid message -->
      <p v-if="invalidMessage" :class="[descriptionBaseStyle, 'text-rose-700 dark:text-rose-400']">
        {{ invalidMessage }}
      </p>
      <!-- helper text -->
      <p v-else-if="helperText" :class="[descriptionBaseStyle, 'text-gray-500 dark:text-gray-400']">
        {{ helperText }}
      </p>
    </Combobox>
  </div>
</template>

<style>
/* remove white background and border (css rule applied by user agent) */
div[multiple] {
  background-color: inherit;
  border: none;
  padding: 0;
}
</style>
