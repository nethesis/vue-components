import {
  NeTable,
  NeTableBody,
  NeTableCell,
  NeTableHead,
  NeTableHeadCell,
  NeTableRow
} from '../src/main'
import { Meta, StoryObj } from '@storybook/vue3'

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
      NeTableCell
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

export const Loading: StoryObj<typeof NeTable> = {
  args: {
    loading: true
  }
}

export const CardBreakpointXL: StoryObj<typeof NeTable> = {
  args: {
    cardBreakpoint: 'xl'
  }
}
