<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import NeButton, { type ButtonKind } from './NeButton.vue'
import NeRoundedIcon from './NeRoundedIcon.vue'
import { watch } from 'vue'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export type ModalKind = 'neutral' | 'info' | 'warning' | 'error' | 'success'
export type PrimaryButtonKind = 'primary' | 'danger'
export type ModalSize = 'md' | 'lg' | 'xl' | 'xxl'

const {
  visible = true,
  title = '',
  kind = 'neutral',
  size = 'md',
  primaryLabel = '',
  secondaryLabel = '',
  cancelLabel = '',
  primaryButtonKind = 'primary',
  primaryButtonDisabled = false,
  primaryButtonLoading = false,
  secondaryButtonKind = 'secondary',
  secondaryButtonDisabled = false,
  secondaryButtonLoading = false
} = defineProps<{
  visible?: boolean
  title?: string
  kind?: ModalKind
  size?: ModalSize
  primaryLabel?: string
  secondaryLabel?: string
  cancelLabel?: string
  primaryButtonKind?: ButtonKind
  primaryButtonDisabled?: boolean
  primaryButtonLoading?: boolean
  secondaryButtonKind?: ButtonKind
  secondaryButtonDisabled?: boolean
  secondaryButtonLoading?: boolean
  closeAriaLabel: string
}>()

const emit = defineEmits(['close', 'primaryClick', 'secondaryClick', 'show'])

const sizeStyle: Record<ModalSize, string> = {
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  xxl: 'sm:max-w-6xl'
}

watch(
  () => visible,
  () => {
    if (visible) {
      emit('show')
    }
  }
)

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
    <Dialog as="div" class="relative z-100" @close="onClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-700/75" />
      </TransitionChild>

      <div class="fixed inset-0 z-100 overflow-y-auto">
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
              :class="`relative transform overflow-hidden rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full ${sizeStyle[size]} bg-gray-50 sm:p-6 dark:bg-gray-900`"
            >
              <form @submit.prevent>
                <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    class="focus:ring-primary-500 dark:focus:ring-primary-300 rounded-md p-1 leading-none text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:outline-hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus:ring-offset-gray-900"
                    @click="onClose"
                  >
                    <span class="sr-only">{{ closeAriaLabel }}</span>
                    <FontAwesomeIcon :icon="faXmark" class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div class="sm:flex sm:items-start">
                  <template v-if="kind !== 'neutral'">
                    <NeRoundedIcon
                      :kind="kind"
                      class="mx-auto mb-3 shrink-0 sm:mx-0 sm:mr-4 sm:mb-0"
                    />
                  </template>
                  <div class="grow text-center sm:text-left">
                    <DialogTitle
                      v-if="title"
                      as="h3"
                      class="mb-4 text-base leading-6 font-medium text-gray-900 dark:text-gray-50"
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
                    class="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
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
