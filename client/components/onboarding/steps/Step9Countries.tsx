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

const COUNTRIES = [
  { code: 'FI', name: 'Finland',         flag: '🇫🇮' },
  { code: 'SE', name: 'Sweden',          flag: '🇸🇪' },
  { code: 'NO', name: 'Norway',          flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark',         flag: '🇩🇰' },
  { code: 'DE', name: 'Germany',         flag: '🇩🇪' },
  { code: 'NL', name: 'Netherlands',     flag: '🇳🇱' },
  { code: 'GB', name: 'United Kingdom',  flag: '🇬🇧' },
  { code: 'FR', name: 'France',          flag: '🇫🇷' },
  { code: 'ES', name: 'Spain',           flag: '🇪🇸' },
  { code: 'IT', name: 'Italy',           flag: '🇮🇹' },
  { code: 'CH', name: 'Switzerland',     flag: '🇨🇭' },
  { code: 'AT', name: 'Austria',         flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium',         flag: '🇧🇪' },
  { code: 'PL', name: 'Poland',          flag: '🇵🇱' },
  { code: 'US', name: 'United States',   flag: '🇺🇸' },
  { code: 'CA', name: 'Canada',          flag: '🇨🇦' },
  { code: 'AU', name: 'Australia',       flag: '🇦🇺' },
  { code: 'SG', name: 'Singapore',       flag: '🇸🇬' },
  { code: 'AE', name: 'UAE',             flag: '🇦🇪' },
  { code: 'IN', name: 'India',           flag: '🇮🇳' },
  { code: 'NP', name: 'Nepal',           flag: '🇳🇵' },
  { code: 'JP', name: 'Japan',           flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea',     flag: '🇰🇷' },
  { code: 'BR', name: 'Brazil',          flag: '🇧🇷' },
]

export default function Step9Countries({ onNext, onBack, dark, textPrimary, textMuted, border }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [openToAnywhere, setOpenToAnywhere] = useState(false)
  const [search, setSearch] = useState('')

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff'

  const toggle = (code: string) => {
    if (selected.includes(code)) setSelected(selected.filter(c => c !== code))
    else setSelected([...selected, code])
  }

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const valid = openToAnywhere || selected.length > 0

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
          Step 9 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>Target countries</h1>
        <p className="text-base" style={{ color: textMuted }}>
          Which countries do you want to apply for jobs in?
        </p>
      </motion.div>

      {/* Open to anywhere toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onClick={() => { setOpenToAnywhere(!openToAnywhere); setSelected([]) }}
        className="flex items-center justify-between rounded-2xl p-4 cursor-pointer mb-4 transition-all"
        style={{
          background: openToAnywhere ? 'rgba(99,102,241,0.1)' : cardBg,
          border: openToAnywhere ? '2px solid #6366f1' : `1px solid ${border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌍</span>
          <div>
            <div className="text-sm font-semibold" style={{ color: textPrimary }}>Open to anywhere</div>
            <div className="text-xs" style={{ color: textMuted }}>Apply to jobs in any country</div>
          </div>
        </div>
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: openToAnywhere ? '#6366f1' : border,
            background: openToAnywhere ? '#6366f1' : 'transparent',
          }}
        >
          {openToAnywhere && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
      </motion.div>

      {!openToAnywhere && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search countries…"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-4"
            style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary }}
          />

          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selected.map(code => {
                const country = COUNTRIES.find(c => c.code === code)
                return (
                  <motion.div
                    key={code}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1' }}
                  >
                    {country?.flag} {country?.name}
                    <button onClick={() => toggle(code)} className="cursor-pointer hover:opacity-70">×</button>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Countries grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
            {filtered.map(country => (
              <motion.div
                key={country.code}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(country.code)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all"
                style={{
                  background: selected.includes(country.code) ? 'rgba(99,102,241,0.1)' : cardBg,
                  border: selected.includes(country.code) ? '1px solid #6366f1' : `1px solid ${border}`,
                }}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="text-xs font-medium truncate" style={{ color: selected.includes(country.code) ? '#6366f1' : textPrimary }}>
                  {country.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Selected count */}
      {selected.length > 0 && (
        <div className="text-sm mt-4" style={{ color: textMuted }}>
          <span style={{ color: '#6366f1', fontWeight: 600 }}>{selected.length}</span> {selected.length === 1 ? 'country' : 'countries'} selected
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer"
          style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}
        >
          ← Back
        </button>
        <button
          onClick={() => onNext({ countries: { selected, openToAnywhere } })}
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