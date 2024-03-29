import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './entity/task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Task } from './entity/task.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');
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

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, user } });
    if (!task) {
      this.logger.error(`Task with ID ${id} does not exist`);
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Task with ID ${id} does not exist`,
      });
    }

    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const task = await this.getTaskById(id, user);
    await this.taskRepository.delete(id);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.update(id, task);
    return task;
  }

  async getFilteredTasks(filters: FilterTasksDto, user: User): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    if (filters?.status) {
      const status = filters.status;
      query.andWhere('task.status = :status', { status });
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      query.andWhere(
        '(LOWER(task.title) LIKE :searchStr OR LOWER(task.description) LIKE :searchStr)',
        {
          searchStr: `%${search}%`,
        },
      );
    }

    const tasks = query.getMany();

    return tasks;
  }
}
