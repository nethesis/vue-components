<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { isEqual } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import NeBadge from './NeBadge.vue'
import NeLink from './NeLink.vue'
import type { ButtonSize } from './NeButton.vue'
import NeTextInput from './NeTextInput.vue'
import { focusElement } from '../lib/utils'

export type FilterKind = 'radio' | 'checkbox'

export type FilterOption = {
  id: string
  label: string
  description?: string
  disabled?: boolean
}

const sizeStyle: { [index: string]: string } = {
  xs: 'rounded px-2 py-1 text-xs',
  sm: 'rounded px-2 py-1 text-sm',
  md: 'rounded-md px-2.5 py-1.5 text-sm',
  lg: 'rounded-md px-3 py-2 text-sm',
  xl: 'rounded-md px-3.5 py-2.5 text-sm'
}

export interface Props {
  label: string
  options: FilterOption[]
  kind: FilterKind
  clearFilterLabel: string
  openMenuAriaLabel: string
  showClearFilter?: boolean
  showSelectionCount?: boolean
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
}

const props = withDefaults(defineProps<Props>(), {
  showClearFilter: true,
  showSelectionCount: true,
  showOptionsFilter: false,
  optionsFilterPlaceholder: '',
  maxOptionsShown: 25,
  alignToRight: false,
  size: 'md',
  disabled: false,
  id: ''
})

const model = defineModel<string[]>()
const radioModel = ref('')
const checkboxModel = ref<string[]>([])
const top = ref(0)
const left = ref(0)
const right = ref(0)
const buttonRef = ref()
const optionsFilter = ref('')
const optionsFilterRef = ref()

const componentId = computed(() => (props.id ? props.id : uuidv4()))

const isSelectionCountShown = computed(() => {
  return props.showSelectionCount && props.kind == 'checkbox' && checkboxModel.value.length > 0
})

const optionsToDisplay = computed(() => {
  return filteredOptions.value.slice(0, props.maxOptionsShown)
})

const moreOptionsHidden = computed(() => {
  return filteredOptions.value.length > props.maxOptionsShown
})

const isShowingOptionsFilter = computed(() => {
  return props.showOptionsFilter || props.options.length > props.maxOptionsShown
})

const filteredOptions = computed(() => {
  if (!isShowingOptionsFilter.value) {
    // return all options
    return props.options
  }

  // show only options that match the options filter

  const regex = /[^a-zA-Z0-9-]/g
  const queryText = optionsFilter.value.replace(regex, '')

  return props.options.filter((option) => {
    return new RegExp(queryText, 'i').test(option.label?.replace(regex, ''))
  })
})

watch(
  () => props.alignToRight,
  () => {
    calculatePosition()
  }
)

watch(
  () => radioModel.value,
  () => {
    model.value = [radioModel.value]
  }
)

watch(
  () => checkboxModel.value,
  () => {
    model.value = checkboxModel.value
  }
)

watch(
  () => model.value,
  () => {
    updateInternalModel()
  },
  { immediate: true }
)

function updateInternalModel() {
  if (props.kind === 'radio') {
    // update only if the value is different to avoid "Maximum recursive updates exceeded" error
    if (model.value && radioModel.value !== model.value[0]) {
      radioModel.value = model.value[0]
    }
  } else if (props.kind === 'checkbox') {
    // update only if the value is different to avoid "Maximum recursive updates exceeded" error
    if (model.value && !isEqual(checkboxModel.value, model.value)) {
      checkboxModel.value = model.value
    }
  }
}

function calculatePosition() {
  top.value = buttonRef.value?.$el.getBoundingClientRect().bottom + window.scrollY
  left.value = buttonRef.value?.$el.getBoundingClientRect().left - window.scrollX
  right.value =
    document.documentElement.clientWidth -
    buttonRef.value?.$el.getBoundingClientRect().right -
    window.scrollX
}

function maybeFocusOptionsFilter() {
  if (isShowingOptionsFilter.value) {
    focusElement(optionsFilterRef)
  }
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
            <NeBadge
              v-if="isSelectionCountShown"
              :text="checkboxModel.length.toString()"
              size="xs"
              class="ml-2"
            />
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
        @after-enter="maybeFocusOptionsFilter"
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
              is-search
              @keydown.stop
            />
          </div>
          <div v-if="showClearFilter && kind == 'checkbox'" class="py-2">
            <NeLink @click.stop="checkboxModel = []">
              {{ clearFilterLabel }}
            </NeLink>
          </div>
          <MenuItem
            v-for="option in optionsToDisplay"
            :key="option.id"
            as="div"
            :disabled="option.disabled"
          >
            <!-- divider -->
            <hr
              v-if="option.id.includes('divider')"
              class="my-1 border-gray-200 dark:border-gray-700"
            />
            <!-- filter option -->
            <div v-if="kind === 'radio'" class="flex items-center py-2" @click.stop>
              <!-- radio button -->
              <input
                :id="`${componentId}-${option.id}`"
                v-model="radioModel"
                type="radio"
                :name="componentId"
                :value="option.id"
                :aria-describedby="`${componentId}-${option.id}-description`"
                class="peer text-primary-700 focus:ring-primary-500 dark:text-primary-500 checked:dark:bg-primary-500 dark:focus:ring-primary-300 border-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 focus:dark:ring-offset-gray-900"
                :disabled="option.disabled || disabled"
              />
              <label
                :for="`${componentId}-${option.id}`"
                class="ms-2 flex flex-col text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:text-gray-50"
              >
                <span>{{ option.label }}</span>
                <span
                  v-if="option.description"
                  :id="`${componentId}-${option.id}-description`"
                  class="text-gray-500 dark:text-gray-400"
                >
                  {{ option.description }}
                </span>
              </label>
            </div>
            <div v-else-if="kind === 'checkbox'" class="flex items-center py-2" @click.stop>
              <!-- checkbox -->
              <div class="flex h-6 items-center">
                <input
                  :id="`${componentId}-${option.id}`"
                  v-model="checkboxModel"
                  type="checkbox"
                  :value="option.id"
                  :aria-describedby="`${componentId}-${option.id}-description`"
                  :disabled="option.disabled || disabled"
                  class="text-primary-700 focus:ring-primary-500 dark:text-primary-500 dark:focus:ring-primary-300 dark:focus:ring-offset-primary-950 h-5 w-5 rounded-sm border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-4 sm:w-4 dark:border-gray-500"
                />
              </div>
              <div class="ml-3 text-sm leading-6">
                <!-- show label prop or default slot -->
                <label
                  :class="[
                    'flex flex-col font-medium text-gray-700 dark:text-gray-50',
                    { 'cursor-not-allowed opacity-50': option.disabled }
                  ]"
                  :for="`${componentId}-${option.id}`"
                >
                  <span>{{ option.label }}</span>
                  <span
                    v-if="option.description"
                    :id="`${componentId}-${option.id}-description`"
                    class="text-gray-500 dark:text-gray-400"
                  >
                    {{ option.description }}
                  </span>
                </label>
              </div>
            </div>
          </MenuItem>
          <!-- showing a limited number of options for performance, but more options are available -->
          <div v-if="moreOptionsHidden" class="cursor-default py-2 opacity-50">
            {{ moreOptionsHiddenLabel }}
          </div>
          <!-- no option matching filter -->
          <div v-if="!filteredOptions.length">
            <div class="py-2 opacity-50">
              {{ noOptionsLabel }}
            </div>
          </div>
        </MenuItems>
      </transition>
    </Teleport>
  </Menu>
</template>
