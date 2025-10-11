import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorization';
import QuestionController from '../controllers/questionController';
// Question Routes
export const questionRoutes = Router();
questionRoutes.get('/all', authenticate, authorize('ADMIN'), QuestionController.getAll);
questionRoutes.post('/:testId/test', authenticate, authorize('ADMIN'), QuestionController.create);
questionRoutes.get('/:testId/test', QuestionController.getByTest);
questionRoutes.patch('/:id', authenticate, authorize('ADMIN'), QuestionController.update);
questionRoutes.delete('/:id', authenticate, authorize('ADMIN'), QuestionController.delete);
//# sourceMappingURL=questionRoutes.js.map