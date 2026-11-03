//  Copyright (C) 2024 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import { Meta, StoryObj } from '@storybook/vue3-vite'
import { NePaginator } from '../src/main'

const meta: Meta<typeof NePaginator> = {
  title: 'Components/NePaginator',
  component: NePaginator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The page navigation of a table or a list, with the range of rows shown and the number of rows per page. It goes in the `paginator` slot of `NeTable`. In a narrow container the pages wrap below the range and the page size.'
      }
    }
  },
  args: {
    currentPage: 1,
    totalRows: 54,
    pageSize: 10,
    pageSizes: [10, 25, 50, 100],
    previousLabel: 'Go to previous page',
    nextLabel: 'Go to next page',
    navPaginationLabel: 'Pagination',
    rangeOfTotalLabel: 'of',
    pageSizeLabel: 'Show',
    listboxOptionsPanelStyle: ''
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

export const InNarrowContainer: Story = {
  render: (args) => ({
    components: { NePaginator },
    setup() {
      return { args }
    },
    template: `<div class="max-w-xl">${template}</div>`
  }),
  args: {
    currentPage: 11,
    totalRows: 1050
  },
  parameters: {
    docs: {
      description: {
        story:
          'When the container is too narrow for one row, as in a card that takes half of a page, the pages wrap below the range and the page size.'
      }
    }
  }
}
