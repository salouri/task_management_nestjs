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
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './entity/task.entity';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { HttpLoggerInterceptor } from 'src/common/interceptors/http-logger.interceptor';
import { FreezeBodyPipe } from 'src/common/pipes/freeze-body.pipe';

@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @UseInterceptors(HttpLoggerInterceptor)
  async getTasks(
    @Query() data: FilterTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    // check if query parameters exist
    return await this.tasksService.getFilteredTasks(data, user);
  }

  @Get('/:id')
  @Version('1')
  @UseInterceptors(HttpLoggerInterceptor)
  // @PublicApi()
  // @UseGuards(RefreshJwtGuard)
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body(new FreezeBodyPipe()) data: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const task = await this.tasksService.createTask(data, user);
    return task;
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    const task = await this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() data: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = data;
    return await this.tasksService.updateTaskStatus(id, status, user);
  }
}
