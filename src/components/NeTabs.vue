<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { ref, onMounted, useId, watch } from 'vue'
import NeBadgeV2, { type NeBadgeV2Kind } from './NeBadgeV2.vue'

export interface Tab {
  name: string
  label: string
  // optional badge after the label, such as a count of rows
  badge?: string | number
  // color of the badge, gray by default
  badgeKind?: Exclude<NeBadgeV2Kind, 'custom'>
}

export interface Props {
  tabs: Tab[]
  selected?: string
  srSelectTabLabel?: string
  srTabsLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
  selected: '',
  srSelectTabLabel: 'Select a tab',
  srTabsLabel: 'Tabs'
})

const selectId = useId()

const currentTab = ref('')

onMounted(() => {
  selectTabFromSelectedProp()
})

watch(currentTab, () => {
  emit('selectTab', currentTab.value)
})

watch(
  () => [props.selected],
  () => {
    selectTabFromSelectedProp()
  }
)

function selectTabFromSelectedProp() {
  let selectedTab = props.tabs[0]

  if (props.selected) {
    const selectedTabFound = props.tabs.find((tab: any) => tab.name === props.selected)

    if (selectedTabFound) {
      selectedTab = selectedTabFound
    }
  }
  currentTab.value = selectedTab.name
}

function hasBadge(tab: Tab) {
  return tab.badge !== undefined && tab.badge !== null && tab.badge !== ''
}

// the select cannot show a badge: append it to the text of the option
function optionLabel(tab: Tab) {
  return hasBadge(tab) ? `${tab.label} (${tab.badge})` : tab.label
}

function selectTab(tabName: any) {
  currentTab.value = tabName
}

const emit = defineEmits(['selectTab'])
</script>

<template>
  <div>
    <!-- mobile tabs -->
    <div class="sm:hidden">
      <label :for="selectId" class="sr-only">{{ srSelectTabLabel }}</label>
      <select
        :id="selectId"
        v-model="currentTab"
        name="tabs_select"
        class="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 block w-full rounded-md border-gray-300 bg-white py-2 pr-10 pl-3 text-base text-gray-700 focus:outline-hidden sm:text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
      >
        <option
          v-for="tab in props.tabs"
          :key="tab.name"
          :selected="currentTab === tab.name"
          :value="tab.name"
        >
          {{ optionLabel(tab) }}
        </option>
      </select>
    </div>
    <!-- desktop tabs -->
    <div class="hidden sm:block">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8" :aria-label="srTabsLabel">
          <button
            v-for="tab in props.tabs"
            :key="tab.name"
            type="button"
            :class="[
              currentTab === tab.name
                ? 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-500'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-100',
              'focus-visible:ring-primary-500 dark:focus-visible:ring-primary-300 inline-flex cursor-pointer items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap focus:outline-hidden focus-visible:ring-2'
            ]"
            :aria-current="currentTab === tab.name ? 'page' : undefined"
            @click="selectTab(tab.name)"
          >
            {{ tab.label }}
            <NeBadgeV2 v-if="hasBadge(tab)" size="xs" :kind="tab.badgeKind ?? 'gray'">
              {{ tab.badge }}
            </NeBadgeV2>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
