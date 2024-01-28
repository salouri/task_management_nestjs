import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

  async create(data: CreateUserDto): Promise<{ id: string; email: string }> {
    const { email, password } = data;
    const user = this.userRepo.create({ email, password });
    try {
      await this.userRepo.save(user);
      return { id: user.id, email };
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('email already exists!');
      else throw new InternalServerErrorException();
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException(`User with email '${email}' does not exist`);
    return user;
  }

  async updateRtHash(id: string, hash?: string): Promise<void> {
    await this.userRepo.update(id, { hashedRt: hash || null });
  }
}
