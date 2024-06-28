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

type RoundedIconKind = 'info' | 'warning' | 'error' | 'success'

interface RoundedIconProps {
  kind?: RoundedIconKind
  customIcon?: IconDefinition
  customForegroundClasses?: string
  customBackgroundClasses?: string
}

const props = defineProps<RoundedIconProps>()

const iconName: Record<RoundedIconKind, IconDefinition> = {
  info: faCircleInfo,
  warning: faTriangleExclamation,
  error: faCircleXmark,
  success: faCircleCheck
}

const iconBackgroundStyle: Record<RoundedIconKind, string> = {
  info: 'bg-indigo-100 dark:bg-indigo-800',
  warning: 'bg-amber-100 dark:bg-amber-800',
  error: 'bg-rose-100 dark:bg-rose-800',
  success: 'bg-green-100 dark:bg-green-800'
}

const iconForegroundStyle: Record<RoundedIconKind, string> = {
  info: 'text-indigo-700 dark:text-indigo-50',
  warning: 'text-amber-700 dark:text-amber-50',
  error: 'text-rose-700 dark:text-rose-50',
  success: 'text-green-700 dark:text-green-50'
}

function getIcon(): IconDefinition | Array<string> {
  if (props.kind) {
    return iconName[props.kind]
  } else if (props.customIcon) {
    return props.customIcon
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
