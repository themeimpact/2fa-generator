import { TOTPGenerator } from '@/components/totp-generator'
import { FaqAccordion } from '@/components/faq-accordion'

const FAQ_ITEMS = [
  {
    question: 'What is TOTP (Time-based One-Time Password)?',
    answer:
      'TOTP is a temporary passcode algorithm that generates a unique code based on the current time and a shared secret key. It\'s the standard behind most 2FA apps like Google Authenticator, Authy, and Microsoft Authenticator, defined in RFC 6238.',
  },
  {
    question: 'What is a Base32 secret key?',
    answer:
      'A Base32 secret is an encoding format using letters A-Z and digits 2-7. When you set up 2FA, the service provides this secret (often shown as a QR code). It typically looks like "JBSWY3DPEHPK3PXP" and is case-insensitive.',
  },
  {
    question: 'Is my secret key stored anywhere?',
    answer:
      'No. Your secret key never leaves your browser. All TOTP calculations happen entirely client-side using the Web Crypto API. Nothing is sent to any server, and no data is stored in cookies or localStorage.',
  },
  {
    question: 'Why does my code not match the authenticator app?',
    answer:
      'Common causes: (1) Incorrect secret key—verify it matches exactly. (2) Wrong settings—check if your service uses non-standard digits, period, or algorithm. (3) Time sync—ensure your device clock is accurate. Most services use 6 digits, 30s period, and SHA-1.',
  },
  {
    question: 'What do the Digits, Period, and Algorithm options mean?',
    answer:
      'Digits: Length of the generated code (6, 7, or 8). Period: How often the code refreshes (15s, 30s, or 60s). Algorithm: The hash function used (SHA-1, SHA-256, or SHA-512). Most services use 6 digits, 30s, and SHA-1 by default.',
  },
  {
    question: 'Can I use this tool as my primary authenticator?',
    answer:
      'This tool is designed for quick code generation and testing. For daily use, dedicated apps like Google Authenticator, Authy, or 1Password offer better security features like encrypted storage, backup, and sync across devices.',
  },
  {
    question: 'Is this tool secure for production use?',
    answer:
      'Yes, the cryptographic implementation follows RFC 6238 standards using the Web Crypto API. However, keep your secret keys safe—never share them, and consider using a password manager with 2FA support for long-term storage.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-8 pt-20 gap-8">
      <TOTPGenerator />
      <FaqAccordion title="2FA Generator: FAQ" items={FAQ_ITEMS} />

      {/* Footer */}
      <div className="text-center space-y-1 pb-4">
        <p className="text-xs text-text-dim font-mono">
          🔒 Your secret never leaves your browser
        </p>
        <p className="text-xs text-text-dim/60 font-mono">© 2025 - ThemeImpact</p>
      </div>
    </main>
  )
}
