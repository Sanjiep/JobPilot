'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'

interface Props {
  onNext: (data?: Record<string, any>) => void
  onBack: () => void
  data: Record<string, any>
  dark: boolean
  textPrimary: string
  textMuted: string
  border: string
  isRevisit?: boolean
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const NUMERIC_TO_ALPHA: Record<string, string> = {
  '246': 'FI', '752': 'SE', '578': 'NO', '208': 'DK', '276': 'DE',
  '528': 'NL', '826': 'GB', '250': 'FR', '724': 'ES', '380': 'IT',
  '756': 'CH', '040': 'AT', '056': 'BE', '616': 'PL', '840': 'US',
  '124': 'CA', '036': 'AU', '702': 'SG', '784': 'AE', '356': 'IN',
  '392': 'JP', '410': 'KR', '076': 'BR', '554': 'NZ', '372': 'IE',
  '620': 'PT', '203': 'CZ', '348': 'HU', '642': 'RO', '792': 'TR',
  '682': 'SA', '634': 'QA', '818': 'EG', '710': 'ZA', '566': 'NG',
  '404': 'KE', '458': 'MY', '764': 'TH', '360': 'ID', '704': 'VN',
  '156': 'CN', '484': 'MX', '032': 'AR', '152': 'CL', '170': 'CO',
  '608': 'PH', '586': 'PK', '050': 'BD', '524': 'NP', '144': 'LK',
  '100': 'BG', '191': 'HR', '703': 'SK', '705': 'SI', '233': 'EE',
  '428': 'LV', '440': 'LT', '400': 'JO', '604': 'PE', '858': 'UY',
}

const COUNTRIES = [
  { code: 'FI', name: 'Finland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DE', name: 'Germany' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'PL', name: 'Poland' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'UAE' },
  { code: 'IN', name: 'India' },
  { code: 'NP', name: 'Nepal' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'BR', name: 'Brazil' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'TR', name: 'Turkey' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'QA', name: 'Qatar' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'CN', name: 'China' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'EE', name: 'Estonia' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'HR', name: 'Croatia' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'PE', name: 'Peru' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'JO', name: 'Jordan' },
]

export default function Step9Countries({ onNext, onBack, data, dark, textPrimary, textMuted, border, isRevisit }: Props) {
  const saved = data?.countries || {}
  const [selected, setSelected] = useState<string[]>(saved.selected || [])
  const [openToAnywhere, setOpenToAnywhere] = useState(saved.openToAnywhere || false)
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState<[number, number]>([15, 10])
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff'
  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'
  const defaultFill = dark ? '#1a1a2e' : '#dde0f0'
  const highlightFill = '#6366f1'
  const hoverFill = dark ? '#2d2d50' : '#c8cce8'
  const strokeColor = dark ? '#0a0a18' : '#ffffff'

  const toggle = (code: string) => {
    setSelected(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  const suggestions = search.trim().length > 0
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : []

  const valid = openToAnywhere || selected.length > 0

  const zoomIn = () => setZoom(z => Math.min(z * 1.5, 8))
  const zoomOut = () => setZoom(z => Math.max(z / 1.5, 1))
  const resetView = () => { setZoom(1); setCenter([15, 10]) }

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
          Step 9 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>Target countries</h1>
        <p className="text-base" style={{ color: textMuted }}>
          Search and select countries where you want to apply for jobs.
        </p>
      </motion.div>

      {/* Open to anywhere */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onClick={() => { setOpenToAnywhere(!openToAnywhere); setSelected([]) }}
        className="flex items-center justify-between rounded-2xl p-4 cursor-pointer mb-5 transition-all"
        style={{
          background: openToAnywhere ? 'rgba(99,102,241,0.1)' : cardBg,
          border: openToAnywhere ? '2px solid #6366f1' : `1px solid ${border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: openToAnywhere ? 'rgba(99,102,241,0.2)' : dark ? 'rgba(255,255,255,0.05)' : '#ebebff',
              color: openToAnywhere ? '#6366f1' : textMuted,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: textPrimary }}>Open to anywhere</div>
            <div className="text-xs" style={{ color: textMuted }}>Apply to jobs in any country</div>
          </div>
        </div>
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          style={{
            borderColor: openToAnywhere ? '#6366f1' : border,
            background: openToAnywhere ? '#6366f1' : 'transparent',
          }}
        >
          {openToAnywhere && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
      </motion.div>

      {!openToAnywhere && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

          {/* Search with suggestions */}
          <div ref={searchRef} className="relative mb-4">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: textMuted }}>
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search and add countries…"
              className="w-full rounded-xl pl-9 pr-9 py-3 text-sm outline-none transition-all"
              style={{
                background: inputBg,
                border: `1px solid ${showSuggestions && suggestions.length > 0 ? '#6366f1' : border}`,
                color: textPrimary,
                boxShadow: showSuggestions && suggestions.length > 0 ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
              }}
            />
            {search && (
              <button type="button" onClick={() => { setSearch(''); setShowSuggestions(false) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg cursor-pointer leading-none"
                style={{ color: textMuted }}>
                ×
              </button>
            )}

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute z-50 w-full rounded-xl overflow-hidden mt-1 shadow-2xl"
                  style={{
                    background: dark ? '#0e0e1a' : '#ffffff',
                    border: '1px solid rgba(99,102,241,0.25)',
                    boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)',
                  }}
                >
                  {suggestions.map((country, i) => {
                    const isSelected = selected.includes(country.code)
                    return (
                      <button
                        key={country.code}
                        type="button"
                        onMouseDown={() => {
                          toggle(country.code)
                          setSearch('')
                          setShowSuggestions(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                        style={{
                          background: isSelected ? 'rgba(99,102,241,0.08)' : 'transparent',
                          color: isSelected ? '#6366f1' : textPrimary,
                          cursor: 'pointer',
                          borderBottom: i < suggestions.length - 1 ? `1px solid ${border}22` : 'none',
                        }}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.04)' : '#f5f5ff' }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                      >
                        <img
                          src={`https://flagcdn.com/20x15/${country.code.toLowerCase()}.png`}
                          alt={country.name}
                          style={{ width: '18px', height: '14px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }}
                        />
                        <span className="flex-1 text-left">
                          {(() => {
                            const idx = country.name.toLowerCase().indexOf(search.toLowerCase())
                            if (idx === -1) return country.name
                            return (
                              <>
                                {country.name.slice(0, idx)}
                                <span style={{ color: '#6366f1', fontWeight: 700 }}>
                                  {country.name.slice(idx, idx + search.length)}
                                </span>
                                {country.name.slice(idx + search.length)}
                              </>
                            )
                          })()}
                        </span>
                        {isSelected && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                        {!isSelected && (
                          <span className="text-xs" style={{ color: textMuted }}>+ Add</span>
                        )}
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selected.map(code => {
                const country = COUNTRIES.find(c => c.code === code)
                if (!country) return null
                return (
                  <motion.div
                    key={code}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1' }}
                  >
                    <img
                      src={`https://flagcdn.com/16x12/${code.toLowerCase()}.png`}
                      alt={country.name}
                      style={{ width: '14px', height: '11px', objectFit: 'cover', borderRadius: '2px' }}
                    />
                    {country.name}
                    <button onClick={() => toggle(code)}
                      className="cursor-pointer hover:opacity-70 text-sm leading-none ml-0.5">×</button>
                  </motion.div>
                )
              })}
              <button
                onClick={() => setSelected([])}
                className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Map */}
          <div
            ref={mapRef}
            className="rounded-2xl overflow-hidden relative"
            style={{ background: dark ? '#0a0a18' : '#eef0f8', border: `1px solid ${border}` }}
          >
            {/* Tooltip */}
            {tooltip && (
              <div
                className="absolute z-10 px-2.5 py-1.5 rounded-lg text-xs font-medium pointer-events-none"
                style={{
                  left: tooltip.x,
                  top: tooltip.y,
                  background: dark ? '#1a1a2e' : '#ffffff',
                  border: `1px solid ${border}`,
                  color: textPrimary,
                  transform: 'translate(-50%, -140%)',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                }}
              >
                {tooltip.name}
                <div
                  className="text-xs mt-0.5"
                  style={{ color: selected.includes(
                    COUNTRIES.find(c => c.name === tooltip.name)?.code ?? ''
                  ) ? '#34d399' : textMuted }}
                >
                  {selected.includes(COUNTRIES.find(c => c.name === tooltip.name)?.code ?? '')
                    ? '✓ Selected'
                    : 'Search above to add'}
                </div>
              </div>
            )}

            {/* Zoom controls */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
              <button
                type="button"
                onClick={zoomIn}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                style={{
                  background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${border}`,
                  color: textPrimary,
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.2)' : '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'}
              >
                +
              </button>
              <button
                type="button"
                onClick={zoomOut}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                style={{
                  background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${border}`,
                  color: textPrimary,
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.2)' : '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'}
              >
                −
              </button>
              <button
                type="button"
                onClick={resetView}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                style={{
                  background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${border}`,
                  color: textMuted,
                  backdropFilter: 'blur(8px)',
                }}
                title="Reset view"
                onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.2)' : '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)'}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
            </div>

            <ComposableMap
              projectionConfig={{ scale: 145, center: [15, 10] }}
              style={{ width: '100%', height: 'auto' }}
            >
              <ZoomableGroup
                zoom={zoom}
                center={center}
                onMoveEnd={({ zoom: z, coordinates }) => {
                  setZoom(z)
                  setCenter(coordinates)
                }}
                minZoom={1}
                maxZoom={8}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map(geo => {
                      const numericCode = geo.id?.toString().padStart(3, '0')
                      const alpha2 = NUMERIC_TO_ALPHA[numericCode] ?? ''
                      const isSelected = selected.includes(alpha2)
                      const countryData = COUNTRIES.find(c => c.code === alpha2)

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={e => {
                            if (countryData) {
                              const mapDiv = mapRef.current
                              if (mapDiv) {
                                const mapRect = mapDiv.getBoundingClientRect()
                                setTooltip({
                                  name: countryData.name,
                                  x: e.clientX - mapRect.left,
                                  y: e.clientY - mapRect.top,
                                })
                              }
                            }
                          }}
                          onMouseMove={e => {
                            if (countryData) {
                              const mapDiv = mapRef.current
                              if (mapDiv) {
                                const mapRect = mapDiv.getBoundingClientRect()
                                setTooltip(prev => prev ? {
                                  ...prev,
                                  x: e.clientX - mapRect.left,
                                  y: e.clientY - mapRect.top,
                                } : null)
                              }
                            }
                          }}
                          onMouseLeave={() => setTooltip(null)}
                          style={{
                            default: {
                              fill: isSelected ? highlightFill : defaultFill,
                              stroke: strokeColor,
                              strokeWidth: 0.4,
                              outline: 'none',
                              transition: 'fill 0.2s',
                            },
                            hover: {
                              fill: isSelected ? '#818cf8' : countryData ? hoverFill : defaultFill,
                              stroke: strokeColor,
                              strokeWidth: 0.4,
                              outline: 'none',
                              cursor: countryData ? 'pointer' : 'default',
                            },
                            pressed: {
                              fill: isSelected ? '#818cf8' : defaultFill,
                              outline: 'none',
                            },
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            {/* Legend + hint */}
            <div className="px-3 pb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs" style={{ color: textMuted }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: highlightFill }}/>
                  Selected
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: defaultFill, border: `1px solid ${border}` }}/>
                  Not selected
                </div>
              </div>
              <div className="text-xs" style={{ color: textMuted }}>
                Scroll to zoom · Drag to pan
              </div>
            </div>
          </div>

          {/* Count */}
          {selected.length > 0 && (
            <div className="text-sm mt-3" style={{ color: textMuted }}>
              <span style={{ color: '#6366f1', fontWeight: 600 }}>{selected.length}</span>{' '}
              {selected.length === 1 ? 'country' : 'countries'} selected
            </div>
          )}
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-8">
        <button onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}>
          ← Back
        </button>
        <button
          onClick={() => isRevisit ? onNext() : onNext({ countries: { selected, openToAnywhere } })}
          disabled={!isRevisit && !valid}
          className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{
            background: (isRevisit || valid) ? '#6366f1' : border,
            color: (isRevisit || valid) ? '#ffffff' : textMuted,
          }}
        >
          {isRevisit ? 'Next →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}