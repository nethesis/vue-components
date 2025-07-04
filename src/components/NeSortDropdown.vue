<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { v4 as uuidv4 } from 'uuid'
import type { ButtonSize } from './NeButton.vue'

export type SortOption = {
  id: string
  label: string
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
  options: SortOption[]
  openMenuAriaLabel: string
  sortByLabel: string
  sortDirectionLabel: string
  ascendingLabel: string
  descendingLabel: string
  alignToRight?: boolean
  size?: ButtonSize
  disabled?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  alignToRight: false,
  size: 'md',
  disabled: false,
  id: ''
})

const sortKey = defineModel<string>('sortKey')
const sortDescending = defineModel<boolean>('sortDescending')
const internalSortKey = ref('')
const internalDescendingValue = ref('asc')
const top = ref(0)
const left = ref(0)
const right = ref(0)
const buttonRef = ref()

const componentId = computed(() => (props.id ? props.id : uuidv4()))

watch(
  () => props.alignToRight,
  () => {
    calculatePosition()
  },
  { immediate: true }
)

watch(
  () => sortDescending.value,
  () => {
    // update internal model when external model changes, converting boolean to string
    internalDescendingValue.value = sortDescending.value ? 'desc' : 'asc'
  },
  { immediate: true }
)

watch(
  () => sortKey.value,
  () => {
    // update internal model when external model changes
    if (sortKey.value !== internalSortKey.value) {
      internalSortKey.value = sortKey.value || ''
    }
  },
  { immediate: true }
)

watch(
  () => internalSortKey.value,
  () => {
    // update external model when internal model changes
    sortKey.value = internalSortKey.value
  },
  { immediate: true }
)

watch(
  () => internalDescendingValue.value,
  () => {
    // update external model when internal model changes, converting string to boolean
    sortDescending.value = internalDescendingValue.value === 'desc'
  },
  { immediate: true }
)

function calculatePosition() {
  top.value = buttonRef.value?.$el.getBoundingClientRect().bottom + window.scrollY
  left.value = buttonRef.value?.$el.getBoundingClientRect().left - window.scrollX
  right.value =
    document.documentElement.clientWidth -
    buttonRef.value?.$el.getBoundingClientRect().right -
    window.scrollX
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
      >
        <MenuItems
          :style="[
            { top: top + 'px' },
            alignToRight ? { right: right + 'px' } : { left: left + 'px' }
          ]"
          class="absolute z-50 mt-2.5 max-h-80 min-w-40 overflow-y-auto rounded-md bg-white px-4 py-2 text-sm shadow-lg ring-1 ring-gray-900/5 focus:outline-hidden dark:bg-gray-950 dark:ring-gray-500/50"
        >
          <div class="text-sm leading-6 font-medium text-gray-500 dark:text-gray-400">
            {{ sortByLabel }}
          </div>
          <MenuItem v-for="option in options" :key="option.id" as="div">
            <!-- divider -->
            <hr
              v-if="option.id.includes('divider')"
              class="my-1 border-gray-200 dark:border-gray-700"
            />
            <div class="flex items-center py-2" @click.stop>
              <input
                :id="`${componentId}-${option.id}`"
                v-model="internalSortKey"
                type="radio"
                :name="componentId"
                :value="option.id"
                :aria-describedby="`${componentId}-${option.id}-description`"
                class="peer text-primary-700 focus:ring-primary-500 dark:text-primary-500 checked:dark:bg-primary-500 dark:focus:ring-primary-300 focus:dark:ring-primary-200 border-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 focus:dark:ring-offset-gray-900"
                :disabled="disabled"
              />
              <label
                :for="`${componentId}-${option.id}`"
                class="ms-2 flex flex-col text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:text-gray-50"
              >
                <span>{{ option.label }}</span>
              </label>
            </div>
          </MenuItem>
          <div class="mt-4 text-sm leading-6 font-medium text-gray-500 dark:text-gray-400">
            {{ sortDirectionLabel }}
          </div>
          <!-- ascending -->
          <MenuItem as="div">
            <div class="flex items-center py-2" @click.stop>
              <input
                :id="`${componentId}-asc`"
                v-model="internalDescendingValue"
                type="radio"
                :name="`${componentId}-sortDirection`"
                value="asc"
                :aria-describedby="`${componentId}-asc-description`"
                class="peer text-primary-700 focus:ring-primary-500 dark:text-primary-500 checked:dark:bg-primary-500 dark:focus:ring-primary-300 focus:dark:ring-primary-200 border-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 focus:dark:ring-offset-gray-900"
                :disabled="disabled"
              />
              <label
                :for="`${componentId}-asc`"
                class="ms-2 flex flex-col text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:text-gray-50"
              >
                <span>{{ ascendingLabel }}</span>
              </label>
            </div>
          </MenuItem>
          <!-- descending -->
          <MenuItem as="div">
            <div class="flex items-center py-2" @click.stop>
              <input
                :id="`${componentId}-desc`"
                v-model="internalDescendingValue"
                type="radio"
                :name="`${componentId}-sortDirection`"
                value="desc"
                :aria-describedby="`${componentId}-desc-description`"
                class="peer text-primary-700 focus:ring-primary-500 dark:text-primary-500 checked:dark:bg-primary-500 dark:focus:ring-primary-300 focus:dark:ring-primary-200 border-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 focus:dark:ring-offset-gray-900"
                :disabled="disabled"
              />
              <label
                :for="`${componentId}-desc`"
                class="ms-2 flex flex-col text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:text-gray-50"
              >
                <span>{{ descendingLabel }}</span>
              </label>
            </div>
          </MenuItem>
        </MenuItems>
      </transition>
    </Teleport>
  </Menu>
</template>
