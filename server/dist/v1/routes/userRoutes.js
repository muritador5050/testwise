import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import UserController from '../controllers/userController.js';
import { authorize } from '../../middleware/authorization.js';
export const userRoutes = Router();
userRoutes.post('/signup', UserController.create);
userRoutes.post('/login', UserController.login);
userRoutes.get('/', authenticate, authorize('ADMIN'), UserController.getAll);
userRoutes.get('/analytics/count', authenticate, authorize('ADMIN'), UserController.getCounts);
userRoutes.get('/:id/activity', authenticate, UserController.getUserActivity);
userRoutes.get('/:id', authenticate, UserController.getById);
userRoutes.patch('/:id', authenticate, authorize('ADMIN'), UserController.update);
userRoutes.delete('/:id', authenticate, authorize('ADMIN'), UserController.delete);
//# sourceMappingURL=userRoutes.js.map