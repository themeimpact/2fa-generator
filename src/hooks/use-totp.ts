'use client'

import { useState, useEffect, useCallback } from 'react'
import type { TOTPOptions, TOTPResult } from '@/types/totp'
import { generateTOTP, getRemainingSeconds } from '@/lib/totp/totp'
import { validateSecret } from '@/lib/utils/validation'
import { DEFAULT_ALGORITHM, DEFAULT_DIGITS, DEFAULT_PERIOD } from '@/lib/constants'

interface UseTOTPReturn {
  otp: string
  remainingSeconds: number
  isValid: boolean
  error: string | null
  isGenerating: boolean
}

export function useTOTP(
  secret: string,
  options?: Partial<Omit<TOTPOptions, 'secret'>>
): UseTOTPReturn {
  const [otp, setOtp] = useState<string>('')
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const digits = options?.digits ?? DEFAULT_DIGITS
  const period = options?.period ?? DEFAULT_PERIOD
  const algorithm = options?.algorithm ?? DEFAULT_ALGORITHM

  const generate = useCallback(async () => {
    const validation = validateSecret(secret)

    if (!validation.isValid) {
      setOtp('')
      setError(validation.error ?? 'Invalid secret')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const code = await generateTOTP({
        secret: validation.normalizedSecret!,
        digits,
        period,
        algorithm,
      })
      setOtp(code)
      setRemainingSeconds(getRemainingSeconds(period))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate OTP')
      setOtp('')
    } finally {
      setIsGenerating(false)
    }
  }, [secret, digits, period, algorithm])

  // Generate OTP on mount and when options change
  useEffect(() => {
    if (secret) {
      generate()
    } else {
      setOtp('')
      setError(null)
    }
  }, [secret, generate])

  // Countdown timer - regenerate when hitting 0
  useEffect(() => {
    if (!secret || !otp) return

    const interval = setInterval(() => {
      const remaining = getRemainingSeconds(period)
      setRemainingSeconds(remaining)

      // Regenerate when period resets
      if (remaining === period) {
        generate()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [secret, otp, period, generate])

  return {
    otp,
    remainingSeconds,
    isValid: !!otp && !error,
    error,
    isGenerating,
  }
}
