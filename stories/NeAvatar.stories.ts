//  Copyright (C) 2025 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeAvatar } from '../src/main'
import AvatarImage from '../src/assets/avatar.png'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

const meta = {
  title: 'NeAvatar',
  component: NeAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] }
  },
  args: {
    size: 'md',
    img: '',
    initials: '',
    squared: false,
    alt: 'Avatar'
  } // default values
} satisfies Meta<typeof NeAvatar>

export default meta
type Story = StoryObj<typeof meta>

const defaultTemplate = `<NeAvatar v-bind="args" />`

export const Default: Story = {
  render: (args) => ({
    components: { NeAvatar },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: {}
}

export const Squared: Story = {
  render: (args) => ({
    components: { NeAvatar },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: { squared: true }
}

export const Image: Story = {
  render: (args) => ({
    components: { NeAvatar },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: { img: AvatarImage, alt: 'User avatar' }
}

export const Initials: Story = {
  render: (args) => ({
    components: { NeAvatar },
    setup() {
      return { args }
    },
    template: defaultTemplate
  }),
  args: { initials: 'JD' }
}

const placeholderSlotTemplate = `<NeAvatar v-bind="args">
  <template #placeholder>
    <div class="flex items-center justify-center size-16 rounded-full bg-emerald-500 text-emerald-950 dark:bg-emerald-200 dark:text-emerald-950">
      <FontAwesomeIcon :icon="faUserSecret" class="size-8" />
    </div>
  </template>
</NeAvatar>`

export const PlaceholderSlot: Story = {
  render: (args) => ({
    components: { NeAvatar, FontAwesomeIcon },
    setup() {
      return { args, faUserSecret }
    },
    template: placeholderSlotTemplate
  }),
  args: {}
}
