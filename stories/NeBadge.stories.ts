//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { Meta, StoryObj } from '@storybook/vue3'
import { NeBadge } from '../src/main'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'

const meta: Meta<typeof NeBadge> = {
  title: 'Visual/NeBadge',
  component: NeBadge,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'xs'],
      control: { type: 'inline-radio' }
    },
    kind: {
      options: [
        'primary',
        'secondary',
        'tertiary',
        'success',
        'warning',
        'error',
        'info',
        'custom'
      ],
      control: { type: 'inline-radio' }
    },
    rounded: {
      control: { type: 'boolean' }
    },
    iconPosition: {
      options: ['left', 'right'],
      control: { type: 'inline-radio' }
    }
  }
}

export default meta

export const Default: StoryObj<typeof NeBadge> = {
  render: (args) => ({
    components: { NeBadge },
    setup() {
      return { args }
    },
    template: `
      <NeBadge :kind="args.kind" :label="args.label" :rounded="args.rounded" :size="args.size" :text="args.text" />
    `
  }),
  args: {
    size: 'sm',
    kind: 'secondary',
    rounded: true,
    text: 'Badge',
    label: '',
    icon: undefined,
    iconClickable: false
  }
}

export const WithLabel: StoryObj<typeof NeBadge> = {
  render: Default.render,
  args: {
    size: 'sm',
    kind: 'primary',
    rounded: true,
    text: "Where's the label?",
    label: "Here's the label!",
    icon: undefined,
    iconClickable: false
  }
}

export const Kinds: StoryObj<typeof NeBadge> = {
  render: (args) => ({
    components: { NeBadge },
    setup() {
      return { args }
    },
    template: `
      <div class="flex flex-wrap gap-8">
        <NeBadge :label="args.label" :rounded="args.rounded" :size="args.size" :kind="'primary'" text="Primary" />
        <NeBadge :label="args.label" :rounded="args.rounded" :size="args.size" :kind="'secondary'" text="Secondary" />
        <NeBadge :label="args.label" :rounded="args.rounded" :size="args.size" :kind="'tertiary'" text="Tertiary" />
        <NeBadge :label="args.label" :rounded="args.rounded" :size="args.size" :kind="'success'" text="Success" />
        <NeBadge :label="args.label" :rounded="args.rounded" :size="args.size" :kind="'warning'" text="Warning" />
        <NeBadge :label="args.label" :rounded="args.rounded" :size="args.size" :kind="'error'" text="Error" />
        <NeBadge :label="args.label" :rounded="args.rounded" :size="args.size" :kind="'info'" text="Info" />
        <NeBadge :label="args.label" :rounded="args.rounded" :size="args.size" :kind="'custom'" text="Custom" :customColorClasses="args.customColorClasses" />
      </div>
    `
  }),
  args: {
    size: 'sm',
    rounded: true,
    label: '',
    customColorClasses: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-700 dark:text-fuchsia-50'
  }
}

export const Icons: StoryObj<typeof NeBadge> = {
  render: (args) => ({
    components: { NeBadge },
    setup() {
      return { args }
    },
    template: `
      <div class="flex flex-wrap gap-8">
        <NeBadge :icon="args.icon" :icon-position="args.iconPosition" :label="args.label" :rounded="args.rounded"
                 :size="args.size" :kind="'primary'" text="Primary" />
        <NeBadge :icon="args.icon" :icon-position="args.iconPosition" :label="args.label" :rounded="args.rounded"
                 :size="args.size" :kind="'secondary'" text="Secondary" />
        <NeBadge :icon="args.icon" :icon-position="args.iconPosition" :label="args.label" :rounded="args.rounded"
                 :size="args.size" :kind="'tertiary'" text="Tertiary" />
        <NeBadge :icon="args.icon" :icon-position="args.iconPosition" :label="args.label" :rounded="args.rounded"
                 :size="args.size" :kind="'success'" text="Success" />
        <NeBadge :icon="args.icon" :icon-position="args.iconPosition" :label="args.label" :rounded="args.rounded"
                 :size="args.size" :kind="'warning'" text="Warning" />
        <NeBadge :icon="args.icon" :icon-position="args.iconPosition" :label="args.label" :rounded="args.rounded"
                 :size="args.size" :kind="'error'" text="Error" />
        <NeBadge :icon="args.icon" :icon-position="args.iconPosition" :label="args.label" :rounded="args.rounded"
                 :size="args.size" :kind="'info'" text="Info" />
      </div>
    `
  }),
  args: {
    size: 'sm',
    rounded: true,
    text: 'Badge',
    label: '',
    icon: faHeart,
    iconPosition: 'left',
    iconClickable: false
  }
}

export const IconClickable: StoryObj<typeof NeBadge> = {
  render: (args) => ({
    components: { NeBadge },
    setup() {
      return { args }
    },
    template: `<NeBadge v-bind="args" />`
  }),
  args: {
    kind: 'secondary',
    size: 'sm',
    rounded: true,
    text: 'Badge',
    label: '',
    icon: faXmark,
    iconPosition: 'right',
    iconClickable: true
  }
}

export const CustomColor: StoryObj<typeof NeBadge> = {
  render: (args) => ({
    components: { NeBadge },
    setup() {
      return { args }
    },
    template: `<NeBadge v-bind="args" />`
  }),
  args: {
    kind: 'custom',
    size: 'sm',
    rounded: true,
    text: 'Badge',
    label: '',
    customColorClasses: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-700 dark:text-fuchsia-50'
  }
}
