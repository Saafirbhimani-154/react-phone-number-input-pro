import { getPhoneRule } from '../data/phoneRules';

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validate a national phone number (raw digits, no country code) against
 * the country-specific rules (regex + min/max length).
 *
 * @param rawDigits  - digits only, no spaces or dashes
 * @param countryCode - ISO 3166-1 alpha-2 (e.g. "IN")
 */
export const validatePhone = (rawDigits: string, countryCode: string): ValidationResult => {
  if (!rawDigits || rawDigits.length === 0) {
    return { isValid: false, error: null }; // empty — no error shown yet
  }

  const rule = getPhoneRule(countryCode);

  if (rawDigits.length < rule.min) {
    return {
      isValid: false,
      error: `Number too short — needs at least ${rule.min} digits`,
    };
  }

  if (rawDigits.length > rule.max) {
    return {
      isValid: false,
      error: `Number too long — maximum ${rule.max} digits`,
    };
  }

  if (!rule.regex.test(rawDigits)) {
    return {
      isValid: false,
      error: 'Invalid phone number format for this country',
    };
  }

  return { isValid: true, error: null };
};
