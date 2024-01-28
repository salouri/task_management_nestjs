import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as argon from 'argon2';
import { Task } from 'src/tasks/entity/task.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({type: 'varchar', nullable: true})
  hashedRt: string;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon.hash(this.password);
  }
}
