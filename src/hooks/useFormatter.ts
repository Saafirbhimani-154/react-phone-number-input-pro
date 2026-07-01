import { useMemo } from 'react';
import { applyMask, stripNonDigits, truncateToMask } from '../utils/formatter';
import { getPhoneRule } from '../data/phoneRules';

/**
 * Hook that applies a country's format mask to raw digit input.
 * Returns the formatted string and the raw digits.
 */
export const useFormatter = (rawInput: string, countryCode: string) => {
  return useMemo(() => {
    const rule = getPhoneRule(countryCode);
    const digits = stripNonDigits(rawInput);
    const truncated = truncateToMask(digits, rule.mask);
    const formatted = applyMask(truncated, rule.mask);
    return { formatted, digits: truncated, mask: rule.mask };
  }, [rawInput, countryCode]);
};
