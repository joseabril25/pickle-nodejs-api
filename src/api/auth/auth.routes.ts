import { Router } from 'express';

import { loginUser, logoutUser, registerUser, getCurrentUser } from './auth.controller';
import { ValidateDTO } from '../../common/middlewares/validation.middleware';
import { CreatePlayerDto, LoginDto } from '../../common/types/dto';
import { AuthGuard } from '../../common/middlewares';

const router = Router();

// POST /api/auth/register
router.post('/register',
  ValidateDTO(CreatePlayerDto),
  registerUser
);

// POST /api/auth/login
router.post('/login',
  ValidateDTO(LoginDto),
  loginUser
);

// POST /api/auth/logout
router.post('/logout',
  AuthGuard,
  logoutUser
);

// GET /api/auth/me  
router.get('/me',
  AuthGuard,
  getCurrentUser
);

export { router as authRoutes };