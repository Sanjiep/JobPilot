'use client'
import { useThemeStore } from '@/lib/store'

export default function QueuePage() {
  const { dark } = useThemeStore()
  const textPrimary = dark ? '#ffffff' : '#0a0a14'
  const textMuted   = dark ? '#9090b0' : '#4a4a6a'

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-lg font-bold mb-2" style={{ color: textPrimary }}>Queue</div>
        <div className="text-sm" style={{ color: textMuted }}>Coming soon…</div>
      </div>
    </div>
  )
}