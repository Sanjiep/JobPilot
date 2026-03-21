'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/logo'
import { useThemeStore } from '@/lib/store'

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
]

export default function Navbar() {
  const { dark, toggleTheme } = useThemeStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const border = dark ? '#1e1e32' : '#e2e4f0'
  const textPrimary = dark ? '#ffffff' : '#0a0a14'
  const textMuted = dark ? '#9090b0' : '#4a4a6a'
  const bg = dark ? '#070711' : '#ffffff'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all"
      style={{
        background: scrolled
          ? dark ? 'rgba(7,7,17,0.9)' : 'rgba(255,255,255,0.9)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${border}` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="cursor-pointer">
          <Logo height={24} dark={dark} />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm transition-all cursor-pointer hover:opacity-100"
              style={{ color: textMuted, opacity: 0.8 }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer"
            style={{ borderColor: border, color: textMuted }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer"
            style={{ color: textMuted }}
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer"
            style={{
              background: '#6366f1',
              color: '#ffffff',
            }}
          >
            Get started free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden cursor-pointer"
          style={{ color: textPrimary }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 space-y-4"
          style={{ background: bg, borderBottom: `1px solid ${border}` }}
        >
          {navLinks.map(link => (
            <Link   
              key={link.label}
              href={link.href}
              className="block text-sm py-2 cursor-pointer"
              style={{ color: textMuted }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/login"
              className="flex-1 text-center text-sm font-medium py-2.5 rounded-lg border cursor-pointer"
              style={{ borderColor: border, color: textPrimary }}>
              Sign in
            </Link>
            <Link href="/register"
              className="flex-1 text-center text-sm font-semibold py-2.5 rounded-lg cursor-pointer"
              style={{ background: '#6366f1', color: '#ffffff' }}>
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}