import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

import { errorMiddleware } from './middleware/error.middleware'
import authRoutes from './routes/auth.routes'
import resumeRouter from './routes/resume'
import aiRouter from './routes/ai'
import onboardingRouter from './routes/onboarding'
import emailRouter from './routes/email.routes'
import passport from './lib/passport'

const app = express()
const PORT = process.env.PORT || 8000

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use(passport.initialize())

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'JobPilot API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/onboarding', onboardingRouter)
app.use('/api/email', emailRouter)
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════╗
  ║    JobPilot API — Running    ║
  ║    Port: ${PORT}                ║
  ╚══════════════════════════════╝
  `)
})

export default app