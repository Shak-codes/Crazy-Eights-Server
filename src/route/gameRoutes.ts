// src/route/gameRoutes.ts
import { Router } from 'express';
import { createGame, endGame } from '../controller/GameController';

const router = Router();

// Route to create a new game
router.post('/', createGame);

// Route to end a game and update user stats
router.post('/:id/end', endGame);

export default router;
