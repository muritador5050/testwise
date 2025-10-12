import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import TestController from '../controllers/testController.js';
import { authorize } from '../../middleware/authorization.js';
// Test Routes
export const testRoutes = Router();
testRoutes.post('/', authenticate, authorize('ADMIN'), TestController.create);
testRoutes.get('/', TestController.getAll);
testRoutes.get('/statistics', authenticate, authorize('ADMIN'), TestController.getStatistics);
testRoutes.get('/:id', TestController.getById);
testRoutes.get('/:id/availability', authenticate, TestController.checkAvailability);
testRoutes.patch('/:id', authenticate, authorize('ADMIN'), TestController.update);
testRoutes.patch('/:id/publish', authenticate, authorize('ADMIN'), TestController.publish);
testRoutes.delete('/:id', authenticate, authorize('ADMIN'), TestController.delete);
//# sourceMappingURL=testRoutes.js.map