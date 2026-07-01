import { useEffect, useState } from 'react';
import { getCountryByCode } from '../data/countries';
import type { Country } from '../types';

const FALLBACK_COUNTRY: Country = { name: 'India', code: 'IN', dialCode: '+91' };

/**
 * Attempts to detect the user's country from the browser's locale setting.
 *
 * Strategy:
 * 1. Parse navigator.language (e.g. "en-IN" → "IN")
 * 2. Also check navigator.languages for a more specific locale
 * 3. Fall back to India (+91) if detection fails
 */
const detectCountryFromLocale = (): Country => {
  try {
    const langs = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];

    for (const lang of langs) {
      // Locale format: "en-IN", "hi-IN", "zh-CN", "pt-BR" etc.
      const parts = lang.split('-');
      if (parts.length >= 2) {
        const regionCode = parts[parts.length - 1].toUpperCase();
        const found = getCountryByCode(regionCode);
        if (found) return found;
      }
    }
  } catch {
    // navigator not available (SSR)
  }

  return FALLBACK_COUNTRY;
};

/**
 * Hook that resolves the initial country.
 *
 * - If `defaultCountry` is "auto" or undefined → detects from browser locale
 * - If `defaultCountry` is a valid ISO code → uses that country
 * - Falls back to India if nothing matches
 */
export const useAutoDetect = (defaultCountry?: string): Country => {
  const [country, setCountry] = useState<Country>(() => {
    if (!defaultCountry || defaultCountry === 'auto') {
      return detectCountryFromLocale();
    }
    return getCountryByCode(defaultCountry) ?? FALLBACK_COUNTRY;
  });

  useEffect(() => {
    if (!defaultCountry || defaultCountry === 'auto') {
      setCountry(detectCountryFromLocale());
    } else {
      const found = getCountryByCode(defaultCountry);
      if (found) setCountry(found);
    }
  }, [defaultCountry]);

  return country;
};
