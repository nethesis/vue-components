//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { NeToastNotificationV2, NeRoundedIcon } from '../src/main'
import type { NeNotificationV2 } from '../src/main'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

const meta = {
  title: 'NeToastNotificationV2',
  component: NeToastNotificationV2,
  tags: ['autodocs'],
  args: {
    srCloseLabel: 'Close',
    firstActionOnRight: false,
    showCloseButton: false,
    showTimestamp: false,
    fullWidth: false,
    notification: undefined,
    onAction: fn(),
    onClose: fn()
  }
} satisfies Meta<typeof NeToastNotificationV2>

export default meta
type Story = StoryObj<typeof meta>

library.add(faHeart)

const notification: NeNotificationV2 = {
  id: '1',
  kind: 'info',
  title: 'Toast title',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  timestamp: new Date(),
  payload: undefined,
  isShown: true,
  firstButtonLabel: 'First action',
  firstButtonAction: 'firstAction',
  secondButtonLabel: 'Second action',
  secondButtonAction: 'secondAction'
}

const template = '<NeToastNotificationV2 v-bind="args"/>'

export const Default: Story = {
  render: (args) => ({
    components: { NeToastNotificationV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { notification }
}

export const Success: Story = {
  render: (args) => ({
    components: { NeToastNotificationV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    notification: { ...notification, kind: 'success' }
  }
}

export const Warning: Story = {
  render: (args) => ({
    components: { NeToastNotificationV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    notification: { ...notification, kind: 'warning' }
  }
}

export const Error: Story = {
  render: (args) => ({
    components: { NeToastNotificationV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    notification: { ...notification, kind: 'error' }
  }
}

export const WithCloseButton: Story = {
  render: (args) => ({
    components: { NeToastNotificationV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    notification: { ...notification, firstButtonLabel: undefined, secondButtonLabel: undefined },
    showCloseButton: true
  }
}

export const WithTimestamp: Story = {
  render: (args) => ({
    components: { NeToastNotificationV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    notification: { ...notification, firstButtonLabel: undefined, secondButtonLabel: undefined },
    showTimestamp: true
  }
}

export const FullWidth: Story = {
  render: (args) => ({
    components: { NeToastNotificationV2 },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    notification,
    fullWidth: true
  }
}

const templateWithIconSlot = `<NeToastNotificationV2 v-bind="args">
  <template #icon>
    <NeRoundedIcon
      :customIcon="['fas', 'heart']"
      customForegroundClasses="text-fuchsia-700 dark:text-fuchsia-50"
      customBackgroundClasses="bg-fuchsia-100 dark:bg-fuchsia-700"
    />
  </template>
</NeToastNotificationV2>`

export const IconSlot: Story = {
  render: (args) => ({
    components: { NeToastNotificationV2, NeRoundedIcon },
    setup() {
      return { args }
    },
    template: templateWithIconSlot
  }),
  args: { notification }
}
