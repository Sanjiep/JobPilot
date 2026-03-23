import { Router, Request, Response } from 'express'
import { google } from 'googleapis'
import { authMiddleware } from '../middleware/auth.middleware'
import { oauth2Client, getAuthUrl } from '../lib/google'
import prisma from '../lib/prisma'

const router = Router()

// GET /api/email/google/connect — redirect user to Google OAuth
router.get('/google/connect', authMiddleware, async (req: any, res: Response) => {
  try {
    const authUrl = getAuthUrl(req.user.id)
    res.json({ success: true, url: authUrl })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate auth URL' })
  }
})

// GET /api/email/google/callback — Google redirects here after auth
router.get('/google/callback', async (req: Request, res: Response) => {
  try {
    const { code, state: userId } = req.query

    if (!code || !userId) {
      return res.redirect(`${process.env.FRONTEND_URL}/onboarding?email_error=missing_params`)
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code as string)
    oauth2Client.setCredentials(tokens)

    // Get user email from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: googleUser } = await oauth2.userinfo.get()

    if (!googleUser.email) {
      return res.redirect(`${process.env.FRONTEND_URL}/onboarding?email_error=no_email`)
    }

    // Save to database
    await prisma.emailConnection.upsert({
      where:  { userId: userId as string },
      update: {
        provider:     'gmail',
        email:        googleUser.email,
        accessToken:  tokens.access_token  || '',
        refreshToken: tokens.refresh_token || null,
        connectedAt:  new Date(),
      },
      create: {
        userId:       userId as string,
        provider:     'gmail',
        email:        googleUser.email,
        accessToken:  tokens.access_token  || '',
        refreshToken: tokens.refresh_token || null,
      },
    })

    // Redirect back to onboarding with success
    res.redirect(`${process.env.FRONTEND_URL}/onboarding?email_connected=gmail&email=${googleUser.email}`)
  } catch (error: any) {
    console.error('Gmail OAuth callback error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/onboarding?email_error=auth_failed`)
  }
})

// GET /api/email/status — check if email is connected
router.get('/status', authMiddleware, async (req: any, res: Response) => {
  try {
    const connection = await prisma.emailConnection.findUnique({
      where: { userId: req.user.id },
    })
    res.json({
      success: true,
      data: {
        connected: !!connection,
        provider:  connection?.provider || null,
        email:     connection?.email    || null,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get email status' })
  }
})

// DELETE /api/email/disconnect — disconnect email
router.delete('/disconnect', authMiddleware, async (req: any, res: Response) => {
  try {
    await prisma.emailConnection.deleteMany({
      where: { userId: req.user.id },
    })
    res.json({ success: true, message: 'Email disconnected' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to disconnect email' })
  }
})

// GET /api/email/messages — fetch recent emails (for detecting replies)
router.get('/messages', authMiddleware, async (req: any, res: Response) => {
  try {
    const connection = await prisma.emailConnection.findUnique({
      where: { userId: req.user.id },
    })

    if (!connection) {
      return res.status(404).json({ success: false, message: 'No email connected' })
    }

    // Set credentials
    oauth2Client.setCredentials({
      access_token:  connection.accessToken,
      refresh_token: connection.refreshToken || undefined,
    })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Fetch last 10 messages related to job applications
    const { data } = await gmail.users.messages.list({
      userId:   'me',
      maxResults: 10,
      q: 'subject:(application OR interview OR position OR job OR opportunity OR hiring)',
    })

    const messages = data.messages || []

    // Fetch details for each message
    const details = await Promise.all(
      messages.slice(0, 5).map(async (msg) => {
        const { data: detail } = await gmail.users.messages.get({
          userId: 'me',
          id:     msg.id!,
          format: 'metadata',
          metadataHeaders: ['Subject', 'From', 'Date'],
        })

        const headers = detail.payload?.headers || []
        const subject = headers.find(h => h.name === 'Subject')?.value || ''
        const from    = headers.find(h => h.name === 'From')?.value    || ''
        const date    = headers.find(h => h.name === 'Date')?.value    || ''

        return { id: msg.id, subject, from, date, snippet: detail.snippet }
      })
    )

    res.json({ success: true, data: { messages: details } })
  } catch (error: any) {
    console.error('Gmail fetch error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch emails' })
  }
})

export default router