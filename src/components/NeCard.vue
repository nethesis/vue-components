<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import NeSkeleton from './NeSkeleton.vue'
import NeInlineNotification from './NeInlineNotification.vue'
import NeDropdown, { type NeDropdownItem } from './NeDropdown.vue'
import { computed, useSlots } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: Array<string>,
    default: () => []
  },
  loading: {
    type: Boolean
  },
  skeletonLines: {
    type: Number,
    default: 4
  },
  errorTitle: {
    type: String,
    default: ''
  },
  errorDescription: {
    type: String,
    default: ''
  },
  menuItems: {
    type: Array<NeDropdownItem>,
    default: () => []
  },
  alternateBackground: {
    type: Boolean
  }
})

const slots = useSlots()

const isHeaderShown = computed(() => {
  return (
    props.title || slots.title || props.icon?.length || slots.topRight || props.menuItems?.length
  )
})
</script>

<template>
  <div
    :class="[
      `overflow-hidden px-4 py-5 text-sm text-gray-700 sm:rounded-lg sm:px-6 sm:shadow dark:text-gray-200`,
      props.alternateBackground ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-950'
    ]"
  >
    <!-- header -->
    <div v-if="isHeaderShown" class="flex justify-between">
      <!-- title -->
      <div class="mb-3 flex items-center gap-1">
        <h3
          v-if="title || $slots.title"
          class="leading-6 font-medium text-gray-900 dark:text-gray-50"
        >
          <span v-if="title">
            {{ title }}
          </span>
          <slot v-if="$slots.title" name="title"></slot>
        </h3>
        <span v-if="$slots.titleTooltip" class="ml-1">
          <slot name="titleTooltip"></slot>
        </span>
      </div>
      <!-- icon -->
      <FontAwesomeIcon
        v-if="icon?.length"
        :icon="icon"
        class="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-600"
      />
      <!-- top-right slot (e.g. for kebab menu) -->
      <div
        v-if="$slots.topRight || menuItems?.length"
        class="relative -top-1.5 -right-1.5 flex items-center"
      >
        <div v-if="$slots.topRight">
          <slot name="topRight"></slot>
        </div>
        <!-- top-right menu -->
        <div v-if="menuItems?.length">
          <NeDropdown :items="menuItems" :align-to-right="true" />
        </div>
      </div>
    </div>
    <!-- description and content -->
    <div class="flex h-full flex-row items-center justify-between">
      <div class="h-full min-w-0 grow overflow-hidden text-ellipsis">
        <NeSkeleton v-if="loading" :lines="skeletonLines"></NeSkeleton>
        <NeInlineNotification
          v-else-if="errorTitle"
          kind="error"
          :title="errorTitle"
          :description="errorDescription"
        />
        <template v-else>
          <div v-if="description" class="mb-3 text-gray-500 dark:text-gray-400">
            {{ description }}
          </div>
          <slot></slot>
        </template>
      </div>
    </div>
  </div>
</template>
