import {
  NeTable,
  NeTableBody,
  NeTableCell,
  NeTableHead,
  NeTableHeadCell,
  NeTableRow,
  NeEmptyState,
  NePaginator
} from '../src/main'
import { Meta, StoryObj } from '@storybook/vue3'
import { faTable } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

const meta: Meta<typeof NeTable> = {
  title: 'NeTable',
  component: NeTable,
  tags: ['autodocs'],
  argTypes: {
    cardBreakpoint: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', '2xl'] }
  },
  args: {
    ariaLabel: 'Aria label for the table',
    cardBreakpoint: 'md',
    loading: false,
    skeletonRows: 8,
    skeletonColumns: 4
  },
  render: (args) => ({
    components: {
      NeTable,
      NeTableHead,
      NeTableHeadCell,
      NeTableBody,
      NeTableRow,
      NeTableCell,
      NePaginator
    },
    setup() {
      return { args }
    },
    template: `
  <NeTable v-bind="args">
    <NeTableHead>
      <NeTableHeadCell>Game</NeTableHeadCell>
      <NeTableHeadCell>Platform</NeTableHeadCell>
      <NeTableHeadCell>Year</NeTableHeadCell>
    </NeTableHead>
    <NeTableBody>
      <NeTableRow>
        <NeTableCell data-label="Game">The Legend of Zelda: Breath of the Wild</NeTableCell>
        <NeTableCell data-label="Platform">Nintendo Switch</NeTableCell>
        <NeTableCell data-label="Year">2017</NeTableCell>
      </NeTableRow>
      <NeTableRow>
        <NeTableCell data-label="Game">Super Mario Odyssey</NeTableCell>
        <NeTableCell data-label="Platform">Nintendo Switch</NeTableCell>
        <NeTableCell data-label="Year">2017</NeTableCell>
      </NeTableRow>
      <NeTableRow>
        <NeTableCell data-label="Game">The Legend of Zelda: Ocarina of Time</NeTableCell>
        <NeTableCell data-label="Platform">Nintendo 64</NeTableCell>
        <NeTableCell data-label="Year">1998</NeTableCell>
      </NeTableRow>
      <NeTableRow>
        <NeTableCell data-label="Game">Super Mario 64</NeTableCell>
        <NeTableCell data-label="Platform">Nintendo 64</NeTableCell>
        <NeTableCell data-label="Year">1996</NeTableCell>
      </NeTableRow>
      <NeTableRow>
        <NeTableCell data-label="Game">The Legend of Zelda: A Link to the Past</NeTableCell>
        <NeTableCell data-label="Platform">Super Nintendo</NeTableCell>
        <NeTableCell data-label="Year">1991</NeTableCell>
      </NeTableRow>
      <NeTableRow>
        <NeTableCell data-label="Game">Super Mario World</NeTableCell>
        <NeTableCell data-label="Platform">Super Nintendo</NeTableCell>
        <NeTableCell data-label="Year">1990</NeTableCell>
      </NeTableRow>
      <NeTableRow>
        <NeTableCell data-label="Game">The Legend of Zelda</NeTableCell>
        <NeTableCell data-label="Platform">Nintendo Entertainment System</NeTableCell>
        <NeTableCell data-label="Year">1986</NeTableCell>
      </NeTableRow>
    </NeTableBody>
  </NeTable>`
  })
}

export default meta

export const Default: StoryObj<typeof NeTable> = {
  args: {}
}

const withPaginatorTemplate = `
<NeTable v-bind="args">
    <NeTableHead>
      <NeTableHeadCell>Game</NeTableHeadCell>
      <NeTableHeadCell>Platform</NeTableHeadCell>
      <NeTableHeadCell>Year</NeTableHeadCell>
    </NeTableHead>
    <NeTableBody>
      <NeTableRow>
        <NeTableCell data-label="Game">The Legend of Zelda: Breath of the Wild</NeTableCell>
        <NeTableCell data-label="Platform">Nintendo Switch</NeTableCell>
        <NeTableCell data-label="Year">2017</NeTableCell>
      </NeTableRow>
      <NeTableRow>
        <NeTableCell data-label="Game">Super Mario Odyssey</NeTableCell>
        <NeTableCell data-label="Platform">Nintendo Switch</NeTableCell>
        <NeTableCell data-label="Year">2017</NeTableCell>
      </NeTableRow>
      <NeTableRow>
        <NeTableCell data-label="Game">The Legend of Zelda: Ocarina of Time</NeTableCell>
        <NeTableCell data-label="Platform">Nintendo 64</NeTableCell>
        <NeTableCell data-label="Year">1998</NeTableCell>
      </NeTableRow>
      <NeTableRow>
        <NeTableCell data-label="Game">Super Mario 64</NeTableCell>
        <NeTableCell data-label="Platform">Nintendo 64</NeTableCell>
        <NeTableCell data-label="Year">1996</NeTableCell>
      </NeTableRow>
      <NeTableRow>
        <NeTableCell data-label="Game">The Legend of Zelda: A Link to the Past</NeTableCell>
        <NeTableCell data-label="Platform">Super Nintendo</NeTableCell>
        <NeTableCell data-label="Year">1991</NeTableCell>
      </NeTableRow>
    </NeTableBody>
    <template #paginator>
      <NePaginator
        :current-page="1"
        :total-rows="20"
        :page-size="5"
        :page-sizes="[5, 10, 25, 50]"
        previous-label="Previous"
        next-label="Next"
        nav-pagination-label="Table pagination"
        range-of-total-label="of"
        page-size-label="Show"
      />
    </template>
  </NeTable>`

export const WithPaginator: StoryObj<typeof NeTable> = {
  render: (args) => ({
    components: {
      NeTable,
      NeTableHead,
      NeTableHeadCell,
      NeTableBody,
      NeTableRow,
      NeTableCell,
      NeEmptyState,
      NePaginator
    },
    setup() {
      return { args }
    },
    template: withPaginatorTemplate
  }),
  args: {}
}

export const Loading: StoryObj<typeof NeTable> = {
  args: {
    loading: true
  }
}

// add fontawesome icons
library.add(faTable)

const noItemsTemplate = `
<NeTable v-bind="args">
    <NeTableHead>
      <NeTableHeadCell>Game</NeTableHeadCell>
      <NeTableHeadCell>Platform</NeTableHeadCell>
      <NeTableHeadCell>Year</NeTableHeadCell>
    </NeTableHead>
    <NeTableBody>
      <NeTableRow>
        <NeTableCell colspan="3">
          <NeEmptyState title="No items" :icon="['fas', 'table']" class="bg-white dark:bg-gray-950"/>
        </NeTableCell>
      </NeTableRow>
    </NeTableBody>
  </NeTable>`

export const NoItems: StoryObj<typeof NeTable> = {
  render: (args) => ({
    components: {
      NeTable,
      NeTableHead,
      NeTableHeadCell,
      NeTableBody,
      NeTableRow,
      NeTableCell,
      NeEmptyState
    },
    setup() {
      return { args }
    },
    template: noItemsTemplate
  }),
  args: {}
}

export const CardBreakpointXL: StoryObj<typeof NeTable> = {
  args: {
    cardBreakpoint: 'xl'
  }
}
