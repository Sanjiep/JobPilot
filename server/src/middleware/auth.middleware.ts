import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './error.middleware'
import prisma from '../lib/prisma'

export interface AuthRequest extends Request {
  user?: { id: string; email: string; plan: string }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || '',
    ) as { id: string; email: string }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, plan: true },
    })

    if (!user) throw new AppError('User not found', 401)
    req.user = user
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401))
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token expired', 401))
    }
    next(error)
  }
}