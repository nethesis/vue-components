<!--
  Copyright (C) 2025 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->
<script lang="ts" setup>
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed, ref, useSlots } from 'vue'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

const slots = useSlots()

const {
  size = 'md',
  img = '',
  initials = '',
  squared = false,
  alt = 'Avatar'
} = defineProps<{
  size?: AvatarSize
  img?: string
  initials?: string
  squared?: boolean
  alt?: string
}>()

const avatarSizeClasses: Record<AvatarSize, string> = {
  xs: 'size-6',
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
  xl: 'size-14',
  '2xl': 'size-16',
  '3xl': 'size-20',
  '4xl': 'size-24'
}

const placeholderColorClasses = 'bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-950'

const placeholderIconSizeClasses: Record<AvatarSize, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-7',
  '2xl': 'size-8',
  '3xl': 'size-10',
  '4xl': 'size-12'
}

const initialsSizeClasses: Record<AvatarSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl',
  '2xl': 'text-3xl',
  '3xl': 'text-4xl',
  '4xl': 'text-5xl'
}

const imageError = ref(false)

const hasPlaceholder = computed(() => slots.placeholder)

const placeholderContainerClasses = computed(
  () =>
    `flex items-center justify-center ${placeholderColorClasses} ${squared ? 'rounded-sm' : 'rounded-full'} ${avatarSizeClasses[size]}`
)

function setImageError() {
  imageError.value = true
}
</script>
<template>
  <div>
    <img
      v-if="img && !imageError"
      :alt="alt"
      :class="[avatarSizeClasses[size], squared ? 'rounded-sm' : 'rounded-full']"
      :src="img"
      @error="setImageError"
    />
    <div v-else-if="!initials && hasPlaceholder">
      <slot name="placeholder" />
    </div>
    <div v-else-if="(imageError || !img) && !initials" :class="placeholderContainerClasses">
      <FontAwesomeIcon
        :icon="faUser"
        :class="[placeholderColorClasses, placeholderIconSizeClasses[size]]"
      />
    </div>
    <div v-else :class="`${placeholderContainerClasses} font-medium`">
      <div :class="initialsSizeClasses[size]">
        {{ initials }}
      </div>
    </div>
  </div>
</template>
