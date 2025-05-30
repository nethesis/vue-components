//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeCard, NeTooltip, NeButton } from '../src/main'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faHeart)

const meta = {
  title: 'NeCard',
  component: NeCard,
  tags: ['autodocs'],
  args: {
    title: 'Card title',
    description: '',
    icon: [],
    loading: false,
    skeletonLines: 4,
    errorTitle: '',
    errorDescription: '',
    menuItems: [],
    alternateBackground: false
  }
} satisfies Meta<typeof NeCard>

export default meta
type Story = StoryObj<typeof meta>

const defaultTemplate =
  '<NeCard v-bind="args">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</NeCard>'

export const Default: Story = {
  render: (args) => ({
    components: { NeCard },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: {}
}

const titleSlotTemplate = `<NeCard v-bind="args">
  <template #title>
    <span>Card title</span>
    <span class='ml-1 text-gray-500 dark:text-gray-400'>
      (with slot)
    </span>
  </template>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
</NeCard>`

export const TitleSlot: Story = {
  render: (args) => ({
    components: { NeCard },
    setup() {
      return { args }
    },
    template: titleSlotTemplate
  }),
  args: { title: '' }
}

export const WithDescription: Story = {
  render: (args) => ({
    components: { NeCard },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: { description: 'Card description' }
}

export const WithIcon: Story = {
  render: (args) => ({
    components: { NeCard },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: { icon: ['fas', 'heart'] }
}

export const Loading: Story = {
  render: (args) => ({
    components: { NeCard },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: { loading: true }
}

export const Error: Story = {
  render: (args) => ({
    components: { NeCard },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: {
    errorTitle: 'Cannot retrieve data',
    errorDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  }
}

const templateWithTooltip =
  '<NeCard v-bind="args">\
      <template #titleTooltip>\
        <NeTooltip>\
          <template #content>Tooltip</template>\
        </NeTooltip>\
      </template>\
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\
    </NeCard>'

export const WithTooltip: Story = {
  render: (args) => ({
    components: { NeCard, NeTooltip },
    setup() {
      return { args }
    },
    template: templateWithTooltip
  }),
  args: {}
}

export const WithMenu: Story = {
  render: (args) => ({
    components: { NeCard },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: {
    menuItems: [
      {
        id: 'edit',
        label: 'Edit'
      },
      {
        id: 'delete',
        label: 'Delete',
        danger: true
      }
    ]
  }
}

const templateWithTopRightSlot = `<NeCard v-bind="args">
  <template #topRight>
    <NeButton kind='tertiary'>Button</NeButton>
  </template>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</NeCard>`

export const WithTopRightSlot: Story = {
  render: (args) => ({
    components: { NeCard, NeButton },
    setup() {
      return { args }
    },
    template: templateWithTopRightSlot
  }),
  args: {}
}

export const WithMenuAndTopRightSlot: Story = {
  render: (args) => ({
    components: { NeCard, NeButton },
    setup() {
      return { args }
    },
    template: templateWithTopRightSlot
  }),
  args: {
    menuItems: [
      {
        id: 'edit',
        label: 'Edit'
      },
      {
        id: 'delete',
        label: 'Delete',
        danger: true
      }
    ]
  }
}

const alternateBackgroundTemplate = `
  <div class="bg-white dark:bg-gray-950 p-12 flex flex-col text-sm gap-6">
    <div class="text-gray-700 dark:text-gray-200">
      Alternate background is useful to get contrast when the card is placed in a container with the same background as the default card background
    </div>
    <NeCard v-bind="args" :alternateBackground="false">
      Card with default background
    </NeCard>
    <NeCard v-bind="args">
      Card with alternate background
    </NeCard>
  </div>`

export const AlternateBackground: Story = {
  render: (args) => ({
    components: { NeCard, NeButton },
    setup() {
      return { args }
    },
    template: alternateBackgroundTemplate
  }),
  args: {
    alternateBackground: true
  }
}
