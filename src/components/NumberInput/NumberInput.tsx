import { forwardRef } from 'react';

interface NumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isValid?: boolean;
  hasError?: boolean;
  hasValue?: boolean;
  name?: string;
  id?: string;
  required?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

/**
 * The number input field portion of PhoneInput.
 * Receives formatted display value but emits raw input for processing.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Phone number',
      disabled = false,
      isValid,
      hasError,
      hasValue,
      name,
      id,
      required,
      onBlur,
      onFocus,
    },
    ref,
  ) => {
    // Dynamic class assignment based on the validation state
    const getStateClass = () => {
      if (!hasValue) return '';
      if (isValid) return 'rpi-input--valid';
      if (hasError) return 'rpi-input--error';
      return '';
    };

    return (
      <input
        ref={ref}
        type="tel" // Triggers numeric keypad with phone formatting on mobile devices
        inputMode="numeric"
        className={`rpi-number-input ${getStateClass()}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        id={id}
        required={required}
        onBlur={onBlur}
        onFocus={onFocus}
        autoComplete="tel-national"
        aria-label="Phone number"
      />
    );
  },
);

NumberInput.displayName = 'NumberInput';
