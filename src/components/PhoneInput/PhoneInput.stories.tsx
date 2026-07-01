import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from './PhoneInput';
import { useState } from 'react';
import '../../styles/phone-input.css';

const meta: Meta<typeof PhoneInput> = {
  title: 'Components/PhoneInput',
  component: PhoneInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A zero-dependency React component for international phone number input.
Supports 250+ countries with auto-formatting and real-time validation.

\`\`\`tsx
import { PhoneInput } from 'react-phone-input-pro';
import 'react-phone-input-pro/styles';

<PhoneInput defaultCountry="auto" onChange={(value, meta) => console.log(meta)} />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    defaultCountry: {
      control: 'text',
      description: 'ISO country code or "auto" to detect from browser locale',
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    defaultCountry: 'auto',
    placeholder: 'Phone number',
  },
};

export const PresetIndia: Story = {
  name: 'Preset — India (+91)',
  args: {
    defaultCountry: 'IN',
    placeholder: '98765 43210',
  },
};

export const PresetUS: Story = {
  name: 'Preset — United States (+1)',
  args: {
    defaultCountry: 'US',
    placeholder: '(555) 000-0000',
  },
};

export const PresetUAE: Story = {
  name: 'Preset — UAE (+971)',
  args: {
    defaultCountry: 'AE',
    placeholder: '50 123 4567',
  },
};

export const Disabled: Story = {
  args: {
    defaultCountry: 'IN',
    disabled: true,
    placeholder: 'Disabled input',
  },
};

export const WithError: Story = {
  args: {
    defaultCountry: 'IN',
    error: true,
  },
};

const ControlledPhoneInput = () => {
  const [value, setValue] = useState('');
  const [meta, setMeta] = useState<Record<string, unknown>>({});

  return (
    <div style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PhoneInput
        value={value}
        onChange={(v, m) => {
          setValue(v);
          setMeta(m as unknown as Record<string, unknown>);
        }}
        defaultCountry="IN"
      />
      <div style={{ fontFamily: 'monospace', fontSize: 12, background: '#f3f4f6', padding: 12, borderRadius: 8 }}>
        <div><strong>Full number:</strong> {value || '—'}</div>
        <div><strong>Country:</strong> {(meta.country as string) || '—'}</div>
        <div><strong>Valid:</strong> {meta.isValid ? '✅' : '❌'}</div>
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPhoneInput />,
};
