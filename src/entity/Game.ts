import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number; // Definite assignment assertion

  @Column('jsonb')  // Store the game state as a JSON object
  state!: Record<string, any>; // Using '!' to assert initialization by TypeORM

  @CreateDateColumn({ type: 'timestamptz' })  // Timestamp of game creation
  createdAt!: Date;  // Using '!' because TypeORM will manage this

  @ManyToMany(() => User, (user) => user.games)
  users!: User[]; // Definite assignment for the many-to-many relationship
}
