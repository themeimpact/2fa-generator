'use client'

import { NeonButton } from '@/components/ui/neon-button'
import { useClipboard } from '@/hooks/use-clipboard'

interface OTPDisplayProps {
  otp: string
  isValid: boolean
}

export function OTPDisplay({ otp, isValid }: OTPDisplayProps) {
  const { copied, copy } = useClipboard()

  // Format OTP with space in middle (e.g., "123 456")
  const formatOTP = (code: string): string => {
    if (!code) return '--- ---'
    const mid = Math.floor(code.length / 2)
    return `${code.slice(0, mid)} ${code.slice(mid)}`
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* OTP Display */}
      <div
        className={`
          relative font-mono text-5xl md:text-6xl font-bold tracking-[0.3em]
          transition-all duration-300
          ${isValid
            ? 'text-neon-cyan [text-shadow:0_0_20px_#00ffff,0_0_40px_#00ffff]'
            : 'text-text-dim'
          }
        `}
      >
        {formatOTP(otp)}

        {/* Glow overlay */}
        {isValid && (
          <div className="absolute inset-0 blur-xl opacity-30 bg-neon-cyan -z-10" />
        )}
      </div>

      {/* Copy Button */}
      <NeonButton
        variant={copied ? 'green' : 'cyan'}
        size="lg"
        onClick={() => copy(otp)}
        disabled={!isValid}
        className="min-w-[160px]"
      >
        {copied ? '✓ Copied' : 'Copy OTP'}
      </NeonButton>
    </div>
  )
}
