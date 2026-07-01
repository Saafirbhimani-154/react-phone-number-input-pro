import { countries } from '../data/countries';
import { stripNonDigits } from './formatter';
import type { Country, ParsedPhone } from '../types';

// Pre-compute sorted countries array and stripped dial codes
// This avoids O(N log N) sorting and regex stripping on every parse invocation.
const sortedCountries = [...countries]
  .map(country => ({
    country,
    dialDigits: stripNonDigits(country.dialCode)
  }))
  .sort((a, b) => b.dialDigits.length - a.dialDigits.length);

/**
 * Parse a pasted international phone number into country + national number.
 *
 * Handles inputs like:
 *   "+919876543210"
 *   "+1 (987) 654-3210"
 *   "00919876543210"
 *
 * Strategy: try to match the longest dial code first to avoid ambiguity
 * (e.g. +1868 for Trinidad before +1 for US).
 */
export const parseInternationalNumber = (input: string): ParsedPhone => {
  const cleaned = input.trim();

  // Normalize: remove leading 00 or + to get raw digits
  let normalized = cleaned;
  if (normalized.startsWith('+')) {
    normalized = normalized.slice(1);
  } else if (normalized.startsWith('00')) {
    normalized = normalized.slice(2);
  } else {
    // Not an international format — return as-is, no country detected
    return { country: null, nationalNumber: stripNonDigits(cleaned) };
  }

  const digits = stripNonDigits(normalized);

  for (const { country, dialDigits } of sortedCountries) {
    if (digits.startsWith(dialDigits)) {
      const nationalNumber = digits.slice(dialDigits.length);
      return { country, nationalNumber };
    }
  }

  // Could not match any country code
  return { country: null, nationalNumber: digits };
};

/**
 * Build the full international number string from a country and national number.
 * @example buildFullNumber({ dialCode: "+91" }, "9876543210") → "+919876543210"
 */
export const buildFullNumber = (country: Country, rawDigits: string): string => {
  if (!rawDigits) return '';
  return `${country.dialCode}${rawDigits}`;
};
