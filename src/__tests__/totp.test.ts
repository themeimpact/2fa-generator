import { describe, it, expect } from 'vitest'
import { generateTOTP, getRemainingSeconds } from '@/lib/totp/totp'

/**
 * RFC 6238 Test Vectors
 * Test secret (ASCII): "12345678901234567890" for SHA1
 * Base32: GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ
 *
 * For SHA256: "12345678901234567890123456789012" (32 bytes)
 * Base32: GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZA
 *
 * For SHA512: "1234567890123456789012345678901234567890123456789012345678901234" (64 bytes)
 * Base32: GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNA
 */

const SECRET_SHA1 = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'
const SECRET_SHA256 = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZA'
const SECRET_SHA512 = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNA'

describe('TOTP - RFC 6238 Test Vectors', () => {
  // Time: 59 seconds (counter = 1 with 30s period)
  describe('Time = 59 (1970-01-01 00:00:59)', () => {
    const timestamp = 59 * 1000

    it('SHA1 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA1, digits: 8, period: 30, algorithm: 'SHA1' },
        timestamp
      )
      expect(otp).toBe('94287082')
    })

    it('SHA256 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA256, digits: 8, period: 30, algorithm: 'SHA256' },
        timestamp
      )
      expect(otp).toBe('46119246')
    })

    it('SHA512 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA512, digits: 8, period: 30, algorithm: 'SHA512' },
        timestamp
      )
      expect(otp).toBe('90693936')
    })
  })

  // Time: 1111111109 seconds
  describe('Time = 1111111109 (2005-03-18 01:58:29)', () => {
    const timestamp = 1111111109 * 1000

    it('SHA1 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA1, digits: 8, period: 30, algorithm: 'SHA1' },
        timestamp
      )
      expect(otp).toBe('07081804')
    })

    it('SHA256 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA256, digits: 8, period: 30, algorithm: 'SHA256' },
        timestamp
      )
      expect(otp).toBe('68084774')
    })

    it('SHA512 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA512, digits: 8, period: 30, algorithm: 'SHA512' },
        timestamp
      )
      expect(otp).toBe('25091201')
    })
  })

  // Time: 1234567890 seconds
  describe('Time = 1234567890 (2009-02-13 23:31:30)', () => {
    const timestamp = 1234567890 * 1000

    it('SHA1 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA1, digits: 8, period: 30, algorithm: 'SHA1' },
        timestamp
      )
      expect(otp).toBe('89005924')
    })

    it('SHA256 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA256, digits: 8, period: 30, algorithm: 'SHA256' },
        timestamp
      )
      expect(otp).toBe('91819424')
    })

    it('SHA512 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA512, digits: 8, period: 30, algorithm: 'SHA512' },
        timestamp
      )
      expect(otp).toBe('93441116')
    })
  })

  // Time: 2000000000 seconds
  describe('Time = 2000000000 (2033-05-18 03:33:20)', () => {
    const timestamp = 2000000000 * 1000

    it('SHA1 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA1, digits: 8, period: 30, algorithm: 'SHA1' },
        timestamp
      )
      expect(otp).toBe('69279037')
    })

    it('SHA256 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA256, digits: 8, period: 30, algorithm: 'SHA256' },
        timestamp
      )
      expect(otp).toBe('90698825')
    })

    it('SHA512 generates correct OTP', async () => {
      const otp = await generateTOTP(
        { secret: SECRET_SHA512, digits: 8, period: 30, algorithm: 'SHA512' },
        timestamp
      )
      expect(otp).toBe('38618901')
    })
  })
})

describe('TOTP - 6 digit codes', () => {
  it('generates 6 digit code with padding', async () => {
    const otp = await generateTOTP(
      { secret: SECRET_SHA1, digits: 6, period: 30, algorithm: 'SHA1' },
      59 * 1000
    )
    expect(otp).toHaveLength(6)
    expect(otp).toBe('287082') // Last 6 digits of 94287082
  })
})

describe('getRemainingSeconds', () => {
  it('calculates remaining seconds correctly', () => {
    // At time 0, remaining should be 30
    expect(getRemainingSeconds(30, 0)).toBe(30)

    // At time 15000ms (15s), remaining should be 15
    expect(getRemainingSeconds(30, 15000)).toBe(15)

    // At time 29000ms (29s), remaining should be 1
    expect(getRemainingSeconds(30, 29000)).toBe(1)

    // At time 30000ms (30s), remaining should be 30 (new period)
    expect(getRemainingSeconds(30, 30000)).toBe(30)
  })

  it('works with 60s period', () => {
    expect(getRemainingSeconds(60, 0)).toBe(60)
    expect(getRemainingSeconds(60, 30000)).toBe(30)
  })
})
