<!--
  Copyright (C) 2023 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  expanded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['setExpanded'])

function toggleExpanded() {
  emit('setExpanded', !props.expanded)
}
</script>

<template>
  <div>
    <button
      class="flex w-full items-center justify-between rounded border-b border-gray-300 px-2 py-1 text-sm font-medium text-gray-900 hover:bg-gray-200 dark:border-gray-500 dark:text-gray-50 dark:hover:bg-gray-700"
      @click="toggleExpanded"
    >
      <span>{{ title }}</span>
      <FontAwesomeIcon
        :icon="expanded ? faChevronUp : faChevronDown"
        aria-hidden="true"
        class="h-4 w-4 shrink-0 text-gray-700 dark:text-gray-200"
      />
    </button>
    <Transition name="slide-down">
      <div v-show="expanded" class="text-sm text-gray-700 dark:text-gray-200">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>
