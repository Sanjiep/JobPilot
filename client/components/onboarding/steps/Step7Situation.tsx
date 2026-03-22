'use client'

import { useState, useRef, useEffect } from 'react'
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

const statuses = [
  {
    id: 'EMPLOYED',
    label: 'Employed',
    desc: 'Currently working, open to opportunities',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
  },
  {
    id: 'ACTIVELY_LOOKING',
    label: 'Actively looking',
    desc: 'Unemployed and searching for a job',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    id: 'STUDENT',
    label: 'Student',
    desc: 'Currently studying',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    id: 'FREELANCING',
    label: 'Freelancing',
    desc: 'Self-employed or contracting',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    id: 'NOT_LOOKING',
    label: 'Not looking right now',
    desc: 'Just exploring options',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
]

const noticePeriods = ['Immediately', '1 week', '2 weeks', '1 month', '2 months', '3 months', '6 months']
const currencies = ['EUR', 'USD', 'GBP', 'SEK', 'NOK', 'DKK', 'CHF']

// Custom Select
function CustomSelect({ value, onChange, options, dark, textPrimary, textMuted, border }: {
  value: string
  onChange: (v: string) => void
  options: string[]
  dark: boolean
  textPrimary: string
  textMuted: string
  border: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between gap-2 px-3 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: dark ? 'rgba(255,255,255,0.05)' : '#ffffff',
          border: `1px solid ${open ? '#6366f1' : border}`,
          color: textPrimary,
          cursor: 'pointer',
          minWidth: '90px',
          boxShadow: open ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
        }}
      >
        <span>{value}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: textMuted, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 rounded-xl overflow-hidden mt-1"
            style={{
              background: dark ? '#0e0e1a' : '#ffffff',
              border: `1px solid ${border}`,
              boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)',
              minWidth: '100px',
            }}
          >
            {options.map((opt, i) => {
              const isSelected = opt === value
              return (
                <button key={opt} type="button"
                  onClick={() => { onChange(opt); setOpen(false) }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm transition-all"
                  style={{
                    background: 'transparent',
                    color: isSelected ? '#6366f1' : textPrimary,
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    borderBottom: i < options.length - 1 ? `1px solid ${border}33` : 'none',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : '#f5f5ff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span>{opt}</span>
                  {isSelected && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: '#6366f1', flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Date Picker
function DatePicker({ value, onChange, inputBg, border, textPrimary, textMuted, dark }: {
  value: string
  onChange: (v: string) => void
  inputBg: string
  border: string
  textPrimary: string
  textMuted: string
  dark: boolean
}) {
  const [open, setOpen] = useState(false)
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => value ? new Date(value).getMonth() : new Date().getMonth())
  const [viewYear, setViewYear] = useState(() => value ? new Date(value).getFullYear() : new Date().getFullYear())
  const ref = useRef<HTMLDivElement>(null)

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']
  const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i)

  // Today with time zeroed for accurate past comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const selectedDate = value ? new Date(value) : null
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const displayValue = value
    ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : ''

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setShowYearDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    onChange(`${viewYear}-${mm}-${dd}`)
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setShowYearDropdown(false) }}
        className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{
          background: inputBg,
          border: `1px solid ${open ? '#6366f1' : border}`,
          color: displayValue ? textPrimary : textMuted,
          cursor: 'pointer',
          minWidth: '180px',
          boxShadow: open ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
        }}
      >
        <span>{displayValue || 'Select date'}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: textMuted, flexShrink: 0 }}>
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            top: 'calc(100% + 8px)', left: 0, width: '280px',
            background: dark ? '#0e0e1a' : '#ffffff',
            border: '1px solid rgba(99,102,241,0.25)',
            boxShadow: dark ? '0 8px 40px rgba(0,0,0,0.5)' : '0 8px 40px rgba(0,0,0,0.12)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: `1px solid ${dark ? '#1e1e32' : '#e2e4f0'}` }}>
            <button type="button"
              onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ color: textMuted, background: 'transparent', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.08)' : '#f0f0ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold" style={{ color: textPrimary }}>{MONTHS[viewMonth]}</span>
              <button type="button"
                onClick={e => { e.stopPropagation(); setShowYearDropdown(o => !o) }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold transition-all"
                style={{
                  color: textPrimary,
                  background: showYearDropdown ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: showYearDropdown ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { if (!showYearDropdown) e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.08)' : '#f0f0ff' }}
                onMouseLeave={e => { if (!showYearDropdown) e.currentTarget.style.background = 'transparent' }}
              >
                {viewYear}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: showYearDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>

            <button type="button"
              onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ color: textMuted, background: 'transparent', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.08)' : '#f0f0ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          {/* Year dropdown */}
          {showYearDropdown && (
            <div className="overflow-y-auto"
              style={{ maxHeight: '180px', background: dark ? '#0e0e1a' : '#ffffff', borderBottom: `1px solid ${dark ? '#1e1e32' : '#e2e4f0'}` }}>
              {YEARS.map(year => {
                const isActive = year === viewYear
                return (
                  <button key={year} type="button"
                    onClick={() => { setViewYear(year); setShowYearDropdown(false) }}
                    className="w-full px-5 py-2 text-sm text-left transition-all"
                    style={{ background: isActive ? '#6366f1' : 'transparent', color: isActive ? '#ffffff' : textMuted, fontWeight: isActive ? 700 : 400, cursor: 'pointer' }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = dark ? 'rgba(99,102,241,0.12)' : '#f0f0ff' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    {year}
                  </button>
                )
              })}
            </div>
          )}

          {/* Day grid */}
          {!showYearDropdown && (
            <div className="p-3">
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs py-1 font-semibold" style={{ color: textMuted }}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const thisDate = new Date(viewYear, viewMonth, day)
                  const isPast = thisDate < today
                  const isSelected = selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === viewMonth &&
                    selectedDate.getFullYear() === viewYear

                  return (
                    <button key={day} type="button"
                      onClick={() => { if (!isPast) selectDay(day) }}
                      className="w-full aspect-square flex items-center justify-center text-xs rounded-lg transition-all"
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
                        color: isSelected ? '#ffffff' : isPast ? (dark ? '#2a2a45' : '#d0d0e0') : textPrimary,
                        fontWeight: isSelected ? 700 : 400,
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        boxShadow: isSelected ? '0 2px 8px rgba(99,102,241,0.4)' : 'none',
                        opacity: isPast ? 0.35 : 1,
                      }}
                      onMouseEnter={e => { if (!isSelected && !isPast) e.currentTarget.style.background = dark ? 'rgba(99,102,241,0.15)' : '#f0f0ff' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
              {value && (
                <button type="button"
                  onClick={() => { onChange(''); setOpen(false) }}
                  className="w-full mt-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ color: textMuted, background: 'transparent', borderTop: `1px solid ${dark ? '#1e1e32' : '#e2e4f0'}`, cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.background = 'transparent' }}
                >
                  Clear date
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Step7Situation({ onNext, onBack, data, dark, textPrimary, textMuted, border, isRevisit }: Props) {
  const saved = data?.situation || {}
  const [status, setStatus] = useState(saved.status || '')
  const [noticePeriod, setNoticePeriod] = useState(saved.noticePeriod || '')
  const [salaryMin, setSalaryMin] = useState(saved.salaryMin || '')
  const [salaryMax, setSalaryMax] = useState(saved.salaryMax || '')
  const [currency, setCurrency] = useState(saved.currency || 'EUR')
  const [availableFrom, setAvailableFrom] = useState(saved.availableFrom || '')

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
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>Current situation</h1>
        <p className="text-base" style={{ color: textMuted }}>
          Tell us about your current employment status and availability.
        </p>
      </motion.div>

      <div className="space-y-6 mb-8">

        {/* Employment status */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>Employment Status</div>
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
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: status === s.id ? 'rgba(99,102,241,0.2)' : dark ? 'rgba(255,255,255,0.05)' : '#ebebff',
                    color: status === s.id ? '#6366f1' : textMuted,
                  }}
                >
                  {s.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: textPrimary }}>{s.label}</div>
                  <div className="text-xs" style={{ color: textMuted }}>{s.desc}</div>
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderColor: status === s.id ? '#6366f1' : border,
                    background: status === s.id ? '#6366f1' : 'transparent',
                  }}
                >
                  {status === s.id && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Notice period */}
        <AnimatePresence>
          {status === 'EMPLOYED' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>Notice Period</div>
              <div className="flex flex-wrap gap-2">
                {noticePeriods.map(n => (
                  <button key={n} onClick={() => setNoticePeriod(n)}
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
        </AnimatePresence>

        {/* Salary */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Expected Salary <span className="font-normal" style={{ color: textMuted }}>(optional)</span>
          </div>
          <div className="flex gap-3 items-center">
            <CustomSelect
              value={currency}
              onChange={setCurrency}
              options={currencies}
              dark={dark}
              textPrimary={textPrimary}
              textMuted={textMuted}
              border={border}
            />
            <input
              type="number"
              value={salaryMin}
              onChange={e => setSalaryMin(e.target.value)}
              placeholder="Min"
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary }}
              onWheel={e => (e.target as HTMLInputElement).blur()}
            />
            <span style={{ color: textMuted }}>—</span>
            <input
              type="number"
              value={salaryMax}
              onChange={e => setSalaryMax(e.target.value)}
              placeholder="Max"
              className="flex-1 rounded-xl px-4 py-3 text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary }}
              onWheel={e => (e.target as HTMLInputElement).blur()}
            />
          </div>
        </div>

        {/* Available from */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Available From <span className="font-normal" style={{ color: textMuted }}>(optional)</span>
          </div>
          <DatePicker
            value={availableFrom}
            onChange={setAvailableFrom}
            inputBg={inputBg}
            border={border}
            textPrimary={textPrimary}
            textMuted={textMuted}
            dark={dark}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}>
          ← Back
        </button>
        <button
          onClick={() => isRevisit ? onNext() : onNext({ situation: { status, noticePeriod, salaryMin, salaryMax, currency, availableFrom } })}
          disabled={!isRevisit && !status}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: (isRevisit || status) ? '#6366f1' : border,
            color: (isRevisit || status) ? '#ffffff' : textMuted,
          }}
        >
          {isRevisit ? 'Next →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}