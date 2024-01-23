import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  Version,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './entity/task.entity';
import { GetUser } from 'src/users/decorator/get-user.decorator';
import { User } from 'src/users/entity/user.entity';

@Controller({
  path: 'tasks',
  version: '1',
})
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() data: FilterTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    // check if query parameters exist
    return this.tasksService.getFilteredTasks(data, user);
  }

  @Get('/:id')
  @Version('2')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksService.createTask(createTaskDto);
    return task;
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() data: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = data;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
