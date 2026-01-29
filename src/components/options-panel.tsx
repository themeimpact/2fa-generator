'use client'

import { NeonSelect } from '@/components/ui/neon-select'
import type { Algorithm, Digits, Period } from '@/types/totp'
import { ALGORITHM_OPTIONS, DIGITS_OPTIONS, PERIOD_OPTIONS } from '@/lib/constants'

interface OptionsPanelProps {
  digits: Digits
  period: Period
  algorithm: Algorithm
  onDigitsChange: (value: Digits) => void
  onPeriodChange: (value: Period) => void
  onAlgorithmChange: (value: Algorithm) => void
}

export function OptionsPanel({
  digits,
  period,
  algorithm,
  onDigitsChange,
  onPeriodChange,
  onAlgorithmChange,
}: OptionsPanelProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <NeonSelect
        label="Digits"
        value={digits}
        onChange={(e) => onDigitsChange(Number(e.target.value) as Digits)}
        options={DIGITS_OPTIONS.map((d) => ({ value: d, label: `${d} digits` }))}
      />
      <NeonSelect
        label="Period"
        value={period}
        onChange={(e) => onPeriodChange(Number(e.target.value) as Period)}
        options={PERIOD_OPTIONS.map((p) => ({ value: p, label: `${p}s` }))}
      />
      <NeonSelect
        label="Algorithm"
        value={algorithm}
        onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
        options={ALGORITHM_OPTIONS.map((a) => ({ value: a, label: a }))}
      />
    </div>
  )
}
