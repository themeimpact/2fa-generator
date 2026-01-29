# TOTP Generator Implementation Plan

**Date:** 2026-01-29
**Project:** 2FA TOTP Generator Web Tool
**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS
**Theme:** Neon Terminal / Cyberpunk Aesthetic

---

## 1. Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with neon theme fonts
│   ├── page.tsx                # Main TOTP generator page
│   └── globals.css             # Global styles, neon theme variables
├── components/
│   ├── totp-generator.tsx      # Main container component
│   ├── secret-input.tsx        # Secret input with validation
│   ├── options-panel.tsx       # Digits, period, algorithm selectors
│   ├── otp-display.tsx         # OTP code display with copy button
│   ├── countdown-timer.tsx     # Countdown + progress bar
│   └── ui/
│       ├── neon-button.tsx     # Styled neon button
│       ├── neon-input.tsx      # Styled neon input field
│       ├── neon-select.tsx     # Styled neon dropdown
│       └── progress-bar.tsx    # Animated progress bar
├── lib/
│   ├── totp/
│   │   ├── totp.ts             # Core TOTP generation (RFC 6238)
│   │   ├── hotp.ts             # HOTP algorithm (RFC 4226)
│   │   ├── base32.ts           # Base32 decoder
│   │   └── hmac.ts             # HMAC-SHA1/256/512 wrapper
│   ├── utils/
│   │   └── validation.ts       # Input validation helpers
│   └── constants.ts            # Default values, config
├── hooks/
│   ├── use-totp.ts             # TOTP generation hook
│   ├── use-countdown.ts        # Countdown timer hook
│   └── use-clipboard.ts        # Copy to clipboard hook
└── types/
    └── totp.ts                 # TypeScript interfaces
```

---

## 2. Core Components Breakdown

### 2.1 Main Page (`app/page.tsx`)
- Client component (`'use client'`)
- Single-page layout with centered card
- No SSR data fetching needed

### 2.2 TOTP Generator Container (`components/totp-generator.tsx`)
- State management for: secret, digits, period, algorithm
- Orchestrates child components
- Handles generate/clear logic

### 2.3 Secret Input (`components/secret-input.tsx`)
- Text input with Base32 validation
- Auto-trim whitespace, auto-uppercase
- Error state display
- Password-style masking toggle

### 2.4 Options Panel (`components/options-panel.tsx`)
- Digits: Radio/Select (6, 8)
- Period: Radio/Select (30s, 60s)
- Algorithm: Select (SHA1, SHA256, SHA512)

### 2.5 OTP Display (`components/otp-display.tsx`)
- Large monospace digit display
- Copy button with success feedback
- Grouped digits (e.g., "123 456")

### 2.6 Countdown Timer (`components/countdown-timer.tsx`)
- Seconds remaining display
- Circular/linear progress bar
- Auto-refresh OTP when timer hits 0

---

## 3. TOTP Algorithm Implementation

### 3.1 RFC 6238 TOTP Formula
```
TOTP = HOTP(K, T)
T = floor((Current Unix Time) / Period)
```

### 3.2 RFC 4226 HOTP Formula
```
HOTP(K, C) = Truncate(HMAC-SHA-X(K, C))
```

### 3.3 Implementation Steps (`lib/totp/totp.ts`)

```typescript
interface TOTPOptions {
  secret: string;      // Base32 encoded
  digits: 6 | 8;
  period: 30 | 60;
  algorithm: 'SHA1' | 'SHA256' | 'SHA512';
}

function generateTOTP(options: TOTPOptions): string {
  // 1. Decode Base32 secret to bytes
  const keyBytes = base32Decode(options.secret);

  // 2. Calculate time counter
  const counter = Math.floor(Date.now() / 1000 / options.period);

  // 3. Convert counter to 8-byte big-endian
  const counterBytes = counterToBytes(counter);

  // 4. Compute HMAC
  const hmac = computeHMAC(options.algorithm, keyBytes, counterBytes);

  // 5. Dynamic truncation
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary = ((hmac[offset] & 0x7f) << 24)
               | ((hmac[offset + 1] & 0xff) << 16)
               | ((hmac[offset + 2] & 0xff) << 8)
               | (hmac[offset + 3] & 0xff);

  // 6. Modulo and pad
  const otp = binary % Math.pow(10, options.digits);
  return otp.toString().padStart(options.digits, '0');
}
```

### 3.4 Base32 Decoder (`lib/totp/base32.ts`)
- RFC 4648 compliant
- Handle uppercase conversion
- Ignore spaces/hyphens
- Throw on invalid characters

### 3.5 HMAC Implementation (`lib/totp/hmac.ts`)
- Use Web Crypto API (`crypto.subtle`)
- Support SHA-1, SHA-256, SHA-512
- Async but cache-friendly

---

## 4. UI/UX Components - Neon Terminal Theme

### 4.1 Color Palette
```css
:root {
  --neon-cyan: #00ffff;
  --neon-green: #39ff14;
  --neon-magenta: #ff00ff;
  --neon-pink: #ff6ec7;
  --bg-dark: #0a0a0f;
  --bg-panel: #12121a;
  --text-primary: #e0e0e0;
  --text-dim: #666680;
  --border-glow: rgba(0, 255, 255, 0.3);
}
```

### 4.2 Typography
- Primary font: `'JetBrains Mono'`, `'Fira Code'`, or `monospace`
- OTP display: Large (3-4rem), letter-spacing for readability
- Labels: Uppercase, small, dimmed

### 4.3 Visual Effects
```css
/* Neon glow effect */
.neon-glow {
  box-shadow: 0 0 5px var(--neon-cyan),
              0 0 10px var(--neon-cyan),
              0 0 20px var(--neon-cyan);
}

/* Scanline overlay (optional) */
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
}

/* Text glow */
.text-glow {
  text-shadow: 0 0 10px currentColor;
}
```

### 4.4 Component Styling

**Neon Input:**
- Dark background with cyan border
- Glow on focus
- Monospace font

**Neon Button:**
- Transparent with neon border
- Glow pulse on hover
- Click ripple effect

**Progress Bar:**
- Linear gradient cyan-to-magenta
- Glow effect
- Smooth countdown animation

---

## 5. Testing Strategy

### 5.1 RFC 6238 Test Vectors
```typescript
// Test vectors from RFC 6238 Appendix B
const testCases = [
  { time: 59, algorithm: 'SHA1', expected: '94287082' },
  { time: 59, algorithm: 'SHA256', expected: '46119246' },
  { time: 59, algorithm: 'SHA512', expected: '90693936' },
  { time: 1111111109, algorithm: 'SHA1', expected: '07081804' },
  { time: 1111111109, algorithm: 'SHA256', expected: '68084774' },
  { time: 1111111109, algorithm: 'SHA512', expected: '25091201' },
  // ... more test vectors
];

// Test secret (ASCII): "12345678901234567890"
// Base32: GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ
```

### 5.2 Unit Tests (`__tests__/`)
- `totp.test.ts` - TOTP generation with RFC vectors
- `base32.test.ts` - Base32 encoding/decoding
- `validation.test.ts` - Input validation
- `hmac.test.ts` - HMAC computation

### 5.3 Component Tests
- Secret input validation states
- Copy button functionality
- Timer countdown accuracy
- Options state management

### 5.4 E2E Tests (Optional)
- Full flow: enter secret -> see OTP -> copy
- Invalid input handling
- Page refresh clears state

---

## 6. Implementation Phases

### Phase 1: Project Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Add custom fonts (JetBrains Mono)
- [ ] Set up project structure
- [ ] Create base layout with neon theme

### Phase 2: Core TOTP Library
- [ ] Implement Base32 decoder
- [ ] Implement HMAC wrapper (Web Crypto API)
- [ ] Implement HOTP algorithm
- [ ] Implement TOTP algorithm
- [ ] Add RFC 6238 test vectors
- [ ] Verify all test vectors pass

### Phase 3: React Hooks
- [ ] Create `use-totp` hook
- [ ] Create `use-countdown` hook with interval
- [ ] Create `use-clipboard` hook
- [ ] Add TypeScript interfaces

### Phase 4: UI Components
- [ ] Build neon UI primitives (button, input, select)
- [ ] Build progress bar component
- [ ] Build secret input with validation
- [ ] Build options panel
- [ ] Build OTP display with copy
- [ ] Build countdown timer

### Phase 5: Main Page Integration
- [ ] Compose all components in page
- [ ] Add state management
- [ ] Wire up generate/clear flow
- [ ] Add keyboard shortcuts (optional)

### Phase 6: Styling & Polish
- [ ] Apply neon terminal theme
- [ ] Add glow effects
- [ ] Add hover/focus states
- [ ] Add transition animations
- [ ] Mobile responsive layout
- [ ] Add scanline effect (optional)

### Phase 7: Security Audit
- [ ] Verify no server requests
- [ ] Verify no localStorage usage
- [ ] Verify no console.log of secrets
- [ ] Verify state clears on refresh
- [ ] Add security headers (CSP)

### Phase 8: Testing & QA
- [ ] Run unit tests
- [ ] Run component tests
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile testing
- [ ] Performance profiling (<10ms OTP generation)

### Phase 9: Optional Enhancements
- [ ] Import from otpauth:// URI
- [ ] QR code preview (using qrcode library)
- [ ] PWA manifest for offline use
- [ ] Keyboard accessibility

---

## 7. Security Checklist

| Requirement | Implementation |
|-------------|----------------|
| No server requests | All computation client-side via Web Crypto API |
| No localStorage | State in React useState only |
| No sessionStorage | Not used |
| No console logging | Remove all console.log in production |
| Clear on refresh | React state naturally clears |
| No caching | No service worker caching of secrets |

---

## 8. Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/react": "^18.x",
    "@types/node": "^20.x",
    "vitest": "^1.x",
    "@testing-library/react": "^14.x"
  }
}
```

**Note:** No external TOTP library needed - implementing from scratch for security transparency and minimal bundle size.

---

## 9. File Size Targets

| Component | Target Lines |
|-----------|-------------|
| totp.ts | ~50 |
| base32.ts | ~40 |
| hmac.ts | ~30 |
| use-totp.ts | ~30 |
| use-countdown.ts | ~25 |
| totp-generator.tsx | ~80 |
| Each UI component | ~50-80 |

All files under 200 lines per development rules.

---

## 10. Performance Requirements

- OTP generation: <10ms
- Timer re-render: Every 1000ms, no visible lag
- Initial page load: <1s on 3G
- Bundle size: <100KB gzipped

---

## Unresolved Questions

1. **Font loading strategy** - Self-host JetBrains Mono or use Google Fonts?
2. **Glitch animation** - Include optional glitch effect on OTP change?
3. **Sound effects** - Add optional beep on copy success?
4. **QR Import** - Should QR scanning use camera or file upload?
