// src/route/userRoutes.ts
import { Router } from 'express';
import { createUser, getUserStats } from '../controller/UserController';

const router = Router();

// Route to create a new user
router.post('/', createUser);

// Route to fetch user stats by user ID
router.get('/:id/stats', getUserStats);

export default router;
