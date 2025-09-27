import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import TestController from '../controllers/testController';
import { authorize } from '../../middleware/authorization';

// Test Routes
export const testRoutes = Router();

testRoutes.post(
  '/',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  TestController.create
);
testRoutes.get('/', TestController.getAll);
testRoutes.get('/:id', TestController.getById);
testRoutes.get(
  '/:id/availability',
  authenticate,
  TestController.checkAvailability
);
testRoutes.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  TestController.update
);
testRoutes.patch(
  '/:id/publish',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  TestController.publish
);
testRoutes.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'INSTRUCTOR'),
  TestController.delete
);
