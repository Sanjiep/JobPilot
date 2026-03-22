'use client'

import { useState, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onNext: (data?: Record<string, any>) => void
  onBack: () => void
  data: Record<string, any>
  dark: boolean
  textPrimary: string
  textMuted: string
  border: string
}

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
  'Design', 'Sales', 'Engineering', 'Data & AI', 'Consulting',
  'Legal', 'HR', 'Operations', 'Product', 'Research',
]

export default function Step10JobPrefs({ onNext, onBack, dark, textPrimary, textMuted, border }: Props) {
  const [titles, setTitles] = useState<string[]>([])
  const [titleInput, setTitleInput] = useState('')
  const [industries, setIndustries] = useState<string[]>([])
  const [dealBreakers, setDealBreakers] = useState('')

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff'

  const addTitle = () => {
    if (!titleInput.trim() || titles.includes(titleInput.trim())) return
    setTitles([...titles, titleInput.trim()])
    setTitleInput('')
  }

  const toggleIndustry = (ind: string) => {
    if (industries.includes(ind)) setIndustries(industries.filter(i => i !== ind))
    else setIndustries([...industries, ind])
  }

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
          Step 10 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>Job preferences</h1>
        <p className="text-base" style={{ color: textMuted }}>
          Tell us what kind of jobs you're looking for.
        </p>
      </motion.div>

      <div className="space-y-6 mb-8">

        {/* Target job titles */}
        <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Target Job Titles
          </div>
          <div className="flex gap-2 mb-3">
            <input
              value={titleInput}
              onChange={e => setTitleInput(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') addTitle()
              }}
              placeholder="e.g. Frontend Developer"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary }}
            />
            <button
              onClick={addTitle}
              className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              style={{ background: '#6366f1', color: '#ffffff' }}
            >
              Add
            </button>
          </div>
          <AnimatePresence>
            <div className="flex flex-wrap gap-2">
              {titles.map(t => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1' }}
                >
                  {t}
                  <button onClick={() => setTitles(titles.filter(x => x !== t))} className="cursor-pointer">×</button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          {titles.length === 0 && (
            <p className="text-xs" style={{ color: textMuted }}>
              Add job titles you want to apply for (e.g. "React Developer", "UX Designer")
            </p>
          )}
        </div>

        {/* Industries */}
        <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Industries <span style={{ color: textMuted, fontWeight: 400 }}>(select all that apply)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map(ind => (
              <motion.button
                key={ind}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleIndustry(ind)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all"
                style={{
                  background: industries.includes(ind) ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: industries.includes(ind) ? '1px solid #6366f1' : `1px solid ${border}`,
                  color: industries.includes(ind) ? '#6366f1' : textMuted,
                }}
              >
                {ind}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Deal breakers */}
        <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="text-sm font-bold mb-1" style={{ color: textPrimary }}>
            Deal Breakers <span style={{ color: textMuted, fontWeight: 400 }}>(optional)</span>
          </div>
          <div className="text-xs mb-3" style={{ color: textMuted }}>
            Things you want to avoid (e.g. "no unpaid overtime", "no travel required")
          </div>
          <textarea
            rows={3}
            value={dealBreakers}
            onChange={e => setDealBreakers(e.target.value)}
            placeholder="No relocation required, no night shifts…"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
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
          onClick={() => onNext({ jobPrefs: { titles, industries, dealBreakers } })}
          disabled={titles.length === 0}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: titles.length > 0 ? '#6366f1' : border,
            color: titles.length > 0 ? '#ffffff' : textMuted,
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}