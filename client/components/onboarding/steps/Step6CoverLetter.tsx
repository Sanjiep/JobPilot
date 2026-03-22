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
  isRevisit?: boolean
}

const options = [
  {
    id: 'manual',
    title: 'Write my own',
    description: 'Write your cover letter in the editor below',
    color: '#6366f1',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  {
    id: 'ai',
    title: 'Generate with AI',
    description: 'AI writes a professional cover letter from your CV data',
    color: '#a78bfa',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-brain-circuit-icon lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>
    ),
  },
  {
    id: 'per_job',
    title: 'Generate per job',
    description: 'AI writes a unique cover letter for each job application',
    color: '#34d399',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
]

export default function Step6CoverLetter({ onNext, onBack, data, dark, textPrimary, textMuted, border, isRevisit }: Props) {
  const saved = data?.coverLetterSource
  const [selected, setSelected] = useState<string | null>(saved || null)
  const [content, setContent] = useState(data?.coverLetter || '')
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
      setContent(
        `Dear Hiring Manager,\n\nI am writing to express my interest in joining your team. With my background in ${data?.technical?.[0]?.name || 'technology'} and proven experience in delivering results, I am confident in my ability to contribute meaningfully to your organization.\n\nI look forward to discussing how my skills align with your needs.\n\nBest regards,\n${data?.personal?.firstName || 'Your Name'}`
      )
    } finally {
      setGenerating(false)
    }
  }

  const handleContinue = () => {
    if (isRevisit) { onNext(); return }
    if (selected === 'ai' && !content) {
      generateWithAI().then(() =>
        onNext({ coverLetter: content, coverLetterSource: selected })
      )
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
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>Cover letter</h1>
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
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${opt.color}15`, color: opt.color }}
            >
              {opt.icon}
            </div>

            {/* Text */}
            <div className="flex-1">
              <div className="text-base font-semibold mb-0.5" style={{ color: textPrimary }}>
                {opt.title}
              </div>
              <div className="text-sm" style={{ color: textMuted }}>
                {opt.description}
              </div>
            </div>

            {/* Radio */}
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                borderColor: selected === opt.id ? opt.color : border,
                background: selected === opt.id ? opt.color : 'transparent',
              }}
            >
              {selected === opt.id && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Editor for manual / ai */}
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
              className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer mb-3 transition-all flex items-center justify-center gap-2"
              style={{
                background: 'rgba(167,139,250,0.1)',
                border: '1px solid rgba(167,139,250,0.3)',
                color: '#a78bfa',
              }}
            >
              {generating ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Generate with AI
                </>
              )}
            </button>
          )}
          <textarea
            rows={10}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={'Dear Hiring Manager,\n\nI am writing to express my interest in…'}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
            style={{
              background: inputBg,
              border: `1px solid ${border}`,
              color: textPrimary,
              lineHeight: '1.7',
            }}
          />
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!isRevisit && (!selected || generating)}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: (isRevisit || selected) ? '#6366f1' : border,
            color: (isRevisit || selected) ? '#ffffff' : textMuted,
            opacity: generating ? 0.7 : 1,
          }}
        >
          {generating ? 'Generating…' : isRevisit ? 'Next →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}