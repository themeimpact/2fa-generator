import { BASE32_ALPHABET } from '@/lib/constants'

/**
 * Decode Base32 string to Uint8Array (RFC 4648)
 * Handles: uppercase conversion, spaces/hyphens removal
 * Throws on invalid characters
 */
export function base32Decode(input: string): Uint8Array {
  // Normalize: uppercase, remove spaces and hyphens
  const normalized = input.toUpperCase().replace(/[\s-]/g, '')

  if (normalized.length === 0) {
    throw new Error('Empty secret')
  }

  // Remove padding
  const unpadded = normalized.replace(/=+$/, '')

  // Validate characters
  for (const char of unpadded) {
    if (!BASE32_ALPHABET.includes(char)) {
      throw new Error(`Invalid Base32 character: ${char}`)
    }
  }

  // Decode - accumulate bits
  let bits = ''
  for (const char of unpadded) {
    const value = BASE32_ALPHABET.indexOf(char)
    bits += value.toString(2).padStart(5, '0')
  }

  // Convert bits to bytes (8 bits each) - only full bytes
  const byteCount = Math.floor(bits.length / 8)
  const bytes = new Uint8Array(byteCount)

  for (let i = 0; i < byteCount; i++) {
    const byteStr = bits.slice(i * 8, (i + 1) * 8)
    bytes[i] = parseInt(byteStr, 2)
  }

  return bytes
}

/**
 * Validate Base32 string
 */
export function isValidBase32(input: string): boolean {
  try {
    base32Decode(input)
    return true
  } catch {
    return false
  }
}

/**
 * Normalize Base32 string (uppercase, remove spaces/hyphens)
 */
export function normalizeBase32(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, '')
}
