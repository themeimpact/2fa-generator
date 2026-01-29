import type { Algorithm, Digits, Period } from '@/types/totp'

export const DEFAULT_DIGITS: Digits = 6
export const DEFAULT_PERIOD: Period = 30
export const DEFAULT_ALGORITHM: Algorithm = 'SHA1'

export const DIGITS_OPTIONS: Digits[] = [6, 8]
export const PERIOD_OPTIONS: Period[] = [30, 60]
export const ALGORITHM_OPTIONS: Algorithm[] = ['SHA1', 'SHA256', 'SHA512']

export const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
