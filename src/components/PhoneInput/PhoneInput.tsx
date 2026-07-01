import React, { useRef, useState } from 'react';
import type { PhoneInputProps } from '../../types';
import { usePhoneInput } from '../../hooks/usePhoneInput';
import { CountryDropdown } from '../CountryDropdown';
import { NumberInput } from '../NumberInput';

/**
 * `<PhoneInput />` — The main exported component.
 *
 * Combines a searchable country dropdown (with flag + dial code)
 * and a formatted number input field with real-time country-specific
 * validation. Zero external dependencies.
 *
 * @example
 * ```tsx
 * import { PhoneInput } from 'react-phone-input-pro';
 * import 'react-phone-input-pro/styles';
 *
 * <PhoneInput
 *   defaultCountry="auto"
 *   onChange={(value, meta) => console.log(value, meta)}
 * />
 * ```
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  defaultCountry = 'auto',
  placeholder = 'Phone number',
  disabled = false,
  className = '',
  style,
  name,
  id,
  required,
  error: errorProp,
  onBlur,
  onFocus,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    country,
    setCountry,
    nationalNumber,
    setNationalNumber,
    formatted,
    isValid,
    fullNumber,
  } = usePhoneInput({
    defaultCountry,
    initialValue: value,
  });

  const [isTouched, setIsTouched] = useState(false);

  // Determine if we should show the red error border.
  // We only show it if the user has touched the field (isTouched),
  // there is an actual error, and the field isn't empty.
  const hasValue = nationalNumber.length > 0;
  const showError = errorProp || (isTouched && !isValid && hasValue);

  const isMounted = useRef(false);
  const onChangeRef = useRef(onChange);

  // Keep ref synced with latest onChange.
  // This is a crucial library pattern: it prevents infinite loops
  // if the parent component passes an inline arrow function for onChange
  // without wrapping it in a useCallback.
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const prev = useRef<{ fullNumber: string; country: string; formatted: string } | null>({ fullNumber, country: country.code, formatted });

  // Trigger the parent's onChange callback whenever the internal
  // state (country, digits, validity) actually changes.
  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    
    // Guard against parent re-renders causing state loops
    if (prev.current && prev.current.fullNumber === fullNumber && prev.current.country === country.code && prev.current.formatted === formatted) {
      return;
    }
    prev.current = { fullNumber, country: country.code, formatted };

    if (onChangeRef.current) {
      onChangeRef.current(fullNumber, {
        country: country.code,
        dialCode: country.dialCode,
        nationalNumber: formatted,
        rawNumber: nationalNumber,
        isValid,
      });
    }
  }, [country, fullNumber, formatted, nationalNumber, isValid]);



  const handleCountryChange = (newCountry: typeof country) => {
    setCountry(newCountry);
    // Focus the number input after country selection
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const wrapperClass = [
    'rpi-wrapper',
    disabled ? 'rpi-wrapper--disabled' : '',
    showError ? 'rpi-wrapper--error' : '',
    hasValue && isValid ? 'rpi-wrapper--valid' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="rpi-root">
      <div className={wrapperClass} style={style} role="group" aria-label="Phone number input">
        {/* Country Selector */}
        <CountryDropdown
          selected={country}
          onChange={handleCountryChange}
          disabled={disabled}
        />

        {/* Divider */}
        <div className="rpi-divider" aria-hidden="true" />

        {/* Number Input */}
        <NumberInput
          ref={inputRef}
          value={formatted}
          onChange={setNationalNumber}
          placeholder={placeholder}
          disabled={disabled}
          isValid={isValid}
          hasError={showError}
          hasValue={hasValue}
          // We omit the 'name' attribute here so that standard form submissions
          // don't submit the formatted string, and instead submit the E.164 hidden input below.
          id={id}
          required={required}
          onBlur={() => {
            setIsTouched(true);
            if (onBlur) onBlur();
          }}
          onFocus={() => {
            if (onFocus) onFocus();
          }}
        />
      </div>


      <input type="hidden" value={fullNumber} name={name} id={id ? `${id}-hidden` : undefined} />
    </div>
  );
};
