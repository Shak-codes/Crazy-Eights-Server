// src/route/index.ts
import { Router } from 'express';
import userRoutes from './userRoutes';
import gameRoutes from './gameRoutes';

const router = Router();

// User-related routes
router.use('/users', userRoutes);

// Game-related routes
router.use('/games', gameRoutes);

export default router;
