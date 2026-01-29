'use client'

import { useState } from 'react'
import type { Algorithm, Digits, Period } from '@/types/totp'
import { DEFAULT_ALGORITHM, DEFAULT_DIGITS, DEFAULT_PERIOD } from '@/lib/constants'
import { useTOTP } from '@/hooks/use-totp'
import { SecretInput } from '@/components/secret-input'
import { OptionsPanel } from '@/components/options-panel'
import { OTPDisplay } from '@/components/otp-display'
import { CountdownTimer } from '@/components/countdown-timer'

export function TOTPGenerator() {
  const [secret, setSecret] = useState('')
  const [digits, setDigits] = useState<Digits>(DEFAULT_DIGITS)
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD)
  const [algorithm, setAlgorithm] = useState<Algorithm>(DEFAULT_ALGORITHM)

  const { otp, isValid, error } = useTOTP(secret, { digits, period, algorithm })

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-mono text-3xl font-bold text-neon-cyan [text-shadow:0_0_20px_#00ffff]">
          2FA Generator
        </h1>
        <p className="text-sm text-text-dim font-mono">
          Client-side TOTP generator • RFC 6238
        </p>
      </div>

      {/* Card */}
      <div
        className="
          relative p-6 rounded-lg
          bg-bg-panel/80 backdrop-blur-sm
          border border-neon-cyan/20
          shadow-[0_0_30px_rgba(0,255,255,0.1)]
        "
      >
        {/* Scanlines overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg opacity-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />

        <div className="relative space-y-6">
          {/* Secret Input */}
          <SecretInput value={secret} onChange={setSecret} error={error} />

          {/* Options */}
          <OptionsPanel
            digits={digits}
            period={period}
            algorithm={algorithm}
            onDigitsChange={setDigits}
            onPeriodChange={setPeriod}
            onAlgorithmChange={setAlgorithm}
          />

          {/* Divider */}
          <div className="border-t border-neon-cyan/20" />

          {/* OTP Display */}
          <OTPDisplay otp={otp} isValid={isValid} />

          {/* Countdown */}
          <CountdownTimer period={period} active={isValid} />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-1">
        <p className="text-xs text-text-dim font-mono">
          🔒 Your secret never leaves your browser
        </p>
        <p className="text-xs text-text-dim/60 font-mono">
          © 2025 - ThemeImpact
        </p>
      </div>
    </div>
  )
}
