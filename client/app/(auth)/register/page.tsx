'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuthStore } from '@/lib/store'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const res = await api.post('/api/auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })
      const { user, token } = res.data.data
      setAuth(user, token)
      router.push('/onboarding')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070711] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Job<span className="text-indigo-400">Pilot</span>
          </h1>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-[#0e0e18] border border-[#1f1f30] rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Get started for free</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  placeholder="John"
                  className="w-full mt-1.5 bg-[#13131f] border border-[#1f1f30] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Doe"
                  className="w-full mt-1.5 bg-[#13131f] border border-[#1f1f30] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
                className="w-full mt-1.5 bg-[#13131f] border border-[#1f1f30] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 characters"
                className="w-full mt-1.5 bg-[#13131f] border border-[#1f1f30] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full mt-1.5 bg-[#13131f] border border-[#1f1f30] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          By creating an account you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}