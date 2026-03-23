'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'

export default function GoogleCallbackPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { setAuth }  = useAuthStore()

  useEffect(() => {
    const code  = searchParams.get('code')
    const error = searchParams.get('error')

    if (error || !code) {
      router.push('/login?error=google_failed')
      return
    }

    // Exchange temp code for real token via API
    api.post('/api/auth/google/exchange', { code })
      .then(res => {
        const { token, user } = res.data.data
        setAuth(user, token)

        // Clear code from URL immediately
        window.history.replaceState({}, '', '/auth/google/callback')

        if (!user.onboardingCompleted) {
          router.push('/onboarding')
        } else {
          router.push('/dashboard')
        }
      })
      .catch(() => {
        router.push('/login?error=google_failed')
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#070711' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: '#9090b0' }}>
          Signing you in with Google…
        </p>
      </div>
    </div>
  )
}