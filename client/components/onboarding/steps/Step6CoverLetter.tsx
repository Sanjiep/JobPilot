'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api'

interface Props {
  onNext: (data?: Record<string, any>) => void
  onBack: () => void
  data: Record<string, any>
  dark: boolean
  textPrimary: string
  textMuted: string
  border: string
}

const options = [
  {
    id: 'manual',
    title: 'Write my own',
    description: 'Write your cover letter in the editor below',
    icon: '✍️',
    color: '#6366f1',
  },
  {
    id: 'ai',
    title: 'Generate with AI',
    description: 'AI writes a professional cover letter from your CV data',
    icon: '🤖',
    color: '#a78bfa',
  },
  {
    id: 'per_job',
    title: 'Generate per job',
    description: 'AI writes a unique cover letter for each job application',
    icon: '🎯',
    color: '#34d399',
  },
]

export default function Step6CoverLetter({ onNext, onBack, data, dark, textPrimary, textMuted, border }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [generating, setGenerating] = useState(false)

  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff'
  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'

  const generateWithAI = async () => {
    setGenerating(true)
    try {
      const res = await api.post('/api/ai/cover-letter', {
        profile: data?.personal || {},
        experience: data?.experience || [],
        skills: data?.technical || [],
      })
      setContent(res.data.data?.coverLetter || '')
    } catch {
      setContent(`Dear Hiring Manager,\n\nI am writing to express my interest in joining your team. With my background in ${data?.technical?.[0]?.name || 'technology'} and proven experience in delivering results, I am confident in my ability to contribute meaningfully to your organization.\n\nI look forward to discussing how my skills align with your needs.\n\nBest regards,\n${data?.personal?.firstName || 'Your Name'}`)
    } finally {
      setGenerating(false)
    }
  }

  const handleContinue = () => {
    if (selected === 'ai' && !content) {
      generateWithAI().then(() => onNext({ coverLetter: content, coverLetterSource: selected }))
      return
    }
    onNext({ coverLetter: content, coverLetterSource: selected || 'per_job' })
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
          Step 6 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>
          Cover letter
        </h1>
        <p className="text-base" style={{ color: textMuted }}>
          How would you like to handle cover letters for your applications?
        </p>
      </motion.div>

      {/* Options */}
      <motion.div
        className="grid grid-cols-1 gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {options.map(opt => (
          <motion.div
            key={opt.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelected(opt.id)}
            className="flex items-center gap-4 rounded-2xl p-5 cursor-pointer transition-all"
            style={{
              background: selected === opt.id ? `${opt.color}10` : cardBg,
              border: selected === opt.id ? `2px solid ${opt.color}` : `1px solid ${border}`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${opt.color}15` }}
            >
              {opt.icon}
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold mb-0.5" style={{ color: textPrimary }}>
                {opt.title}
              </div>
              <div className="text-sm" style={{ color: textMuted }}>
                {opt.description}
              </div>
            </div>
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                borderColor: selected === opt.id ? opt.color : border,
                background: selected === opt.id ? opt.color : 'transparent',
              }}
            >
              {selected === opt.id && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Editor for manual/ai */}
      {(selected === 'manual' || selected === 'ai') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          {selected === 'ai' && (
            <button
              onClick={generateWithAI}
              disabled={generating}
              className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer mb-3 transition-all"
              style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa' }}
            >
              {generating ? '⟳ Generating…' : '✦ Generate with AI'}
            </button>
          )}
          <textarea
            rows={10}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my interest in…"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
            style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary, lineHeight: '1.7' }}
          />
        </motion.div>
      )}

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
          onClick={handleContinue}
          disabled={!selected || generating}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: selected ? '#6366f1' : border,
            color: selected ? '#ffffff' : textMuted,
            opacity: generating ? 0.7 : 1,
          }}
        >
          {generating ? 'Generating…' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}