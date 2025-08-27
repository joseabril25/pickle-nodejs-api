import { Router } from 'express';
import { authRoutes } from './auth/auth.routes';

const apiRouter = Router();

// Group all API routes
apiRouter.use('/auth', authRoutes);
// apiRouter.use('/games', standupRoutes);
// apiRouter.use('/players', userRoutes);

export { apiRouter };