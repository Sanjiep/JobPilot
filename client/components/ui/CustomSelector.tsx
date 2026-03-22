'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  value: string
  onChange: (v: string) => void
  options: string[] | { label: string; value: string }[]
  label?: string
  dark: boolean
  textPrimary: string
  textMuted: string
  border: string
  placeholder?: string
  accentColor?: string
}

export default function CustomSelect({
  value,
  onChange,
  options,
  label,
  dark,
  textPrimary,
  textMuted,
  border,
  placeholder = 'Select…',
  accentColor = '#6366f1',
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Normalize options to { label, value } shape
  const normalized = options.map(o =>
    typeof o === 'string' ? { label: o, value: o } : o
  )

  const selected = normalized.find(o => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
        style={{
          background: dark ? 'rgba(255,255,255,0.05)' : '#ffffff',
          border: `1px solid ${open ? accentColor : border}`,
          color: selected ? textPrimary : textMuted,
          cursor: 'pointer',
          boxShadow: open ? `0 0 0 3px ${accentColor}20` : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        <span>{selected?.label ?? placeholder}</span>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            color: textMuted,
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.15s',
          }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 w-full rounded-xl overflow-hidden mt-1"
            style={{
              background: dark ? '#0e0e1a' : '#ffffff',
              border: `1px solid ${border}`,
              boxShadow: dark
                ? '0 8px 32px rgba(0,0,0,0.5)'
                : '0 8px 32px rgba(0,0,0,0.12)',
              minWidth: '160px',
            }}
          >
            {/* Optional panel label */}
            {label && (
              <div
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
                style={{ color: textMuted, borderBottom: `1px solid ${border}` }}
              >
                {label}
              </div>
            )}

            {normalized.map((opt, i) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm transition-all"
                  style={{
                    background: 'transparent',
                    color: isSelected ? accentColor : textPrimary,
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    borderBottom: i < normalized.length - 1 ? `1px solid ${border}33` : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected)
                      e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : '#f5f5ff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: accentColor, flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}