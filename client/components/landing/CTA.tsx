'use client'

import Link from 'next/link'
import { useThemeStore } from '@/lib/store'

export default function CTA() {
  const { dark } = useThemeStore()

  const textMuted = dark ? '#9090b0' : '#4a4a6a'
  const border = dark ? '#1e1e32' : '#e2e4f0'

  return (
    <section
      className="py-24 px-6"
      style={{ background: dark ? '#070711' : '#ffffff' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="rounded-3xl p-12 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
          }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{ background: '#ffffff' }} />
            <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ background: '#38bdf8' }} />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to automate your job search?
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
              Join 10,000+ job seekers who let JobPilot handle their applications. Start free today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl font-semibold text-base transition-all cursor-pointer w-full sm:w-auto text-center"
                style={{
                  background: '#ffffff',
                  color: '#6366f1',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}
              >
                Get started for free
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl font-semibold text-base transition-all cursor-pointer w-full sm:w-auto text-center"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                Sign in →
              </Link>
            </div>

            <p className="text-indigo-200 text-sm mt-6">
              No credit card required · Free forever plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}