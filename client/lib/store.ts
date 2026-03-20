import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  plan: string
  onboardingCompleted: boolean
  onboardingStep: number
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
}

interface OnboardingStore {
  currentStep: number
  totalSteps: number
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('jobpilot_token', token)
        localStorage.setItem('jobpilot_user', JSON.stringify(user))
        set({ user, token, isAuthenticated: true })
      },
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      logout: () => {
        localStorage.removeItem('jobpilot_token')
        localStorage.removeItem('jobpilot_user')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'jobpilot_auth' },
  ),
)

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: 1,
  totalSteps: 13,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps),
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),
}))

interface ThemeStore {
  dark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      dark: true,
      toggleTheme: () => {
        set((state) => {
          const newDark = !state.dark
          if (newDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { dark: newDark }
        })
      },
    }),
    { name: 'jobpilot_theme' },
  ),
)