'use client'

import { ProgressBar } from '@/components/ui/progress-bar'
import type { Period } from '@/types/totp'
import { useCountdown } from '@/hooks/use-countdown'

interface CountdownTimerProps {
  period: Period
  active: boolean
  showHint?: boolean
}

export function CountdownTimer({ period, active, showHint = false }: CountdownTimerProps) {
  const { remaining, progress, isExpiring } = useCountdown(period, active)

  return (
    <div className="w-full space-y-3">
      {/* Timer display */}
      <div className="flex items-center justify-between font-mono text-sm">
        <span className="uppercase tracking-widest text-text-dim">Time Remaining</span>
        <span
          className={`
            text-2xl font-bold tabular-nums transition-colors duration-300
            ${isExpiring
              ? 'text-red-500 animate-pulse'
              : 'text-neon-magenta [text-shadow:0_0_10px_#ff00ff]'
            }
          `}
        >
          {remaining}s
        </span>
      </div>

      {/* Progress bar */}
      <ProgressBar progress={progress} isExpiring={isExpiring} />

      {/* Optional hint */}
      {showHint && (
        <p className="text-xs text-text-dim font-mono text-center">
          Codes auto-refresh every {period}s
        </p>
      )}
    </div>
  )
}
