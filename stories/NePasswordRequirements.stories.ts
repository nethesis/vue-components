//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { ref } from 'vue'

import {
  NePasswordRequirements,
  NeTextInput,
  defaultPasswordRequirements,
  usePasswordRequirements
} from '../src/main'
import type { NePasswordRequirement } from '../src/main'

// Evaluate real requirements against a sample password, so that the stories can't drift from
// the actual predicates in usePasswordRequirements.
function statusesFor(
  password: string,
  requirements: NePasswordRequirement[] = defaultPasswordRequirements()
) {
  return requirements.map((requirement) => ({
    key: requirement.key,
    label: requirement.label,
    met: requirement.validate(password)
  }))
}

const meta = {
  title: 'Components/NePasswordRequirements',
  component: NePasswordRequirements,
  tags: ['autodocs'],
  // default values
  args: {
    requirements: statusesFor(''),
    showErrors: false,
    metLabel: 'Requirement met',
    unmetLabel: 'Requirement not met'
  }
} satisfies Meta<typeof NePasswordRequirements>

export default meta
type Story = StoryObj<typeof meta>

const template = '<NePasswordRequirements v-bind="args" class="max-w-md" />'

const render: Story['render'] = (args) => ({
  components: { NePasswordRequirements },
  setup: () => ({ args }),
  template
})

/** While the user is typing: unmet requirements stay neutral, nothing looks like an error yet. */
export const Default: Story = {
  render,
  args: { requirements: statusesFor('AB1') }
}

export const AllRequirementsMet: Story = {
  name: 'All requirements met',
  render,
  args: { requirements: statusesFor('Str0ng!Pass') }
}

/** After a submit attempt: unmet requirements turn into explicit failures. */
export const WithErrors: Story = {
  name: 'With errors',
  render,
  args: { requirements: statusesFor('Password'), showErrors: true }
}

/**
 * The default rules can be extended, subset or replaced entirely. Here: a stricter minimum
 * length plus a rule that closes over the username.
 */
export const CustomRequirements: Story = {
  name: 'Custom requirements',
  render,
  args: {
    requirements: statusesFor('alice.fox2026', [
      ...defaultPasswordRequirements({ minLength: 12 }),
      {
        key: 'noUsername',
        label: 'Must not contain your username',
        validate: (password) => !password.toLowerCase().includes('alice.fox')
      }
    ]),
    showErrors: true
  }
}

/** Labels always come from the caller, so translating the checklist needs no library change. */
export const CustomLabels: Story = {
  render,
  args: {
    requirements: statusesFor(
      'AB1',
      defaultPasswordRequirements({
        labels: {
          minLength: 'Minimo 8 caratteri',
          uppercase: 'Almeno una lettera maiuscola (A-Z)',
          lowercase: 'Almeno una lettera minuscola (a-z)',
          number: 'Almeno un numero (0-9)',
          specialCharacter: 'Almeno un carattere speciale (!@#$%…)'
        }
      })
    ),
    metLabel: 'Requisito soddisfatto',
    unmetLabel: 'Requisito non soddisfatto'
  }
}

/** Live checklist: type a password in the field below and watch requirements update. */
export const Playground: Story = {
  render: () => ({
    components: { NePasswordRequirements, NeTextInput },
    setup() {
      const password = ref('')
      const { requirements } = usePasswordRequirements(password)
      return { password, requirements }
    },
    template: `<div class="max-w-md space-y-3">
      <NeTextInput v-model="password" is-password label="Password" placeholder="Type a password" />
      <NePasswordRequirements :requirements="requirements" show-errors />
    </div>`
  })
}
