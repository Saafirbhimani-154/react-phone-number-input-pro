import React, { useEffect, useRef, useState } from 'react';
import type { Country } from '../../types';
import { useCountrySearch } from '../../hooks/useCountrySearch';

interface CountryDropdownProps {
  selected: Country;
  onChange: (country: Country) => void;
  disabled?: boolean;
}

/**
 * Searchable country selector dropdown.
 * Shows flag emoji + country name + dial code.
 * Closes on outside click, Escape key, or selection.
 * Supports arrow-key navigation for accessibility.
 */
export const CountryDropdown: React.FC<CountryDropdownProps> = ({
  selected,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const { query, setQuery, filtered, clearSearch } = useCountrySearch();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const closeDropdown = React.useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    clearSearch();
  }, [clearSearch]);

  // Reset focused index when the filtered list changes (user types in search)
  useEffect(() => {
    setFocusedIndex(-1);
  }, [filtered]);

  const scrollItemIntoView = React.useCallback((index: number) => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[role="option"]');
    const item = items[index] as HTMLElement;
    item?.scrollIntoView({ block: 'nearest' });
  }, []);

  // ─── Consolidated event listeners for UX & Accessibility ───────────────────
  useEffect(() => {
    if (!isOpen) return;

    // Auto-focus the search input when the dropdown opens
    const focusTimer = setTimeout(() => searchRef.current?.focus(), 50);

    // Close on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeDropdown();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev < filtered.length - 1 ? prev + 1 : 0;
            scrollItemIntoView(next);
            return next;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : filtered.length - 1;
            scrollItemIntoView(next);
            return next;
          });
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          scrollItemIntoView(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(filtered.length - 1);
          scrollItemIntoView(filtered.length - 1);
          break;
        case 'Enter':
          if (focusedIndex >= 0 && focusedIndex < filtered.length) {
            e.preventDefault();
            handleSelect(filtered[focusedIndex]);
          }
          break;
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeDropdown, filtered, focusedIndex]);



  const openDropdown = () => {
    if (!disabled) setIsOpen(true);
  };

  const handleSelect = (country: Country) => {
    onChange(country);
    closeDropdown();
  };

  // Scroll selected item into view when dropdown opens
  useEffect(() => {
    if (isOpen && listRef.current) {
      const selectedEl = listRef.current.querySelector('[aria-selected="true"]');
      selectedEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen]);

  return (
    <div className="rpi-dropdown" ref={containerRef}>
      {/* Trigger button */}
      <button
        type="button"
        className={`rpi-dropdown__trigger ${disabled ? 'rpi-dropdown__trigger--disabled' : ''}`}
        onClick={openDropdown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Country: ${selected.name}, dial code ${selected.dialCode}`}
      >
        <span className="rpi-dropdown__flag" aria-hidden="true">
          <img
            src={`https://flagcdn.com/w20/${selected.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${selected.code.toLowerCase()}.png 2x`}
            width="20"
            alt={selected.code}
            loading="lazy"
          />
        </span>
        <span className="rpi-dropdown__dialcode">{selected.dialCode}</span>
        <span className={`rpi-dropdown__arrow ${isOpen ? 'rpi-dropdown__arrow--open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="rpi-dropdown__panel" role="dialog" aria-label="Select country">
          {/* Search */}
          <div className="rpi-dropdown__search-wrap">
            <span className="rpi-dropdown__search-icon" aria-hidden="true">🔍</span>
            <input
              ref={searchRef}
              type="text"
              className="rpi-dropdown__search"
              placeholder="Search country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search countries"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className="rpi-dropdown__search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Country list */}
          <ul
            ref={listRef}
            className="rpi-dropdown__list"
            role="listbox"
            aria-label="Countries"
            aria-activedescendant={focusedIndex >= 0 && filtered[focusedIndex] ? `rpi-country-${filtered[focusedIndex].code}` : undefined}
          >
            {filtered.length === 0 ? (
              <li className="rpi-dropdown__empty">No countries found</li>
            ) : (
              filtered.map((country, index) => {
                const isSelected = country.code === selected.code;
                const isFocused = index === focusedIndex;
                return (
                  <li
                    key={country.code}
                    id={`rpi-country-${country.code}`}
                    role="option"
                    aria-selected={isSelected}
                    className={[
                      'rpi-dropdown__item',
                      isSelected ? 'rpi-dropdown__item--selected' : '',
                      isFocused ? 'rpi-dropdown__item--focused' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => handleSelect(country)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleSelect(country);
                    }}
                  >
                    <span className="rpi-dropdown__item-flag" aria-hidden="true">
                      <img
                        src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                        width="20"
                        alt={country.code}
                        loading="lazy"
                      />
                    </span>
                    <span className="rpi-dropdown__item-name">{country.name}</span>
                    <span className="rpi-dropdown__item-code">{country.dialCode}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
