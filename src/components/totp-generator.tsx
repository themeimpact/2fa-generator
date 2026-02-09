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
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-mono text-3xl font-bold text-neon-cyan [text-shadow:0_0_20px_#00ffff]">
          2FA Generator
        </h1>
        <p className="text-sm text-text-dim font-mono">
          Client-side TOTP generator • RFC 6238
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Generator Card - 3 columns */}
        <div
          className="
            lg:col-span-3 relative p-6 rounded-lg
            bg-bg-panel/80 backdrop-blur-sm
            border border-neon-cyan/20
            shadow-[0_0_30px_rgba(0,255,255,0.1)]
          "
        >
          {/* Scanlines overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-lg opacity-5"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
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

        {/* How to Use Guide - 2 columns */}
        <div
          className="
            lg:col-span-2 relative p-6 rounded-lg
            bg-bg-panel/80 backdrop-blur-sm
            border border-neon-cyan/20
            shadow-[0_0_30px_rgba(0,255,255,0.1)]
            h-fit
          "
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-lg opacity-5"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />

          <div className="relative space-y-4">
            <h2 className="font-mono text-xl font-bold text-neon-cyan">How to Use This Tool</h2>

            <div className="space-y-3">
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">1. Enter Your Secret</strong>: Paste your
                Base32-encoded TOTP secret key from your authenticator app setup.
              </p>

              <h3 className="text-sm font-bold text-neon-magenta font-mono">Quick Option:</h3>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">2. View Code</strong>: Your 2FA code appears
                instantly with a countdown timer showing time remaining.
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">3. Copy</strong>: Click the code to copy it
                to your clipboard for quick login.
              </p>

              <h3 className="text-sm font-bold text-neon-magenta font-mono">Advanced Options:</h3>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">Digits</strong>: Choose between 6, 7, or 8
                digit codes (most services use 6).
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">Period</strong>: Set refresh interval—15s,
                30s, or 60s (default is 30s).
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">Algorithm</strong>: Select SHA-1, SHA-256, or
                SHA-512 based on your service requirements.
              </p>
            </div>

            <p className="text-xs text-text-dim/80 font-mono pt-2 border-t border-neon-cyan/20">
              All codes are generated locally in your browser following RFC 6238 standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
