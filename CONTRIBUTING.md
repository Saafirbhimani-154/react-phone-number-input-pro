# Contributing to react-phone-input-pro

First off — thank you for taking the time to contribute! 🎉  
Every contribution, big or small, is genuinely appreciated.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Adding a New Country / Fixing Validation](#adding-a-new-country--fixing-validation)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project follows a simple rule: **be kind and respectful**.  
Harassment, trolling, or discriminatory language will not be tolerated.

---

## How Can I Contribute?

### 🐛 Reporting Bugs
Open an issue and include:
- The country code affected
- The phone number you typed
- What you expected vs. what happened
- Your React version and browser

### ✅ Fixing Validation Rules
This is the most impactful contribution you can make!  
If a country's regex, mask, or length is wrong — please fix it.  
See the [section below](#adding-a-new-country--fixing-validation).

### ✨ Suggesting Features
Open an issue with the `enhancement` label.  
Describe the use case — not just the solution.

### 📖 Improving Docs
Typos, clearer examples, or missing docs — all PRs welcome.

---

## Development Setup

### Prerequisites
- Node.js >= 18
- npm >= 9

### Steps

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/react-phone-input-pro.git
cd react-phone-input-pro

# 2. Install dependencies
npm ci

# 3. Start the playground (live dev app)
npm run playground

# 4. Or start Storybook
npm run storybook

# 5. Run tests in watch mode while you work
npm test
```

---

## Project Structure

```
src/
├── data/
│   ├── countries.ts    ← Country list (name, code, dialCode)
│   └── phoneRules.ts   ← Validation rules per country (regex, mask, min, max)
├── utils/
│   ├── flagEmoji.ts    ← "IN" → "🇮🇳" conversion
│   ├── formatter.ts    ← Mask engine (XXXXX XXXXX)
│   ├── validator.ts    ← Runs regex + length check
│   └── parser.ts       ← Handles pasted international numbers
├── hooks/
│   ├── usePhoneInput.ts     ← Master hook (exported for headless use)
│   ├── useAutoDetect.ts     ← Detects country from browser locale
│   ├── useCountrySearch.ts  ← Filters country list
│   └── useFormatter.ts      ← Applies mask to input
├── components/
│   ├── PhoneInput/      ← Main exported component
│   ├── CountryDropdown/ ← Searchable flag dropdown
│   └── NumberInput/     ← Formatted number input
├── styles/
│   └── phone-input.css  ← CSS variables theming system
└── types/
    └── index.ts         ← All TypeScript interfaces
```

---

## Making Changes

1. **Create a branch** from `main`:
   ```bash
   git checkout -b fix/ng-validation
   # or
   git checkout -b feat/preferred-countries
   ```

2. **Make your changes** — keep them focused and minimal

3. **Run tests** to make sure nothing is broken:
   ```bash
   npm run test:run
   ```

4. **Run the build** to make sure it compiles:
   ```bash
   npm run build
   ```

5. **Lint your code**:
   ```bash
   npm run lint
   ```

---

## Adding a New Country / Fixing Validation

The most common contribution is fixing or adding validation rules in  
`src/data/phoneRules.ts`.

### Format

```ts
NG: {
  mask:  'XXX XXX XXXX',   // X = digit, other chars = literal separators
  regex: /^[789]\d{9}$/,   // validates raw national digits (no country code)
  min:   10,               // minimum digit count
  max:   10,               // maximum digit count
},
```

### Guidelines for writing a good regex
- The regex tests **raw digits only** — no spaces, dashes, parens
- Start with the valid prefix digits (e.g. Nigerian numbers start with 7, 8, or 9)
- Use the exact length with `\d{n}` rather than loose `\d+`
- Always test your regex against 5–10 real numbers from that country

### Test your rule
Add a test case in `src/components/PhoneInput/PhoneInput.test.tsx`:
```ts
it('validates a valid Nigerian mobile number', () => {
  expect(validatePhone('8031234567', 'NG').isValid).toBe(true);
});

it('rejects a Nigerian number starting with 1', () => {
  expect(validatePhone('1031234567', 'NG').isValid).toBe(false);
});
```

---

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>

Examples:
fix: correct regex for Nigerian mobile numbers
feat: add preferred countries prop
docs: add example for headless hook
chore: upgrade vite to 5.4
test: add validation tests for AE and QA
```

---

## Pull Request Process

1. Ensure all tests pass: `npm run test:run`
2. Ensure build passes: `npm run build`
3. Update `CHANGELOG.md` under `[Unreleased]`
4. Open a PR against the `main` branch
5. Fill in the PR template:
   - **What changed?**
   - **Why?**
   - **How to test?**
6. A maintainer will review and merge or request changes

---

## Questions?

Open an issue with the `question` label — happy to help! 🙌
