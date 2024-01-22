import { IsEnum } from 'class-validator';
import { TaskStatus } from '../entity/task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
