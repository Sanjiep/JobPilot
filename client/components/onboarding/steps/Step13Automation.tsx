'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
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
}

const modes = [
  {
    id: 'FULL',
    title: 'Full Autopilot',
    desc: 'AI applies automatically based on your preferences. You get a daily summary of what was submitted.',
    badge: 'Recommended for active seekers',
    badgeColor: '#34d399',
    icon: '🤖',
    color: '#6366f1',
    features: ['Applies automatically every day', 'Daily email summary', 'Best for high volume'],
  },
  {
    id: 'REVIEW',
    title: 'Review Before Apply',
    desc: 'AI fills everything, you approve each application before it is submitted.',
    badge: 'Most popular',
    badgeColor: '#6366f1',
    icon: '👀',
    color: '#a78bfa',
    features: ['AI fills all fields', 'You confirm before submit', 'Best for quality over quantity'],
  },
  {
    id: 'MANUAL',
    title: 'Manual Apply',
    desc: 'AI fills the forms, but you click submit yourself every time. Full control.',
    badge: 'Maximum control',
    badgeColor: '#f59e0b',
    icon: '✋',
    color: '#38bdf8',
    features: ['AI assists with filling', 'You submit manually', 'Best for careful applicants'],
  },
]

export default function Step13Automation({ onNext, onBack, data, dark, textPrimary, textMuted, border }: Props) {
  const [selected, setSelected] = useState('REVIEW')
  const [saving, setSaving] = useState(false)
  const { updateUser } = useAuthStore()
  const router = useRouter()

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'

  const handleFinish = async () => {
    setSaving(true)
    try {
      await api.put('/api/automation', { mode: selected })
      await api.put('/api/profile', {
        ...data.personal,
        onboardingCompleted: true,
      })
      updateUser({ onboardingCompleted: true })
      onNext({ automation: { mode: selected } })
    } catch {
      onNext({ automation: { mode: selected } })
    } finally {
      setSaving(false)
    }
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
        {modes.map(mode => (
          <motion.div
            key={mode.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelected(mode.id)}
            className="rounded-2xl p-6 cursor-pointer transition-all"
            style={{
              background: selected === mode.id ? `${mode.color}10` : cardBg,
              border: selected === mode.id ? `2px solid ${mode.color}` : `1px solid ${border}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${mode.color}15` }}
              >
                {mode.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
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
                <div className="flex flex-wrap gap-2">
                  {mode.features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: textMuted }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: mode.color }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1"
                style={{
                  borderColor: selected === mode.id ? mode.color : border,
                  background: selected === mode.id ? mode.color : 'transparent',
                }}
              >
                {selected === mode.id && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer"
          style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}
        >
          ← Back
        </button>
        <motion.button
          onClick={handleFinish}
          disabled={saving}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: '#6366f1', color: '#ffffff', opacity: saving ? 0.7 : 1 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {saving ? 'Setting up…' : '🚀 Complete Setup → Go to Dashboard'}
        </motion.button>
      </div>
    </div>
  )
}