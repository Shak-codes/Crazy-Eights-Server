import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // Using '!' to tell TypeScript this will be initialized by TypeORM

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  // To store gameIds as an array of strings (e.g., Socket.IO room IDs)
  @Column("text", { array: true, default: [] })
  gameIds!: string[];

  // Stats fields
  @Column({ type: 'int', default: 0 })
  gamesPlayed!: number;

  @Column({ type: 'int', default: 0 })
  gamesWon!: number;

  @Column({ type: 'int', default: 0 })
  gamesLost!: number;

  @Column({ type: 'int', default: 0 })
  winStreak!: number;

  @Column({ type: 'int', default: 0 })
  highestStreak!: number;

  @Column({ type: 'float', default: 0.0 })
  winRate!: number;
}

