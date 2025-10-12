import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { attemptRateLimit } from '../../middleware/attemptRateLimit.js';
import AttemptController from '../controllers/attemptController.js';
import { authorize } from '../../middleware/authorization.js';

export const attemptRoutes = Router();

attemptRoutes.get('/user', authenticate, AttemptController.getUserAttempts);

attemptRoutes.get(
  '/analytics',
  authenticate,
  authorize('ADMIN'),
  AttemptController.getAnalytics
);

attemptRoutes.post(
  '/test/:testId/start',
  authenticate,
  attemptRateLimit,
  AttemptController.start
);

attemptRoutes.get(
  '/test/:testId/performance',
  authenticate,
  authorize('ADMIN'),
  AttemptController.getTestPerformance
);

attemptRoutes.get(
  '/test/:testId/questions/analytics',
  authenticate,
  authorize('ADMIN'),
  AttemptController.getQuestionAnalytics
);

attemptRoutes.get(
  '/user/performance',
  authenticate,
  AttemptController.getUserPerformance
);

attemptRoutes.get(
  '/test/:testId/score-distribution',
  authenticate,
  authorize('ADMIN'),
  AttemptController.getScoreDistribution
);
attemptRoutes.post('/:id/answer', authenticate, AttemptController.submitAnswer);
attemptRoutes.patch('/:id/complete', authenticate, AttemptController.complete);
attemptRoutes.get('/:id', authenticate, AttemptController.getById);
