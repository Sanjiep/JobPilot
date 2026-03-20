export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export interface JWTPayload {
  id: string
  email: string
}

export interface ExtractedCV {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  location?: string
  title?: string
  experience?: string
  skills?: string
  education?: string
  linkedin?: string
  github?: string
  portfolio?: string
  summary?: string
}