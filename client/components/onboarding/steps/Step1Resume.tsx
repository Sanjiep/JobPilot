'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    title: 'Build Manually',
    description: 'Fill in your details step by step',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    color: '#6366f1',
  },
  {
    id: 'ai',
    title: 'Generate with AI',
    description: 'Answer a few questions, AI builds your CV',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    color: '#a78bfa',
  },
  {
    id: 'linkedin',
    title: 'Import from LinkedIn',
    description: 'Paste your LinkedIn URL to extract data',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    color: '#0077b5',
  },
  {
    id: 'upload',
    title: 'Upload CV File',
    description: 'PDF, DOCX or image — AI extracts everything',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
    color: '#34d399',
  },
]

export default function Step1Resume({ onNext, dark, data, textPrimary, textMuted, border, isRevisit }: Props) {
  // Restore previous selection from saved data
  const previousSource = data?.resumeSource
  const previousFileName = data?.cvFileName

  const [selected, setSelected] = useState<string | null>(previousSource || null)
  const [linkedinUrl, setLinkedinUrl] = useState(data?.linkedinUrl || '')
  const [file, setFile] = useState<File | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState('')
  const [reUpload, setReUpload] = useState(false) // user wants to re-upload

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff'

  // If revisiting and already has a source — show summary unless they want to change
  const showSummary = isRevisit && previousSource && !reUpload

  const handleContinue = async () => {
    if (!selected) return

    if (selected === 'manual' || selected === 'ai') {
      onNext({ resumeSource: selected })
      return
    }

    if (selected === 'linkedin') {
      if (!linkedinUrl.trim()) {
        setError('Please enter your LinkedIn URL')
        return
      }
      setExtracting(true)
      try {
        const res = await api.post('/api/ai/extract-cv', { linkedinUrl })
        onNext({ resumeSource: 'linkedin', linkedinUrl, extractedData: res.data.data })
      } catch {
        setError('Could not extract LinkedIn data. Continue manually.')
        onNext({ resumeSource: 'linkedin', linkedinUrl })
      } finally {
        setExtracting(false)
      }
      return
    }

    if (selected === 'upload') {
      if (!file) {
        setError('Please select a file')
        return
      }
      setExtracting(true)
      try {
        const formData = new FormData()
        formData.append('cv', file)
        const res = await api.post('/api/resume/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        onNext({
          resumeSource: 'upload',
          cvFileName: file.name,
          extractedData: res.data.data,
        })
      } catch {
        setError('Could not parse file. Continue manually.')
        onNext({ resumeSource: 'upload', cvFileName: file.name })
      } finally {
        setExtracting(false)
      }
    }
  }

  const sourceLabel: Record<string, string> = {
    manual: 'Built Manually',
    ai: 'Generated with AI',
    linkedin: 'Imported from LinkedIn',
    upload: 'Uploaded CV File',
  }

  const sourceColor: Record<string, string> = {
    manual: '#6366f1',
    ai: '#a78bfa',
    linkedin: '#0077b5',
    upload: '#34d399',
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1' }}
        >
          Step 1 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>
          Set up your resume
        </h1>
        <p className="text-base" style={{ color: textMuted }}>
          How would you like to add your professional information?
        </p>
      </motion.div>

      {/* Already completed summary */}
      <AnimatePresence mode="wait">
        {showSummary ? (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {/* Success card */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{
                background: `${sourceColor[previousSource]}10`,
                border: `1px solid ${sourceColor[previousSource]}30`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#34d39920', border: '1px solid #34d39940' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: textPrimary }}>
                    Resume already set up
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: textMuted }}>
                    Method: {sourceLabel[previousSource] ?? previousSource}
                  </div>
                </div>
              </div>

              {/* Show filename if uploaded */}
              {previousSource === 'upload' && previousFileName && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                  style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#ffffff', color: textPrimary }}
                >
                  <span>📄</span>
                  <span className="flex-1 truncate">{previousFileName}</span>
                </div>
              )}

              {/* Show linkedin url if linkedin */}
              {previousSource === 'linkedin' && data?.linkedinUrl && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                  style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#ffffff', color: textPrimary }}
                >
                  <span>🔗</span>
                  <span className="flex-1 truncate">{data.linkedinUrl}</span>
                </div>
              )}

              {/* Show extraction status */}
              {data?.extractedData && (
                <div className="mt-2 text-xs flex items-center gap-1.5" style={{ color: '#34d399' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Data extracted and saved to your profile
                </div>
              )}
            </div>

            {/* Re-upload option */}
            <button
              type="button"
              onClick={() => setReUpload(true)}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{
                background: 'transparent',
                border: `1px solid ${border}`,
                color: textMuted,
              }}
              onMouseEnter={e => e.currentTarget.style.color = textPrimary}
              onMouseLeave={e => e.currentTarget.style.color = textMuted}
            >
              Change / Re-upload CV
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Re-upload back button */}
            {reUpload && (
              <button
                type="button"
                onClick={() => setReUpload(false)}
                className="flex items-center gap-1.5 text-sm mb-4 cursor-pointer transition-all"
                style={{ color: textMuted }}
                onMouseEnter={e => e.currentTarget.style.color = textPrimary}
                onMouseLeave={e => e.currentTarget.style.color = textMuted}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Keep existing
              </button>
            )}

            {/* Options grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {options.map(opt => (
                <motion.div
                  key={opt.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelected(opt.id); setError('') }}
                  className="rounded-2xl p-5 cursor-pointer transition-all"
                  style={{
                    background: selected === opt.id ? `${opt.color}10` : cardBg,
                    border: selected === opt.id ? `2px solid ${opt.color}` : `1px solid ${border}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${opt.color}15`, color: opt.color }}
                  >
                    {opt.icon}
                  </div>
                  <div className="text-base font-semibold mb-1" style={{ color: textPrimary }}>
                    {opt.title}
                  </div>
                  <div className="text-sm" style={{ color: textMuted }}>
                    {opt.description}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* LinkedIn input */}
            {selected === 'linkedin' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <label className="block text-sm font-medium mb-2" style={{ color: textMuted }}>
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary }}
                />
              </motion.div>
            )}

            {/* File upload */}
            {selected === 'upload' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <label
                  className="flex flex-col items-center justify-center w-full h-32 rounded-xl cursor-pointer transition-all"
                  style={{ background: inputBg, border: `2px dashed ${border}` }}
                >
                  <input
                    type="file"
                    accept=".pdf,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? (
                    <div className="text-center">
                      <div className="text-2xl mb-1">📄</div>
                      <div className="text-sm font-medium" style={{ color: textPrimary }}>{file.name}</div>
                      <div className="text-xs" style={{ color: textMuted }}>Click to change</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl mb-1">📎</div>
                      <div className="text-sm font-medium" style={{ color: textPrimary }}>
                        Drop your CV here or click to browse
                      </div>
                      <div className="text-xs mt-1" style={{ color: textMuted }}>PDF, DOCX, PNG, JPG</div>
                    </div>
                  )}
                </label>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 mb-4 text-sm"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}
              >
                {error}
              </div>
            )}

            {/* Continue button */}
            <motion.button
              onClick={handleContinue}
              disabled={!selected || extracting}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
              style={{
                background: selected ? '#6366f1' : border,
                color: selected ? '#ffffff' : textMuted,
                opacity: extracting ? 0.7 : 1,
              }}
              whileHover={selected ? { scale: 1.01 } : {}}
              whileTap={selected ? { scale: 0.99 } : {}}
            >
              {extracting ? 'Extracting your data…' : 'Continue →'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next button when showing summary */}
      {showSummary && (
        <motion.button
          onClick={() => onNext()}
          className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer mt-2"
          style={{ background: '#6366f1', color: '#ffffff' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Next →
        </motion.button>
      )}
    </div>
  )
}