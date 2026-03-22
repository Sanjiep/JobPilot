'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onNext: (data?: Record<string, any>) => void
  onBack: () => void
  data: Record<string, any>
  dark: boolean
  textPrimary: string
  textMuted: string
  border: string
  isRevisit?: boolean
}

const frequencies = [
  {
    id: 'DAILY',
    label: 'Daily',
    desc: 'Apply every day automatically',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="8" y1="14" x2="8" y2="14"/>
        <line x1="12" y1="14" x2="12" y2="14"/>
        <line x1="16" y1="14" x2="16" y2="14"/>
      </svg>
    ),
  },
  {
    id: 'WEEKLY',
    label: 'Weekly',
    desc: 'Apply once a week in a batch',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14h8"/>
        <path d="M8 18h5"/>
      </svg>
    ),
  },
  {
    id: 'MONTHLY',
    label: 'Monthly',
    desc: 'Apply once a month',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14h2v4H8z"/>
        <path d="M14 14h2v4h-2z"/>
      </svg>
    ),
  },
  {
    id: 'MANUAL',
    label: 'Manual only',
    desc: 'I will trigger each apply myself',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/>
        <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/>
        <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/>
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
      </svg>
    ),
  },
]

const appCounts = [5, 10, 20, 50, 100]

const times = [
  {
    id: 'MORNING',
    label: 'Morning',
    desc: '6am – 12pm',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        <circle cx="12" cy="12" r="4"/>
        <path d="M2 17h20"/>
      </svg>
    ),
  },
  {
    id: 'AFTERNOON',
    label: 'Afternoon',
    desc: '12pm – 6pm',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
  },
  {
    id: 'EVENING',
    label: 'Evening',
    desc: '6pm – 12am',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  },
  {
    id: 'ANY',
    label: 'Any time',
    desc: 'No preference',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
]

export default function Step11Frequency({ onNext, onBack, data, dark, textPrimary, textMuted, border, isRevisit }: Props) {
  const saved = data?.frequency || {}
  const [frequency, setFrequency] = useState(saved.frequency || '')
  const [count, setCount] = useState(saved.count || 10)
  const [time, setTime] = useState(saved.time || '')

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'
  const valid = frequency !== ''

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1' }}
        >
          Step 11 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>Apply frequency</h1>
        <p className="text-base" style={{ color: textMuted }}>
          How often should JobPilot apply for jobs on your behalf?
        </p>
      </motion.div>

      <div className="space-y-6 mb-8">

        {/* Frequency */}
        <div className="grid grid-cols-2 gap-3">
          {frequencies.map(f => {
            const isSelected = frequency === f.id
            return (
              <motion.div
                key={f.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFrequency(f.id)}
                className="rounded-2xl p-4 cursor-pointer transition-all"
                style={{
                  background: isSelected ? 'rgba(99,102,241,0.1)' : cardBg,
                  border: isSelected ? '2px solid #6366f1' : `1px solid ${border}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: isSelected ? 'rgba(99,102,241,0.2)' : dark ? 'rgba(255,255,255,0.05)' : '#ebebff',
                    color: isSelected ? '#6366f1' : textMuted,
                  }}
                >
                  {f.icon}
                </div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: textPrimary }}>{f.label}</div>
                <div className="text-xs" style={{ color: textMuted }}>{f.desc}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Applications per session */}
        <AnimatePresence>
          {frequency && frequency !== 'MANUAL' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
                Applications per session
              </div>
              <div className="flex gap-2">
                {appCounts.map(n => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all"
                    style={{
                      background: count === n ? '#6366f1' : cardBg,
                      border: count === n ? '2px solid #6366f1' : `1px solid ${border}`,
                      color: count === n ? '#ffffff' : textMuted,
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preferred time */}
        <AnimatePresence>
          {frequency && frequency !== 'MANUAL' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
                Preferred time
              </div>
              <div className="grid grid-cols-2 gap-2">
                {times.map(t => {
                  const isSelected = time === t.id
                  return (
                    <motion.div
                      key={t.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setTime(t.id)}
                      className="flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-all"
                      style={{
                        background: isSelected ? 'rgba(99,102,241,0.1)' : cardBg,
                        border: isSelected ? '1px solid #6366f1' : `1px solid ${border}`,
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isSelected ? 'rgba(99,102,241,0.2)' : dark ? 'rgba(255,255,255,0.05)' : '#ebebff',
                          color: isSelected ? '#6366f1' : textMuted,
                        }}
                      >
                        {t.icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold" style={{ color: textPrimary }}>{t.label}</div>
                        <div className="text-xs" style={{ color: textMuted }}>{t.desc}</div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}>
          ← Back
        </button>
        <button
          onClick={() => isRevisit ? onNext() : onNext({ frequency: { frequency, count, time } })}
          disabled={!isRevisit && !valid}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: (isRevisit || valid) ? '#6366f1' : border,
            color: (isRevisit || valid) ? '#ffffff' : textMuted,
          }}
        >
          {isRevisit ? 'Next →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}