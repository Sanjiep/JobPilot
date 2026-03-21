'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useThemeStore } from '@/lib/store'

const cyclingRoles = [
  { text: 'Software Engineer', color: '#6366f1' },
  { text: 'Product Designer', color: '#a78bfa' },
  { text: 'Data Scientist', color: '#38bdf8' },
  { text: 'Marketing Manager', color: '#34d399' },
  { text: 'DevOps Engineer', color: '#f59e0b' },
]

export default function Hero() {
  const { dark } = useThemeStore()
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % cyclingRoles.length)
        setVisible(true)
      }, 400)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const textPrimary = dark ? '#ffffff' : '#0a0a14'
  const textMuted = dark ? '#9090b0' : '#4a4a6a'
  const border = dark ? '#1e1e32' : '#e2e4f0'
  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden"
      style={{ background: dark ? '#070711' : '#ffffff' }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#6366f1' }} />
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: '#a78bfa' }} />
        <div className="absolute top-[50%] left-[50%] w-64 h-64 rounded-full blur-3xl opacity-5"
          style={{ background: '#38bdf8' }} />
      </div>

      {/* Badge */}
      <div
        className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
        style={{
          background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.3)',
          color: '#6366f1',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        AI-Powered Job Application Automation
      </div>

      {/* Headline */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1
          className="text-5xl md:text-7xl font-bold leading-tight mb-4"
          style={{ color: textPrimary }}
        >
          Auto-apply to jobs as
        </h1>
        <div className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          style={{
            color: cyclingRoles[wordIndex].color,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-16px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {cyclingRoles[wordIndex].text}
        </div>
        <p
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: textMuted }}
        >
          Upload your CV once. JobPilot's AI fills every application form,
          writes tailored cover letters, and submits on your behalf —
          while you focus on interview prep.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register"
            className="px-8 py-4 rounded-xl font-semibold text-base transition-all cursor-pointer w-full sm:w-auto text-center"
            style={{
              background: '#6366f1',
              color: '#ffffff',
              boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
            }}
          >
            Start for free — no credit card
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-4 rounded-xl font-semibold text-base transition-all cursor-pointer w-full sm:w-auto text-center"
            style={{
              background: 'transparent',
              border: `1px solid ${border}`,
              color: textPrimary,
            }}
          >
            See how it works →
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <div className="flex -space-x-2">
            {['#6366f1', '#a78bfa', '#38bdf8', '#34d399', '#f59e0b'].map((c, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                style={{
                  background: c,
                  borderColor: dark ? '#070711' : '#ffffff',
                }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="text-sm" style={{ color: textMuted }}>
            <span className="font-semibold" style={{ color: textPrimary }}>10,000+</span>
            {' '}job seekers already using JobPilot
          </div>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto rounded-2xl p-6"
          style={{ background: cardBg, border: `1px solid ${border}` }}
        >
          {[
            { value: '10x', label: 'Faster applying' },
            { value: '500+', label: 'Job boards' },
            { value: '92%', label: 'ATS pass rate' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#6366f1' }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}