import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Game } from './Game';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // Using '!' to tell TypeScript this will be initialized by TypeORM

  @Column({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @ManyToMany(() => Game, (game) => game.users)
  games!: Game[];

  // Stats fields
  @Column({ type: 'int', default: 0 })
  gamesPlayed!: number;

  @Column({ type: 'int', default: 0 })
  gamesWon!: number;

  @Column({ type: 'int', default: 0 })
  totalScore!: number;

  @Column({ type: 'float', default: 0.0 })
  averageScore!: number;

  @Column({ type: 'float', default: 0.0 })
  winRate!: number;
}
