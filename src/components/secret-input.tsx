'use client'

import { NeonInput } from '@/components/ui/neon-input'

interface SecretInputProps {
  value: string
  onChange: (value: string) => void
  error?: string | null
}

export function SecretInput({ value, onChange, error }: SecretInputProps) {
  return (
    <NeonInput
      label="2FA Secret"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter Base32 secret (e.g., JBSWY3DPEHPK3PXP)"
      error={error}
      showToggle
      autoComplete="off"
      spellCheck={false}
      autoCapitalize="characters"
    />
  )
}
