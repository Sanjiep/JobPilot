'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useThemeStore } from '@/lib/store'

export default function CTA() {
  const { dark } = useThemeStore()
  const textMuted = dark ? '#9090b0' : '#4a4a6a'

  return (
    <section
      className="py-24 px-6"
      style={{ background: dark ? '#070711' : '#ffffff' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          className="rounded-3xl p-12 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{ background: '#ffffff' }}
            />
            <div
              className="absolute bottom-[-20%] left-[-10%] w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ background: '#38bdf8' }}
            />
          </div>

          <div className="relative z-10">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Ready to automate your job search?
            </motion.h2>

            <motion.p
              className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              Join 10,000+ job seekers who let JobPilot handle their applications. Start free today.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
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
            </motion.div>

            <motion.p
              className="text-indigo-200 text-sm mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              No credit card required · Free forever plan available
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}