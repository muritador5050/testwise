import { Response } from 'express';
import AttemptService from '../services/attemptService';
import { AuthenticatedRequest } from '../../middleware/authenticate';
import { SubmitAnswerData } from '../../types/types';
import { PrismaClient } from '../../generated/prisma';

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

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const attempt = await AttemptService.getAttempt(parseInt(id));

      if (!attempt) {
        return res.status(404).json({ error: 'Attempt not found' });
      }

      // Check if user owns this attempt or is admin/instructor
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
}

export default AttemptController;
