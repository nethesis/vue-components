//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3'
import { NeFileInput } from '../src/main'

const meta = {
  title: 'NeFileInput',
  component: NeFileInput,
  argTypes: {},
  args: {
    label: 'Label',
    invalidMessage: '',
    progress: 0,
    showProgress: false,
    dropzoneLabel: 'Drag and drop or click to upload',
    modelValue: null,
    accept: undefined
  } // default values
} satisfies Meta<typeof NeFileInput>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NeFileInput v-bind="args" />'

export const Default: Story = {
  render: (args) => ({
    components: { NeFileInput },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {}
}

export const Invalid: Story = {
  render: (args) => ({
    components: { NeFileInput },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    invalidMessage: 'Invalid file'
  }
}

export const Progress: Story = {
  render: (args) => ({
    components: { NeFileInput },
    setup() {
      return { args }
    },
    template: template
  }),
  args: { showProgress: true, progress: 75 }
}

export const Accept: Story = {
  render: (args) => ({
    components: { NeFileInput },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    accept: 'image/*,.pdf'
  }
}
