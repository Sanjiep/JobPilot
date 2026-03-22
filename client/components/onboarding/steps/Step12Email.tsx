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

export default function Step12Email({ onNext, onBack, dark, textPrimary, textMuted, border }: Props) {
  const [connected, setConnected] = useState<string | null>(null)
  const [skipped, setSkipped] = useState(false)

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'

  const providers = [
    {
      id: 'gmail',
      name: 'Gmail',
      desc: 'Connect your Google account',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
          <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
          <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
          <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
        </svg>
      ),
    },
    {
      id: 'outlook',
      name: 'Outlook',
      desc: 'Connect your Microsoft account',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#0078D4">
          <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12zm-7.33-4.17v-.92q0-.19-.13-.32-.12-.13-.32-.13h-1.93q-.19 0-.32.13-.13.13-.13.32v.92q0 .19.13.32.13.13.32.13h1.93q.2 0 .32-.13.13-.13.13-.32zm0 2.76v-.92q0-.19-.13-.32-.12-.13-.32-.13h-1.93q-.19 0-.32.13-.13.13-.13.32v.92q0 .19.13.32.13.13.32.13h1.93q.2 0 .32-.13.13-.13.13-.32zm0 2.77v-.92q0-.2-.13-.33-.12-.12-.32-.12h-1.93q-.19 0-.32.12-.13.13-.13.33v.92q0 .19.13.32.13.13.32.13h1.93q.2 0 .32-.13.13-.13.13-.32zm2.98-5.53v-.92q0-.19-.13-.32-.13-.13-.32-.13H17.27q-.19 0-.32.13-.13.13-.13.32v.92q0 .19.13.32.13.13.32.13h1.93q.19 0 .32-.13.13-.13.13-.32zm0 2.76v-.92q0-.19-.13-.32-.13-.13-.32-.13H17.27q-.19 0-.32.13-.13.13-.13.32v.92q0 .19.13.32.13.13.32.13h1.93q.19 0 .32-.13.13-.13.13-.32zm0 2.77v-.92q0-.2-.13-.33-.13-.12-.32-.12H17.27q-.19 0-.32.12-.13.13-.13.33v.92q0 .19.13.32.13.13.32.13h1.93q.19 0 .32-.13.13-.13.13-.32zM9.3 17.37l4.7-1.76V7.43L9.3 9.19v8.18zm12.7.63v-6h-2v4.38l-10-3.7v8.32h12z"/>
        </svg>
      ),
    },
  ]

  const benefits = [
    '📬 Detect interview invitations automatically',
    '📊 Track application replies in your dashboard',
    '🔔 Get notified when companies respond',
    '✉️ Send follow-up emails on your behalf',
  ]

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
        style={{ background: dark ? '#0e0e1a' : '#f5f5ff', border: `1px solid ${border}` }}
      >
        <div className="text-sm font-bold mb-3" style={{ color: textPrimary }}>
          Why connect your email?
        </div>
        <div className="space-y-2">
          {benefits.map((b, i) => (
            <div key={i} className="text-sm" style={{ color: textMuted }}>{b}</div>
          ))}
        </div>
      </motion.div>

      {/* Connected state */}
      {connected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(52,211,153,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: '#34d399' }}>
              {connected === 'gmail' ? 'Gmail' : 'Outlook'} connected!
            </div>
            <div className="text-xs" style={{ color: textMuted }}>
              JobPilot will monitor your inbox for replies
            </div>
          </div>
          <button
            onClick={() => setConnected(null)}
            className="ml-auto text-xs cursor-pointer"
            style={{ color: textMuted }}
          >
            Disconnect
          </button>
        </motion.div>
      )}

      {/* Provider buttons */}
      {!connected && (
        <motion.div
          className="space-y-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {providers.map(p => (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setConnected(p.id)}
              className="w-full flex items-center gap-4 rounded-2xl p-4 cursor-pointer transition-all"
              style={{ background: cardBg, border: `1px solid ${border}` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: dark ? 'rgba(255,255,255,0.05)' : '#ffffff' }}>
                {p.icon}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold" style={{ color: textPrimary }}>
                  Connect {p.name}
                </div>
                <div className="text-xs" style={{ color: textMuted }}>{p.desc}</div>
              </div>
              <svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" style={{ color: textMuted }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Skip */}
      {!connected && (
        <button
          onClick={() => setSkipped(true)}
          className="w-full py-3 rounded-xl text-sm font-medium cursor-pointer mb-6 transition-all"
          style={{
            background: 'transparent',
            border: `1px dashed ${border}`,
            color: textMuted,
          }}
        >
          Skip for now — I'll connect later
        </button>
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
          onClick={() => onNext({ email: { connected, skipped } })}
          disabled={!connected && !skipped}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: (connected || skipped) ? '#6366f1' : border,
            color: (connected || skipped) ? '#ffffff' : textMuted,
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}