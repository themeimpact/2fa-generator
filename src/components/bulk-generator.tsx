'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Algorithm, Digits, Period } from '@/types/totp'
import { DEFAULT_ALGORITHM, DEFAULT_DIGITS, DEFAULT_PERIOD } from '@/lib/constants'
import { generateTOTP, getRemainingSeconds } from '@/lib/totp/totp'
import { validateSecret } from '@/lib/utils/validation'
import { NeonButton } from '@/components/ui/neon-button'
import { NeonSelect } from '@/components/ui/neon-select'
import { CountdownTimer } from '@/components/countdown-timer'
import { ALGORITHM_OPTIONS, DIGITS_OPTIONS, PERIOD_OPTIONS } from '@/lib/constants'

export function BulkGenerator() {
  const [secrets, setSecrets] = useState('')
  const [output, setOutput] = useState('')
  const [digits, setDigits] = useState<Digits>(DEFAULT_DIGITS)
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD)
  const [algorithm, setAlgorithm] = useState<Algorithm>(DEFAULT_ALGORITHM)
  const [isGenerating, setIsGenerating] = useState(false)

  // Auto-regenerate when countdown hits period (new cycle)
  const [lastGenerated, setLastGenerated] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRemainingSeconds(period)
      if (remaining === period && output && lastGenerated > 0) {
        generateCodes()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [period, output, lastGenerated])

  const generateCodes = useCallback(async () => {
    if (!secrets.trim()) return

    setIsGenerating(true)
    const lines = secrets.split('\n').filter((line) => line.trim())
    const results: string[] = []

    for (const line of lines) {
      const secret = line.trim()
      const validation = validateSecret(secret)

      if (!validation.isValid) {
        results.push(`${secret}|ERROR: ${validation.error}`)
        continue
      }

      try {
        const code = await generateTOTP({
          secret: validation.normalizedSecret!,
          digits,
          period,
          algorithm,
        })
        results.push(`${secret}|${code}`)
      } catch (err) {
        results.push(`${secret}|ERROR: Failed to generate`)
      }
    }

    setOutput(results.join('\n'))
    setIsGenerating(false)
    setLastGenerated(Date.now())
  }, [secrets, digits, period, algorithm])

  const copyOutput = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
    } catch {
      // ignore
    }
  }, [output])

  const resetAll = useCallback(() => {
    setSecrets('')
    setOutput('')
    setLastGenerated(0)
  }, [])

  const secretCount = secrets.split('\n').filter((line) => line.trim()).length

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-mono text-3xl font-bold text-neon-cyan [text-shadow:0_0_20px_#00ffff]">
          Bulk 2FA Generator
        </h1>
        <p className="text-sm text-text-dim font-mono">
          Generate multiple TOTP codes at once
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Generator Card - 3 columns */}
        <div
          className="
            lg:col-span-3 relative p-6 rounded-lg
            bg-bg-panel/80 backdrop-blur-sm
            border border-neon-cyan/20
            shadow-[0_0_30px_rgba(0,255,255,0.1)]
          "
        >
          {/* Scanlines overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-lg opacity-5"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />

          <div className="relative space-y-5">
            {/* Options Row */}
            <div className="grid grid-cols-3 gap-4">
              <NeonSelect
                label="Digits"
                value={digits}
                onChange={(e) => setDigits(Number(e.target.value) as Digits)}
                options={DIGITS_OPTIONS.map((d) => ({ value: d, label: `${d} digits` }))}
              />
              <NeonSelect
                label="Period"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value) as Period)}
                options={PERIOD_OPTIONS.map((p) => ({ value: p, label: `${p}s` }))}
              />
              <NeonSelect
                label="Algorithm"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
                options={ALGORITHM_OPTIONS.map((a) => ({ value: a, label: a }))}
              />
            </div>

            {/* Input Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-text-dim font-mono">
                  Secrets (one per line)
                </label>
                <span className="text-xs text-neon-green font-mono">
                  {secretCount} secret{secretCount !== 1 ? 's' : ''}
                </span>
              </div>
              <textarea
                value={secrets}
                onChange={(e) => setSecrets(e.target.value)}
                placeholder="JBSWY3DPEHPK3PXP&#10;GEZDGNBVGY3TQOJQ&#10;MFRGGZDFMY2TQNTD"
                rows={6}
                className="
                  w-full px-4 py-3 font-mono text-sm
                  bg-bg-input border-2 border-text-dim/30 rounded-md
                  text-neon-cyan placeholder-text-dim/50
                  resize-none
                  transition-all duration-200
                  focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan
                "
                spellCheck={false}
                autoComplete="off"
              />
            </div>

            {/* Generate Button */}
            <NeonButton
              variant="green"
              size="lg"
              onClick={generateCodes}
              disabled={!secrets.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? '⏳ Generating...' : '⚡ Generate All Codes'}
            </NeonButton>

            {/* Divider */}
            <div className="border-t border-neon-cyan/20" />

            {/* Countdown Timer */}
            <CountdownTimer period={period} active={!!output} showHint={!!output} />

            {/* Divider */}
            <div className="border-t border-neon-cyan/20" />

            {/* Output Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-text-dim font-mono">
                  Output (secret|code)
                </label>
                <div className="flex gap-2">
                  <NeonButton
                    variant="magenta"
                    size="sm"
                    onClick={resetAll}
                    disabled={!secrets && !output}
                  >
                    Reset
                  </NeonButton>
                  <NeonButton
                    variant="cyan"
                    size="sm"
                    onClick={copyOutput}
                    disabled={!output}
                  >
                    Copy All
                  </NeonButton>
                </div>
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Results will appear here..."
                rows={6}
                className="
                  w-full px-4 py-3 font-mono text-sm
                  bg-bg-input border-2 border-text-dim/30 rounded-md
                  text-neon-green placeholder-text-dim/50
                  resize-none cursor-text
                  transition-all duration-200
                  focus:outline-none focus:border-neon-green
                "
              />
            </div>
          </div>
        </div>

        {/* How to Use Guide - 2 columns */}
        <div
          className="
            lg:col-span-2 relative p-6 rounded-lg
            bg-bg-panel/80 backdrop-blur-sm
            border border-neon-cyan/20
            shadow-[0_0_30px_rgba(0,255,255,0.1)]
            h-fit
          "
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-lg opacity-5"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />

          <div className="relative space-y-4">
            <h2 className="font-mono text-xl font-bold text-neon-cyan">How to Use This Tool</h2>

            <div className="space-y-3">
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">1. Paste Your Secrets</strong>: Enter multiple
                Base32 secret keys, one per line.
              </p>

              <h3 className="text-sm font-bold text-neon-magenta font-mono">Quick Option:</h3>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">2. Generate</strong>: Click{' '}
                <span className="text-neon-cyan">&quot;Generate All Codes&quot;</span> to create
                TOTP codes for all secrets instantly.
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">3. Copy</strong>: Use{' '}
                <span className="text-neon-cyan">&quot;Copy All&quot;</span> to grab all
                secret|code pairs.
              </p>

              <h3 className="text-sm font-bold text-neon-magenta font-mono">Advanced Options:</h3>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">Digits</strong>: Choose 6, 7, or 8 digit codes
                based on your services.
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">Period</strong>: Set refresh interval—15s, 30s,
                or 60s.
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">Algorithm</strong>: Select SHA-1, SHA-256, or
                SHA-512.
              </p>

              <h3 className="text-sm font-bold text-neon-magenta font-mono">Output Format:</h3>
              <p className="text-sm text-text-dim font-mono">
                Results appear as <span className="text-neon-cyan">secret|code</span> pairs. Codes
                auto-refresh when the timer resets.
              </p>
            </div>

            <p className="text-xs text-text-dim/80 font-mono pt-2 border-t border-neon-cyan/20">
              All codes are generated locally in your browser. Perfect for managing multiple 2FA
              accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
