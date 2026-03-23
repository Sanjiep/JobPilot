'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { useAuthStore } from '@/lib/store'

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

const modes = [
  {
    id: 'FULL',
    title: 'Full Autopilot',
    desc: 'AI applies automatically based on your preferences. You get a daily summary of what was submitted.',
    badge: 'Recommended',
    badgeColor: '#34d399',
    color: '#6366f1',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot-icon lucide-bot"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
    ),
    features: ['Applies automatically every day', 'Daily email summary', 'Best for high volume'],
  },
  {
    id: 'REVIEW',
    title: 'Review Before Apply',
    desc: 'AI fills everything, you approve each application before it is submitted.',
    badge: 'Most popular',
    badgeColor: '#6366f1',
    color: '#a78bfa',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    features: ['AI fills all fields', 'You confirm before submit', 'Best for quality over quantity'],
  },
  {
    id: 'MANUAL',
    title: 'Manual Apply',
    desc: 'AI fills the forms, but you click submit yourself every time. Full control.',
    badge: 'Max control',
    badgeColor: '#f59e0b',
    color: '#38bdf8',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
      </svg>
    ),
    features: ['AI assists with filling', 'You submit manually', 'Best for careful applicants'],
  },
]

export default function Step13Automation({ onNext, onBack, data, dark, textPrimary, textMuted, border, isRevisit }: Props) {
  const saved = data?.automation || {}
  const [selected, setSelected] = useState(saved.mode || 'REVIEW')
  const [saving, setSaving] = useState(false)
  const { updateUser } = useAuthStore()

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'

  const handleFinish = async () => {
  setSaving(true)
  try {
    await api.post('/api/onboarding/complete', {
      personal:          data.personal,
      education:         data.education,
      experience:        data.experience,
      technical:         data.technical,
      soft:              data.soft,
      languages:         data.languages,
      certifications:    data.certifications,
      coverLetter:       data.coverLetter,
      coverLetterSource: data.coverLetterSource,
      situation:         data.situation,
      workPrefs:         data.workPrefs,
      countries:         data.countries,
      jobPrefs:          data.jobPrefs,
      frequency:         data.frequency,
      automation:        { mode: selected },
    })
    updateUser({ onboardingCompleted: true })
    onNext({ automation: { mode: selected } })
  } catch (err) {
    console.error('Failed to save onboarding', err)
    // Still navigate to dashboard even if save fails
    onNext({ automation: { mode: selected } })
  } finally {
    setSaving(false)
  }
}

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
          Step 13 of 13 — Final Step!
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>
          Choose your automation level
        </h1>
        <p className="text-base" style={{ color: textMuted }}>
          How should JobPilot handle applications? You can change this anytime in settings.
        </p>
      </motion.div>

      {/* Mode cards */}
      <motion.div
        className="space-y-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {modes.map(mode => {
          const isSelected = selected === mode.id
          return (
            <motion.div
              key={mode.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelected(mode.id)}
              className="rounded-2xl p-6 cursor-pointer transition-all"
              style={{
                background: isSelected ? `${mode.color}10` : cardBg,
                border: isSelected ? `2px solid ${mode.color}` : `1px solid ${border}`,
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isSelected ? `${mode.color}20` : dark ? 'rgba(255,255,255,0.05)' : '#ebebff',
                    color: isSelected ? mode.color : textMuted,
                  }}
                >
                  {mode.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="text-base font-bold" style={{ color: textPrimary }}>
                      {mode.title}
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${mode.badgeColor}15`, color: mode.badgeColor }}
                    >
                      {mode.badge}
                    </span>
                  </div>
                  <div className="text-sm mb-3" style={{ color: textMuted }}>{mode.desc}</div>
                  <div className="flex flex-wrap gap-3">
                    {mode.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: textMuted }}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: mode.color }}/>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radio */}
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1"
                  style={{
                    borderColor: isSelected ? mode.color : border,
                    background: isSelected ? mode.color : 'transparent',
                  }}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Final note */}
      <div
        className="rounded-xl px-4 py-3 mb-6 flex items-center gap-3 text-sm"
        style={{ background: dark ? 'rgba(255,255,255,0.03)' : '#f5f5ff', border: `1px solid ${border}` }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: textMuted, flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span style={{ color: textMuted }}>
          You can change your automation mode anytime from your dashboard settings.
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}>
          ← Back
        </button>
        <motion.button
          onClick={isRevisit ? () => onNext() : handleFinish}
          disabled={saving}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all flex items-center justify-center gap-2"
          style={{ background: '#6366f1', color: '#ffffff', opacity: saving ? 0.7 : 1 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {saving ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Setting up…
            </>
          ) : isRevisit ? 'Next →' : (
            <>
              Complete Setup
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}