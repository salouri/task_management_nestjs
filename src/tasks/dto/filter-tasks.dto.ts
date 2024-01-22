import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../entity/task-status.enum';

export class FilterTasksDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;
}
