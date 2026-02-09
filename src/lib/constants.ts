import type { Algorithm, Digits, Period } from '@/types/totp'

export const DEFAULT_DIGITS: Digits = 6
export const DEFAULT_PERIOD: Period = 30
export const DEFAULT_ALGORITHM: Algorithm = 'SHA1'

export const DIGITS_OPTIONS: Digits[] = [6, 8]
export const PERIOD_OPTIONS: Period[] = [30, 60]
export const ALGORITHM_OPTIONS: Algorithm[] = ['SHA1', 'SHA256', 'SHA512']

export const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

// API Key Generator Options
export const KEY_LENGTH_OPTIONS = [128, 256, 512, 1024, 2048] as const
export type KeyLength = (typeof KEY_LENGTH_OPTIONS)[number]
export const DEFAULT_KEY_LENGTH: KeyLength = 256

export const KEY_TYPE_OPTIONS = [
  { value: 'mixed', label: 'Mixed (Letters & Numbers)' },
  { value: 'lettersNumbersSymbols', label: 'Letters, Numbers & Symbols' },
  { value: 'numbers', label: 'Numbers Only' },
  { value: 'letters', label: 'Letters Only' },
  { value: 'uppercase', label: 'Uppercase Only' },
  { value: 'lowercase', label: 'Lowercase Only' },
] as const
export const DEFAULT_KEY_TYPE = 'mixed'

export const SEPARATOR_OPTIONS = [
  { value: '\n', label: 'New line' },
  { value: ', ', label: 'Comma' },
  { value: '; ', label: 'Semicolon' },
  { value: ' ', label: 'Space' },
  { value: '\t', label: 'Tab' },
] as const
export const DEFAULT_SEPARATOR = '\n'
