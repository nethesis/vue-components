<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { faXmark as fasXmark } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import NeButton, { type ButtonKind } from './NeButton.vue'
import NeRoundedIcon from './NeRoundedIcon.vue'
import type { PropType } from 'vue'

type ModalKind = 'neutral' | 'info' | 'warning' | 'error' | 'success'
type PrimaryButtonKind = 'primary' | 'danger'
type ModalSize = 'md' | 'lg' | 'xl' | 'xxl'

defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  kind: {
    type: String as PropType<ModalKind>,
    default: 'neutral'
  },
  size: {
    type: String as PropType<ModalSize>,
    default: 'md'
  },
  primaryLabel: {
    type: String,
    default: ''
  },
  secondaryLabel: {
    type: String,
    default: ''
  },
  cancelLabel: {
    type: String,
    default: ''
  },
  primaryButtonKind: {
    type: String as PropType<PrimaryButtonKind>,
    default: 'primary'
  },
  primaryButtonDisabled: {
    type: Boolean,
    default: false
  },
  primaryButtonLoading: {
    type: Boolean,
    default: false
  },
  secondaryButtonKind: {
    type: String as PropType<ButtonKind>,
    default: 'secondary'
  },
  secondaryButtonDisabled: {
    type: Boolean,
    default: false
  },
  secondaryButtonLoading: {
    type: Boolean,
    default: false
  },
  closeAriaLabel: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'primaryClick', 'secondaryClick'])

// add fontawesome icons
library.add(fasXmark)

const sizeStyle: Record<ModalSize, string> = {
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  xxl: 'sm:max-w-6xl'
}

function onClose() {
  emit('close')
}

function onPrimaryClick() {
  emit('primaryClick')
}

function onSecondaryClick() {
  emit('secondaryClick')
}
</script>

<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-[100]" @close="onClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-700 dark:bg-opacity-75"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-[100] overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              :class="`relative transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full ${sizeStyle[size]} bg-gray-50 dark:bg-gray-900 sm:p-6`"
            >
              <form @submit.prevent>
                <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    class="rounded-md p-1 leading-none text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus:ring-primary-300 dark:focus:ring-offset-gray-900"
                    @click="onClose"
                  >
                    <span class="sr-only">{{ closeAriaLabel }}</span>
                    <FontAwesomeIcon :icon="['fas', 'xmark']" class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div class="sm:flex sm:items-start">
                  <template v-if="kind !== 'neutral'">
                    <NeRoundedIcon
                      :kind="kind"
                      class="mx-auto mb-3 flex-shrink-0 sm:mx-0 sm:mb-0 sm:mr-4"
                    />
                  </template>
                  <div class="grow text-center sm:text-left">
                    <DialogTitle
                      v-if="title"
                      as="h3"
                      class="mb-4 text-base font-semibold leading-6 text-gray-900 dark:text-gray-50"
                      >{{ title }}</DialogTitle
                    >
                    <div>
                      <p class="text-sm text-gray-700 dark:text-gray-200">
                        <slot />
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-6 sm:flex sm:flex-row-reverse">
                  <NeButton
                    :kind="primaryButtonKind"
                    size="lg"
                    :disabled="primaryButtonDisabled"
                    :loading="primaryButtonLoading"
                    type="submit"
                    class="w-full sm:ml-3 sm:w-auto"
                    @click.prevent="onPrimaryClick"
                    >{{ primaryLabel }}</NeButton
                  >
                  <NeButton
                    v-if="secondaryLabel"
                    :kind="secondaryButtonKind"
                    size="lg"
                    :disabled="secondaryButtonDisabled"
                    :loading="secondaryButtonLoading"
                    class="mt-3 w-full sm:ml-3 sm:mt-0 sm:w-auto"
                    @click="onSecondaryClick"
                    >{{ secondaryLabel }}</NeButton
                  >
                  <NeButton
                    v-if="cancelLabel"
                    kind="tertiary"
                    size="lg"
                    class="mt-3 w-full sm:mt-0 sm:w-auto"
                    @click="onClose"
                    >{{ cancelLabel }}</NeButton
                  >
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
