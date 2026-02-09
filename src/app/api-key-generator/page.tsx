import { ApiKeyGenerator } from '@/components/api-key-generator'
import { FaqAccordion } from '@/components/faq-accordion'

const FAQ_ITEMS = [
  {
    question: 'What is an API key?',
    answer:
      'An API key is a unique identifier used to authenticate requests to an API (Application Programming Interface). It acts as a secret token that identifies and authorizes the calling application or user, allowing servers to track and control how the API is being used.',
  },
  {
    question: 'Why should API keys be random and secure?',
    answer:
      'Random, secure API keys prevent unauthorized access and brute-force attacks. Predictable or weak keys can be guessed by attackers, potentially exposing your systems and data. Cryptographically random keys with sufficient length make such attacks computationally infeasible.',
  },
  {
    question: 'Are the generated API keys stored?',
    answer:
      'No. All keys are generated entirely in your browser using the Web Crypto API. Nothing is sent to any server, and no data is stored in cookies, localStorage, or any other persistent storage. Once you close or refresh the page, the generated keys are gone.',
  },
  {
    question: 'Can I use these keys in production?',
    answer:
      'Yes. The keys are generated using cryptographically secure random number generation (crypto.getRandomValues), which is suitable for production use. However, always follow your organization\'s security policies and consider additional measures like key rotation and secure storage.',
  },
  {
    question: 'How long should an API key be?',
    answer:
      'For most applications, 32-64 characters (256-512 bits of entropy with alphanumeric characters) provide excellent security. For highly sensitive applications, consider 128+ characters. The key should be long enough that brute-force attacks are impractical.',
  },
  {
    question: "What's the difference between an API key and a token?",
    answer:
      'API keys are typically long-lived, static identifiers for applications. Tokens (like JWT or OAuth tokens) are often short-lived, can contain claims/permissions, and are issued after authentication. API keys identify "what" is calling, while tokens often identify "who" and "what they can do."',
  },
  {
    question: 'How do I store API keys securely?',
    answer:
      'Never commit API keys to version control. Use environment variables or secret management services (AWS Secrets Manager, HashiCorp Vault). Encrypt keys at rest, implement key rotation policies, use different keys for development and production, and monitor key usage for anomalies.',
  },
]

export default function ApiKeyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-8 pt-20 gap-8">
      <ApiKeyGenerator />
      <FaqAccordion title="API Key Generator: FAQ" items={FAQ_ITEMS} />

      {/* Footer */}
      <div className="text-center space-y-1 pb-4">
        <p className="text-xs text-text-dim font-mono">
          🔒 Your keys never leave your browser
        </p>
        <p className="text-xs text-text-dim/60 font-mono">© 2025 - ThemeImpact</p>
      </div>
    </main>
  )
}
