import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './authenticate';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

export const attemptRateLimit = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testId } = req.params;
    const userId = req.user!.id;

    const test = await prisma.test.findUnique({
      where: { id: parseInt(testId) },
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const attemptCount = await prisma.attempt.count({
      where: {
        userId,
        testId: parseInt(testId),
      },
    });

    if (attemptCount >= test.maxAttempts) {
      return res.status(429).json({
        error: 'Maximum attempts reached',
        maxAttempts: test.maxAttempts,
        currentAttempts: attemptCount,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
