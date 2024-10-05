// src/route/userRoutes.ts
import { Router } from 'express';
import { registerUser, getUserStats, checkEmail, deleteUser, updatePlayerStats, loginUser } from '../controller/UserController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Route to create a new user
router.post('/', registerUser);
router.get('/:id/stats', getUserStats);
router.get('/email/:email', checkEmail);

router.get('/stats/:id', authenticateJWT, getUserStats);
router.put('/update-stats', authenticateJWT, updatePlayerStats);
router.delete('/delete', authenticateJWT, deleteUser);

export default router;
