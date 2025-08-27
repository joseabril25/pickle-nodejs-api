import { Router } from 'express';
import { authRoutes } from './auth/auth.routes';
import { gamesRoutes } from './games/games.routes';

const apiRouter = Router();

// Group all API routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/games', gamesRoutes);
// apiRouter.use('/players', userRoutes);

export { apiRouter };