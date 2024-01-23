import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<{ id: string }> {
    const { email, password } = data;
    const user = await this.userRepo.create({ email, password });
    try {
      await this.userRepo.save(user);
      return { id: user.id };
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('email already exists!');
      else throw new InternalServerErrorException();
    }
  }
}
