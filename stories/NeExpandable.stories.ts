//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { Meta, StoryObj } from '@storybook/vue3'
import { NeExpandable } from '../src/main'

const meta: Meta<typeof NeExpandable> = {
  title: 'Utils/NeExpandable',
  component: NeExpandable,
  tags: ['autodocs'],
  args: {
    label: 'Label',
    isExpanded: false,
    fullWidth: false
  }
}
export default meta
type Story = StoryObj<typeof meta>

const defaultTemplate = `<NeExpandable v-bind="args">
  <div class="text-gray-700 dark:text-gray-300">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </div>
</NeExpandable>`

export const Default: Story = {
  render: (args) => ({
    components: { NeExpandable },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: {}
}

export const FullWidth: Story = {
  render: (args) => ({
    components: { NeExpandable },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: { fullWidth: true }
}

const customTriggerTemplate = `<NeExpandable v-bind="args">
  <template #trigger>
    <span class="underline text-gray-700 dark:text-gray-300">
      Click here to show more
    </span>
  </template>
  <div class="text-gray-700 dark:text-gray-300">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </div>
</NeExpandable>`

export const CustomTrigger: Story = {
  render: (args) => ({
    components: { NeExpandable },
    setup() {
      return { args }
    },
    template: customTriggerTemplate
  }),
  args: {}
}

const customTriggerFullWidthTemplate = `<NeExpandable v-bind="args">
  <template #trigger>
    <div class="p-1 rounded bg-sky-200 dark:bg-sky-800 text-gray-700 dark:text-gray-300">
      Click here to show more
    </div>
  </template>
  <div class="text-gray-700 dark:text-gray-300">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </div>
</NeExpandable>`

export const CustomTriggerFullWidth: Story = {
  render: (args) => ({
    components: { NeExpandable },
    setup() {
      return { args }
    },
    template: customTriggerFullWidthTemplate
  }),
  args: { fullWidth: true }
}
