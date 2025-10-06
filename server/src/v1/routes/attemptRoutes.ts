import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { attemptRateLimit } from '../../middleware/attemptRateLimit';
import AttemptController from '../controllers/attemptController';
import { authorize } from '../../middleware/authorization';

export const attemptRoutes = Router();

attemptRoutes.get('/user', authenticate, AttemptController.getUserAttempts);
attemptRoutes.get(
  '/analytics',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  AttemptController.getAnalytics
);
attemptRoutes.get(
  '/trends',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  AttemptController.getTrends
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
  authorize('ADMIN', 'INSTRUCTOR'),
  AttemptController.getTestPerformance
);

attemptRoutes.get(
  '/test/:testId/questions/analytics',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  AttemptController.getQuestionAnalytics
);

attemptRoutes.get(
  '/user/:userId/performance',
  authenticate,
  AttemptController.getUserPerformance
);

attemptRoutes.get(
  '/test/:testId/score-distribution',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  AttemptController.getScoreDistribution
);
attemptRoutes.post('/:id/answer', authenticate, AttemptController.submitAnswer);
attemptRoutes.patch('/:id/complete', authenticate, AttemptController.complete);
attemptRoutes.get('/:id', authenticate, AttemptController.getById);
