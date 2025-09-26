import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { attemptRateLimit } from '../../middleware/attemptRateLimit';
import AttemptController from '../controllers/attemtController';

export const attemptRoutes = Router();

attemptRoutes.post(
  '/test/:testId/start',
  authenticate,
  attemptRateLimit,
  AttemptController.start
);
attemptRoutes.get('/:id', authenticate, AttemptController.getById);
attemptRoutes.post('/:id/answer', authenticate, AttemptController.submitAnswer);
attemptRoutes.patch('/:id/complete', authenticate, AttemptController.complete);
attemptRoutes.get(
  '/user/attempts',
  authenticate,
  AttemptController.getUserAttempts
);
