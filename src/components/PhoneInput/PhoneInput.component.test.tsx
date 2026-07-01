import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PhoneInput } from './PhoneInput';


// Mock the CSS import if needed, but it should be fine with global.d.ts

describe('PhoneInput Component', () => {
  it('renders without crashing, shows country dropdown trigger, shows number input', () => {
    render(<PhoneInput defaultCountry="IN" />);
    expect(screen.getByRole('group', { name: /phone number input/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Country: India/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /phone number/i })).toBeInTheDocument();
  });

  it('renders with defaultCountry="IN" and shows +91', () => {
    render(<PhoneInput defaultCountry="IN" />);
    expect(screen.getByText('+91')).toBeInTheDocument();
  });

  it('allows typing a number and formats it', async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="IN" />);
    const input = screen.getByRole('textbox', { name: /phone number/i });
    
    await user.type(input, '9876543210');
    expect(input).toHaveValue('98765 43210');
  });

  it('allows country selection and updates dial code', async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="IN" />);
    
    // Open dropdown
    const trigger = screen.getByRole('button', { name: /Country: India/i });
    await user.click(trigger);
    
    // Verify dropdown opens
    const dialog = screen.getByRole('dialog', { name: /Select country/i });
    expect(dialog).toBeInTheDocument();
    
    // Select a country (e.g., United States)
    const searchInput = screen.getByRole('textbox', { name: /Search countries/i });
    await user.type(searchInput, 'United States');
    
    // the option contains text "United States"
    const usOption = screen.getByRole('option', { name: /United States/i });
    if (usOption) await user.click(usOption);
    
    // Verify dial code changed
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('handles pasting an international number', async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="US" />);
    
    const input = screen.getByRole('textbox', { name: /phone number/i });
    await user.click(input);
    await user.paste('+919876543210');
    
    // Should switch to India
    expect(screen.getByText('+91')).toBeInTheDocument();
    expect(input).toHaveValue('98765 43210');
  });

  it('disables input and button when disabled prop is true', () => {
    render(<PhoneInput defaultCountry="IN" disabled />);
    
    const input = screen.getByRole('textbox', { name: /phone number/i });
    const trigger = screen.getByRole('button', { name: /Country: India/i });
    
    expect(input).toBeDisabled();
    expect(trigger).toBeDisabled();
  });

  it('shows error styling when error prop is true', () => {
    const { container } = render(<PhoneInput defaultCountry="IN" error />);
    // Note: The wrapper gets 'rpi-wrapper--error' class
    expect(container.querySelector('.rpi-wrapper--error')).toBeInTheDocument();
  });

  it('fires onChange callback with correct value and meta', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PhoneInput defaultCountry="IN" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox', { name: /phone number/i });
    await user.type(input, '9');
    
    expect(handleChange).toHaveBeenCalledWith('+919', expect.objectContaining({
      country: 'IN',
      dialCode: '+91',
      isValid: false,
      nationalNumber: '9',
      rawNumber: '9'
    }));
  });

  it('closes dropdown when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="IN" />);
    
    // Open dropdown
    const trigger = screen.getByRole('button', { name: /Country: India/i });
    await user.click(trigger);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    await user.keyboard('{Escape}');
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('filters countries when searching', async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="IN" />);
    
    const trigger = screen.getByRole('button', { name: /Country: India/i });
    await user.click(trigger);
    
    const searchInput = screen.getByRole('textbox', { name: /Search countries/i });
    await user.type(searchInput, 'japan');
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent(/Japan/i);
  });
});
