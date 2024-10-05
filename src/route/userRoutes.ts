// src/route/userRoutes.ts
import { Router } from 'express';
import { registerUser, getUserStats, checkEmail, deleteUser } from '../controller/UserController';

const router = Router();

// Route to create a new user
router.post('/', registerUser);

// Route to fetch user stats by user ID
router.get('/:id/stats', getUserStats);

router.get('/email/:email', checkEmail);

router.delete('/delete', deleteUser);

export default router;
