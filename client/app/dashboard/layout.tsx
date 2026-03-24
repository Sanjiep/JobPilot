'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  CreditCard,
  FileText,
  Globe,
  Headphones,
  Inbox,
  LayoutGrid,
  ListTodo,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sparkles,
  Sun,
  User,
} from 'lucide-react'

import Logo from '@/components/ui/logo'
import { Input } from '@/components/ui/input'
import { useAuthStore, useThemeStore } from '@/lib/store'
import { cn, getInitials } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navGroups: { section: string | null; items: NavItem[] }[] = [
  {
    section: null,
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutGrid },
      { href: '/dashboard/jobs', label: 'Jobs', icon: BriefcaseBusiness },
      { href: '/dashboard/applications', label: 'Applications', icon: FileText },
    ],
  },
  {
    section: 'Workspace',
    items: [
      { href: '/dashboard/queue', label: 'Queue', icon: ListTodo },
      { href: '/dashboard/inbox', label: 'Inbox', icon: Inbox },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
]

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/jobs': 'Jobs',
  '/dashboard/applications': 'Applications',
  '/dashboard/queue': 'Queue',
  '/dashboard/inbox': 'Inbox',
  '/dashboard/settings': 'Settings',
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
}

function DashboardSidebar({
  pathname,
  dark,
  collapsed,
  setCollapsed,
  mobileOpen,
  onClose,
}: {
  pathname: string
  dark: boolean
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  mobileOpen: boolean
  onClose: () => void
}) {
  const sidebarContent = (
    <div className="flex h-full flex-col bg-[var(--bg-card)]">
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <Logo height={20} dark={dark} />
          </Link>
        ) : (
          <div className="relative mx-auto group">
            <Link href="/dashboard" onClick={onClose}>
              <div className="rounded-xl border border-[color:var(--border)] bg-[var(--bg-secondary)] p-2 transition group-hover:opacity-0">
                <Sparkles className="h-4 w-4 text-[var(--text-primary)]" />
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 transition group-hover:opacity-100 hover:bg-[var(--bg-secondary)]"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4 text-[var(--text-secondary)]" />
            </button>
          </div>
        )}

        {!collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            {group.section && !collapsed ? (
              <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {group.section}
              </p>
            ) : null}

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActivePath(pathname, item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : ''}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                      collapsed ? 'justify-center' : '',
                      active
                        ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]/80 hover:text-[var(--text-primary)]'
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed ? <span className="font-medium">{item.label}</span> : null}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[color:var(--border)] p-2">
        {!collapsed ? (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-white/90"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade Now
          </button>
        ) : (
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-xl bg-slate-900 py-2.5 text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-white/90"
            title="Upgrade"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden border-r border-[color:var(--border)] bg-[var(--bg-card)] transition-[width] duration-300 lg:block"
        style={{ width: collapsed ? 64 : 224 }}
      >
        {sidebarContent}
      </aside>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-56 border-r border-[color:var(--border)] bg-[var(--bg-card)] shadow-xl transition-transform lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

function DashboardNavbar({
  pathname,
  onMenuClick,
}: {
  pathname: string
  onMenuClick: () => void
}) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { dark, toggleTheme } = useThemeStore()
  const [showAccount, setShowAccount] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  const title = pageTitles[pathname] ?? 'Dashboard'
  const displayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
      : user?.email ?? 'User'
  const initials = getInitials(displayName)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setShowAccount(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="text-lg font-medium text-[var(--text-primary)]">{title}</h1>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative mr-2 hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <Input
              placeholder="Search"
              className="h-10 w-72 rounded-xl border-[color:var(--border)] bg-[var(--bg-card)] pl-9 shadow-none"
            />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            title="Language"
          >
            <Globe className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            title="Support"
          >
            <Headphones className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="mx-1 hidden h-5 w-px bg-[var(--border)] sm:block" />

          <div className="relative" ref={accountRef}>
            <button
              type="button"
              onClick={() => setShowAccount((current) => !current)}
              className="flex items-center gap-1.5 rounded-xl px-1.5 py-1 transition hover:bg-[var(--bg-secondary)]"
            >
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-full border border-[color:var(--border)] bg-[var(--bg-secondary)]" />
                <div className="absolute inset-1 flex items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
                  {initials}
                </div>
              </div>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 text-[var(--text-muted)] transition-transform',
                  showAccount ? 'rotate-180' : ''
                )}
              />
            </button>

            {showAccount ? (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[var(--bg-card)] shadow-xl">
                <div className="border-b border-[color:var(--border)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                      {displayName}
                    </p>
                    <span className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
                      {user?.plan ?? 'Free'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Application quota</span>
                      <span className="font-medium text-[var(--text-secondary)]">46 / 800</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--bg-secondary)]">
                      <div className="h-1.5 rounded-full bg-slate-800 dark:bg-white" style={{ width: '18%' }} />
                    </div>
                  </div>
                </div>

                <div className="border-b border-[color:var(--border)] p-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowAccount(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowAccount(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowAccount(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <CreditCard className="h-4 w-4" />
                    Plans
                  </Link>
                </div>

                <div className="p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccount(false)
                      logout()
                      router.push('/')
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { dark } = useThemeStore()

  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated())
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (user === null) {
      router.push('/login')
      return
    }
    if (user && !user.onboardingCompleted) {
      router.push('/onboarding')
    }
  }, [hydrated, router, user])

  useEffect(() => {
    if (!hydrated) return
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark, hydrated])

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          Loading dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <DashboardSidebar
        pathname={pathname}
        dark={dark}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div
        className="transition-[padding-left] duration-300 lg:pl-[var(--sidebar-offset)]"
        style={{ ['--sidebar-offset' as string]: `${collapsed ? 64 : 224}px` }}
      >
        <DashboardNavbar pathname={pathname} onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
