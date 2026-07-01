import { describe, it, expect } from 'vitest';
import { applyMask, stripNonDigits, getMaskCapacity, truncateToMask } from '../../utils/formatter';
import { validatePhone } from '../../utils/validator';

import { parseInternationalNumber } from '../../utils/parser';
import { getCountryByCode } from '../../data/countries';

// ─── formatter.ts ─────────────────────────────────────────────────────────────

describe('applyMask', () => {
  it('formats India number correctly', () => {
    expect(applyMask('9876543210', 'XXXXX XXXXX')).toBe('98765 43210');
  });

  it('formats US number correctly', () => {
    expect(applyMask('9876543210', '(XXX) XXX-XXXX')).toBe('(987) 654-3210');
  });

  it('handles partial input', () => {
    expect(applyMask('987', 'XXXXX XXXXX')).toBe('987');
    expect(applyMask('98765', 'XXXXX XXXXX')).toBe('98765');
    expect(applyMask('987651', 'XXXXX XXXXX')).toBe('98765 1');
  });

  it('returns empty string for empty input', () => {
    expect(applyMask('', 'XXXXX XXXXX')).toBe('');
  });
});

describe('stripNonDigits', () => {
  it('removes all non-digit characters', () => {
    expect(stripNonDigits('+91 98765-43210')).toBe('919876543210');
    expect(stripNonDigits('(987) 654-3210')).toBe('9876543210');
    expect(stripNonDigits('123 456 789')).toBe('123456789');
  });
});

describe('getMaskCapacity', () => {
  it('counts X placeholders correctly', () => {
    expect(getMaskCapacity('XXXXX XXXXX')).toBe(10);
    expect(getMaskCapacity('(XXX) XXX-XXXX')).toBe(10);
    expect(getMaskCapacity('XXXX XXXX')).toBe(8);
  });
});

describe('truncateToMask', () => {
  it('truncates digits to mask capacity', () => {
    expect(truncateToMask('98765432109999', 'XXXXX XXXXX')).toBe('9876543210');
  });
});

// ─── validator.ts ─────────────────────────────────────────────────────────────

describe('validatePhone', () => {
  it('validates a valid Indian number', () => {
    const result = validatePhone('9876543210', 'IN');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('rejects an Indian number that starts with 1', () => {
    const result = validatePhone('1234567890', 'IN');
    expect(result.isValid).toBe(false);
  });

  it('rejects a too-short number', () => {
    const result = validatePhone('98765', 'IN');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('short');
  });

  it('rejects a too-long number', () => {
    const result = validatePhone('98765432109', 'IN');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('long');
  });

  it('returns no error for empty input', () => {
    const result = validatePhone('', 'IN');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeNull();
  });

  it('validates a valid US number', () => {
    expect(validatePhone('2125551234', 'US').isValid).toBe(true);
  });

  it('validates a valid UAE number', () => {
    expect(validatePhone('501234567', 'AE').isValid).toBe(true);
  });
});

// ─── parser.ts ────────────────────────────────────────────────────────────────

describe('parseInternationalNumber', () => {
  it('parses +919876543210 correctly', () => {
    const result = parseInternationalNumber('+919876543210');
    expect(result.country?.code).toBe('IN');
    expect(result.nationalNumber).toBe('9876543210');
  });

  it('parses +1 numbers — returns a +1 country (US or CA share dial code)', () => {
    const result = parseInternationalNumber('+12125551234');
    // US and Canada both use +1; the parser returns the first match alphabetically
    expect(result.country?.dialCode).toBe('+1');
    expect(result.nationalNumber).toBe('2125551234');
  });

  it('parses +18682501234 as Trinidad (not US)', () => {
    const result = parseInternationalNumber('+18682501234');
    expect(result.country?.code).toBe('TT');
  });

  it('handles 00 prefix', () => {
    const result = parseInternationalNumber('00919876543210');
    expect(result.country?.code).toBe('IN');
  });

  it('returns null country for non-international number', () => {
    const result = parseInternationalNumber('9876543210');
    expect(result.country).toBeNull();
  });
});

// ─── countries.ts ─────────────────────────────────────────────────────────────

describe('getCountryByCode', () => {
  it('finds India by code IN', () => {
    const country = getCountryByCode('IN');
    expect(country?.name).toBe('India');
    expect(country?.dialCode).toBe('+91');
  });

  it('is case-insensitive', () => {
    expect(getCountryByCode('in')?.code).toBe('IN');
    expect(getCountryByCode('Us')?.code).toBe('US');
  });

  it('returns undefined for unknown code', () => {
    expect(getCountryByCode('XX')).toBeUndefined();
  });
});
