<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import NeButton from '../src/components/NeButton.vue'
import NeToggle from '../src/components/NeToggle.vue'

const isDark = useDark()
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 p-10 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-100"
  >
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-semibold">@nethesis/vue-components playground</h1>
      <NeToggle v-model="isDark" label="Dark mode" />
    </div>

    <p class="mb-8 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
      This playground serves as an interactive testing ground for the Nethesis Vue components
      library. It's designed to facilitate development and debugging by allowing you to quickly set
      up test scenarios. Unlike Storybook, features like <code>v-model</code> and other Vue instance
      features fully work in this playground.
    </p>

    <!-- Add components below -->
    <NeButton kind="primary">Hello from playground</NeButton>
  </div>
</template>
