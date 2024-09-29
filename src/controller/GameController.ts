// src/controller/GameController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'; // Use AppDataSource instead of getRepository
import { Game } from '../entity/Game';
import { User } from '../entity/User';

// Controller to create a new game
export const createGame = async (req: Request, res: Response): Promise<Response> => {
  const gameRepository = AppDataSource.getRepository(Game);
  const userRepository = AppDataSource.getRepository(User);
  const { users } = req.body; // List of user IDs

  try {
    // Find the users participating in the game
    const gameUsers = await userRepository.find({
      where: users.map((id: number) => ({ id })),
    });

    if (gameUsers.length === 0) {
      return res.status(400).json({ message: 'No valid users found' });
    }

    // Create and save the new game
    const game = gameRepository.create({
      state: {},  // Initialize game state as an empty object
      users: gameUsers,  // Associate the users with the game
    });

    await gameRepository.save(game);
    return res.status(201).json({ message: 'Game created successfully', gameId: game.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating game', error });
  }
};

// Controller to end a game and update user stats
export const endGame = async (req: Request, res: Response) => {
  const gameRepository = AppDataSource.getRepository(Game);
  const userRepository = AppDataSource.getRepository(User);
  const gameId = req.params.id;
  const { winningUserId, userScores } = req.body; // userScores: { userId: score }

  try {
    const game = await gameRepository.findOne({ where: { id: Number(gameId) }, relations: ['users'] });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Update user stats for each user in the game
    for (const user of game.users) {
      user.gamesPlayed += 1;
      user.totalScore += userScores[user.id] || 0;
      user.averageScore = user.totalScore / user.gamesPlayed;
      if (user.id === winningUserId) {
        user.gamesWon += 1;
      }
      user.winRate = (user.gamesWon / user.gamesPlayed) * 100;

      // Save updated user stats
      await userRepository.save(user);
    }

    res.status(200).json({ message: 'Game ended successfully, user stats updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error ending game', error });
  }
};
