'use client'

import { useState, useCallback } from 'react'

interface UseClipboardReturn {
  copied: boolean
  copy: (text: string) => Promise<void>
  error: string | null
}

/**
 * Clipboard hook with copy feedback
 * @param resetDelay - Time in ms to reset copied state (default: 2000)
 */
export function useClipboard(resetDelay: number = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const copy = useCallback(async (text: string) => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setError(null)

      setTimeout(() => {
        setCopied(false)
      }, resetDelay)
    } catch (err) {
      setError('Failed to copy')
      setCopied(false)
    }
  }, [resetDelay])

  return { copied, copy, error }
}
