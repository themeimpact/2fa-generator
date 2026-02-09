'use client'

import { useState } from 'react'

interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  title?: string
  items: FaqItem[]
}

export function FaqAccordion({ title, items }: FaqAccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {title && (
        <h2 className="font-mono text-2xl font-bold text-neon-cyan [text-shadow:0_0_20px_#00ffff] text-center">
          {title}
        </h2>
      )}

      <div className="space-y-2">
        {items.map((item, index) => {
          const isExpanded = expandedItems.has(index)

          return (
            <div
              key={index}
              className={`
                rounded-lg border transition-all duration-300
                bg-bg-panel/50 backdrop-blur-sm
                ${isExpanded ? 'border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.1)]' : 'border-neon-cyan/20'}
              `}
            >
              {/* Question Row */}
              <button
                type="button"
                onClick={() => toggleItem(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleItem(index)
                  }
                }}
                className="
                  w-full flex items-center gap-3 p-4
                  text-left font-mono text-sm
                  text-neon-cyan hover:bg-neon-cyan/5
                  transition-colors duration-200
                  cursor-pointer
                "
                aria-expanded={isExpanded}
              >
                {/* Arrow Icon */}
                <span
                  className={`
                    text-neon-magenta transition-transform duration-300
                    ${isExpanded ? 'rotate-90' : 'rotate-0'}
                  `}
                >
                  ▶
                </span>
                <span className="flex-1">{item.question}</span>
              </button>

              {/* Answer */}
              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="px-4 pb-4 pl-11">
                  <p className="text-sm text-text-dim font-mono leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
