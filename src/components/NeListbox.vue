<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown as fasChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faCheck as fasCheck } from '@fortawesome/free-solid-svg-icons'

import { onClickOutside } from '@vueuse/core'
import { uniqBy, isEqual } from 'lodash-es'

export interface NeListboxOption {
  id: string
  label: string
  description?: string
  rawObj?: any
  disabled?: boolean
}

export interface Props {
  modelValue: string | Array<NeListboxOption>
  options: NeListboxOption[]
  label?: string
  placeholder?: string
  helperText?: string
  invalidMessage?: string
  multiple?: boolean
  disabled?: boolean
  showOptionsType?: boolean
  optional?: boolean
  noOptionsLabel: string
  optionalLabel: string
  optionsPanelStyle?: string
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  label: '',
  placeholder: '',
  helperText: '',
  invalidMessage: '',
  multiple: false,
  disabled: false,
  showOptionsType: true,
  optional: false,
  optionsPanelStyle: ''
})

const emit = defineEmits(['update:modelValue'])

// expose focus function
defineExpose({
  focus
})

const query = ref('')
const selected = ref(props.multiple ? [] : null) as any
const showOptions = ref(false)
const listboxRef = ref<HTMLDivElement | null>(null)
const top = ref(0)
const left = ref(0)
const buttonRef = ref<InstanceType<typeof Listbox> | null>(null)

const inputValidStyle =
  'ring-gray-300 dark:ring-gray-600 focus:ring-primary-500 dark:focus:ring-primary-300'

const inputInvalidStyle = 'ring-rose-300 focus:ring-rose-500 ring-rose-700 focus:ring-rose-500'

const descriptionBaseStyle = 'mt-2 text-sm'

const allOptions = computed(() => {
  if (!props.options.length) {
    return [{ id: 'no_option', label: props.noOptionsLabel, disabled: true }]
  }
  return props.options
})

watch(selected, () => {
  if (props.multiple) {
    // remove duplicates
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

function calculatePosition() {
  top.value = buttonRef.value?.$el.getBoundingClientRect().bottom + window.scrollY
  left.value = buttonRef.value?.$el.getBoundingClientRect().left - window.scrollX
}

function onClickOutsideListbox() {
  query.value = ''
  showOptions.value = false
}

function onOptionSelected() {
  if (!props.multiple) {
    showOptions.value = false
  }
}

function selectSingleOptionFromModelValue() {
  const optionFound = props.options.find((option) => option.id === props.modelValue)

  if (optionFound) {
    selected.value = optionFound
  }
}

function selectMultipleOptionsFromModelValue() {
  const selectedList: NeListboxOption[] = []

  for (const selectedOption of props.modelValue as NeListboxOption[]) {
    const optionFound = props.options.find((option) => option.id === selectedOption.id)

    if (optionFound) {
      selectedList.push(optionFound)
    }
  }

  // update selected list only if needed: this is needed to avoid loops that degrade performances
  if (!isEqual(selected.value, selectedList)) {
    selected.value = selectedList
  }
}

function focus() {
  listboxRef.value?.querySelector('input')?.focus()
}

// detect click outside to close the options list
onClickOutside(listboxRef, () => onClickOutsideListbox())
</script>

<template>
  <div ref="listboxRef">
    <Listbox
      v-slot="{ open }"
      v-model="selected"
      as="div"
      :multiple="multiple"
      v-bind="$attrs"
      :disabled="disabled"
    >
      <ListboxLabel
        v-if="props.label"
        class="mb-2 flex justify-between text-sm leading-6 font-medium text-gray-700 dark:text-gray-200"
      >
        <div>
          <span>{{ props.label }}</span>
          <span v-if="$slots.tooltip" class="ml-2">
            <slot name="tooltip"></slot>
          </span>
        </div>
        <span v-if="optional" class="ml-2 font-normal">{{ optionalLabel }}</span>
      </ListboxLabel>
      <div class="relative">
        <ListboxButton
          ref="buttonRef"
          :class="`${
            props.invalidMessage ? inputInvalidStyle : inputValidStyle
          } min-h-9 w-full rounded-md border-0 bg-white py-1.5 pr-10 pl-3 text-left text-base text-gray-900 shadow-sm ring-1 transition-colors duration-200 ring-inset hover:bg-gray-200/70 focus:ring-2 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm sm:leading-6 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-600/30`"
          @click="calculatePosition()"
        >
          <template v-if="!multiple">
            <template v-if="selected">
              {{ selected.label }}
            </template>
            <!-- placeholder -->
            <span v-else class="text-gray-400 dark:text-gray-500">
              {{ placeholder || '&nbsp;' }}
            </span>
          </template>
          <template v-else>
            <!-- multiple selection -->
            <div v-if="selected.length" class="truncate">
              {{ selected.map((sel: NeListboxOption) => sel.label).join(', ') }}
            </div>
            <!-- placeholder -->
            <span v-else class="text-gray-400 dark:text-gray-500">
              {{ placeholder || '&nbsp;' }}
            </span>
          </template>
          <div
            :class="[
              'absolute inset-y-0 right-0 flex items-center pr-3 pl-4 text-gray-500 focus:outline-hidden dark:text-gray-400',
              { 'cursor-not-allowed opacity-50': disabled }
            ]"
          >
            <FontAwesomeIcon :icon="fasChevronDown" class="h-3 w-3 shrink-0" aria-hidden="true" />
          </div>
        </ListboxButton>
        <Teleport to="body">
          <div v-show="open || showOptions">
            <ListboxOptions
              static
              :class="`absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-500/5 focus:outline-hidden sm:text-sm dark:bg-gray-950 ${optionsPanelStyle}`"
              :style="[{ top: top + 'px' }, { left: left + 'px' }]"
            >
              <ListboxOption
                v-for="option in allOptions"
                :key="option.id"
                v-slot="{ active, selected: optionSelected }"
                :value="option"
                as="template"
                :disabled="option.disabled"
                @click="onOptionSelected()"
              >
                <li
                  :class="[
                    'relative cursor-default py-2 pr-9 pl-3 select-none',
                    active
                      ? 'cursor-pointer bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-gray-100'
                      : option.disabled
                        ? 'cursor-not-allowed text-gray-500 dark:text-gray-500'
                        : 'text-gray-900 dark:text-gray-100'
                  ]"
                >
                  <div class="block truncate">
                    <span :class="['truncate', optionSelected && 'font-semibold']">
                      {{ option.label }}
                    </span>
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
                      'text-primary-700 dark:text-primary-500 absolute inset-y-0 right-0 flex items-center pr-4'
                    ]"
                  >
                    <FontAwesomeIcon :icon="fasCheck" class="h-4 w-4 shrink-0" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Teleport>
      </div>
      <!-- invalid message -->
      <p v-if="invalidMessage" :class="[descriptionBaseStyle, 'text-rose-700 dark:text-rose-400']">
        {{ invalidMessage }}
      </p>
      <!-- helper text -->
      <p v-else-if="helperText" :class="[descriptionBaseStyle, 'text-gray-500 dark:text-gray-400']">
        {{ helperText }}
      </p>
    </Listbox>
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
