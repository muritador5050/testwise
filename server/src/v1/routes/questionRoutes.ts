import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorization.js';
import QuestionController from '../controllers/questionController.js';

// Question Routes
export const questionRoutes = Router();

questionRoutes.get(
  '/all',
  authenticate,
  authorize('ADMIN'),
  QuestionController.getAll
);

questionRoutes.post(
  '/:testId/test',
  authenticate,
  authorize('ADMIN'),
  QuestionController.create
);

questionRoutes.get('/:testId/test', QuestionController.getByTest);

questionRoutes.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  QuestionController.update
);

questionRoutes.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  QuestionController.delete
);
