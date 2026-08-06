//  Copyright (C) 2026 Nethesis S.r.l.
//  SPDX-License-Identifier: GPL-3.0-or-later

import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { computed, ref } from 'vue'

import { NeButton, NePasswordRequirements, NeTextInput, usePasswordRequirements } from '../src/main'
import type { NePasswordRequirementLabels } from '../src/main'

const meta = {
  title: 'Patterns/New password form',
  component: NePasswordRequirements,
  // The pattern drives its own reactive state from the render function, so args are unused
  // here — the requirements list comes from usePasswordRequirements, not from a control.
  args: {
    requirements: [],
    showErrors: false
  }
} satisfies Meta<typeof NePasswordRequirements>

export default meta
type Story = StoryObj<typeof meta>

type FormLabels = {
  newPassword: string
  confirmPassword: string
  submit: string
  requirementsError: string
  mismatchError: string
  met: string
  unmet: string
  showPassword: string
  hidePassword: string
  ruleLabels?: NePasswordRequirementLabels
}

const englishLabels: FormLabels = {
  newPassword: 'New password',
  confirmPassword: 'Confirm new password',
  submit: 'Change password',
  requirementsError: 'Choose a password that meets all requirements',
  mismatchError: 'Passwords do not match',
  met: 'Requirement met',
  unmet: 'Requirement not met',
  showPassword: 'Show password',
  hidePassword: 'Hide password'
}

const italianLabels: FormLabels = {
  newPassword: 'Nuova password',
  confirmPassword: 'Conferma nuova password',
  submit: 'Cambia password',
  requirementsError: 'Scegli una password che soddisfi tutti i requisiti',
  mismatchError: 'Le password non corrispondono',
  met: 'Requisito soddisfatto',
  unmet: 'Requisito non soddisfatto',
  showPassword: 'Mostra password',
  hidePassword: 'Nascondi password',
  ruleLabels: {
    minLength: 'Minimo 8 caratteri',
    uppercase: 'Almeno una lettera maiuscola (A-Z)',
    lowercase: 'Almeno una lettera minuscola (a-z)',
    number: 'Almeno un numero (0-9)',
    specialCharacter: 'Almeno un carattere speciale (!@#$%…)'
  }
}

const template = `<form class="max-w-md space-y-6" @submit.prevent="submit">
  <div class="space-y-3">
    <NeTextInput
      v-model="password"
      is-password
      autocomplete="new-password"
      :label="labels.newPassword"
      :invalid-message="passwordError"
      :show-password-label="labels.showPassword"
      :hide-password-label="labels.hidePassword"
    />
    <NePasswordRequirements
      :requirements="requirements"
      :show-errors="submitted"
      :met-label="labels.met"
      :unmet-label="labels.unmet"
    />
  </div>
  <NeTextInput
    v-model="confirmPassword"
    is-password
    autocomplete="new-password"
    :label="labels.confirmPassword"
    :invalid-message="confirmError"
    :show-password-label="labels.showPassword"
    :hide-password-label="labels.hidePassword"
  />
  <NeButton kind="primary" size="lg" type="submit">{{ labels.submit }}</NeButton>
</form>`

/**
 * Wires the three pieces together: usePasswordRequirements owns the rules,
 * NePasswordRequirements renders them, and the form owns what the library deliberately does not
 * — the submit attempt and the cross-field match check.
 */
function setupForm(
  labels: FormLabels,
  initialState: { password?: string; confirmPassword?: string; submitted?: boolean } = {}
) {
  const password = ref(initialState.password ?? '')
  const confirmPassword = ref(initialState.confirmPassword ?? '')
  // Unmet requirements only turn red once the user has tried to submit.
  const submitted = ref(initialState.submitted ?? false)

  const { requirements, isValid } = usePasswordRequirements(password, {
    labels: labels.ruleLabels
  })

  const passwordsMatch = computed(() => password.value === confirmPassword.value)

  const passwordError = computed(() =>
    submitted.value && !isValid.value ? labels.requirementsError : ''
  )

  // Only surface the match error once the password itself is valid, so the form never shows two
  // competing errors at the same time.
  const confirmError = computed(() =>
    submitted.value && isValid.value && !passwordsMatch.value ? labels.mismatchError : ''
  )

  function submit() {
    submitted.value = true

    if (isValid.value && passwordsMatch.value) {
      // the real form would call the API here
    }
  }

  return {
    labels,
    password,
    confirmPassword,
    submitted,
    requirements,
    passwordError,
    confirmError,
    submit
  }
}

const components = { NeButton, NePasswordRequirements, NeTextInput }

// Shared by the English and Italian variants, so that both show the same scenario.
const invalidSubmitState = {
  password: 'Password',
  confirmPassword: 'Password',
  submitted: true
}

const mismatchState = {
  password: 'Str0ng!Pass',
  confirmPassword: 'Str0ng!Pas',
  submitted: true
}

export const Standard: Story = {
  render: () => ({
    components,
    setup: () => setupForm(englishLabels),
    template
  })
}

/** Submitting with unmet requirements: they turn red and the field gets an error message. */
export const InvalidSubmit: Story = {
  name: 'Invalid submit',
  render: () => ({
    components,
    setup: () => setupForm(englishLabels, invalidSubmitState),
    template
  })
}

export const PasswordsDoNotMatch: Story = {
  name: 'Passwords do not match',
  render: () => ({
    components,
    setup: () => setupForm(englishLabels, mismatchState),
    template
  })
}

export const StandardItalian: Story = {
  name: 'Standard (Italian)',
  render: () => ({
    components,
    setup: () => setupForm(italianLabels),
    template
  })
}

export const InvalidSubmitItalian: Story = {
  name: 'Invalid submit (Italian)',
  render: () => ({
    components,
    setup: () => setupForm(italianLabels, invalidSubmitState),
    template
  })
}

export const PasswordsDoNotMatchItalian: Story = {
  name: 'Passwords do not match (Italian)',
  render: () => ({
    components,
    setup: () => setupForm(italianLabels, mismatchState),
    template
  })
}
