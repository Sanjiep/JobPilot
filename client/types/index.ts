export interface User {
  id: string
  email: string
  plan: 'FREE' | 'PRO' | 'ELITE'
  onboardingCompleted: boolean
  onboardingStep: number
  createdAt: string
}

export interface Profile {
  id: string
  userId: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  nationality?: string
  address?: string
  city?: string
  country?: string
  photoUrl?: string
  website?: string
}

export interface Job {
  id: string
  title: string
  company: string
  location?: string
  salary?: string
  description: string
  url: string
  tags: string[]
  postedAt?: string
  createdAt: string
}

export interface Application {
  id: string
  userId: string
  jobId: string
  status: ApplicationStatus
  filledData?: Record<string, string>
  coverLetter?: string
  notes?: string
  createdAt: string
  submittedAt?: string
  job: Job
}

export type ApplicationStatus =
  | 'DRAFT'
  | 'QUEUED'
  | 'APPLYING'
  | 'SUBMITTED'
  | 'FAILED'
  | 'REPLIED'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'OFFER'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}