'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useThemeStore } from '@/lib/store'

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started',
    color: '#6b7280',
    features: [
      '5 applications per month',
      '1 target country',
      'Manual apply only',
      'Basic CV extraction',
      'Application tracking',
      'Email support',
    ],
    notIncluded: [
      'AI cover letters',
      'Full autopilot',
      'Email monitoring',
      'Priority AI models',
    ],
    cta: 'Get started free',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    price: { monthly: 19, yearly: 15 },
    description: 'For active job seekers',
    color: '#6366f1',
    features: [
      '100 applications per month',
      '5 target countries',
      'Review before apply mode',
      'AI cover letters',
      'Full CV extraction',
      'Application tracking',
      'Email monitoring',
      'Priority support',
    ],
    notIncluded: [
      'Full autopilot',
      'Unlimited applications',
    ],
    cta: 'Start Pro trial',
    href: '/register?plan=pro',
    popular: true,
  },
  {
    name: 'Elite',
    price: { monthly: 49, yearly: 39 },
    description: 'For serious job hunters',
    color: '#a78bfa',
    features: [
      'Unlimited applications',
      'All countries',
      'Full autopilot mode',
      'AI cover letters',
      'Priority AI models',
      'Email monitoring',
      'Interview tracking',
      'Dedicated support',
      'Early access to features',
    ],
    notIncluded: [],
    cta: 'Start Elite trial',
    href: '/register?plan=elite',
    popular: false,
  },
]

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function Pricing() {
  const { dark } = useThemeStore()
  const [yearly, setYearly] = useState(false)

  const textPrimary = dark ? '#ffffff' : '#0a0a14'
  const textMuted = dark ? '#9090b0' : '#4a4a6a'
  const border = dark ? '#1e1e32' : '#e2e4f0'

  return (
    <section
      id="pricing"
      className="py-24 px-6"
      style={{ background: dark ? '#070711' : '#ffffff' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4"
            style={{
              background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#6366f1',
            }}
          >
            Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: textPrimary }}>
            Simple, transparent pricing
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: textMuted }}>
            Start free. Upgrade when you need more applications.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl"
            style={{ background: dark ? '#0e0e1a' : '#f5f5ff', border: `1px solid ${border}` }}>
            <button
              onClick={() => setYearly(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
              style={{
                background: !yearly ? '#6366f1' : 'transparent',
                color: !yearly ? '#ffffff' : textMuted,
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
              style={{
                background: yearly ? '#6366f1' : 'transparent',
                color: yearly ? '#ffffff' : textMuted,
              }}
            >
              Yearly
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: '#34d39920', color: '#34d399' }}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-8 transition-all"
              style={{
                background: plan.popular
                  ? dark ? '#111128' : '#f0f0ff'
                  : dark ? '#0e0e1a' : '#f5f5ff',
                border: plan.popular
                  ? '2px solid #6366f1'
                  : `1px solid ${border}`,
                transform: plan.popular ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{ background: '#6366f1', color: '#ffffff' }}
                >
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: plan.color }}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold" style={{ color: textPrimary }}>
                    ${yearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-sm" style={{ color: textMuted }}>/month</span>
                  )}
                </div>
                <p className="text-sm" style={{ color: textMuted }}>
                  {plan.description}
                </p>
              </div>

              {/* CTA */}
              <Link
                href={plan.href}
                className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer mb-6"
                style={{
                  background: plan.popular ? '#6366f1' : 'transparent',
                  color: plan.popular ? '#ffffff' : textPrimary,
                  border: plan.popular ? 'none' : `1px solid ${border}`,
                }}
              >
                {plan.cta}
              </Link>

              {/* Divider */}
              <div className="h-px mb-6" style={{ background: border }} />

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#34d39920', color: '#34d399' }}>
                      <CheckIcon />
                    </div>
                    <span className="text-sm" style={{ color: textMuted }}>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map((f, j) => (
                  <div key={j} className="flex items-center gap-3 opacity-40">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: border, color: textMuted }}>
                      <XIcon />
                    </div>
                    <span className="text-sm" style={{ color: textMuted }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm mt-8" style={{ color: textMuted }}>
          All plans include a 7-day free trial. No credit card required to start.
        </p>
      </div>
    </section>
  )
}