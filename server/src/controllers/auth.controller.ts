import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { AppError } from '../middleware/error.middleware'

const generateToken = (id: string, email: string) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET || '',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body

    if (!email || !password || !firstName || !lastName) {
      throw new AppError('All fields are required', 400)
    }

    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400)
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new AppError('Email already registered', 409)

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        profile: {
          create: { firstName, lastName },
        },
      },
      select: {
        id: true,
        email: true,
        plan: true,
        onboardingCompleted: true,
        onboardingStep: true,
        createdAt: true,
      },
    })

    const token = generateToken(user.id, user.email)

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        user: {
          ...user,
          firstName,
          lastName,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('Email and password are required', 400)
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        hashedPassword: true,
        plan: true,
        onboardingCompleted: true,
        onboardingStep: true,
        createdAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!user || !user.hashedPassword) {
      throw new AppError('Invalid email or password', 401)
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword)
    if (!isValid) throw new AppError('Invalid email or password', 401)

    const token = generateToken(user.id, user.email)

    const { hashedPassword, profile, ...rest } = user

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user: {
          ...rest,
          firstName: profile?.firstName ?? '',
          lastName: profile?.lastName ?? '',
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        plan: true,
        onboardingCompleted: true,
        onboardingStep: true,
        createdAt: true,
        profile: true,
      },
    })

    if (!user) throw new AppError('User not found', 404)

    res.json({ success: true, data: { user } })
  } catch (error) {
    next(error)
  }
}