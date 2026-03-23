'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import api from '@/lib/api'

// ... keep all the same props and benefits array ...

export default function Step12Email({ onNext, onBack, data, dark, textPrimary, textMuted, border, isRevisit }: Props) {
  const saved = data?.email || {}
  const [connected, setConnected] = useState<string | null>(saved.connected || null)
  const [connectedEmail, setConnectedEmail] = useState<string>(saved.connectedEmail || '')
  const [skipped, setSkipped] = useState(saved.skipped || false)
  const [connecting, setConnecting] = useState(false)
  const searchParams = useSearchParams()

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'
  const canContinue = connected !== null || skipped

  // Handle OAuth callback — check URL params when returning from Google
  useEffect(() => {
    const emailConnected = searchParams.get('email_connected')
    const email          = searchParams.get('email')
    const emailError     = searchParams.get('email_error')

    if (emailConnected && email) {
      setConnected(emailConnected)
      setConnectedEmail(email)
      // Clean up URL
      window.history.replaceState({}, '', '/onboarding')
    }

    if (emailError) {
      console.error('Email connection error:', emailError)
      window.history.replaceState({}, '', '/onboarding')
    }
  }, [searchParams])

  // Also check DB status on mount
  useEffect(() => {
    if (saved.connected) return // already have it
    api.get('/api/email/status').then(res => {
      if (res.data.data?.connected) {
        setConnected(res.data.data.provider)
        setConnectedEmail(res.data.data.email)
      }
    }).catch(() => {})
  }, [])

  const handleConnect = async (provider: string) => {
    setConnecting(true)
    try {
      if (provider === 'gmail') {
        const res = await api.get('/api/email/google/connect')
        // Redirect to Google OAuth
        window.location.href = res.data.url
      } else if (provider === 'outlook') {
        // Outlook OAuth — coming soon
        alert('Outlook connection coming soon!')
        setConnecting(false)
      }
    } catch (error) {
      console.error('Connect error:', error)
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await api.delete('/api/email/disconnect')
      setConnected(null)
      setConnectedEmail('')
    } catch {}
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
          Step 12 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>Connect your email</h1>
        <p className="text-base" style={{ color: textMuted }}>
          Let JobPilot monitor replies and detect interview invitations.
        </p>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl p-5 mb-6"
        style={{ background: cardBg, border: `1px solid ${border}` }}
      >
        <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
          Why connect your email?
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Detect interview invitations automatically', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
            { label: 'Track application replies in your dashboard', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
            { label: 'Get notified when companies respond', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
            { label: 'Send follow-up emails on your behalf', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                {b.icon}
              </div>
              <span className="text-sm" style={{ color: textMuted }}>{b.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Connected state */}
      <AnimatePresence>
        {connected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl p-4 mb-6 flex items-center gap-3"
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(52,211,153,0.2)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold" style={{ color: '#34d399' }}>
                {connected === 'gmail' ? 'Gmail' : 'Outlook'} connected!
              </div>
              <div className="text-xs mt-0.5" style={{ color: textMuted }}>
                {connectedEmail || 'JobPilot will monitor your inbox for replies'}
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-xs cursor-pointer transition-all px-3 py-1.5 rounded-lg"
              style={{ color: textMuted, background: 'transparent', border: `1px solid ${border}` }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = textMuted}
            >
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Provider buttons */}
      <AnimatePresence>
        {!connected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3 mb-4"
          >
            {/* Gmail */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleConnect('gmail')}
              disabled={connecting}
              className="w-full flex items-center gap-4 rounded-2xl p-4 cursor-pointer transition-all"
              style={{ background: cardBg, border: `1px solid ${border}`, opacity: connecting ? 0.7 : 1 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = border}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#ffffff' }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <div className="text-sm font-semibold" style={{ color: textPrimary }}>
                  {connecting ? 'Connecting...' : 'Connect Gmail'}
                </div>
                <div className="text-xs mt-0.5" style={{ color: textMuted }}>Connect your Google account</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: textMuted, flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </motion.button>

            {/* Outlook */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleConnect('outlook')}
              className="w-full flex items-center gap-4 rounded-2xl p-4 cursor-pointer transition-all"
              style={{ background: cardBg, border: `1px solid ${border}` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = border}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#ffffff' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#0078D4">
                  <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12zm-7.33-4.17v-.92q0-.19-.13-.32-.12-.13-.32-.13h-1.93q-.19 0-.32.13-.13.13-.13.32v.92q0 .19.13.32.13.13.32.13h1.93q.2 0 .32-.13.13-.13.13-.32zm0 2.76v-.92q0-.19-.13-.32-.12-.13-.32-.13h-1.93q-.19 0-.32.13-.13.13-.13.32v.92q0 .19.13.32.13.13.32.13h1.93q.2 0 .32-.13.13-.13.13-.32zm0 2.77v-.92q0-.2-.13-.33-.12-.12-.32-.12h-1.93q-.19 0-.32.12-.13.13-.13.33v.92q0 .19.13.32.13.13.32.13h1.93q.2 0 .32-.13.13-.13.13-.32zm2.98-5.53v-.92q0-.19-.13-.32-.13-.13-.32-.13H17.27q-.19 0-.32.13-.13.13-.13.32v.92q0 .19.13.32.13.13.32.13h1.93q.19 0 .32-.13.13-.13.13-.32zm0 2.76v-.92q0-.19-.13-.32-.13-.13-.32-.13H17.27q-.19 0-.32.13-.13.13-.13.32v.92q0 .19.13.32.13.13.32.13h1.93q.19 0 .32-.13.13-.13.13-.32zm0 2.77v-.92q0-.2-.13-.33-.13-.12-.32-.12H17.27q-.19 0-.32.12-.13.13-.13.33v.92q0 .19.13.32.13.13.32.13h1.93q.19 0 .32-.13.13-.13.13-.32zM9.3 17.37l4.7-1.76V7.43L9.3 9.19v8.18zm12.7.63v-6h-2v4.38l-10-3.7v8.32h12z"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <div className="text-sm font-semibold" style={{ color: textPrimary }}>Connect Outlook</div>
                <div className="text-xs mt-0.5" style={{ color: textMuted }}>Connect your Microsoft account</div>
              </div>
              <div className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                Soon
              </div>
            </motion.button>

            {/* Skip */}
            <button
              onClick={() => { setSkipped(true); setConnected(null) }}
              className="w-full py-3 rounded-xl text-sm font-medium cursor-pointer transition-all"
              style={{ background: 'transparent', border: `1px dashed ${border}`, color: textMuted }}
              onMouseEnter={e => e.currentTarget.style.color = textPrimary}
              onMouseLeave={e => e.currentTarget.style.color = textMuted}
            >
              Skip for now — I'll connect later
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skipped state */}
      <AnimatePresence>
        {skipped && !connected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl p-4 mb-6 flex items-center gap-3"
            style={{ background: dark ? 'rgba(255,255,255,0.03)' : '#f5f5ff', border: `1px solid ${border}` }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#ebebff', color: textMuted }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold" style={{ color: textPrimary }}>Skipped for now</div>
              <div className="text-xs mt-0.5" style={{ color: textMuted }}>
                You can connect your email later from settings
              </div>
            </div>
            <button
              onClick={() => setSkipped(false)}
              className="text-xs cursor-pointer transition-all px-3 py-1.5 rounded-lg"
              style={{ color: '#6366f1', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              Connect now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}>
          ← Back
        </button>
        <button
          onClick={() => isRevisit ? onNext() : onNext({ email: { connected, connectedEmail, skipped } })}
          disabled={!isRevisit && !canContinue}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: (isRevisit || canContinue) ? '#6366f1' : border,
            color:       (isRevisit || canContinue) ? '#ffffff' : textMuted,
          }}
        >
          {isRevisit ? 'Next →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}