import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = []; // in-memory database! temporary
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();
    return tasks;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const task = await this.taskRepository.create({
      ...data,
      status: TaskStatus.OPEN,
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

  async getFilteredTasks(
    filterDto: FilterTasksDto,
  ): Promise<Task[] | undefined> {
    let tasks = await this.getAllTasks();
    if (filterDto?.status)
      tasks = tasks.filter((task) => task.status === filterDto.status);

    if (filterDto?.search) {
      const search = filterDto.search.toLowerCase();

      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search),
      );
    }

    return tasks;
  }
}
