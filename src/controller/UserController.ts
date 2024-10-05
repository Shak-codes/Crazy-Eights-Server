// src/controller/UserController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const userRepository = AppDataSource.getRepository(User);
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare provided password with stored password hash
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload data
      process.env.JWT_SECRET!,            // Secret key from .env
      { expiresIn: '1h' }                 // Token expiration (e.g., 1 hour)
    );

    // Send JWT as a response
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in user', error });
  }
};

export const checkEmail = async (req: Request, res: Response): Promise<Response> => {
  const userRepository = AppDataSource.getRepository(User);
  const email = req.params.email;

  try {
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(200).json({ message: 'Email is already registered', available: false });
    }

    return res.status(200).json({ message: 'Email is available', available: true });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking email', error });
  }
};

// Controller to register a new user
export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const userRepository = AppDataSource.getRepository(User);
  const { email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = userRepository.create({ email, passwordHash });
    await userRepository.save(newUser);

    return res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user', error });
  }
};

// Controller to retrieve user stats
export const getUserStats = async (req: Request, res: Response): Promise<Response> => {
  const userRepository = AppDataSource.getRepository(User);
  const userId = req.params.id;

  try {
    const user = await userRepository.findOne({ where: { id: Number(userId) } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      gamesPlayed: user.gamesPlayed,
      gamesWon: user.gamesWon,
      gamesLost: user.gamesLost,
      winRate: user.winRate,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving user stats', error });
  }
};

export const updatePlayerStats = async (req: Request, res: Response): Promise<Response> => {
  const userRepository = AppDataSource.getRepository(User);
  const { winner, players } = req.body;  // Expecting "winner" and "players" in the request body

  try {
    // Find all users based on the list of player names
    const users = await userRepository.find({
      where: players.map((name: string) => ({ email: name })),  // Assuming 'email' is the identifier for players
    });

    if (users.length === 0) {
      return res.status(400).json({ message: 'No valid players found' });
    }

    // Loop through each user to update their stats
    for (const user of users) {
      // Increment games played for each user
      user.gamesPlayed += 1;

      if (user.email === winner) {
        // Update the winner's games won
        user.gamesWon += 1;
        user.winStreak += 1;
        if (user.winStreak > user.highestStreak) user.highestStreak = user.winStreak;
      } else {
        // Update games lost for other players
        user.gamesLost += 1;
        user.winStreak = 0;
      }

      // Update win rate for each player
      user.winRate = (user.gamesWon / user.gamesPlayed) * 100;

      // Save the updated user data to the database
      await userRepository.save(user);
    }

    return res.status(200).json({ message: 'Game results updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating game results', error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const userRepository = AppDataSource.getRepository(User);
  const { id, email } = req.body;

  try {
    // Find the user by ID or email
    let user;
    if (id) {
      user = await userRepository.findOne({ where: { id: Number(id) } });
    } else if (email) {
      user = await userRepository.findOne({ where: { email } });
    }

    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user from the database
    await userRepository.remove(user);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Error deleting user', error });
  }
};