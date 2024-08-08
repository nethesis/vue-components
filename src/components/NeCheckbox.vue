<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  disableSelectOnLabel: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  invalidMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const componentId = computed(() => (props.id ? props.id : uuidv4()))

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>
<template>
  <div>
    <div class="relative flex items-start">
      <div class="flex h-6 items-center">
        <input
          :id="componentId"
          v-model="model"
          :aria-describedby="componentId + '-description'"
          :disabled="disabled"
          class="h-5 w-5 rounded border-gray-300 text-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-500 dark:text-primary-500 dark:focus:ring-primary-300 dark:focus:ring-offset-primary-950 sm:h-4 sm:w-4"
          type="checkbox"
          v-bind="$attrs"
        />
      </div>
      <div class="ml-3 text-sm leading-6">
        <!-- show label prop or default slot -->
        <label
          :class="[
            'font-medium text-gray-700 dark:text-gray-50',
            { 'cursor-not-allowed opacity-50': disabled }
          ]"
          :for="disableSelectOnLabel ? '' : componentId"
        >
          <slot>{{ label }}</slot>
        </label>
        <span v-if="$slots.tooltip" class="ml-2">
          <slot name="tooltip"></slot>
        </span>
        <div
          v-if="$slots.description"
          :id="componentId + '-description'"
          class="text-gray-500 dark:text-gray-400"
        >
          <slot name="description" />
        </div>
      </div>
    </div>
    <!-- invalid message -->
    <p v-if="invalidMessage" class="mt-2 text-sm text-rose-700 dark:text-rose-400">
      {{ invalidMessage }}
    </p>
  </div>
</template>
