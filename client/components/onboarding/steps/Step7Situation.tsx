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

const statuses = [
  { id: 'EMPLOYED',         label: 'Employed',               desc: 'Currently working, open to opportunities', icon: '💼' },
  { id: 'ACTIVELY_LOOKING', label: 'Actively looking',       desc: 'Unemployed and searching for a job',       icon: '🔍' },
  { id: 'STUDENT',          label: 'Student',                desc: 'Currently studying',                       icon: '🎓' },
  { id: 'FREELANCING',      label: 'Freelancing',            desc: 'Self-employed or contracting',             icon: '💻' },
  { id: 'NOT_LOOKING',      label: 'Not looking right now',  desc: 'Just exploring options',                  icon: '😴' },
]

const noticePeriods = ['Immediately', '1 week', '2 weeks', '1 month', '2 months', '3 months', '6 months']
const currencies = ['EUR', 'USD', 'GBP', 'SEK', 'NOK', 'DKK', 'CHF']

export default function Step7Situation({ onNext, onBack, dark, textPrimary, textMuted, border }: Props) {
  const [status, setStatus] = useState('')
  const [noticePeriod, setNoticePeriod] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [availableFrom, setAvailableFrom] = useState('')

  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff'
  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'

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
          Step 7 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>
          Current situation
        </h1>
        <p className="text-base" style={{ color: textMuted }}>
          Tell us about your current employment status and availability.
        </p>
      </motion.div>

      <div className="space-y-6 mb-8">

        {/* Employment status */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Employment Status
          </div>
          <div className="grid grid-cols-1 gap-2">
            {statuses.map(s => (
              <motion.div
                key={s.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setStatus(s.id)}
                className="flex items-center gap-4 rounded-xl p-4 cursor-pointer transition-all"
                style={{
                  background: status === s.id ? 'rgba(99,102,241,0.1)' : cardBg,
                  border: status === s.id ? '2px solid #6366f1' : `1px solid ${border}`,
                }}
              >
                <span className="text-xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: textPrimary }}>{s.label}</div>
                  <div className="text-xs" style={{ color: textMuted }}>{s.desc}</div>
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: status === s.id ? '#6366f1' : border,
                    background: status === s.id ? '#6366f1' : 'transparent',
                  }}
                >
                  {status === s.id && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Notice period */}
        {status === 'EMPLOYED' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>Notice Period</div>
            <div className="flex flex-wrap gap-2">
              {noticePeriods.map(n => (
                <button
                  key={n}
                  onClick={() => setNoticePeriod(n)}
                  className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
                  style={{
                    background: noticePeriod === n ? 'rgba(99,102,241,0.15)' : cardBg,
                    border: noticePeriod === n ? '2px solid #6366f1' : `1px solid ${border}`,
                    color: noticePeriod === n ? '#6366f1' : textMuted,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Salary */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Expected Salary <span className="font-normal" style={{ color: textMuted }}>(optional)</span>
          </div>
          <div className="flex gap-3 items-center">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="rounded-xl px-3 py-3 text-sm outline-none"
              style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary }}
            >
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number"
              value={salaryMin}
              onChange={e => setSalaryMin(e.target.value)}
              placeholder="Min"
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary }}
            />
            <span style={{ color: textMuted }}>—</span>
            <input
              type="number"
              value={salaryMax}
              onChange={e => setSalaryMax(e.target.value)}
              placeholder="Max"
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary }}
            />
          </div>
        </div>

        {/* Available from */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Available From <span className="font-normal" style={{ color: textMuted }}>(optional)</span>
          </div>
          <input
            type="date"
            value={availableFrom}
            onChange={e => setAvailableFrom(e.target.value)}
            className="rounded-xl px-4 py-3 text-sm outline-none"
            style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary }}
          />
        </div>
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
          onClick={() => onNext({ situation: { status, noticePeriod, salaryMin, salaryMax, currency, availableFrom } })}
          disabled={!status}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: status ? '#6366f1' : border,
            color: status ? '#ffffff' : textMuted,
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}