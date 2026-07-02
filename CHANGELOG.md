# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

<!-- Changes for the next release go here -->
<!-- Format: ### Added / ### Fixed / ### Changed -->

## [1.0.2] - 2026-07-02

### Fixed
- Fixed the GitHub repository URL in `package.json` to point to the correct repository


## [1.0.1] - 2026-07-01

### Fixed
- Fixed corrupted encoding of emojis and special characters in the README for the npm registry page
- Relaxed CI pipeline strictness and resolved minor internal ESLint warnings

## [1.0.0] - 2026-06-26

### Added
- Initial release
- `<PhoneInput />` component with country selector and number input
- `usePhoneInput()` headless hook
- Auto-detection of country from browser locale
- Support for 240+ countries with dial codes and flag emojis
- Custom validation rules per country (regex + length)
- Real-time phone number formatting with country-specific masks
- Searchable country dropdown
- Paste handler for international numbers (+919876543210)
- CSS variables theming system
- Full TypeScript support
- Zero dependencies (only peer deps: react, react-dom)
