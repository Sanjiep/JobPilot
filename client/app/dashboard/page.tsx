'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  ChevronRight,
  FileText,
  Inbox,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'

import api from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { formatRelativeDate } from '@/lib/utils'

type Application = {
  id: string
  status: string
  createdAt?: string
  updatedAt?: string
  job?: {
    title?: string
    company?: string
    location?: string
  }
}

type Job = {
  id: string
  title?: string
  company?: string
  location?: string
  salary?: string
  type?: string
}

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

function DashboardCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-[color:var(--border)] bg-[var(--bg-card)]',
        className
      )}
    >
      {children}
    </div>
  )
}

const statusLabels: Record<string, string> = {
  SUBMITTED: 'Submitted',
  REPLIED: 'Replied',
  INTERVIEW: 'Interview',
  REJECTED: 'Rejected',
  OFFER: 'Offer',
  QUEUED: 'Queued',
  DRAFT: 'Draft',
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      try {
        const [applicationsResponse, jobsResponse] = await Promise.allSettled([
          api.get('/api/applications?limit=6'),
          api.get('/api/jobs/recommended?limit=5'),
        ])

        if (!active) return

        if (applicationsResponse.status === 'fulfilled') {
          setApplications(applicationsResponse.value.data.data?.applications ?? [])
        }

        if (jobsResponse.status === 'fulfilled') {
          setJobs(jobsResponse.value.data.data?.jobs ?? [])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [])

  const displayName = user?.firstName || user?.email?.split('@')[0] || 'there'

  const stats = useMemo(() => {
    const total = applications.length
    const replies = applications.filter((item) =>
      ['REPLIED', 'INTERVIEW', 'OFFER'].includes(item.status)
    ).length
    const interviews = applications.filter((item) => item.status === 'INTERVIEW').length
    const queued = applications.filter((item) => item.status === 'QUEUED').length

    return { total, replies, interviews, queued }
  }, [applications])

  const metrics = [
    {
      label: 'Applications',
      value: stats.total,
      note: 'Tracked this cycle',
      icon: FileText,
    },
    {
      label: 'Replies',
      value: stats.replies,
      note: 'Companies responded',
      icon: Inbox,
    },
    {
      label: 'Interviews',
      value: stats.interviews,
      note: 'In progress',
      icon: CalendarClock,
    },
    {
      label: 'Queued',
      value: stats.queued,
      note: 'Ready to send',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <DashboardCard className="relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_32%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--bg-primary)]/70 px-3 py-1 text-xs font-medium text-[var(--text-secondary)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              New dashboard
            </div>

            <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                  Welcome back, {displayName}.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                  A sharper workspace for tracking applications, finding roles, and keeping your
                  momentum high without the clutter.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/dashboard/jobs"
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>Browse jobs</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
                <Link
                  href="/dashboard/applications"
                  className="rounded-2xl border border-[color:var(--border)] bg-[var(--bg-primary)]/70 px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>Open pipeline</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-300">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Focus today</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Review replies and submit your next 3 matches.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-[var(--bg-secondary)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Priority
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                Follow up with recent responses
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--bg-secondary)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Recommended
              </p>
              <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                Check the newest job matches before they get stale
              </p>
            </div>
          </div>
        </DashboardCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <DashboardCard key={metric.label} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{metric.note}</p>
              </div>
              <div className="rounded-2xl bg-[var(--bg-secondary)] p-3 text-[var(--text-primary)]">
                <metric.icon className="h-5 w-5" />
              </div>
            </div>
          </DashboardCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <DashboardCard className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-[var(--text-primary)]">Recent applications</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Latest movement across your pipeline
              </p>
            </div>
            <Link
              href="/dashboard/applications"
              className="text-sm font-medium text-[var(--text-primary)] transition hover:text-[var(--text-secondary)]"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-2xl bg-[var(--bg-secondary)]"
                  />
                ))
              : applications.slice(0, 5).map((application) => (
                  <div
                    key={application.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[color:var(--border)] p-4 transition hover:bg-[var(--bg-secondary)] sm:flex-row sm:items-center"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                        {application.job?.title || 'Untitled role'}
                      </p>
                      <p className="truncate text-sm text-[var(--text-secondary)]">
                        {application.job?.company || 'Unknown company'}
                        {application.job?.location ? ` | ${application.job.location}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                        {statusLabels[application.status] || application.status}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {formatRelativeDate(application.updatedAt || application.createdAt || new Date())}
                      </span>
                    </div>
                  </div>
                ))}

            {!loading && applications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[color:var(--border)] px-5 py-10 text-center">
                <p className="text-sm font-medium text-[var(--text-primary)]">No applications yet</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Start applying and your recent activity will show here.
                </p>
              </div>
            ) : null}
          </div>
        </DashboardCard>

        <div className="space-y-4">
          <DashboardCard className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-[var(--text-primary)]">Recommended jobs</h3>
                <p className="text-sm text-[var(--text-secondary)]">Fresh matches to review next</p>
              </div>
              <BriefcaseBusiness className="h-4 w-4 text-[var(--text-muted)]" />
            </div>

            <div className="mt-5 space-y-3">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-2xl bg-[var(--bg-secondary)]"
                    />
                  ))
                : jobs.slice(0, 4).map((job) => (
                    <Link
                      key={job.id}
                      href="/dashboard/jobs"
                      className="block rounded-2xl border border-[color:var(--border)] p-4 transition hover:bg-[var(--bg-secondary)]"
                    >
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {job.title || 'Untitled role'}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {job.company || 'Unknown company'}
                      </p>
                      <p className="mt-3 text-xs text-[var(--text-muted)]">
                        {[job.location, job.type, job.salary].filter(Boolean).join(' | ') || 'Open details'}
                      </p>
                    </Link>
                  ))}

              {!loading && jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[color:var(--border)] px-5 py-10 text-center">
                  <p className="text-sm font-medium text-[var(--text-primary)]">No recommendations yet</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Recommended roles will appear once the API returns matches.
                  </p>
                </div>
              ) : null}
            </div>
          </DashboardCard>

          <DashboardCard className="p-5">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">Quick actions</h3>
            <div className="mt-4 space-y-2">
              {[
                { href: '/dashboard/jobs', label: 'Search jobs' },
                { href: '/dashboard/queue', label: 'Review queue' },
                { href: '/dashboard/inbox', label: 'Open inbox' },
                { href: '/dashboard/settings', label: 'Update settings' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-2xl bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]/80"
                >
                  <span>{action.label}</span>
                  <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
                </Link>
              ))}
            </div>
          </DashboardCard>
        </div>
      </section>
    </div>
  )
}
