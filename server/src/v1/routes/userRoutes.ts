import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import UserController from '../controllers/userController';
import { authorize } from '../../middleware/authorization';

export const userRoutes = Router();

userRoutes.post('/', authenticate, authorize('ADMIN'), UserController.create);
userRoutes.get(
  '/',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  UserController.getAll
);
userRoutes.get('/:id', authenticate, UserController.getById);
userRoutes.put('/:id', authenticate, authorize('ADMIN'), UserController.update);
userRoutes.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  UserController.delete
);
