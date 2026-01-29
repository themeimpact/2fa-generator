'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'

interface NeonSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string | number; label: string }[]
}

export const NeonSelect = forwardRef<HTMLSelectElement, NeonSelectProps>(
  ({ className = '', label, options, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-xs uppercase tracking-widest text-text-dim font-mono">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 font-mono text-base
            bg-bg-input border-2 border-text-dim/30 rounded-md
            text-neon-green appearance-none cursor-pointer
            transition-all duration-200
            focus:outline-none focus:border-neon-green focus:shadow-neon-green
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2339ff14'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1.5rem',
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-bg-panel">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
)

NeonSelect.displayName = 'NeonSelect'
