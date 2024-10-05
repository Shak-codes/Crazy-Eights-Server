// src/route/userRoutes.ts
import { Router } from 'express';
import { registerUser, getUserStats, checkEmail } from '../controller/UserController';

const router = Router();

// Route to create a new user
router.post('/', registerUser);

// Route to fetch user stats by user ID
router.get('/:id/stats', getUserStats);

router.get('/email/:email', checkEmail);

export default router;
