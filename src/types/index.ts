// ─── Core Data Types ──────────────────────────────────────────────────────────

export interface Country {
  /** Country display name */
  name: string;
  /** ISO 3166-1 alpha-2 country code (e.g. "IN", "US") */
  code: string;
  /** International dial code (e.g. "+91", "+1") */
  dialCode: string;
}

export interface PhoneRule {
  /** Format mask where X = digit (e.g. "XXXXX XXXXX") */
  mask: string;
  /** Regex to validate the national number (digits only, no spaces/dashes) */
  regex: RegExp;
  /** Minimum length of the national number */
  min: number;
  /** Maximum length of the national number */
  max: number;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface PhoneInputProps {
  /** Controlled value — full international number e.g. "+919876543210" */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string, meta: PhoneChangeMeta) => void;
  /**
   * Starting country ISO code, or "auto" to detect from browser locale.
   * @default "auto"
   */
  defaultCountry?: string;
  /** Placeholder for the number input */
  placeholder?: string;
  /** Disable the entire input */
  disabled?: boolean;
  /** Additional className on the wrapper */
  className?: string;
  /** Additional inline styles on the wrapper */
  style?: React.CSSProperties;
  /** Input name attribute */
  name?: string;
  /** Input id attribute */
  id?: string;
  /** Mark input as required */
  required?: boolean;
  /** Show error state (red border) */
  error?: boolean;
  /** Callback when input loses focus */
  onBlur?: () => void;
  /** Callback when input receives focus */
  onFocus?: () => void;
}

export interface PhoneChangeMeta {
  /** ISO country code e.g. "IN" */
  country: string;
  /** Dial code e.g. "+91" */
  dialCode: string;
  /** National number without dial code, formatted */
  nationalNumber: string;
  /** Raw digits only (no spaces/dashes) */
  rawNumber: string;
  /** Whether the number passes country-specific validation */
  isValid: boolean;
}

// ─── Hook Types ───────────────────────────────────────────────────────────────

export interface UsePhoneInputOptions {
  /**
   * Starting country ISO code, or "auto" to detect from browser locale.
   * @default "auto"
   */
  defaultCountry?: string;
  /** Initial phone number value */
  initialValue?: string;
}

export interface UsePhoneInputReturn {
  /** Selected country object */
  country: Country;
  /** Set country by ISO code or Country object */
  setCountry: (country: Country) => void;
  /** Raw national number digits (unformatted, without dial code) */
  nationalNumber: string;
  /** Set the national number */
  setNationalNumber: (number: string) => void;
  /** Full international number e.g. "+919876543210" */
  fullNumber: string;
  /** Formatted national number with mask applied */
  formatted: string;
  /** Whether the current number is valid */
  isValid: boolean;
  /** Validation error message, or null if valid */
  error: string | null;
  /** Reset to initial state */
  reset: () => void;
}

// ─── Utility Types ────────────────────────────────────────────────────────────

export interface ParsedPhone {
  country: Country | null;
  nationalNumber: string;
}
