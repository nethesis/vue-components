<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import NeButton from './NeButton.vue'
import { type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { ref, watch } from 'vue'

export interface Props {
  items: NeDropdownItem[]
  alignToRight: boolean
  openMenuAriaLabel?: string
  menuClasses?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  alignToRight: false,
  openMenuAriaLabel: 'Open menu',
  menuClasses: ''
})

export interface NeDropdownItem {
  id: string
  label?: string
  icon?: IconDefinition
  danger?: boolean
  action?: () => void
  disabled?: boolean
}

function onItemClick(item: NeDropdownItem) {
  if (!item.disabled && item.action) {
    item.action()
  }
}

function getMenuItemActiveClasses(item: NeDropdownItem) {
  if (item.danger) {
    return 'bg-rose-700 text-white dark:bg-rose-600 dark:text-white'
  } else {
    return 'bg-gray-100 dark:bg-gray-800'
  }
}

const top = ref(0)
const left = ref(0)
const right = ref(0)
const buttonRef = ref<InstanceType<typeof MenuButton> | null>(null)

function calculatePosition() {
  top.value = buttonRef.value?.$el.getBoundingClientRect().bottom + window.scrollY
  left.value = buttonRef.value?.$el.getBoundingClientRect().left - window.scrollX
  right.value =
    document.documentElement.clientWidth -
    buttonRef.value?.$el.getBoundingClientRect().right -
    window.scrollX
}

watch(
  () => props.alignToRight,
  () => {
    calculatePosition()
  }
)
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton
      ref="buttonRef"
      class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
      @click="calculatePosition()"
    >
      <span class="sr-only">{{ openMenuAriaLabel }}</span>
      <slot name="button">
        <!-- default kebab button -->
        <NeButton class="py-2" kind="tertiary">
          <FontAwesomeIcon :icon="faEllipsisVertical" aria-hidden="true" class="h-5 w-5 shrink-0" />
        </NeButton>
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
          :class="`absolute z-50 mt-2.5 min-w-40 rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-hidden dark:bg-gray-950 dark:ring-gray-500/50 ${menuClasses}`"
        >
          <template v-for="item in items" :key="item.id">
            <!-- divider -->
            <hr
              v-if="item.id.includes('divider')"
              class="my-1 border-gray-200 dark:border-gray-700"
            />
            <!-- item -->
            <MenuItem v-else v-slot="{ active }" :disabled="item.disabled">
              <a
                :class="[
                  active ? getMenuItemActiveClasses(item) : '',
                  'group flex items-center px-4 py-2 text-sm',
                  item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                  item.danger
                    ? 'text-rose-700 dark:text-rose-500'
                    : 'text-gray-700 dark:text-gray-50'
                ]"
                @click="onItemClick(item)"
              >
                <FontAwesomeIcon
                  v-if="item.icon"
                  :icon="item.icon"
                  aria-hidden="true"
                  class="mr-2 h-5 w-5 shrink-0"
                />
                {{ item.label }}
              </a>
            </MenuItem>
          </template>
        </MenuItems>
      </transition>
    </Teleport>
  </Menu>
</template>
