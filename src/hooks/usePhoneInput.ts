import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import type { Country, UsePhoneInputOptions, UsePhoneInputReturn } from '../types';
import { useAutoDetect } from './useAutoDetect';
import { applyMask, stripNonDigits, truncateToMask } from '../utils/formatter';
import { validatePhone } from '../utils/validator';
import { buildFullNumber, parseInternationalNumber } from '../utils/parser';
import { getPhoneRule } from '../data/phoneRules';

/**
 * Core headless hook for phone number input.
 *
 * Manages all state: selected country, national number input,
 * formatting, and validation. Export this so consumers can build
 * custom UI on top of the logic.
 *
 * @example
 * const { country, setCountry, nationalNumber, setNationalNumber, isValid } =
 *   usePhoneInput({ defaultCountry: 'auto' });
 */
export const usePhoneInput = (options: UsePhoneInputOptions = {}): UsePhoneInputReturn => {
  const { defaultCountry = 'auto', initialValue = '' } = options;

  const detectedCountry = useAutoDetect(defaultCountry);
  const [country, setCountryState] = useState<Country>(detectedCountry);
  const [rawDigits, setRawDigits] = useState<string>('');

  // Sync auto-detected country on mount (handles SSR cases)
  useEffect(() => {
    setCountryState(detectedCountry);
  }, [detectedCountry]);

  // Sync with external value prop changes.
  // Uses a ref to track the last value we produced, so we only re-parse
  // when the parent provides a genuinely new value (avoids feedback loops).
  const lastEmittedValue = useRef<string>('');
  useEffect(() => {
    if (initialValue && initialValue !== lastEmittedValue.current) {
      const parsed = parseInternationalNumber(initialValue);
      if (parsed.country) setCountryState(parsed.country);
      setRawDigits(parsed.nationalNumber);
      lastEmittedValue.current = initialValue;
    }
  }, [initialValue]);

  const setCountry = useCallback((c: Country) => {
    setCountryState(c);
    // Preserve the number when switching countries, but truncate it 
    // just in case the new country's max length is shorter.
    setRawDigits((prev) => {
      const rule = getPhoneRule(c.code);
      return truncateToMask(prev, rule.mask);
    });
  }, []);

  const setNationalNumber = useCallback(
    (input: string) => {
      // 1. Handle Copy-Pasting International Numbers:
      // If the user pastes a number that starts with '+' or '00',
      // we intercept it, parse the country code, automatically switch
      // the dropdown to that country, and extract just the national part.
      if (input.startsWith('+') || input.startsWith('00')) {
        const parsed = parseInternationalNumber(input);
        if (parsed.country) {
          setCountryState(parsed.country);
          const rule = getPhoneRule(parsed.country.code);
          setRawDigits(truncateToMask(parsed.nationalNumber, rule.mask));
          return;
        }
      }

      // 2. Handle Normal Typing:
      // Strip out all non-digits (like letters or punctuation)
      // and prevent the user from typing past the maximum mask length
      // for the currently selected country.
      const rule = getPhoneRule(country.code);
      const digits = truncateToMask(stripNonDigits(input), rule.mask);
      setRawDigits(digits);
    },
    [country],
  );

  const reset = useCallback(() => {
    setCountryState(detectedCountry);
    setRawDigits('');
  }, [detectedCountry]);

  // Derived state (memoized to avoid re-computation on unrelated re-renders)
  const { formatted, fullNumber, isValid, error } = useMemo(() => {
    const rule = getPhoneRule(country.code);
    return {
      formatted: applyMask(rawDigits, rule.mask),
      fullNumber: buildFullNumber(country, rawDigits),
      ...validatePhone(rawDigits, country.code),
    };
  }, [country, rawDigits]);

  // Keep the emitted value ref in sync to prevent feedback loops
  useEffect(() => {
    lastEmittedValue.current = fullNumber;
  }, [fullNumber]);

  return {
    country,
    setCountry,
    nationalNumber: rawDigits,
    setNationalNumber,
    fullNumber,
    formatted,
    isValid,
    error,
    reset,
  };
};
