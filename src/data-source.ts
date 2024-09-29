// src/data-source.ts
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Game } from './entity/Game';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Your database URL
  synchronize: true,  // Set to false in production, and use migrations
  logging: false,
  entities: [User, Game],  // Add your entities here
  migrations: [],
  subscribers: [],
});
