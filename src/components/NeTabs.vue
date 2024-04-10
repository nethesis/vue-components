<!--
  Copyright (C) 2024 Nethesis S.r.l.
  SPDX-License-Identifier: GPL-3.0-or-later
-->

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

export interface Tab {
  name: string
  label: string
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

let currentTab = ref('')

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
    let selectedTabFound = props.tabs.find((tab: any) => tab.name === props.selected)

    if (selectedTabFound) {
      selectedTab = selectedTabFound
    }
  }
  currentTab.value = selectedTab.name
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
      <label for="tabs_select" class="sr-only">{{ srSelectTabLabel }}</label>
      <select
        id="tabs_select"
        v-model="currentTab"
        name="tabs_select"
        class="block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
      >
        <option
          v-for="tab in props.tabs"
          :key="tab.name"
          :selected="currentTab === tab.name"
          :value="tab.name"
        >
          {{ tab.label }}
        </option>
      </select>
    </div>
    <!-- desktop tabs -->
    <div class="hidden sm:block">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8" :aria-label="srTabsLabel">
          <a
            v-for="tab in props.tabs"
            :key="tab.name"
            :class="[
              currentTab === tab.name
                ? 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-500'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-100',
              'cursor-pointer whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
            ]"
            :aria-current="currentTab === tab.name ? 'page' : undefined"
            @click="selectTab(tab.name)"
            >{{ tab.label }}</a
          >
        </nav>
      </div>
    </div>
  </div>
</template>
