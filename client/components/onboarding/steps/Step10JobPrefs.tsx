'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

const ALL_JOB_TITLES = [
  // Technology
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer',
  'iOS Developer', 'Android Developer', 'React Developer', 'Vue Developer', 'Angular Developer',
  'Node.js Developer', 'Python Developer', 'Java Developer', 'PHP Developer', 'Ruby Developer',
  'Go Developer', 'Rust Developer', 'C++ Developer', 'C# Developer', '.NET Developer',
  'Software Engineer', 'Senior Software Engineer', 'Lead Software Engineer', 'Principal Engineer',
  'Staff Engineer', 'DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer',
  'Cloud Engineer', 'AWS Engineer', 'Azure Engineer', 'Infrastructure Engineer',
  'Embedded Systems Engineer', 'Firmware Engineer', 'Systems Engineer',
  'Machine Learning Engineer', 'AI Engineer', 'Data Scientist', 'Data Analyst',
  'Data Engineer', 'Business Intelligence Analyst', 'Database Administrator',
  'QA Engineer', 'Test Automation Engineer', 'Security Engineer', 'Cybersecurity Analyst',
  'Penetration Tester', 'Network Engineer', 'IT Support Specialist', 'IT Administrator',
  'Blockchain Developer', 'Smart Contract Developer', 'Game Developer', 'AR/VR Developer',
  // Design
  'UI Designer', 'UX Designer', 'UI/UX Designer', 'Product Designer', 'Graphic Designer',
  'Visual Designer', 'Motion Designer', 'Web Designer', 'Brand Designer', 'Logo Designer',
  'Illustrator', 'Art Director', 'Creative Director', '3D Artist', 'Video Editor',
  'Photographer', 'Videographer', 'Content Creator', 'Social Media Manager',
  // Product & Management
  'Product Manager', 'Senior Product Manager', 'Technical Product Manager',
  'Product Owner', 'Scrum Master', 'Agile Coach', 'Project Manager', 'Program Manager',
  'Engineering Manager', 'CTO', 'VP of Engineering', 'Head of Product',
  // Business & Finance
  'Business Analyst', 'Financial Analyst', 'Financial Controller', 'Accountant',
  'Senior Accountant', 'Auditor', 'Tax Specialist', 'CFO', 'Investment Analyst',
  'Risk Analyst', 'Compliance Officer', 'Management Consultant', 'Strategy Consultant',
  'Business Development Manager', 'Operations Manager', 'Supply Chain Manager',
  'Procurement Specialist', 'Logistics Coordinator',
  // Sales & Marketing
  'Sales Representative', 'Account Executive', 'Account Manager', 'Sales Manager',
  'Business Development Representative', 'Growth Hacker', 'Marketing Manager',
  'Digital Marketing Specialist', 'SEO Specialist', 'SEM Specialist', 'PPC Specialist',
  'Content Marketer', 'Email Marketing Specialist', 'Brand Manager', 'PR Manager',
  'Communications Manager', 'Community Manager', 'Influencer Marketing Manager',
  // HR & Recruiting
  'HR Manager', 'HR Business Partner', 'Recruiter', 'Technical Recruiter',
  'Talent Acquisition Specialist', 'People Operations Manager', 'L&D Specialist',
  'Compensation & Benefits Specialist', 'Payroll Specialist',
  // Healthcare
  'Doctor', 'General Practitioner', 'Nurse', 'Registered Nurse', 'Surgeon',
  'Dentist', 'Pharmacist', 'Physiotherapist', 'Psychologist', 'Psychiatrist',
  'Radiologist', 'Paramedic', 'Healthcare Administrator', 'Medical Researcher',
  'Clinical Trial Manager', 'Lab Technician', 'Biomedical Engineer',
  // Education
  'Teacher', 'Primary School Teacher', 'Secondary School Teacher', 'Professor',
  'Lecturer', 'Tutor', 'School Counselor', 'Curriculum Developer',
  'Instructional Designer', 'Education Administrator', 'Principal',
  // Engineering (non-software)
  'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Structural Engineer',
  'Chemical Engineer', 'Environmental Engineer', 'Aerospace Engineer', 'Automotive Engineer',
  'Manufacturing Engineer', 'Industrial Engineer', 'Process Engineer', 'Quality Engineer',
  'AutoCAD Technician', 'HVAC Engineer', 'Telecommunications Engineer',
  // Construction & Trades
  'Electrician', 'Plumber', 'Carpenter', 'Welder', 'Construction Manager',
  'Site Supervisor', 'Architect', 'Interior Designer', 'Quantity Surveyor',
  // Science & Research
  'Research Scientist', 'Biologist', 'Chemist', 'Physicist', 'Geologist',
  'Environmental Scientist', 'Statistician', 'Mathematician', 'Lab Researcher',
  // Legal
  'Lawyer', 'Attorney', 'Paralegal', 'Legal Counsel', 'Compliance Manager',
  'Contract Manager', 'Legal Assistant',
  // Customer Service
  'Customer Service Representative', 'Customer Success Manager', 'Support Specialist',
  'Technical Support Engineer', 'Help Desk Technician',
  // Logistics & Transport
  'Truck Driver', 'Delivery Driver', 'Warehouse Operative', 'Logistics Manager',
  'Fleet Manager', 'Import/Export Specialist',
  // Hospitality & Food
  'Chef', 'Sous Chef', 'Restaurant Manager', 'Hotel Manager', 'Front Desk Agent',
  'Barista', 'Waiter', 'Bartender', 'Event Coordinator', 'Travel Agent',
  // Other
  'Administrative Assistant', 'Office Manager', 'Executive Assistant',
  'Receptionist', 'Security Guard', 'Cleaner', 'Maintenance Technician',
  'Social Worker', 'Journalist', 'Copywriter', 'Technical Writer', 'Translator',
  'Interpreter', 'Real Estate Agent', 'Insurance Agent', 'Financial Advisor',
]

const ALL_INDUSTRIES = [
  // Tech
  'Technology', 'Software', 'Cybersecurity', 'Artificial Intelligence', 'Data & Analytics',
  'Cloud Computing', 'Blockchain', 'Gaming', 'E-commerce', 'SaaS',
  // Finance
  'Finance', 'Banking', 'Investment', 'Insurance', 'Fintech', 'Accounting', 'Venture Capital',
  // Healthcare
  'Healthcare', 'Pharmaceuticals', 'Biotechnology', 'Medical Devices', 'Mental Health',
  'Dental', 'Veterinary',
  // Education
  'Education', 'EdTech', 'Higher Education', 'Training & Development',
  // Creative
  'Design', 'Advertising', 'Media & Entertainment', 'Publishing', 'Music', 'Film & TV',
  'Photography', 'Architecture', 'Fashion',
  // Business
  'Consulting', 'Management', 'Operations', 'Strategy', 'Human Resources',
  'Legal', 'Compliance', 'Audit',
  // Sales & Marketing
  'Marketing', 'Sales', 'Public Relations', 'Digital Marketing', 'Growth',
  // Engineering
  'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Aerospace', 'Automotive', 'Manufacturing',
  'Construction', 'Energy', 'Oil & Gas', 'Renewable Energy',
  // Science
  'Research & Development', 'Biotechnology', 'Environmental Science',
  'Physics', 'Chemistry', 'Life Sciences',
  // Other
  'Retail', 'Hospitality', 'Tourism', 'Food & Beverage', 'Agriculture',
  'Logistics', 'Supply Chain', 'Transportation', 'Real Estate', 'Property',
  'Non-profit', 'Government', 'Defence', 'Telecommunications',
  'Sports & Fitness', 'Beauty & Wellness', 'Social Services',
]

// Autocomplete Input
function AutocompleteInput({
  value, onChange, onAdd, placeholder, suggestions, inputBg, border, textPrimary, textMuted, dark,
}: {
  value: string
  onChange: (v: string) => void
  onAdd: (v: string) => void
  placeholder: string
  suggestions: string[]
  inputBg: string
  border: string
  textPrimary: string
  textMuted: string
  dark: boolean
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const filtered = value.trim().length > 0
    ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 7)
    : []

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setHighlighted(-1) }, [value])

  const commit = (val: string) => {
    onAdd(val)
    onChange('')
    setShowDropdown(false)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, -1)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && filtered[highlighted]) commit(filtered[highlighted])
      else if (value.trim()) commit(value.trim())
    }
    else if (e.key === 'Escape') setShowDropdown(false)
  }

  return (
    <div ref={wrapperRef} className="flex gap-2 relative">
      <div className="flex-1 relative">
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setShowDropdown(true) }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{ background: inputBg, border: `1px solid ${showDropdown && filtered.length > 0 ? '#6366f1' : border}`, color: textPrimary }}
          autoComplete="off"
        />

        <AnimatePresence>
          {showDropdown && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute z-50 w-full rounded-xl overflow-hidden shadow-2xl mt-1"
              style={{
                background: dark ? '#0e0e1a' : '#ffffff',
                border: '1px solid rgba(99,102,241,0.25)',
                boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)',
              }}
            >
              {filtered.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={() => commit(s)}
                  className="w-full px-4 py-2.5 text-sm text-left transition-all flex items-center justify-between"
                  style={{
                    background: highlighted === i ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: highlighted === i ? '#ffffff' : textPrimary,
                    cursor: 'pointer',
                    borderBottom: i < filtered.length - 1 ? `1px solid ${border}22` : 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#ffffff' }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = highlighted === i ? 'rgba(99,102,241,0.12)' : 'transparent'
                    e.currentTarget.style.color = highlighted === i ? '#ffffff' : textPrimary
                  }}
                >
                  {/* Highlight matching text */}
                  <span>
                    {(() => {
                      const idx = s.toLowerCase().indexOf(value.toLowerCase())
                      if (idx === -1) return s
                      return (
                        <>
                          {s.slice(0, idx)}
                          <span style={{ color: '#6366f1', fontWeight: 700 }}>{s.slice(idx, idx + value.length)}</span>
                          {s.slice(idx + value.length)}
                        </>
                      )
                    })()}
                  </span>
                  <span className="text-xs ml-2 flex-shrink-0" style={{ color: textMuted }}>+ Add</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => { if (value.trim()) commit(value.trim()) }}
        className="px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
        style={{ background: '#6366f1', color: '#ffffff' }}
      >
        Add
      </button>
    </div>
  )
}

export default function Step10JobPrefs({ onNext, onBack, data, dark, textPrimary, textMuted, border, isRevisit }: Props) {
  const saved = data?.jobPrefs || {}
  const [titles, setTitles] = useState<string[]>(saved.titles || [])
  const [titleInput, setTitleInput] = useState('')
  const [industries, setIndustries] = useState<string[]>(saved.industries || [])
  const [industryInput, setIndustryInput] = useState('')
  const [dealBreakers, setDealBreakers] = useState(saved.dealBreakers || '')

  const cardBg = dark ? '#0e0e1a' : '#f5f5ff'
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff'

  const addTitle = (val: string) => {
    if (!val.trim() || titles.includes(val.trim())) return
    setTitles(prev => [...prev, val.trim()])
  }

  const addIndustry = (val: string) => {
    if (!val.trim() || industries.includes(val.trim())) return
    setIndustries(prev => [...prev, val.trim()])
  }

  const toggleIndustry = (ind: string) => {
    if (industries.includes(ind)) setIndustries(industries.filter(i => i !== ind))
    else setIndustries([...industries, ind])
  }

  const valid = titles.length > 0

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
          Step 10 of 13
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: textPrimary }}>Job preferences</h1>
        <p className="text-base" style={{ color: textMuted }}>
          Tell us what kind of jobs you're looking for.
        </p>
      </motion.div>

      <div className="space-y-6 mb-8">

        {/* Target job titles */}
        <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="text-sm font-bold mb-1" style={{ color: textPrimary }}>Target Job Titles *</div>
          <div className="text-xs mb-3" style={{ color: textMuted }}>Search from 150+ roles or type your own</div>
          <AutocompleteInput
            value={titleInput}
            onChange={setTitleInput}
            onAdd={addTitle}
            placeholder="e.g. Frontend Developer, Data Scientist…"
            suggestions={ALL_JOB_TITLES.filter(t => !titles.includes(t))}
            inputBg={inputBg} border={border}
            textPrimary={textPrimary} textMuted={textMuted} dark={dark}
          />
          <AnimatePresence>
            <div className="flex flex-wrap gap-2 mt-3">
              {titles.map(t => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1' }}
                >
                  {t}
                  <button onClick={() => setTitles(titles.filter(x => x !== t))}
                    className="cursor-pointer hover:opacity-70 text-sm leading-none">×</button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          {titles.length === 0 && (
            <p className="text-xs mt-2" style={{ color: textMuted }}>
              Add at least one job title to continue
            </p>
          )}
        </div>

        {/* Industries */}
        <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="text-sm font-bold mb-1" style={{ color: textPrimary }}>
            Industries <span style={{ color: textMuted, fontWeight: 400 }}>(optional)</span>
          </div>
          <div className="text-xs mb-3" style={{ color: textMuted }}>Search from 60+ industries or type your own</div>
          <AutocompleteInput
            value={industryInput}
            onChange={setIndustryInput}
            onAdd={addIndustry}
            placeholder="e.g. Technology, Healthcare, Finance…"
            suggestions={ALL_INDUSTRIES.filter(i => !industries.includes(i))}
            inputBg={inputBg} border={border}
            textPrimary={textPrimary} textMuted={textMuted} dark={dark}
          />

          {/* Added industries as chips */}
          <AnimatePresence>
            <div className="flex flex-wrap gap-2 mt-3 mb-3">
              {industries.map(ind => (
                <motion.div
                  key={ind}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa' }}
                >
                  {ind}
                  <button onClick={() => setIndustries(industries.filter(x => x !== ind))}
                    className="cursor-pointer hover:opacity-70 text-sm leading-none">×</button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {/* Quick pick popular industries */}
          <div className="text-xs mb-2" style={{ color: textMuted }}>Quick pick:</div>
          <div className="flex flex-wrap gap-2">
            {['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Engineering', 'Data & Analytics', 'Consulting', 'Sales']
              .filter(i => !industries.includes(i))
              .map(ind => (
                <button
                  key={ind}
                  onClick={() => addIndustry(ind)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all"
                  style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.color = '#a78bfa' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = textMuted }}
                >
                  + {ind}
                </button>
              ))}
          </div>
        </div>

        {/* Deal breakers */}
        <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${border}` }}>
          <div className="text-sm font-bold mb-1" style={{ color: textPrimary }}>
            Deal Breakers <span style={{ color: textMuted, fontWeight: 400 }}>(optional)</span>
          </div>
          <div className="text-xs mb-3" style={{ color: textMuted }}>
            Things you want to avoid (e.g. "no unpaid overtime", "no travel required")
          </div>
          <textarea
            rows={3}
            value={dealBreakers}
            onChange={e => setDealBreakers(e.target.value)}
            placeholder="No relocation required, no night shifts…"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
            style={{ background: inputBg, border: `1px solid ${border}`, color: textPrimary }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
          style={{ background: 'transparent', border: `1px solid ${border}`, color: textMuted }}>
          ← Back
        </button>
        <button
          onClick={() => isRevisit ? onNext() : onNext({ jobPrefs: { titles, industries, dealBreakers } })}
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