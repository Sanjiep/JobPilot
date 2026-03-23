import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from './prisma'
import jwt from 'jsonwebtoken'

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID     || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL:  process.env.GOOGLE_LOGIN_REDIRECT_URI || 'http://localhost:8000/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email     = profile.emails?.[0]?.value
        const googleId  = profile.id
        const firstName = profile.name?.givenName  || ''
        const lastName  = profile.name?.familyName || ''
        const photoUrl  = profile.photos?.[0]?.value || ''

        if (!email) {
          return done(new Error('No email from Google'), undefined)
        }

        // Find or create user
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId }, { email }],
          },
          include: { profile: true },
        })

        if (user) {
          // Update googleId if missing
          if (!user.googleId) {
            user = await prisma.user.update({
              where:   { id: user.id },
              data:    { googleId },
              include: { profile: true },
            })
          }
        } else {
          // Create new user
          user = await prisma.user.create({
            data: {
              email,
              googleId,
              profile: {
                create: {
                  firstName,
                  lastName,
                  photoUrl,
                },
              },
            },
            include: { profile: true },
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error as Error, undefined)
      }
    }
  )
)

export default passport