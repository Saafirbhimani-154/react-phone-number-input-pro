/**
 * Phone number mask engine.
 *
 * Applies a format mask to a string of raw digits.
 * 'X' in the mask is replaced by the next available digit.
 * All other mask characters (spaces, dashes, parens) are kept as literals.
 *
 * @example applyMask("9876543210", "XXXXX XXXXX") → "98765 43210"
 * @example applyMask("9876543210", "(XXX) XXX-XXXX") → "(987) 654-3210"
 * @example applyMask("12", "XXXXX XXXXX") → "12"  (partial input)
 */
export const applyMask = (digits: string, mask: string): string => {
  if (!digits) return '';

  let digitIndex = 0;
  let result = '';

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === 'X') {
      if (digitIndex >= digits.length) break;
      result += digits[digitIndex++];
    } else {
      result += mask[i];
    }
  }

  // Trim trailing separator characters (spaces, dashes, parens)
  // that appear when digits don't fill the next group.
  return result.replace(/[\s\-()]+$/, '');
};

/**
 * Strip all non-digit characters from a string.
 * @example stripNonDigits("+91 98765-43210") → "919876543210"
 */
export const stripNonDigits = (value: string): string =>
  value.replace(/\D/g, '');

/**
 * Count how many 'X' placeholders are in a mask.
 * This equals the max length of digits the mask can hold.
 */
export const getMaskCapacity = (mask: string): number =>
  [...mask].filter((c) => c === 'X').length;

/**
 * Truncate raw digits to fit within the mask capacity.
 */
export const truncateToMask = (digits: string, mask: string): string =>
  digits.slice(0, getMaskCapacity(mask));
