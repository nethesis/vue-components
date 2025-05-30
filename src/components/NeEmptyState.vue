<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: undefined
  }
})
</script>

<template>
  <div class="bg-gray-100 px-6 py-7 text-sm sm:rounded-md sm:px-8 dark:bg-gray-800">
    <div class="flex flex-col items-center">
      <FontAwesomeIcon
        v-if="icon"
        :icon="icon"
        class="mb-5 h-14 w-14 text-gray-400 dark:text-gray-500"
      />
      <div v-if="title" class="text-base font-medium text-gray-700 dark:text-gray-200">
        {{ title }}
      </div>
      <div v-if="description" class="mt-1 text-gray-600 dark:text-gray-400">{{ description }}</div>
      <div v-if="$slots.default" class="mt-5">
        <slot />
      </div>
    </div>
  </div>
</template>
