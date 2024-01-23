import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entity/user.entity';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';

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

  @Post('signin')
  signIn(@Body() data: SigninUserDto): Promise<{ access_token: string }> {
    return this.authService.signIn(data);
  }
}
