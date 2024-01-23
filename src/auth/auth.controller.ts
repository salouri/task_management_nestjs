import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entity/user.entity';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  createUser(@Body() data: CreateUserDto): Promise<{ id: string }> {
    return this.authService.signUp(data);
  }
}
