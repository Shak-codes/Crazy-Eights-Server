// src/controller/UserController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'; // Use AppDataSource instead of getRepository
import { User } from '../entity/User';
import bcrypt from 'bcrypt';

// Controller to create a new user
export const createUser = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User); // Use AppDataSource to get the repository
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = userRepository.create({
      username,
      passwordHash: hashedPassword,
    });

    await userRepository.save(user);
    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Controller to get user stats by user ID
export const getUserStats = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User); // Use AppDataSource to get the repository
  const userId = req.params.id;

  try {
    const user = await userRepository.findOne({ where: { id: Number(userId) } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
      totalScore: user.totalScore,
      averageScore: user.averageScore,
      winRate: user.winRate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user stats', error });
  }
};

