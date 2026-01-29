export type Algorithm = 'SHA1' | 'SHA256' | 'SHA512'
export type Digits = 6 | 8
export type Period = 30 | 60

export interface TOTPOptions {
  secret: string
  digits: Digits
  period: Period
  algorithm: Algorithm
}

export interface TOTPResult {
  otp: string
  remainingSeconds: number
  period: Period
}

export interface ValidationResult {
  isValid: boolean
  error?: string
  normalizedSecret?: string
}
