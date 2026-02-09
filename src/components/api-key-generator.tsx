'use client'

import { useState, useCallback } from 'react'
import { generateMultipleKeys, calculateStrength, type KeyType } from '@/lib/api-key'
import {
  KEY_LENGTH_OPTIONS,
  KEY_TYPE_OPTIONS,
  SEPARATOR_OPTIONS,
  DEFAULT_KEY_LENGTH,
  DEFAULT_KEY_TYPE,
  DEFAULT_SEPARATOR,
} from '@/lib/constants'
import { NeonButton } from '@/components/ui/neon-button'
import { NeonSelect } from '@/components/ui/neon-select'
import { NeonInput } from '@/components/ui/neon-input'
import { ProgressBar } from '@/components/ui/progress-bar'

export function ApiKeyGenerator() {
  const [quantity, setQuantity] = useState(1)
  const [keyLength, setKeyLength] = useState(DEFAULT_KEY_LENGTH)
  const [keyType, setKeyType] = useState<KeyType>(DEFAULT_KEY_TYPE as KeyType)
  const [prefix, setPrefix] = useState('')
  const [separator, setSeparator] = useState(DEFAULT_SEPARATOR)
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const strength = calculateStrength(keyLength, keyType)

  const generateKeys = useCallback(() => {
    const validQuantity = Math.max(1, Math.min(500, quantity))
    setIsGenerating(true)

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const keys = generateMultipleKeys(validQuantity, keyLength, keyType, prefix || undefined, separator)
      setOutput(keys)
      setIsGenerating(false)
    }, 10)
  }, [quantity, keyLength, keyType, prefix, separator])

  const copyOutput = useCallback(async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
    } catch {
      // ignore
    }
  }, [output])

  const getStrengthLabel = (value: number): string => {
    if (value >= 80) return 'Excellent'
    if (value >= 60) return 'Strong'
    if (value >= 40) return 'Good'
    if (value >= 20) return 'Moderate'
    return 'Weak'
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-mono text-3xl font-bold text-neon-cyan [text-shadow:0_0_20px_#00ffff]">
          API Key Generator
        </h1>
        <p className="text-sm text-text-dim font-mono">
          Generate secure, random API keys for your apps—free and no sign-up required.
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
            {/* Quantity Input */}
            <NeonInput
              label="Number of API Keys (1-500)"
              value={quantity.toString()}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1
                setQuantity(Math.max(1, Math.min(500, val)))
              }}
              placeholder="1"
            />

            {/* Options Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NeonSelect
                label="API Key Length (chars)"
                value={keyLength}
                onChange={(e) => setKeyLength(Number(e.target.value) as typeof keyLength)}
                options={KEY_LENGTH_OPTIONS.map((len) => ({ value: len, label: `${len}-char` }))}
              />
              <NeonSelect
                label="Type of Characters"
                value={keyType}
                onChange={(e) => setKeyType(e.target.value as KeyType)}
                options={KEY_TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
              />
            </div>

            {/* Prefix and Separator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NeonInput
                label="Prefix (optional)"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="sk_live_"
              />
              <NeonSelect
                label="Separator (if more than 1)"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                options={SEPARATOR_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
              />
            </div>

            {/* Strength Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-text-dim font-mono">
                  Strength
                </label>
                <span className="text-xs font-mono text-neon-green">{getStrengthLabel(strength)}</span>
              </div>
              <ProgressBar progress={strength} />
            </div>

            {/* Generate Button */}
            <NeonButton
              variant="green"
              size="lg"
              onClick={generateKeys}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate API Keys'}
            </NeonButton>

            {/* Output Textarea */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-text-dim font-mono">
                Your API keys will appear here
              </label>
              <textarea
                value={output}
                readOnly
                placeholder="Your API keys will appear here"
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

            {/* Copy Button */}
            <NeonButton
              variant="cyan"
              size="lg"
              onClick={copyOutput}
              disabled={!output}
              className="w-full"
            >
              Copy API Keys
            </NeonButton>
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
                <strong className="text-neon-green">1. Set the Quantity</strong>: Choose how many API keys
                to generate (1–500).
              </p>

              <h3 className="text-sm font-bold text-neon-magenta font-mono">Quick Option:</h3>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">2. Generate</strong>: Click{' '}
                <span className="text-neon-cyan">&quot;Generate API Keys&quot;</span> to instantly create
                your keys.
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">3. Copy</strong>: Use the{' '}
                <span className="text-neon-cyan">&quot;Copy API Keys&quot;</span> button to grab and use
                them securely.
              </p>

              <h3 className="text-sm font-bold text-neon-magenta font-mono">Custom Option:</h3>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">2. Select Key Length</strong>: Pick your desired key
                strength, such as 256-char.
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">3. Choose Character Type</strong>: Use letters, numbers,
                or a mix for added randomness.
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">4. Add a Prefix (Optional)</strong>: Include a custom
                prefix to help identify your keys.
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">5. Set a Separator</strong>: Choose how to separate
                multiple keys—new line, comma, etc.
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">6. Generate</strong>: Click{' '}
                <span className="text-neon-cyan">&quot;Generate API Keys&quot;</span> to instantly create
                your keys.
              </p>
              <p className="text-sm text-text-dim font-mono">
                <strong className="text-neon-green">7. Copy</strong>: Use the{' '}
                <span className="text-neon-cyan">&quot;Copy API Keys&quot;</span> button to grab and use
                them securely.
              </p>
            </div>

            <p className="text-xs text-text-dim/80 font-mono pt-2 border-t border-neon-cyan/20">
              All keys are generated locally in your browser for maximum privacy and security.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
