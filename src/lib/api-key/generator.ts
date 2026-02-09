export type KeyType =
  | 'mixed'
  | 'lettersNumbersSymbols'
  | 'numbers'
  | 'letters'
  | 'uppercase'
  | 'lowercase'

export const CHARSETS: Record<KeyType, string> = {
  mixed: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  lettersNumbersSymbols:
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
  numbers: '0123456789',
  letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
}

/**
 * Generate a single API key using crypto.getRandomValues()
 */
export function generateApiKey(
  length: number,
  type: KeyType,
  prefix?: string
): string {
  const charset = CHARSETS[type]
  const randomValues = new Uint32Array(length)
  crypto.getRandomValues(randomValues)

  let key = ''
  for (let i = 0; i < length; i++) {
    key += charset[randomValues[i] % charset.length]
  }

  return prefix ? `${prefix}${key}` : key
}

/**
 * Calculate entropy-based strength (0-100)
 * Maps entropy to percentage where 256 bits = 100%
 */
export function calculateStrength(length: number, type: KeyType): number {
  const charsetSize = CHARSETS[type].length
  const entropy = length * Math.log2(charsetSize)
  // Map entropy to 0-100 scale (256 bits = 100%)
  return Math.min(100, Math.round((entropy / 256) * 100))
}

/**
 * Generate multiple keys with separator
 */
export function generateMultipleKeys(
  count: number,
  length: number,
  type: KeyType,
  prefix?: string,
  separator: string = '\n'
): string {
  const keys: string[] = []
  for (let i = 0; i < count; i++) {
    keys.push(generateApiKey(length, type, prefix))
  }
  return keys.join(separator)
}
