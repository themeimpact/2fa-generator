'use client'

import { useState, useEffect } from 'react'
import type { Period } from '@/types/totp'

interface UseCountdownReturn {
  remaining: number
  progress: number
  isExpiring: boolean
}

/**
 * Countdown hook for TOTP timer
 * @param period - TOTP period in seconds (30 or 60)
 * @param active - Whether the countdown is active
 */
export function useCountdown(period: Period, active: boolean = true): UseCountdownReturn {
  const [remaining, setRemaining] = useState<number>(period)

  useEffect(() => {
    if (!active) {
      setRemaining(period)
      return
    }

    const calculateRemaining = () => {
      const now = Math.floor(Date.now() / 1000)
      return period - (now % period)
    }

    setRemaining(calculateRemaining())

    const interval = setInterval(() => {
      setRemaining(calculateRemaining())
    }, 1000)

    return () => clearInterval(interval)
  }, [period, active])

  const progress = (remaining / period) * 100
  const isExpiring = remaining <= 5

  return { remaining, progress, isExpiring }
}
