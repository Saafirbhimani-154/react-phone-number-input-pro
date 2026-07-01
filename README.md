# react-phone-number-input-pro
> A zero-dependency React component for international phone number input with country selection, auto-formatting, and validation for 240+ countries.

[![npm version](https://img.shields.io/npm/v/react-phone-number-input-pro.svg)](https://www.npmjs.com/package/react-phone-number-input-pro)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-phone-number-input-pro)](https://bundlephobia.com/package/react-phone-number-input-pro)
[![license](https://img.shields.io/npm/l/react-phone-number-input-pro)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org)

## Features

- ðŸŒ **240+ countries** â€” complete dataset with dial codes and crisp SVG flags (via FlagCDN)
- ðŸ” **Searchable dropdown** â€” filter by country name, code, or dial code
- âœ… **Per-country validation** â€” custom regex + length rules for every country
- ðŸŽ­ **Auto-format** â€” masks number as you type (e.g. `98765 43210`)
- ðŸ“‹ **Paste detection** â€” paste `+919876543210` and it auto-selects country
- ðŸŒ **Auto-detect country** â€” reads browser locale on mount
- ðŸŽ¨ **CSS variables theming** â€” full customization, dark mode included
- ðŸ”Œ **Headless hook** â€” `usePhoneInput()` for custom UI
- ðŸ“¦ **Zero dependencies** â€” only peer deps: `react >=17`
- ðŸ’ª **TypeScript** â€” 100% typed, types shipped with package

---

## Installation

```bash
npm install react-phone-number-input-pro
```

---

## Quick Start

```tsx
import { PhoneInput } from 'react-phone-number-input-pro';
import 'react-phone-number-input-pro/styles';

function MyForm() {
  return (
    <PhoneInput
      defaultCountry="auto"
      onChange={(value, meta) => {
        console.log(value);        // "+919876543210"
        console.log(meta.isValid); // true
        console.log(meta.country); // "IN"
      }}
    />
  );
}
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | â€” | Controlled value (full international number) |
| `onChange` | `(value, meta) => void` | â€” | Called on every change |
| `defaultCountry` | `string` | `"auto"` | ISO code or `"auto"` to detect from browser |
| `placeholder` | `string` | `"Phone number"` | Input placeholder |
| `disabled` | `boolean` | `false` | Disables the component |
| `error` | `boolean` | `false` | Forces error state (red border) |
| `className` | `string` | â€” | Extra class on wrapper |
| `style` | `CSSProperties` | â€” | Extra inline styles |
| `name` | `string` | â€” | Input `name` attribute |
| `id` | `string` | â€” | Input `id` attribute |
| `required` | `boolean` | â€” | Input `required` attribute |
| `onBlur` | `() => void` | â€” | Focus out callback |
| `onFocus` | `() => void` | â€” | Focus in callback |

### `onChange` meta object

```ts
interface PhoneChangeMeta {
  country: string;        // "IN"
  dialCode: string;       // "+91"
  nationalNumber: string; // "98765 43210" (formatted)
  rawNumber: string;      // "9876543210"  (digits only)
  isValid: boolean;       // true
}
```

---

## Headless Hook

Build your own UI while using all the logic:

```tsx
import { usePhoneInput } from 'react-phone-number-input-pro';

function CustomPhoneInput() {
  const {
    country,
    setCountry,
    nationalNumber,
    setNationalNumber,
    formatted,
    fullNumber,
    isValid,
    error,
    reset,
  } = usePhoneInput({ defaultCountry: 'auto' });

  return (
    <div>
      <span>{country.dialCode}</span>
      <input
        value={formatted}
        onChange={(e) => setNationalNumber(e.target.value)}
      />
      {error && <p>{error}</p>}
    </div>
  );
}
```

---

## Theming with CSS Variables

```css
.my-phone-input {
  --rpi-border-radius:     12px;
  --rpi-border-color:      #8b5cf6;
  --rpi-border-color-focus:#7c3aed;
  --rpi-border-color-valid: #10b981;
  --rpi-border-color-error: #f43f5e;
  --rpi-font-size:         1rem;
  --rpi-height:            52px;
  --rpi-trigger-width:     110px;
}
```

```tsx
<PhoneInput className="my-phone-input" defaultCountry="auto" />
```

### Available CSS Variables

| Variable | Default | Description |
|---|---|---|
| `--rpi-font-size` | `0.9375rem` | Text size |
| `--rpi-height` | `46px` | Input height |
| `--rpi-border-color` | `#d1d5db` | Border color |
| `--rpi-border-color-focus` | `#6366f1` | Focus border |
| `--rpi-border-color-valid` | `#22c55e` | Valid border |
| `--rpi-border-color-error` | `#ef4444` | Error border |
| `--rpi-border-radius` | `10px` | Corner radius |
| `--rpi-bg` | `#ffffff` | Background |
| `--rpi-trigger-width` | `96px` | Country selector width |
| `--rpi-dropdown-width` | `300px` | Dropdown panel width |
| `--rpi-dropdown-max-height` | `300px` | Dropdown scroll height |

---

## Using Utilities Directly

```tsx
import { validatePhone, countries, getCountryByCode } from 'react-phone-number-input-pro';

// Validate a number
const { isValid, error } = validatePhone('9876543210', 'IN');

// Look up a country
const india = getCountryByCode('IN');
// { name: "India", code: "IN", dialCode: "+91" }

// Access the full list
console.log(countries.length); // 240
```

---

## Browser Support

All modern browsers. Flags are served dynamically via high-quality CDNs, guaranteeing perfect rendering on Windows, Mac, iOS, and Android (bypassing Windows' lack of native flag emoji support).
Works flawlessly in React 17, 18, and 19.

---

## License

MIT Â© saafir-bhimani
