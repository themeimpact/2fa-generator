import { BulkGenerator } from '@/components/bulk-generator'
import { FaqAccordion } from '@/components/faq-accordion'

const FAQ_ITEMS = [
  {
    question: 'What is Bulk 2FA Generation?',
    answer:
      'Bulk 2FA generation allows you to generate TOTP codes for multiple secret keys simultaneously. Instead of entering secrets one by one, you can paste a list and get all codes at once—perfect for managing multiple accounts or testing.',
  },
  {
    question: 'What format should I use for input?',
    answer:
      'Enter one Base32-encoded secret key per line. Spaces and dashes are automatically removed. Example: "JBSWY3DPEHPK3PXP" or "JBSW Y3DP EHPK 3PXP". Invalid secrets will show an error in the output.',
  },
  {
    question: 'How does the output format work?',
    answer:
      'Results are shown as "secret|code" pairs, one per line. For example: "JBSWY3DPEHPK3PXP|123456". If a secret is invalid, you\'ll see "secret|ERROR: reason". This format is easy to parse programmatically.',
  },
  {
    question: 'Do codes automatically refresh?',
    answer:
      'Yes! Once generated, codes automatically regenerate when the countdown timer reaches zero. This ensures you always have valid, current codes without manually clicking generate again.',
  },
  {
    question: 'Is there a limit to how many secrets I can process?',
    answer:
      'There\'s no hard limit, but for best performance, we recommend processing up to 100 secrets at a time. All processing happens in your browser, so performance depends on your device.',
  },
  {
    question: 'Can I use different settings for different secrets?',
    answer:
      'Currently, all secrets in a batch use the same Digits, Period, and Algorithm settings. If you need different settings for specific secrets, generate them in separate batches or use the single 2FA Generator.',
  },
  {
    question: 'Are my secrets stored or transmitted?',
    answer:
      'No. All secrets remain in your browser. Nothing is sent to any server, stored in cookies, or saved to localStorage. When you close the page, all data is gone. Use the Reset button to clear everything instantly.',
  },
]

export default function BulkPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-8 pt-20 gap-8">
      <BulkGenerator />
      <FaqAccordion title="Bulk 2FA Generator: FAQ" items={FAQ_ITEMS} />

      {/* Footer */}
      <div className="text-center space-y-1 pb-4">
        <p className="text-xs text-text-dim font-mono">
          🔒 Your secrets never leave your browser
        </p>
        <p className="text-xs text-text-dim/60 font-mono">© 2025 - ThemeImpact</p>
      </div>
    </main>
  )
}
