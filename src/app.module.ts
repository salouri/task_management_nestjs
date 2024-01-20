import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TasksModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
