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
  isRevisit?: boolean
}

const workTypes = [
  {
    id: 'REMOTE',
    label: 'Remote',
    desc: 'Work from anywhere',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'ONSITE',
    label: 'On-site',
    desc: 'Work from office',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="12"/>
        <path d="M8 12h8"/>
      </svg>
    ),
  },
  {
    id: 'HYBRID',
    label: 'Hybrid',
    desc: 'Mix of both',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
]

const employmentTypes = [
  {
    id: 'FULL_TIME',
    label: 'Full-time',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    id: 'PART_TIME',
    label: 'Part-time',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 8 14"/>
      </svg>
    ),
  },
  {
    id: 'CONTRACT',
    label: 'Contract',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'FREELANCE',
    label: 'Freelance',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    id: 'INTERNSHIP',
    label: 'Internship',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    id: 'SUMMER_JOB',
    label: 'Summer job',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
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
    id: 'APPRENTICESHIP',
    label: 'Apprenticeship',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
]

const companySizes = [
  { id: 'STARTUP',  label: 'Startup',   desc: '1–50 employees' },
  { id: 'MIDSIZE',  label: 'Mid-size',  desc: '50–500 employees' },
  { id: 'LARGE',    label: 'Large',     desc: '500+ employees' },
  { id: 'ANY',      label: 'Any size',  desc: 'No preference' },
]

export default function Step8WorkPrefs({ onNext, onBack, data, dark, textPrimary, textMuted, border, isRevisit }: Props) {
  const saved = data?.workPrefs || {}
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>(saved.workTypes || [])
  const [selectedEmpTypes, setSelectedEmpTypes] = useState<string[]>(saved.employmentTypes || [])
  const [selectedSize, setSelectedSize] = useState(saved.companySize || '')

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'

  const toggle = (list: string[], setList: (v: string[]) => void, id: string) => {
    if (list.includes(id)) setList(list.filter(i => i !== id))
    else setList([...list, id])
  }

  const valid = selectedWorkTypes.length > 0 && selectedEmpTypes.length > 0

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
          Step 8 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>Work preferences</h1>
        <p className="text-base" style={{ color: textMuted }}>
          Tell us what kind of work environment you're looking for.
        </p>
      </motion.div>

      <div className="space-y-6 mb-8">

        {/* Work type */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Work Type <span style={{ color: textMuted, fontWeight: 400 }}>(select all that apply)</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {workTypes.map(w => {
              const isSelected = selectedWorkTypes.includes(w.id)
              return (
                <motion.div
                  key={w.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggle(selectedWorkTypes, setSelectedWorkTypes, w.id)}
                  className="rounded-2xl p-4 cursor-pointer text-center transition-all flex flex-col items-center"
                  style={{
                    background: isSelected ? 'rgba(99,102,241,0.1)' : cardBg,
                    border: isSelected ? '2px solid #6366f1' : `1px solid ${border}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                    style={{
                      background: isSelected ? 'rgba(99,102,241,0.2)' : dark ? 'rgba(255,255,255,0.05)' : '#ebebff',
                      color: isSelected ? '#6366f1' : textMuted,
                    }}
                  >
                    {w.icon}
                  </div>
                  <div className="text-sm font-semibold" style={{ color: textPrimary }}>{w.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: textMuted }}>{w.desc}</div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Employment type */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Employment Type <span style={{ color: textMuted, fontWeight: 400 }}>(select all that apply)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {employmentTypes.map(e => {
              const isSelected = selectedEmpTypes.includes(e.id)
              return (
                <motion.button
                  key={e.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggle(selectedEmpTypes, setSelectedEmpTypes, e.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
                  style={{
                    background: isSelected ? 'rgba(99,102,241,0.1)' : cardBg,
                    border: isSelected ? '2px solid #6366f1' : `1px solid ${border}`,
                    color: isSelected ? '#6366f1' : textMuted,
                  }}
                >
                  <span style={{ color: isSelected ? '#6366f1' : textMuted }}>{e.icon}</span>
                  {e.label}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Company size */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Company Size <span style={{ color: textMuted, fontWeight: 400 }}>(optional)</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {companySizes.map(s => {
              const isSelected = selectedSize === s.id
              return (
                <motion.div
                  key={s.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedSize(s.id)}
                  className="rounded-xl p-4 cursor-pointer transition-all flex items-center justify-between"
                  style={{
                    background: isSelected ? 'rgba(99,102,241,0.1)' : cardBg,
                    border: isSelected ? '2px solid #6366f1' : `1px solid ${border}`,
                  }}
                >
                  <div>
                    <div className="text-sm font-semibold" style={{ color: textPrimary }}>{s.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: textMuted }}>{s.desc}</div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: isSelected ? '#6366f1' : border,
                      background: isSelected ? '#6366f1' : 'transparent',
                    }}
                  >
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
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
          onClick={() => isRevisit ? onNext() : onNext({ workPrefs: { workTypes: selectedWorkTypes, employmentTypes: selectedEmpTypes, companySize: selectedSize } })}
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