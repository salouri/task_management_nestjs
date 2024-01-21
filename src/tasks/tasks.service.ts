import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = []; // in-memory database! temporary

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task); // add task to tasks array
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) throw new NotFoundException(`Task with ID ${id} does not exist`);

    return task;
  }

  deleteTask(id: string): void {
    const origCount = this.tasks.length;
    this.tasks = this.tasks.filter((task) => task.id !== id);
    if (this.tasks.length == origCount) throw new NotFoundException();
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  getFilteredTasks(filterDto: FilterTasksDto): Task[] | undefined {
    let tasks = this.getAllTasks();
    if (filterDto.status)
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
