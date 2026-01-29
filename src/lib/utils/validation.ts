import type { ValidationResult } from '@/types/totp'
import { isValidBase32, normalizeBase32 } from '@/lib/totp/base32'

/**
 * Validate and normalize secret input
 */
export function validateSecret(input: string): ValidationResult {
  if (!input || input.trim().length === 0) {
    return { isValid: false, error: 'Secret is required' }
  }

  const normalized = normalizeBase32(input)

  if (normalized.length < 8) {
    return { isValid: false, error: 'Secret too short (min 8 chars)' }
  }

  if (!isValidBase32(normalized)) {
    return { isValid: false, error: 'Invalid Base32 format' }
  }

  return { isValid: true, normalizedSecret: normalized }
}
