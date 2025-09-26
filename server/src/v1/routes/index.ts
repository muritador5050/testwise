import express from 'express';
import { userRoutes } from './userRoutes';
import { testRoutes } from './testRoutes';
import { attemptRoutes } from './attemptRoutes';
// const router = express.Router();

export const setupRoutes = (app: any) => {
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/tests', testRoutes);
  app.use('/api/v1/attempts', attemptRoutes);
};

// export default router;
