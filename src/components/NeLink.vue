<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
defineProps({
  // useful on inverted backgrounds (e.g. inside a tooltip)
  invertedTheme: {
    type: Boolean,
    default: false
  }
})

const standardThemeStyle =
  'text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400'

const invertedThemeStyle =
  'text-primary-500 hover:text-primary-400 dark:text-primary-700 dark:hover:text-primary-800'
</script>
<template>
  <a
    rel="noreferrer"
    :class="[
      'cursor-pointer font-medium hover:underline',
      invertedTheme ? invertedThemeStyle : standardThemeStyle
    ]"
  >
    <slot />
  </a>
</template>
