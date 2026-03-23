import { Router } from 'express'
import passport from '../lib/passport'
import jwt from 'jsonwebtoken'
import { register, login, getMe } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Protected routes
router.get('/me', authMiddleware, getMe)

// GET /api/auth/google — redirect to Google
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
)

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed` }),
  async (req: any, res) => {
    try {
      const user = req.user as any

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      )

      const userData = {
        id:                  user.id,
        email:               user.email,
        plan:                user.plan,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep:      user.onboardingStep,
        firstName:           user.profile?.firstName || '',
        lastName:            user.profile?.lastName  || '',
      }

      // Generate a short-lived temp code (5 minutes)
      const tempCode = jwt.sign(
        { token, user: userData },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '5m' }
      )

      // Only pass the temp code in URL — not the real token
      res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?code=${tempCode}`)
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=google_failed`)
    }
  }
)

// POST /api/auth/google/exchange — exchange temp code for real token
router.post('/google/exchange', async (req, res) => {
  try {
    const { code } = req.body
    if (!code) return res.status(400).json({ success: false, message: 'No code provided' })

    const decoded = jwt.verify(code, process.env.JWT_SECRET || 'secret') as any
    res.json({ success: true, data: { token: decoded.token, user: decoded.user } })
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired code' })
  }
})

export default router