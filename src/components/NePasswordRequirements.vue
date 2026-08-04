<!--
  Copyright (C) 2026 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import type { NePasswordRequirementStatus } from '../composables/usePasswordRequirements'

const {
  requirements,
  showErrors = false,
  metLabel = 'Requirement met',
  unmetLabel = 'Requirement not met'
} = defineProps<{
  /** Usually the requirements returned by usePasswordRequirements */
  requirements: NePasswordRequirementStatus[]
  /**
   * Turns unmet requirements from pending into failed. Set it once the user has attempted to
   * submit, so that the checklist doesn't look like a list of errors while they are still typing.
   */
  showErrors?: boolean
  metLabel?: string
  unmetLabel?: string
}>()

library.add(faCircleCheck)
library.add(faCircleXmark)
</script>

<template>
  <ul class="space-y-1">
    <li
      v-for="requirement in requirements"
      :key="requirement.key"
      class="flex items-center gap-2 text-sm leading-5 text-gray-600 dark:text-gray-400"
    >
      <!-- met -->
      <FontAwesomeIcon
        v-if="requirement.met"
        :icon="faCircleCheck"
        class="size-4 shrink-0 text-green-700 dark:text-green-500"
        aria-hidden="true"
      />
      <!-- unmet, after a submit attempt -->
      <FontAwesomeIcon
        v-else-if="showErrors"
        :icon="faCircleXmark"
        class="size-4 shrink-0 text-rose-700 dark:text-rose-400"
        aria-hidden="true"
      />
      <!-- unmet, still pending -->
      <span
        v-else
        class="size-4 shrink-0 rounded-full border border-gray-600 dark:border-gray-400"
        aria-hidden="true"
      ></span>
      <span>
        {{ requirement.label }}
        <span class="sr-only">{{ requirement.met ? metLabel : unmetLabel }}</span>
      </span>
    </li>
  </ul>
</template>
