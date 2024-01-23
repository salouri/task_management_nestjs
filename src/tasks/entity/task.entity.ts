import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  @ManyToMany((_type) => User, (user) => user.tasks, { eager: false })
  user: User;
}
