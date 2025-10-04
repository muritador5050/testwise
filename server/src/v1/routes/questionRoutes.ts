import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorization';
import QuestionController from '../controllers/questionController';

// Question Routes
export const questionRoutes = Router();

// Create a question for a specific test
questionRoutes.post(
  '/:testId',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  QuestionController.create
);

// Get all questions for a specific test
questionRoutes.get('/:testId', QuestionController.getByTest);

// Update a question
questionRoutes.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  QuestionController.update
);

// Delete a question
questionRoutes.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  QuestionController.delete
);
