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

const workTypes = [
  { id: 'REMOTE',  label: 'Remote',  icon: '🏠', desc: 'Work from anywhere' },
  { id: 'ONSITE',  label: 'On-site', icon: '🏢', desc: 'Work from office' },
  { id: 'HYBRID',  label: 'Hybrid',  icon: '🔄', desc: 'Mix of both' },
]

const employmentTypes = [
  { id: 'FULL_TIME',   label: 'Full-time',   icon: '⏰' },
  { id: 'PART_TIME',   label: 'Part-time',   icon: '🕐' },
  { id: 'CONTRACT',    label: 'Contract',    icon: '📝' },
  { id: 'FREELANCE',   label: 'Freelance',   icon: '💻' },
  { id: 'INTERNSHIP',  label: 'Internship',  icon: '🎓' },
]

const companySizes = [
  { id: 'STARTUP',  label: 'Startup',   desc: '1–50 employees' },
  { id: 'MIDSIZE',  label: 'Mid-size',  desc: '50–500 employees' },
  { id: 'LARGE',    label: 'Large',     desc: '500+ employees' },
  { id: 'ANY',      label: 'Any size',  desc: 'No preference' },
]

export default function Step8WorkPrefs({ onNext, onBack, dark, textPrimary, textMuted, border }: Props) {
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([])
  const [selectedEmpTypes, setSelectedEmpTypes] = useState<string[]>([])
  const [selectedSize, setSelectedSize] = useState('')

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'

  const toggle = (list: string[], setList: (v: string[]) => void, id: string) => {
    if (list.includes(id)) setList(list.filter(i => i !== id))
    else setList([...list, id])
  }

  const valid = selectedWorkTypes.length > 0 && selectedEmpTypes.length > 0

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
            {workTypes.map(w => (
              <motion.div
                key={w.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(selectedWorkTypes, setSelectedWorkTypes, w.id)}
                className="rounded-2xl p-4 cursor-pointer text-center transition-all"
                style={{
                  background: selectedWorkTypes.includes(w.id) ? 'rgba(99,102,241,0.1)' : cardBg,
                  border: selectedWorkTypes.includes(w.id) ? '2px solid #6366f1' : `1px solid ${border}`,
                }}
              >
                <div className="text-2xl mb-2">{w.icon}</div>
                <div className="text-sm font-semibold" style={{ color: textPrimary }}>{w.label}</div>
                <div className="text-xs mt-0.5" style={{ color: textMuted }}>{w.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Employment type */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Employment Type <span style={{ color: textMuted, fontWeight: 400 }}>(select all that apply)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {employmentTypes.map(e => (
              <motion.button
                key={e.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(selectedEmpTypes, setSelectedEmpTypes, e.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
                style={{
                  background: selectedEmpTypes.includes(e.id) ? 'rgba(99,102,241,0.1)' : cardBg,
                  border: selectedEmpTypes.includes(e.id) ? '2px solid #6366f1' : `1px solid ${border}`,
                  color: selectedEmpTypes.includes(e.id) ? '#6366f1' : textMuted,
                }}
              >
                <span>{e.icon}</span>
                {e.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Company size */}
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
            Company Size <span style={{ color: textMuted, fontWeight: 400 }}>(optional)</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {companySizes.map(s => (
              <motion.div
                key={s.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedSize(s.id)}
                className="rounded-xl p-4 cursor-pointer transition-all"
                style={{
                  background: selectedSize === s.id ? 'rgba(99,102,241,0.1)' : cardBg,
                  border: selectedSize === s.id ? '2px solid #6366f1' : `1px solid ${border}`,
                }}
              >
                <div className="text-sm font-semibold" style={{ color: textPrimary }}>{s.label}</div>
                <div className="text-xs mt-0.5" style={{ color: textMuted }}>{s.desc}</div>
              </motion.div>
            ))}
          </div>
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
          onClick={() => onNext({ workPrefs: { workTypes: selectedWorkTypes, employmentTypes: selectedEmpTypes, companySize: selectedSize } })}
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