# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

<!-- Changes for the next release go here -->
<!-- Format: ### Added / ### Fixed / ### Changed -->

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
