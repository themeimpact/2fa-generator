import type { TOTPOptions } from '@/types/totp'
import { base32Decode } from './base32'
import { computeHMAC, counterToBytes } from './hmac'

/**
 * Generate TOTP code according to RFC 6238
 * @param options - TOTP configuration
 * @param timestamp - Optional Unix timestamp (ms), defaults to Date.now()
 * @returns OTP string with padding
 */
export async function generateTOTP(
  options: TOTPOptions,
  timestamp?: number
): Promise<string> {
  const { secret, digits, period, algorithm } = options

  // 1. Decode Base32 secret to bytes
  const keyBytes = base32Decode(secret)

  // 2. Calculate time counter
  const time = timestamp ?? Date.now()
  const counter = Math.floor(time / 1000 / period)

  // 3. Convert counter to 8-byte big-endian
  const counterBytes = counterToBytes(counter)

  // 4. Compute HMAC
  const hmac = await computeHMAC(algorithm, keyBytes, counterBytes)

  // 5. Dynamic truncation (RFC 4226 Section 5.4)
  const offset = hmac[hmac.length - 1] & 0x0f
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  // 6. Modulo and pad to specified digits
  const otp = binary % Math.pow(10, digits)
  return otp.toString().padStart(digits, '0')
}

/**
 * Get remaining seconds until next OTP
 */
export function getRemainingSeconds(period: number, timestamp?: number): number {
  const time = timestamp ?? Date.now()
  const seconds = Math.floor(time / 1000)
  return period - (seconds % period)
}
