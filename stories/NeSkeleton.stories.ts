import { Meta, StoryObj } from '@storybook/vue3-vite'
import { NeSkeleton } from '../src/main'

const meta: Meta<typeof NeSkeleton> = {
  title: 'Components/NeSkeleton',
  component: NeSkeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Gray lines in place of content while it loads. For a table, use the `loading` prop of `NeTable`.'
      }
    }
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    lines: { control: 'number' }
  },
  args: {
    size: 'md',
    lines: 1
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
