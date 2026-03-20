<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark as fasXmark } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { humanDistanceToNowLoc, formatDateLoc } from '../main'
import NeButton, { type ButtonKind } from './NeButton.vue'
import NeRoundedIcon from './NeRoundedIcon.vue'
import NeTooltip from './NeTooltip.vue'
import { type PropType } from 'vue'

export interface NeNotificationV2 {
  id: string
  kind: 'info' | 'warning' | 'error' | 'success'
  title: string
  description?: string
  timestamp?: Date
  payload?: Record<string, unknown>
  isShown?: boolean
  firstButtonLabel?: string
  firstButtonAction?: string
  firstButtonKind?: ButtonKind
  secondButtonLabel?: string
  secondButtonAction?: string
  secondButtonKind?: ButtonKind
  /** If true, the consuming notification manager should not persist this notification after it is dismissed. */
  ephemeral?: boolean
}

defineProps({
  notification: {
    type: Object as PropType<NeNotificationV2>,
    required: true
  },
  srCloseLabel: {
    type: String,
    required: true
  },
  firstActionOnRight: {
    type: Boolean,
    default: false
  },
  showCloseButton: {
    type: Boolean,
    default: false
  },
  showTimestamp: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'action'])

// add fontawesome icons
library.add(fasXmark)
</script>

<template>
  <div
    :class="[
      `pointer-events-auto w-full overflow-hidden rounded-lg bg-white text-sm shadow-lg ring-1 ring-gray-500/5 dark:bg-gray-950 dark:ring-gray-500/10`,
      { 'max-w-sm': !fullWidth }
    ]"
  >
    <div class="relative p-4">
      <div
        v-if="showCloseButton || (showTimestamp && notification.timestamp)"
        class="absolute top-0 right-0 block pt-4 pr-4"
      >
        <!-- close button -->
        <button
          v-if="showCloseButton"
          type="button"
          class="focus:ring-primary-500 dark:focus:ring-primary-300 rounded-md leading-none text-gray-600 transition-colors hover:text-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:outline-hidden dark:text-gray-300 dark:hover:text-gray-200 dark:focus:ring-offset-gray-900"
          @click="$emit('close')"
        >
          <span class="sr-only">{{ srCloseLabel }}</span>
          <FontAwesomeIcon :icon="['fas', 'xmark']" class="h-5 w-5" aria-hidden="true" />
        </button>
        <!-- timestamp -->
        <NeTooltip
          v-else-if="showTimestamp && notification.timestamp"
          placement="left-start"
          class="text-gray-500 dark:text-gray-400"
        >
          <template #trigger>
            <span class="cursor-pointer">
              {{ humanDistanceToNowLoc(notification.timestamp) }}
            </span>
          </template>
          <template #content>
            {{ formatDateLoc(notification.timestamp, 'Pp') }}
          </template>
        </NeTooltip>
      </div>
      <div class="flex items-start gap-3">
        <div class="shrink-0">
          <!-- custom icon -->
          <template v-if="$slots.icon">
            <slot name="icon" />
          </template>
          <!-- standard icon -->
          <NeRoundedIcon v-else :kind="notification.kind" />
        </div>
        <div class="w-0 flex-1 pt-0.5">
          <h6
            :class="[
              'font-medium text-gray-900 dark:text-gray-50',
              {
                'mr-6': showCloseButton,
                'mr-24!': showTimestamp && notification.timestamp && !showCloseButton
              }
            ]"
          >
            {{ notification.title }}
          </h6>
          <p
            v-if="notification.description"
            class="mt-2 break-words text-gray-700 dark:text-gray-200"
          >
            {{ notification.description }}
          </p>
        </div>
      </div>
      <div
        v-if="notification.firstButtonLabel || notification.secondButtonLabel"
        class="ml-10 flex shrink-0"
      >
        <div
          :class="[
            `mt-4 flex grow justify-end gap-3`,
            firstActionOnRight ? 'flex-row' : 'flex-row-reverse'
          ]"
        >
          <NeButton
            v-if="notification.secondButtonLabel && notification.secondButtonAction"
            :kind="notification.secondButtonKind ?? 'tertiary'"
            size="sm"
            class="w-auto"
            @click="$emit('action', notification.secondButtonAction)"
          >
            {{ notification.secondButtonLabel }}
          </NeButton>
          <NeButton
            v-if="notification.firstButtonLabel && notification.firstButtonAction"
            :kind="notification.firstButtonKind ?? 'secondary'"
            size="sm"
            class="w-auto"
            @click="$emit('action', notification.firstButtonAction)"
          >
            {{ notification.firstButtonLabel }}
          </NeButton>
        </div>
      </div>
    </div>
  </div>
</template>
