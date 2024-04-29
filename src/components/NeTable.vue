<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
defineProps({
  ariaLabel: {
    type: String,
    required: true
  }
})
</script>
<template>
  <div class="overflow-x-auto rounded-lg border border-gray-300 shadow-sm dark:border-gray-600">
    <table
      role="grid"
      :aria-label="ariaLabel"
      class="grid w-full table-auto bg-white text-left text-sm font-normal text-gray-700 dark:bg-gray-950 dark:text-gray-200 md:table md:divide-y md:divide-gray-300 md:dark:divide-gray-600"
    >
      <slot />
    </table>
  </div>
</template>
