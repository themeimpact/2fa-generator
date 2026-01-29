import { describe, it, expect } from 'vitest'
import { base32Decode, isValidBase32, normalizeBase32 } from '@/lib/totp/base32'

describe('Base32', () => {
  describe('base32Decode', () => {
    it('decodes standard Base32 string', () => {
      // "JBSWY3DPEHPK3PXP" decodes to "Hello!"
      const result = base32Decode('JBSWY3DPEHPK3PXP')
      const text = new TextDecoder().decode(result)
      expect(text).toBe('Hello!')
    })

    it('handles lowercase input', () => {
      const result = base32Decode('jbswy3dpehpk3pxp')
      const text = new TextDecoder().decode(result)
      expect(text).toBe('Hello!')
    })

    it('handles spaces in input', () => {
      const result = base32Decode('JBSW Y3DP EHPK 3PXP')
      const text = new TextDecoder().decode(result)
      expect(text).toBe('Hello!')
    })

    it('handles hyphens in input', () => {
      const result = base32Decode('JBSW-Y3DP-EHPK-3PXP')
      const text = new TextDecoder().decode(result)
      expect(text).toBe('Hello!')
    })

    it('handles padding', () => {
      const result = base32Decode('JBSWY3DPEHPK3PXP====')
      const text = new TextDecoder().decode(result)
      expect(text).toBe('Hello!')
    })

    it('throws on empty input', () => {
      expect(() => base32Decode('')).toThrow('Empty secret')
    })

    it('throws on invalid characters', () => {
      expect(() => base32Decode('JBSWY3DP!@#$')).toThrow('Invalid Base32 character')
    })
  })

  describe('isValidBase32', () => {
    it('returns true for valid Base32', () => {
      expect(isValidBase32('JBSWY3DPEHPK3PXP')).toBe(true)
    })

    it('returns false for invalid Base32', () => {
      expect(isValidBase32('INVALID!@#')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isValidBase32('')).toBe(false)
    })
  })

  describe('normalizeBase32', () => {
    it('converts to uppercase', () => {
      expect(normalizeBase32('jbswy3dp')).toBe('JBSWY3DP')
    })

    it('removes spaces', () => {
      expect(normalizeBase32('JBSW Y3DP')).toBe('JBSWY3DP')
    })

    it('removes hyphens', () => {
      expect(normalizeBase32('JBSW-Y3DP')).toBe('JBSWY3DP')
    })
  })
})
