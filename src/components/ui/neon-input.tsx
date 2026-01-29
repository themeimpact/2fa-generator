'use client'

import { forwardRef, useState, type InputHTMLAttributes } from 'react'

interface NeonInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string | null
  showToggle?: boolean
}

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ className = '', label, error, showToggle = false, ...props }, ref) => {
    const [showValue, setShowValue] = useState(false)

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-xs uppercase tracking-widest text-text-dim font-mono">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showToggle && !showValue ? 'password' : 'text'}
            className={`
              w-full px-4 py-3 font-mono text-base
              bg-bg-input border-2 rounded-md
              text-neon-cyan placeholder-text-dim
              transition-all duration-200
              focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan
              ${error ? 'border-red-500' : 'border-text-dim/30'}
              ${showToggle ? 'pr-12' : ''}
              ${className}
            `}
            {...props}
          />
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowValue(!showValue)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-neon-cyan transition-colors"
              tabIndex={-1}
            >
              {showValue ? '◉' : '◎'}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-mono animate-pulse">{error}</p>
        )}
      </div>
    )
  }
)

NeonInput.displayName = 'NeonInput'
