import { userRoutes } from './userRoutes';
import { testRoutes } from './testRoutes';
import { attemptRoutes } from './attemptRoutes';
import { questionRoutes } from './questionRoutes';
export const setupRoutes = (app) => {
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/tests', testRoutes);
    app.use('/api/v1/questions', questionRoutes);
    app.use('/api/v1/attempts', attemptRoutes);
};
//# sourceMappingURL=index.js.map