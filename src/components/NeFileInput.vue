<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons'
import NeProgressBar from './NeProgressBar.vue'

interface FileInputProps {
  modelValue?: File | File[] | null
  label?: string
  helperText?: string
  invalidMessage?: string
  dropzoneLabel: string
  progress?: number
  showProgress?: boolean
  accept?: string | undefined
}

const props = withDefaults(defineProps<FileInputProps>(), {
  modelValue: null,
  label: '',
  helperText: '',
  invalidMessage: '',
  progress: 0,
  showProgress: false,
  dropzoneLabel: 'Drag and drop or click to upload',
  accept: undefined
})

const emit = defineEmits(['update:modelValue', 'select'])

const inputRef = ref<HTMLInputElement | null>(null)

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus })

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const dropZoneText = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return (props.modelValue as File[]).map((el) => el.name).join(', ')
  } else if (props.modelValue instanceof File) {
    return props.modelValue.name || ''
  } else {
    return ''
  }
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0] ?? null
  model.value = selectedFile
  emit('select', selectedFile)
}

const dropFileHandler = (event: DragEvent) => {
  event.preventDefault()
  const arr: File[] = []
  if (event.dataTransfer?.items) {
    Object.values(event.dataTransfer.items).forEach((item: DataTransferItem) => {
      if (item.kind === 'file') {
        arr.push(item.getAsFile() as File)
      }
    })
    const selectedFile = arr[0]
    model.value = selectedFile
    emit('select', selectedFile)
  } else if (event.dataTransfer?.files) {
    Object.values(event.dataTransfer.files).forEach((file: File) => {
      const selectedFile = file
      model.value = selectedFile
      emit('select', selectedFile)
    })
  }
}

const dragOverHandler = (event: Event) => {
  event.preventDefault()
}
</script>

<template>
  <div class="text-sm">
    <div @change="handleChange" @dragover="dragOverHandler" @drop="dropFileHandler">
      <label v-if="label">
        <span class="mb-2 block font-medium text-gray-900 dark:text-white">{{ label }}</span>
      </label>
      <div class="flex items-center justify-center">
        <label
          class="focus-within:ring-primary-500 dark:focus-within:ring-primary-300 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none hover:border-gray-400 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500 dark:hover:bg-gray-700"
        >
          <div
            class="flex flex-col items-center justify-center p-6 text-gray-600 dark:text-gray-300"
          >
            <FontAwesomeIcon :icon="faFileArrowUp" class="mb-4 h-8 w-8" />
            <div v-if="!model">
              <p class="-mb-2! font-medium">
                <span>{{ dropzoneLabel }}</span>
              </p>
              <slot />
            </div>
            <p v-else class="text-gray-900 dark:text-gray-50">
              {{ dropZoneText }}
            </p>
          </div>
          <input ref="inputRef" class="sr-only" type="file" :accept="accept" />
          <!-- progress bar -->
          <NeProgressBar
            v-if="showProgress"
            :indeterminate="!progress"
            :progress="progress"
            class="w-full px-6 pb-6"
          />
        </label>
      </div>
      <!-- invalid message -->
      <p v-if="invalidMessage" class="mt-2 text-rose-700 dark:text-rose-400">
        {{ invalidMessage }}
      </p>
      <!-- helper text -->
      <p v-else-if="helperText" class="mt-2 text-gray-500 dark:text-gray-400">
        {{ helperText }}
      </p>
    </div>
  </div>
</template>
