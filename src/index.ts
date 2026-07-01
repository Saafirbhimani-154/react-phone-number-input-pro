// ─── Main Component ───────────────────────────────────────────────────────────
export { PhoneInput } from './components/PhoneInput';

// ─── Headless Hook ────────────────────────────────────────────────────────────
export { usePhoneInput } from './hooks/usePhoneInput';

// ─── Sub-components (for advanced custom UI) ──────────────────────────────────
export { CountryDropdown } from './components/CountryDropdown';
export { NumberInput } from './components/NumberInput';

// ─── Utilities ────────────────────────────────────────────────────────────────
export { validatePhone } from './utils/validator';
export { applyMask, stripNonDigits } from './utils/formatter';

export { parseInternationalNumber, buildFullNumber } from './utils/parser';

// ─── Data ─────────────────────────────────────────────────────────────────────
export { countries, getCountryByCode, getCountriesByDialCode } from './data/countries';
export { phoneRules, getPhoneRule, defaultRule } from './data/phoneRules';

// ─── TypeScript Types ─────────────────────────────────────────────────────────
export type {
  Country,
  PhoneRule,
  PhoneInputProps,
  PhoneChangeMeta,
  UsePhoneInputOptions,
  UsePhoneInputReturn,
  ParsedPhone,
} from './types';

// ─── Default CSS import (users do: import 'react-phone-input-pro/styles') ─────
import './styles/phone-input.css';
