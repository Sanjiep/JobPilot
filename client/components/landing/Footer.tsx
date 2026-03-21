'use client'

import Link from 'next/link'
import Logo from '@/components/ui/logo'
import { useThemeStore } from '@/lib/store'

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '/changelog' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export default function Footer() {
  const { dark } = useThemeStore()

  const textPrimary = dark ? '#ffffff' : '#0a0a14'
  const textMuted = dark ? '#9090b0' : '#4a4a6a'
  const border = dark ? '#1e1e32' : '#e2e4f0'

  return (
    <footer
      className="py-16 px-6"
      style={{
        background: dark ? '#0e0e1a' : '#f5f5ff',
        borderTop: `1px solid ${border}`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Logo height={24} dark={dark} />
            <p className="text-sm leading-relaxed mt-4 max-w-xs" style={{ color: textMuted }}>
              AI-powered job application automation. Upload your CV once, let JobPilot apply to hundreds of jobs automatically.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {[
                { label: 'Twitter', href: '#', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )},
                { label: 'LinkedIn', href: '#', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                )},
                { label: 'GitHub', href: '#', icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                )},
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer"
                  style={{ borderColor: border, color: textMuted }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <div
                className="text-xs font-bold uppercase tracking-wider mb-4"
                style={{ color: textPrimary }}
              >
                {category}
              </div>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="block text-sm transition-all cursor-pointer hover:opacity-100"
                    style={{ color: textMuted, opacity: 0.8 }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4"
          style={{ borderTop: `1px solid ${border}` }}
        >
          <p className="text-xs" style={{ color: textMuted }}>
            © 2026 JobPilot. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: textMuted }}>
            Built with ❤️ for job seekers worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}