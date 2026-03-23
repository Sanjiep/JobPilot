import { Request } from 'express'

// Authenticated request with user attached by auth middleware
export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
  }
}