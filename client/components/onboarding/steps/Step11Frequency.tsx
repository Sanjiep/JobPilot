'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  onNext: (data?: Record<string, any>) => void
  onBack: () => void
  data: Record<string, any>
  dark: boolean
  textPrimary: string
  textMuted: string
  border: string
}

const frequencies = [
  { id: 'DAILY',   label: 'Daily',       desc: 'Apply every day automatically',     icon: '📅' },
  { id: 'WEEKLY',  label: 'Weekly',      desc: 'Apply once a week in a batch',      icon: '📆' },
  { id: 'MONTHLY', label: 'Monthly',     desc: 'Apply once a month',                icon: '🗓️' },
  { id: 'MANUAL',  label: 'Manual only', desc: 'I will trigger each apply myself',  icon: '✋' },
]

const appCounts = [5, 10, 20, 50, 100]

const times = [
  { id: 'MORNING',   label: 'Morning',   desc: '6am – 12pm',  icon: '🌅' },
  { id: 'AFTERNOON', label: 'Afternoon', desc: '12pm – 6pm',  icon: '☀️' },
  { id: 'EVENING',   label: 'Evening',   desc: '6pm – 12am',  icon: '🌆' },
  { id: 'ANY',       label: 'Any time',  desc: 'No preference', icon: '⏰' },
]

export default function Step11Frequency({ onNext, onBack, dark, textPrimary, textMuted, border }: Props) {
  const [frequency, setFrequency] = useState('')
  const [count, setCount] = useState(10)
  const [time, setTime] = useState('')

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'
  const valid = frequency !== ''

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

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
          {frequencies.map(f => (
            <motion.div
              key={f.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFrequency(f.id)}
              className="rounded-2xl p-4 cursor-pointer transition-all"
              style={{
                background: frequency === f.id ? 'rgba(99,102,241,0.1)' : cardBg,
                border: frequency === f.id ? '2px solid #6366f1' : `1px solid ${border}`,
              }}
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-semibold mb-0.5" style={{ color: textPrimary }}>{f.label}</div>
              <div className="text-xs" style={{ color: textMuted }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Applications per session */}
        {frequency && frequency !== 'MANUAL' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
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

        {/* Preferred time */}
        {frequency && frequency !== 'MANUAL' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
              Preferred time
            </div>
            <div className="grid grid-cols-2 gap-2">
              {times.map(t => (
                <motion.div
                  key={t.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setTime(t.id)}
                  className="flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-all"
                  style={{
                    background: time === t.id ? 'rgba(99,102,241,0.1)' : cardBg,
                    border: time === t.id ? '1px solid #6366f1' : `1px solid ${border}`,
                  }}
                >
                  <span className="text-xl">{t.icon}</span>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: textPrimary }}>{t.label}</div>
                    <div className="text-xs" style={{ color: textMuted }}>{t.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer"
          style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}
        >
          ← Back
        </button>
        <button
          onClick={() => onNext({ frequency: { frequency, count, time } })}
          disabled={!valid}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: valid ? '#6366f1' : border, color: valid ? '#ffffff' : textMuted }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}