//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'
import { NeToastNotification, NeNotification, NeRoundedIcon } from '../src/main'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

const meta = {
  title: 'NeToastNotification',
  component: NeToastNotification,
  tags: ['autodocs'],
  args: {
    srCloseLabel: 'Close',
    primaryButtonRightAligned: false,
    showCloseButton: false,
    showTimestamp: false,
    fullWidth: false,
    notification: undefined
  }
} satisfies Meta<typeof NeToastNotification>

export default meta
type Story = StoryObj<typeof meta>

library.add(faHeart)

const notification: NeNotification = {
  id: '1',
  kind: 'info',
  title: 'Toast title',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  timestamp: new Date(),
  payload: undefined,
  isShown: true,
  primaryLabel: 'Primary',
  primaryAction: () => {
    console.log('Primary action')
  },
  secondaryLabel: 'Secondary',
  secondaryAction: () => {
    console.log('Secondary action')
  }
}

const template = '<NeToastNotification v-bind="args"/>'

export const Default: Story = {
  render: (args) => ({
    components: { NeToastNotification },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { notification }
}

const templateWithIconSlot = `<NeToastNotification v-bind="args">
  <template #icon>
    <NeRoundedIcon
      :customIcon="['fas', 'heart']"
      customForegroundClasses="text-fuchsia-700 dark:text-fuchsia-50"
      customBackgroundClasses="bg-fuchsia-100 dark:bg-fuchsia-700"
    />
  </template>
</NeToastNotification>`

export const IconSlot: Story = {
  render: (args) => ({
    components: { NeToastNotification, NeRoundedIcon },
    setup() {
      return { args }
    },
    template: templateWithIconSlot
  }),
  args: { notification }
}
