import { Meta, StoryObj } from '@storybook/vue3'
import { NeSkeleton } from '../src/main'

const meta: Meta<typeof NeSkeleton> = {
  title: 'Utils/NeSkeleton',
  component: NeSkeleton,
  tags: ['autodocs'],
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
