// src/route/index.ts
import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// User-related routes
router.use('/users', userRoutes);

export default router;
