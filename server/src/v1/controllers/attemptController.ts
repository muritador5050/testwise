import { Response } from 'express';
import AttemptService from '../services/attemptService.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { SubmitAnswerData } from '../../types/types.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AttemptController {
  static async start(req: AuthenticatedRequest, res: Response) {
    try {
      const { testId } = req.params;
      const userId = req.user!.id;
      const ipAddress = req.ip || req.connection.remoteAddress;

      const attempt = await AttemptService.startAttempt(
        userId,
        parseInt(testId),
        ipAddress
      );
      res.status(201).json(attempt);
    } catch (error: any) {
      if (
        error.message.includes('Maximum attempts') ||
        error.message.includes('not available')
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getRemainingTime(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const attempt = await prisma.attempt.findUnique({
        where: { id: parseInt(id) },
      });

      if (!attempt || attempt.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const remainingTime = await AttemptService.getRemainingTime(parseInt(id));
      res.json({ remainingTime });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLiveAttempts(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.user!.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      await AttemptService.updateExpiredAttempts();

      const liveAttempts = await prisma.attempt.findMany({
        where: { status: 'IN_PROGRESS' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          test: { select: { id: true, title: true, duration: true } },
          answers: { select: { id: true, isCorrect: true } },
        },
        orderBy: { startedAt: 'desc' },
      });

      const formatted = liveAttempts.map((attempt) => ({
        attemptId: attempt.id,
        user: attempt.user,
        test: attempt.test,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        answeredQuestions: attempt.answers.length,
        correctAnswers: attempt.answers.filter((a) => a.isCorrect).length,
      }));

      res.json(formatted);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const attempt = await AttemptService.getAttemptById(parseInt(id));

      if (!attempt) {
        return res.status(404).json({ error: 'Attempt not found' });
      }

      if (
        attempt.userId !== req.user!.id &&
        !['ADMIN', 'INSTRUCTOR'].includes(req.user!.role)
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(attempt);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async submitAnswer(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const answerData: SubmitAnswerData = req.body;

      // Verify attempt belongs to user
      const attempt = await prisma.attempt.findUnique({
        where: { id: parseInt(id) },
      });

      if (!attempt || attempt.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const answer = await AttemptService.submitAnswer(
        parseInt(id),
        answerData
      );
      res.json(answer);
    } catch (error: any) {
      if (error.message.includes('not in progress')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async complete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      // Verify attempt belongs to user
      const attempt = await prisma.attempt.findUnique({
        where: { id: parseInt(id) },
      });

      if (!attempt || attempt.userId !== req.user!.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const completedAttempt = await AttemptService.completeAttempt(
        parseInt(id)
      );
      res.json(completedAttempt);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate id parameter
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'Valid attempt ID is required' });
      }

      // Validate status
      if (!['IN_PROGRESS', 'COMPLETED', 'TIMED_OUT'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      const attemptId = parseInt(id);

      // Verify attempt exists
      const attempt = await prisma.attempt.findUnique({
        where: { id: attemptId },
      });

      if (!attempt) {
        return res.status(404).json({ error: 'Attempt not found' });
      }

      const updatedAttempt = await AttemptService.updateStatus(
        attemptId,
        status
      );

      res.json(updatedAttempt);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllAttempts(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.user!.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      const attempts = await AttemptService.getAllAttempts();
      res.json(attempts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserAttempts(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const testId = req.query.testId
        ? parseInt(req.query.testId as string)
        : undefined;

      const attempts = await AttemptService.getUserAttempts(userId, testId);
      res.json(attempts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const analytics = await AttemptService.getAttemptAnalytics();
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTestPerformance(req: AuthenticatedRequest, res: Response) {
    try {
      const { testId } = req.params;
      const performance = await AttemptService.getTestPerformanceByUser(
        parseInt(testId)
      );
      res.json(performance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getQuestionAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const { testId } = req.params;
      const performance = await AttemptService.getQuestionPerformance(
        parseInt(testId)
      );
      res.json(performance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserPerformance(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const performance = await AttemptService.getUserPerformanceHistory(
        userId
      );
      res.json(performance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getScoreDistribution(req: AuthenticatedRequest, res: Response) {
    try {
      const { testId } = req.params;
      const distribution = await AttemptService.getScoreDistribution(
        parseInt(testId)
      );
      res.json(distribution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AttemptController;
