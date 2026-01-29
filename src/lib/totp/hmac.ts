import type { Algorithm } from '@/types/totp'

const ALGORITHM_MAP: Record<Algorithm, string> = {
  'SHA1': 'SHA-1',
  'SHA256': 'SHA-256',
  'SHA512': 'SHA-512',
}

/**
 * Compute HMAC using Web Crypto API
 * @param algorithm - Hash algorithm (SHA1, SHA256, SHA512)
 * @param key - Secret key as Uint8Array
 * @param message - Message to sign as Uint8Array
 * @returns HMAC result as Uint8Array
 */
export async function computeHMAC(
  algorithm: Algorithm,
  key: Uint8Array,
  message: Uint8Array
): Promise<Uint8Array> {
  const cryptoAlgorithm = ALGORITHM_MAP[algorithm]

  // Create proper ArrayBuffer from Uint8Array (works in both browser and Node)
  const keyBuffer = new ArrayBuffer(key.length)
  const keyView = new Uint8Array(keyBuffer)
  keyView.set(key)

  const messageBuffer = new ArrayBuffer(message.length)
  const messageView = new Uint8Array(messageBuffer)
  messageView.set(message)

  // Import key for HMAC
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: cryptoAlgorithm },
    false,
    ['sign']
  )

  // Sign message
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBuffer)

  return new Uint8Array(signature)
}

/**
 * Convert counter to 8-byte big-endian Uint8Array
 */
export function counterToBytes(counter: number): Uint8Array {
  const bytes = new Uint8Array(8)
  for (let i = 7; i >= 0; i--) {
    bytes[i] = counter & 0xff
    counter = Math.floor(counter / 256)
  }
  return bytes
}
