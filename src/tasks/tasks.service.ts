import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './entity/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Task } from './entity/task.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .getMany();
    return tasks;
  }

  async createTask(data: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...data,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID ${id} does not exist`);

    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.getTaskById(id);
    await this.taskRepository.delete(task.id);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.update(id, task);
    return task;
  }

  async getFilteredTasks(filters: FilterTasksDto, user: User): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');

    if (filters?.status) {
      const status = filters.status;
      query.andWhere('task.status = :status', { status });
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      query.andWhere('LOWER(task.title) LIKE :searchStr', {
        searchStr: `%${search}%`,
      });
      query.orWhere('LOWER(task.description) LIKE :searchStr', {
        searchStr: `%${search}%`,
      });
    }
    const tasks = query.getMany();

    return tasks;
  }
}
