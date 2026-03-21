'use client'

import { useThemeStore } from '@/lib/store'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const steps = [
  {
    number: '01',
    title: 'Upload your CV',
    description: 'Upload your CV or resume. Our AI instantly extracts all your details — experience, skills, education, and more.',
    color: '#6366f1',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Set your preferences',
    description: 'Tell us what jobs you want, which countries to target, your salary expectations, and how many applications to send daily.',
    color: '#a78bfa',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'AI applies for you',
    description: 'JobPilot searches for matching jobs, fills every application form, writes tailored cover letters, and submits automatically.',
    color: '#38bdf8',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Track & get hired',
    description: 'Monitor all your applications in one dashboard. Get notified when companies reply and track your interview pipeline.',
    color: '#34d399',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
]

// Separate component so hooks are called at top level
function StepCard({ step, index, border, cardBg, textPrimary, textMuted }: any) {
  const { ref, visible } = useScrollAnimation()
  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div
        className="relative rounded-2xl p-6 h-full"
        style={{ background: cardBg, border: `1px solid ${border}` }}
      >
        <div className="text-xs font-bold mb-4" style={{ color: step.color }}>
          {step.number}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: `${step.color}15`, color: step.color }}
        >
          {step.icon}
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ color: textPrimary }}>
          {step.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
          {step.description}
        </p>
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const { dark } = useThemeStore()
  const { ref: headerRef, visible: headerVisible } = useScrollAnimation()

  const textPrimary = dark ? '#ffffff' : '#0a0a14'
  const textMuted = dark ? '#9090b0' : '#4a4a6a'
  const border = dark ? '#1e1e32' : '#e2e4f0'
  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'

  return (
    <section
      id="how-it-works"
      className="py-24 px-6"
      style={{ background: dark ? '#070711' : '#ffffff' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 animate-on-scroll ${headerVisible ? 'visible' : ''}`}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4"
            style={{
              background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#6366f1',
            }}
          >
            How it works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: textPrimary }}>
            From CV to interviews in 4 steps
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: textMuted }}>
            JobPilot handles the entire application process so you can focus on preparing for interviews.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <StepCard
              key={i}
              step={step}
              index={i}
              border={border}
              cardBg={cardBg}
              textPrimary={textPrimary}
              textMuted={textMuted}
            />
          ))}
        </div>
      </div>
    </section>
  )
}