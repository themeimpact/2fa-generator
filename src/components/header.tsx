'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'single' },
  { href: '/bulk', label: 'bulk' },
]

const GITHUB_URL = 'https://github.com/themeimpact/2fa-generator'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full border-b border-neon-cyan/20 bg-bg-panel/50 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Terminal-style header */}
        <div className="flex items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="font-mono text-sm text-text-dim">
              <span className="text-neon-green">2fa@themeimpact</span>
              <span className="text-text-dim">:</span>
              <span className="text-neon-cyan">~</span>
              <span className="text-text-dim">$</span>
              <span className="ml-2 text-neon-cyan animate-pulse">_</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    font-mono text-sm transition-all duration-300
                    ${isActive
                      ? 'text-neon-cyan [text-shadow:0_0_10px_#00ffff,0_0_20px_#00ffff] scale-110'
                      : 'text-text-dim hover:text-neon-cyan hover:[text-shadow:0_0_10px_#00ffff] hover:scale-105'
                    }
                  `}
                >
                  [{item.label}]
                </Link>
              )
            })}

            {/* Separator */}
            <span className="text-text-dim/30 mx-1">|</span>

            {/* GitHub Link */}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-mono text-sm text-text-dim
                transition-all duration-300
                hover:text-neon-green hover:[text-shadow:0_0_10px_#39ff14] hover:scale-105
              "
              title="View on GitHub"
            >
              [github]
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
