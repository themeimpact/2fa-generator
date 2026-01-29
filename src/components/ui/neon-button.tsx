'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'green' | 'magenta' | 'pink'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  cyan: 'border-neon-cyan text-neon-cyan hover:shadow-neon-cyan hover:bg-neon-cyan/10',
  green: 'border-neon-green text-neon-green hover:shadow-neon-green hover:bg-neon-green/10',
  magenta: 'border-neon-magenta text-neon-magenta hover:shadow-neon-magenta hover:bg-neon-magenta/10',
  pink: 'border-neon-pink text-neon-pink hover:shadow-neon-pink hover:bg-neon-pink/10',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className = '', variant = 'cyan', size = 'md', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          font-mono font-medium uppercase tracking-wider
          bg-transparent border-2 rounded-md
          transition-all duration-200 ease-out
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

NeonButton.displayName = 'NeonButton'
