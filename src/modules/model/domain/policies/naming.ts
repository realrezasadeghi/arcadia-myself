/**
 * NamingPolicy
 *
 * The single source of truth for validating human-readable names (elements,
 * diagrams, relationships, model artifacts) before they cross into the domain.
 *
 * Rules:
 *  - names are trimmed of surrounding whitespace
 *  - a required name must be present and non-blank
 *  - an optional name that is absent or blank becomes `undefined`
 *  - names must not exceed their maximum length
 *
 * The UI-facing entry point is `checkName`, which never throws. The write
 * boundary (DTOs, entities) uses `validateRequiredName` / `validateOptionalName`,
 * which throw an `Error` with a human-readable message.
 */

/** Default maximum length for most names. */
export const NAME_MAX_LENGTH = 255;

/** Shorter cap used by diagrams, models, elements, scenarios and fragments. */
export const SHORT_NAME_MAX_LENGTH = 100;

export type NameRule = {
  /** Human label used in error messages, e.g. `"Element name"`. */
  label: string;
  /** Defaults to {@link NAME_MAX_LENGTH}. */
  maxLength?: number;
};

export type NameCheck =
  | { valid: true; value: string }
  | { valid: false; message: string };

function maxLengthOf(rule: NameRule): number {
  return rule.maxLength ?? NAME_MAX_LENGTH;
}

function tooLongMessage(rule: NameRule, maxLength: number): string {
  return `${rule.label} cannot exceed ${maxLength} characters`;
}

/**
 * Validates a required name without throwing.
 *
 * `undefined`/`null` are reported as required; empty or whitespace-only
 * strings are reported as empty.
 */
export function checkName(
  value: string | null | undefined,
  rule: NameRule,
): NameCheck {
  const maxLength = maxLengthOf(rule);

  if (value === undefined || value === null) {
    return { valid: false, message: `${rule.label} is required` };
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: false, message: `${rule.label} cannot be empty` };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, message: tooLongMessage(rule, maxLength) };
  }

  return { valid: true, value: trimmed };
}

/** Validates a required name, throwing when it is absent, blank or too long. */
export function validateRequiredName(
  value: string | null | undefined,
  rule: NameRule,
): string {
  const check = checkName(value, rule);
  if (!check.valid) throw new Error(check.message);
  return check.value;
}

/**
 * Validates an optional name: absent or blank input becomes `undefined`,
 * anything else is trimmed and length-checked.
 */
export function validateOptionalName(
  value: string | null | undefined,
  rule: NameRule,
): string | undefined {
  if (value === undefined || value === null) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const maxLength = maxLengthOf(rule);
  if (trimmed.length > maxLength) {
    throw new Error(tooLongMessage(rule, maxLength));
  }

  return trimmed;
}
