<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { Tippy } from 'vue-tippy'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, type PropType } from 'vue'
import { useEventListener } from '@vueuse/core'
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
  'click' | 'mouseenter focus' | 'focusin' | 'mouseenter click' | 'manual'

/**
 * All the props accepted by the Tippy component, see https://vue-tippy.netlify.app/props/
 */
export type TippyComponentProps = Partial<InstanceType<typeof Tippy>['$props']>

const props = defineProps({
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
  },
  /**
   * Any additional Tippy prop (https://vue-tippy.netlify.app/props/), e.g.
   * `{ maxWidth: 'none', offset: [0, 20], delay: [300, 0] }`.
   * The props above take precedence over the same key set here.
   */
  tippyProps: {
    type: Object as PropType<TippyComponentProps>,
    default: undefined
  }
})

// vue-tippy exposes the instance methods but does not type them
const tippyRef = ref<{ hide: () => void } | null>(null)
const isShown = ref(false)

// escape dismisses the tooltip only: listening on document lets an open popup inside it
// handle the key first, and stops it before a drawer or modal listening on window.
// manual tooltips are left alone, their visibility belongs to the consumer
useEventListener(
  () => (isShown.value && props.triggerEvent !== 'manual' ? document : undefined),
  'keydown',
  (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      tippyRef.value?.hide()
    }
  }
)
</script>

<template>
  <Tippy
    ref="tippyRef"
    v-bind="tippyProps"
    :interactive="interactive"
    :placement="placement"
    :trigger="triggerEvent"
    theme="tailwind"
    @state="isShown = $event.isShown"
  >
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
