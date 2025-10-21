<!--
  Copyright (C) 2025 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import NeProgressBar from './NeProgressBar.vue'
import { range } from 'lodash-es'

const { totalSteps, currentStep, stepLabel } = defineProps<{
  totalSteps: number
  currentStep: number
  stepLabel: string
}>()
</script>

<template>
  <div>
    <NeProgressBar :progress="(currentStep / totalSteps) * 100" size="sm" />
    <div class="mt-2 flex flex-row">
      <div v-for="i in range(1, totalSteps + 1)" :key="i" class="flex grow basis-0 justify-center">
        <p
          v-if="i === currentStep"
          class="text-primary-700 dark:text-primary-500 text-xs font-medium"
        >
          {{ stepLabel }} {{ currentStep }}/{{ totalSteps }}
        </p>
      </div>
    </div>
  </div>
</template>
