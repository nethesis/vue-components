<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
defineProps({
  dataLabel: {
    // This attribute replaces table header in mobile viewport
    type: String,
    required: true
  }
})
</script>
<template>
  <td :data-label="dataLabel" class="grid grid-cols-2 px-6 py-4 md:table-cell">
    <span class="font-medium text-gray-900 dark:text-gray-50 md:hidden">
      {{ dataLabel }}
    </span>
    <slot />
  </td>
</template>
