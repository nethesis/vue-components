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

const items = [
  { game: 'Super Mario 64', platform: 'Nintendo 64', year: 1996 },
  { game: 'Super Mario Odyssey', platform: 'Nintendo Switch', year: 2017 },
  { game: 'Super Mario World', platform: 'Super Nintendo', year: 1990 },
  { game: 'The Legend of Zelda', platform: 'Nintendo Entertainment System', year: 1986 },
  { game: 'The Legend of Zelda: A Link to the Past', platform: 'Super Nintendo', year: 1991 },
  { game: 'The Legend of Zelda: Breath of the Wild', platform: 'Nintendo Switch', year: 2017 },
  { game: 'The Legend of Zelda: Ocarina of Time', platform: 'Nintendo 64', year: 1998 }
]

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
    skeletonColumns: 4,
    sortKey: 'game',
    sortDescending: false
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
      return { args, items }
    },
    template: `
  <NeTable v-bind="args">
    <NeTableHead>
      <NeTableHeadCell>Game</NeTableHeadCell>
      <NeTableHeadCell>Platform</NeTableHeadCell>
      <NeTableHeadCell>Year</NeTableHeadCell>
    </NeTableHead>
    <NeTableBody>
      <NeTableRow v-for="(item, index) in items" :key="index">
        <NeTableCell data-label="Game">{{ item.game }}</NeTableCell>
        <NeTableCell data-label="Platform">{{ item.platform }}</NeTableCell>
        <NeTableCell data-label="Year">{{ item.year }}</NeTableCell>
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
      <NeTableRow v-for="(item, index) in items" :key="index">
        <NeTableCell data-label="Game">{{ item.game }}</NeTableCell>
        <NeTableCell data-label="Platform">{{ item.platform }}</NeTableCell>
        <NeTableCell data-label="Year">{{ item.year }}</NeTableCell>
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
      return { args, items }
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

const sortableTemplate = `
<NeTable v-bind="args">
    <NeTableHead>
      <NeTableHeadCell sortable columnKey="game">Game</NeTableHeadCell>
      <NeTableHeadCell sortable columnKey="platform">Platform</NeTableHeadCell>
      <NeTableHeadCell sortable columnKey="year">Year</NeTableHeadCell>
    </NeTableHead>
    <NeTableBody>
      <NeTableRow v-for="(item, index) in items" :key="index">
        <NeTableCell data-label="Game">{{ item.game }}</NeTableCell>
        <NeTableCell data-label="Platform">{{ item.platform }}</NeTableCell>
        <NeTableCell data-label="Year">{{ item.year }}</NeTableCell>
      </NeTableRow>
    </NeTableBody>
  </NeTable>`

export const Sortable: StoryObj<typeof NeTable> = {
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
      return { args, items }
    },
    template: sortableTemplate
  }),
  args: {}
}
