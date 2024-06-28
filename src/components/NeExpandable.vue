<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { onMounted, ref, watch } from 'vue'
import NeButton from './NeButton.vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  isExpanded: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['setExpanded'])

const internalIsExpanded = ref(false)

onMounted(() => {
  internalIsExpanded.value = props.isExpanded
})

watch(
  () => props.isExpanded,
  () => {
    if (internalIsExpanded.value != props.isExpanded) {
      internalIsExpanded.value = props.isExpanded
    }
  }
)

function toggleExpanded() {
  internalIsExpanded.value = !internalIsExpanded.value
  emit('setExpanded', internalIsExpanded.value)
}
</script>

<template>
  <div class="text-sm">
    <div :class="['cursor-pointer', fullWidth ? 'block' : 'inline-block']" @click="toggleExpanded">
      <slot name="trigger">
        <!-- inline button -->
        <template v-if="!fullWidth">
          <NeButton kind="tertiary" size="sm" class="-ml-2">
            <template #suffix>
              <font-awesome-icon
                :icon="internalIsExpanded ? faChevronUp : faChevronDown"
                class="h-3 w-3"
                aria-hidden="true"
              />
            </template>
            {{ label }}
          </NeButton>
        </template>
        <template v-else>
          <!-- full width button -->
          <button
            class="flex w-full items-center justify-between rounded border-b border-gray-300 px-2 py-1 text-sm font-medium text-gray-900 hover:bg-gray-200 dark:border-gray-500 dark:text-gray-50 dark:hover:bg-gray-700"
          >
            <span>{{ label }}</span>
            <font-awesome-icon
              :icon="internalIsExpanded ? faChevronUp : faChevronDown"
              class="h-3 w-3"
              aria-hidden="true"
            />
          </button>
        </template>
      </slot>
    </div>
    <Transition name="slide-down">
      <div v-show="internalIsExpanded" class="mt-4">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>
