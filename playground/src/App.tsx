import { useState } from 'react';
import { PhoneInput } from '../../src/index';
import type { PhoneChangeMeta } from '../../src/index';
import '../../src/styles/phone-input.css';

export default function App() {
  const [meta, setMeta] = useState<Partial<PhoneChangeMeta>>({});
  const [blurred, setBlurred] = useState(false);

  const showError = blurred && !meta.isValid;

  return (
    <div style={{ padding: '40px', maxWidth: '360px', fontFamily: 'system-ui' }}>
      <PhoneInput
        defaultCountry="auto"
        onChange={(_, m) => setMeta(m)}
        onBlur={() => setBlurred(true)}
        onFocus={() => setBlurred(false)}
        placeholder="Enter phone number"
        error={showError}
      />
      {showError && (
        <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#dc2626' }}>
          ⚠ Invalid phone number
        </p>
      )}
    </div>
  );
}
