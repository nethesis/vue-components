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
  title: 'Visual/NeTable',
  component: NeTable,
  tags: ['autodocs'],
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
      <NeTable>
        <NeTableHead>
          <NeTableHeadCell>Game</NeTableHeadCell>
          <NeTableHeadCell>Platform</NeTableHeadCell>
          <NeTableHeadCell>Year</NeTableHeadCell>
        </NeTableHead>
        <NeTableBody>
          <NeTableRow>
            <NeTableCell>The Legend of Zelda: Breath of the Wild</NeTableCell>
            <NeTableCell>Nintendo Switch</NeTableCell>
            <NeTableCell>2017</NeTableCell>
          </NeTableRow>
          <NeTableRow>
            <NeTableCell>Super Mario Odyssey</NeTableCell>
            <NeTableCell>Nintendo Switch</NeTableCell>
            <NeTableCell>2017</NeTableCell>
          </NeTableRow>
          <NeTableRow>
            <NeTableCell>The Legend of Zelda: Ocarina of Time</NeTableCell>
            <NeTableCell>Nintendo 64</NeTableCell>
            <NeTableCell>1998</NeTableCell>
          </NeTableRow>
          <NeTableRow>
            <NeTableCell>Super Mario 64</NeTableCell>
            <NeTableCell>Nintendo 64</NeTableCell>
            <NeTableCell>1996</NeTableCell>
          </NeTableRow>
          <NeTableRow>
            <NeTableCell>The Legend of Zelda: A Link to the Past</NeTableCell>
            <NeTableCell>Super Nintendo</NeTableCell>
            <NeTableCell>1991</NeTableCell>
          </NeTableRow>
          <NeTableRow>
            <NeTableCell>Super Mario World</NeTableCell>
            <NeTableCell>Super Nintendo</NeTableCell>
            <NeTableCell>1990</NeTableCell>
          </NeTableRow>
          <NeTableRow>
            <NeTableCell>The Legend of Zelda</NeTableCell>
            <NeTableCell>Nintendo Entertainment System</NeTableCell>
            <NeTableCell>1986</NeTableCell>
          </NeTableRow>
        </NeTableBody>
      </NeTable>
    `
  })
}

export default meta

export const Default: StoryObj<typeof NeTable> = {}
