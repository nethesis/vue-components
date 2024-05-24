//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { Meta, StoryObj } from '@storybook/vue3'
import { NePaginator } from '../src/main'

const meta: Meta<typeof NePaginator> = {
  title: 'NePaginator',
  component: NePaginator,
  tags: ['autodocs'],
  args: {
    currentPage: 1,
    totalRows: 54,
    pageSize: 10,
    pageSizes: [10, 25, 50, 100],
    previousLabel: 'Go to previous page',
    nextLabel: 'Go to next page',
    navPaginationLabel: 'Pagination',
    rangeOfTotalLabel: 'of',
    pageSizeLabel: 'Show'
  }
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
  args: {}
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
    totalRows: 125
  }
}

export const CustomPageSizes: Story = {
  render: (args) => ({
    components: { NePaginator },
    setup() {
      return { args }
    },
    template: template
  }),
  args: {
    pageSizes: [5, 10, 15, 20],
    pageSize: 5
  }
}
