<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faTriangleExclamation,
  type IconDefinition
} from '@fortawesome/free-solid-svg-icons'

export type RoundedIconKind = 'info' | 'warning' | 'error' | 'success' | 'gray'

interface RoundedIconProps {
  kind?: RoundedIconKind
  customIcon?: IconDefinition
  customForegroundClasses?: string
  customBackgroundClasses?: string
}

const props = defineProps<RoundedIconProps>()

// the 'gray' kind has no standard icon: it is always paired with customIcon
const iconName: Partial<Record<RoundedIconKind, IconDefinition>> = {
  info: faCircleInfo,
  warning: faTriangleExclamation,
  error: faCircleXmark,
  success: faCircleCheck
}

const iconBackgroundStyle: Record<RoundedIconKind, string> = {
  info: 'bg-blue-100 dark:bg-blue-800',
  warning: 'bg-amber-100 dark:bg-amber-800',
  error: 'bg-rose-100 dark:bg-rose-800',
  success: 'bg-green-100 dark:bg-green-800',
  gray: 'bg-gray-100 dark:bg-gray-800'
}

const iconForegroundStyle: Record<RoundedIconKind, string> = {
  info: 'text-blue-700 dark:text-blue-50',
  warning: 'text-amber-700 dark:text-amber-50',
  error: 'text-rose-700 dark:text-rose-50',
  success: 'text-green-700 dark:text-green-50',
  gray: 'text-gray-700 dark:text-gray-50'
}

function getIcon(): IconDefinition | Array<string> {
  // customIcon takes precedence over the kind default, so that kinds without a
  // standard icon (e.g. 'gray') can be paired with any icon. An empty array is
  // treated as "not set", since it's the idiomatic empty value for icon props.
  const customIcon = props.customIcon

  if (customIcon != null && !(Array.isArray(customIcon) && customIcon.length === 0)) {
    return customIcon
  } else if (props.kind) {
    return iconName[props.kind] ?? []
  } else {
    return []
  }
}
</script>

<template>
  <div
    :class="[
      `flex h-10 w-10 items-center justify-center rounded-full`,
      kind ? iconBackgroundStyle[kind] : customBackgroundClasses
    ]"
  >
    <FontAwesomeIcon
      :class="[`h-5 w-5`, kind ? iconForegroundStyle[kind] : customForegroundClasses]"
      :icon="getIcon()"
      aria-hidden="true"
    />
  </div>
</template>
