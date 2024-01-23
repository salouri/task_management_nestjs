import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<string> {
    const { email, password } = data;
    try {
      const user = await this.userRepo.create({ email, password });
      await this.userRepo.save(user);
      return user.id;
    } catch (error) {
      console.log('error: ', error.detail);
      return error.detail;
    }
  }
}
