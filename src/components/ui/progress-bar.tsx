'use client'

interface ProgressBarProps {
  progress: number // 0-100
  isExpiring?: boolean
  className?: string
}

export function ProgressBar({ progress, isExpiring = false, className = '' }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className={`relative w-full h-2 bg-bg-input rounded-full overflow-hidden ${className}`}>
      {/* Glow background */}
      <div
        className={`
          absolute inset-0 opacity-30 transition-colors duration-300
          ${isExpiring ? 'bg-red-500' : 'bg-neon-cyan'}
        `}
      />

      {/* Progress bar */}
      <div
        className={`
          h-full rounded-full transition-all duration-1000 ease-linear
          ${isExpiring
            ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
            : 'bg-gradient-to-r from-neon-cyan to-neon-magenta shadow-[0_0_10px_rgba(0,255,255,0.5)]'
          }
        `}
        style={{ width: `${clampedProgress}%` }}
      />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
        }}
      />
    </div>
  )
}
