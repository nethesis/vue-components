import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'

/**
 * A single password rule: a stable key, the text shown to the user and the predicate that
 * decides whether the password satisfies it.
 */
export type NePasswordRequirement = {
  key: string
  label: string
  validate: (password: string) => boolean
}

/**
 * A requirement paired with the outcome of its predicate for the current password.
 *
 * Note this is a plain boolean: whether an unmet requirement should look merely pending or
 * clearly failed is a presentation concern, handled by NePasswordRequirements' showErrors prop.
 */
export type NePasswordRequirementStatus = {
  key: string
  label: string
  met: boolean
}

/**
 * Overrides for the labels of the default requirements. The library ships no i18n, so
 * translated strings are supplied by the caller.
 */
export type NePasswordRequirementLabels = {
  minLength?: string
  uppercase?: string
  lowercase?: string
  number?: string
  specialCharacter?: string
}

const DEFAULT_MIN_LENGTH = 8

/**
 * Matches any character that is not a letter, a digit or whitespace.
 *
 * Unicode-aware on purpose: an accented letter such as 'à' counts as a letter rather than a
 * symbol, and whitespace is excluded so that a stray space cannot silently satisfy the rule.
 */
const SPECIAL_CHARACTER_REGEXP = /[^\p{L}\p{N}\s]/u

/**
 * The five requirements from the design, as a plain array.
 *
 * Exported so that callers can compose on top of them instead of rebuilding the set: spread the
 * result, append or drop rules, and pass it back as the `requirements` option of
 * usePasswordRequirements.
 */
export function defaultPasswordRequirements({
  minLength = DEFAULT_MIN_LENGTH,
  labels = {}
}: {
  minLength?: number
  labels?: NePasswordRequirementLabels
} = {}): NePasswordRequirement[] {
  return [
    {
      key: 'minLength',
      label: labels.minLength ?? `Minimum ${minLength} characters`,
      validate: (password) => password.length >= minLength
    },
    {
      key: 'uppercase',
      label: labels.uppercase ?? 'At least one uppercase (A-Z)',
      validate: (password) => /[A-Z]/.test(password)
    },
    {
      key: 'lowercase',
      label: labels.lowercase ?? 'At least one lowercase (a-z)',
      validate: (password) => /[a-z]/.test(password)
    },
    {
      key: 'number',
      label: labels.number ?? 'At least one number (0-9)',
      validate: (password) => /[0-9]/.test(password)
    },
    {
      key: 'specialCharacter',
      // the sample is deliberately followed by an ellipsis: any symbol is accepted, not just
      // the ones listed
      label: labels.specialCharacter ?? 'At least one special character (!@#$%…)',
      validate: (password) => SPECIAL_CHARACTER_REGEXP.test(password)
    }
  ]
}

/**
 * Evaluates a set of password requirements against a password, reactively.
 *
 * Pair it with NePasswordRequirements to render the checklist, and gate form submission on
 * isValid.
 *
 * @param password the password to check, as a plain string, ref or getter
 * @param options.minLength minimum length for the default `minLength` requirement (defaults to 8)
 * @param options.labels label overrides for the default requirements, for i18n
 * @param options.requirements replaces the default requirements entirely
 */
export function usePasswordRequirements(
  password: MaybeRefOrGetter<string>,
  options: {
    minLength?: MaybeRefOrGetter<number>
    labels?: MaybeRefOrGetter<NePasswordRequirementLabels>
    requirements?: MaybeRefOrGetter<NePasswordRequirement[]>
  } = {}
): {
  requirements: ComputedRef<NePasswordRequirementStatus[]>
  isValid: ComputedRef<boolean>
} {
  const activeRequirements = computed<NePasswordRequirement[]>(() => {
    const customRequirements = toValue(options.requirements)

    if (customRequirements) {
      return customRequirements
    }

    return defaultPasswordRequirements({
      minLength: toValue(options.minLength),
      labels: toValue(options.labels)
    })
  })

  const requirements = computed<NePasswordRequirementStatus[]>(() => {
    const passwordValue = toValue(password)

    return activeRequirements.value.map((requirement) => ({
      key: requirement.key,
      label: requirement.label,
      met: requirement.validate(passwordValue)
    }))
  })

  const isValid = computed(() => requirements.value.every((requirement) => requirement.met))

  return {
    requirements,
    isValid
  }
}
