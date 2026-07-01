import { useCallback, useMemo, useState } from 'react';
import { countries } from '../data/countries';
import { countryAliases } from '../data/countryAliases';
import type { Country } from '../types';

/**
 * Hook to filter the countries list by a search query.
 * Matches against:
 * - Country name       ("United Arab Emirates")
 * - ISO code           ("AE")
 * - Dial code          ("+971")
 * - Aliases            ("uae", "dubai", "emirates")
 */
export const useCountrySearch = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo<Country[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;

    return countries.filter((c) => {
      // Match official name
      if (c.name.toLowerCase().includes(q)) return true;
      // Match ISO code (e.g. "ae", "us")
      if (c.code.toLowerCase().includes(q)) return true;
      // Match dial code (e.g. "+971", "971")
      if (c.dialCode.includes(q)) return true;
      // Match aliases (e.g. "uae", "dubai", "emirates")
      const aliases = countryAliases[c.code];
      if (aliases?.some((alias) => alias.includes(q))) return true;

      return false;
    });
  }, [query]);

  const clearSearch = useCallback(() => setQuery(''), []);

  return { query, setQuery, filtered, clearSearch };
};
