<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { Tippy } from 'vue-tippy'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'auto'
  | 'auto-start'
  | 'auto-end'

export type TooltipTriggerEvent =
  | 'click'
  | 'mouseenter focus'
  | 'focusin'
  | 'mouseenter click'
  | 'manual'

defineProps({
  placement: {
    type: String as PropType<TooltipPlacement>,
    default: 'top'
  },
  triggerEvent: {
    type: String as PropType<TooltipTriggerEvent>,
    default: 'click'
  },
  interactive: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <Tippy :interactive="interactive" :placement="placement" :trigger="triggerEvent" theme="tailwind">
    <slot name="trigger">
      <button type="button" class="inline-flex">
        <FontAwesomeIcon
          :icon="faCircleInfo"
          class="h-4 w-4 text-indigo-500 dark:text-indigo-300"
        />
      </button>
    </slot>
    <template #content>
      <slot name="content" />
    </template>
  </Tippy>
</template>
