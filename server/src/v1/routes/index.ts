import { userRoutes } from './userRoutes.js';
import { testRoutes } from './testRoutes.js';
import { attemptRoutes } from './attemptRoutes.js';
import { questionRoutes } from './questionRoutes.js';

export const setupRoutes = (app: any) => {
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/tests', testRoutes);
  app.use('/api/v1/questions', questionRoutes);
  app.use('/api/v1/attempts', attemptRoutes);
};
