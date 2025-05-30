<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isShown: { type: Boolean, default: false },
  title: { type: String, default: '' },
  closeOnClickOutside: { type: Boolean, default: false },
  closeAriaLabel: { type: String, default: 'Close side drawer' }
})

const emit = defineEmits(['close'])

onMounted(() => {
  window.addEventListener('keydown', onKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyUp)
})

function closeDrawer() {
  emit('close')
}

function maybeCloseDrawer() {
  // close drawer only if closeOnClickOutside pros is true
  if (props.closeOnClickOutside) {
    closeDrawer()
  }
}

function onKeyUp(event: any) {
  // close drawer on escape key
  if (event.key === 'Escape') {
    closeDrawer()
  }
}
</script>

<template>
  <TransitionRoot :show="isShown" as="template">
    <Dialog as="div" class="relative z-100" @close="maybeCloseDrawer">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="bg-opacity-75 dark:bg-opacity-75 fixed top-0 right-0 bottom-0 left-0 bg-gray-500 dark:bg-gray-700"
        />
      </TransitionChild>

      <div class="fixed top-0 right-0 bottom-0 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="translate-x-full"
        >
          <DialogPanel
            class="3xl:w-[35rem] relative ml-16 flex w-[80vw] flex-1 overflow-y-auto bg-gray-50 text-gray-700 shadow-[0px_20px_40px_0_rgba(0,0,0,0.2)] sm:w-100 lg:w-120 dark:bg-gray-900 dark:text-gray-100 dark:shadow-[0px_20px_40px_0_rgba(0,0,0,0.6)]"
          >
            <TransitionChild
              v-if="!title"
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="absolute top-0 right-full flex w-16 justify-center pt-5">
                <button class="-m-2.5 p-2.5" type="button" @click="closeDrawer">
                  <span class="sr-only">{{ props.closeAriaLabel }}</span>
                  <FontAwesomeIcon
                    :icon="faXmark"
                    aria-hidden="true"
                    class="h-6 w-6 text-gray-600 dark:text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            <div class="w-full grow p-6">
              <!-- drawer header -->
              <div v-if="title">
                <div class="flex items-center justify-between">
                  <div class="text-lg">
                    {{ props.title }}
                  </div>
                  <button
                    class="focus:ring-primary-500 dark:focus:ring-primary-300 inline-flex rounded-md p-1.5 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-hidden dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
                    type="button"
                    @click="closeDrawer"
                  >
                    <span class="sr-only">{{ props.closeAriaLabel }}</span>
                    <FontAwesomeIcon :icon="faXmark" aria-hidden="true" class="h-4 w-4" />
                  </button>
                </div>
                <hr class="my-6 border-gray-200 dark:border-gray-700" />
              </div>
              <div class="pb-6">
                <!-- drawer content -->
                <slot></slot>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
