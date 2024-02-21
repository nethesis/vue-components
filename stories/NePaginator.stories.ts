//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { Meta, StoryObj } from '@storybook/vue3'
import { NePaginator } from '../src/main'

const meta: Meta<typeof NePaginator> = {
  title: 'Visual/NePaginator',
  component: NePaginator,
  tags: ['autodocs'],
  args: {}
}

export default meta
type Story = StoryObj<typeof meta>

const template = '<NePaginator v-bind="args" />'

export const Default: Story = {
  render: (args) => ({
    components: { NePaginator },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    currentPage: 1,
    totalPages: 5,
    previousLabel: 'Previous',
    nextLabel: 'Next'
  }
}

export const WithManyPages: Story = {
  render: (args) => ({
    components: { NePaginator },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    currentPage: 5,
    totalPages: 12,
    previousLabel: 'Previous',
    nextLabel: 'Next'
  }
}
